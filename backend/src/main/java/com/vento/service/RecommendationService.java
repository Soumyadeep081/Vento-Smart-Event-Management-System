package com.vento.service;

import com.vento.dto.VendorDto;
import com.vento.entity.Event;
import com.vento.entity.Service;
import com.vento.entity.Vendor;
import com.vento.repository.ServiceRepository;
import com.vento.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * AI-inspired recommendation engine using configurable weighted scoring.
 *
 * Score formula:
 *   score = (rating * w1) + (budget_fit * w2) + (availability * w3)
 *
 * Where:
 *   - rating: normalized 0-1 (vendorRating / 5.0)
 *   - budget_fit: 1 if price ≤ budget, else (budget / price) clamped to 0-1
 *   - availability: 1 if available, 0 otherwise
 */
@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class RecommendationService {

    private final VendorRepository vendorRepository;
    private final ServiceRepository serviceRepository;

    @Value("${recommendation.weight.rating:0.4}")
    private double weightRating;

    @Value("${recommendation.weight.budget:0.35}")
    private double weightBudget;

    @Value("${recommendation.weight.availability:0.25}")
    private double weightAvailability;

    /**
     * Get top N recommended vendors for an event based on scoring.
     */
    public List<VendorDto.Response> recommend(
            BigDecimal budget,
            Vendor.ServiceCategory category,
            String city,
            int topN) {

        // Search by category only — city is used for scoring, not filtering
        List<Vendor> vendors = vendorRepository.searchVendors(category, null, null, null, null);

        List<ScoredVendor> scored = vendors.stream()
                .map(v -> score(v, budget, city))
                .sorted(Comparator.comparingDouble(ScoredVendor::score).reversed())
                .limit(topN)
                .toList();

        return scored.stream().map(sv -> {
            VendorDto.Response r = VendorDto.Response.from(sv.vendor());
            r.setScore(sv.score());
            return r;
        }).collect(Collectors.toList());
    }

    /**
     * Compare multiple vendors by ID using full weighted scoring.
     */
    public List<VendorDto.Response> compare(
            List<Long> vendorIds,
            BigDecimal budget,
            String eventCity,
            // Optional custom weights (null = use defaults from config)
            Double wRating, Double wCost, Double wExperience, Double wProximity, Double wAvailability) {

        List<Vendor> vendors = vendorRepository.findAllByIdIn(vendorIds);

        double wr = wRating != null ? wRating : 0.30;
        double wc = wCost != null ? wCost : 0.25;
        double we = wExperience != null ? wExperience : 0.20;
        double wp = wProximity != null ? wProximity : 0.15;
        double wa = wAvailability != null ? wAvailability : 0.10;

        // Normalize experience across compared set
        int maxExp = vendors.stream().mapToInt(Vendor::getExperience).max().orElse(1);

        return vendors.stream().map(v -> {
            double ratingScore = v.getAverageRating() / 5.0;

            // Cost efficiency: lowest cost = 1.0
            BigDecimal minPrice = getMinServicePrice(v.getId());
            double costScore = budget != null && minPrice != null
                    ? Math.min(1.0, budget.doubleValue() / Math.max(minPrice.doubleValue(), 1.0))
                    : 0.5;
            // Invert: cheaper = better
            costScore = Math.min(1.0, costScore);

            double expScore = maxExp > 0 ? (double) v.getExperience() / maxExp : 0;

            double proximityScore = computeProximityScore(v.getCity(), eventCity);

            double availScore = hasAvailableService(v.getId()) ? 1.0 : 0.0;

            double total = (ratingScore * wr) + (costScore * wc) +
                           (expScore * we) + (proximityScore * wp) + (availScore * wa);

            VendorDto.Response r = VendorDto.Response.from(v);
            r.setScore(Math.round(total * 1000.0) / 1000.0);
            return r;
        })
        .sorted(Comparator.comparingDouble(VendorDto.Response::getScore).reversed())
        .collect(Collectors.toList());
    }

    private ScoredVendor score(Vendor vendor, BigDecimal budget, String eventCity) {
        double ratingScore = vendor.getAverageRating() / 5.0;

        BigDecimal minPrice = getMinServicePrice(vendor.getId());
        double budgetFit;
        if (minPrice == null || minPrice.compareTo(BigDecimal.ZERO) == 0) {
            budgetFit = 0.5;
        } else if (budget == null) {
            budgetFit = 0.5;
        } else {
            budgetFit = Math.min(1.0, budget.doubleValue() / minPrice.doubleValue());
        }

        double availability = hasAvailableService(vendor.getId()) ? 1.0 : 0.0;

        double proximity = computeProximityScore(vendor.getCity(), eventCity);

        // Weights: rating 35%, budget 30%, availability 20%, proximity 15%
        double total = (ratingScore * 0.35)
                + (budgetFit * 0.30)
                + (availability * 0.20)
                + (proximity * 0.15);

        return new ScoredVendor(vendor, Math.round(total * 1000.0) / 1000.0);
    }

    private BigDecimal getMinServicePrice(Long vendorId) {
        return serviceRepository.findByVendorIdAndActiveTrue(vendorId).stream()
                .map(Service::getPrice)
                .min(Comparator.naturalOrder())
                .orElse(null);
    }

    private boolean hasAvailableService(Long vendorId) {
        return serviceRepository.findByVendorIdAndActiveTrue(vendorId).stream()
                .anyMatch(Service::isAvailable);
    }

    /**
     * Simple city-match based proximity: same city = 1.0, else 0.3.
     * Can be replaced with Haversine geolocation calculation if lat/lng available.
     */
    private double computeProximityScore(String vendorCity, String eventCity) {
        if (eventCity == null || vendorCity == null) return 0.5;
        return vendorCity.equalsIgnoreCase(eventCity) ? 1.0 : 0.3;
    }

    private record ScoredVendor(Vendor vendor, double score) {}
}
