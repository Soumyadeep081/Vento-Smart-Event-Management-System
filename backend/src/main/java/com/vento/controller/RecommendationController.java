package com.vento.controller;

import com.vento.dto.VendorDto;
import com.vento.entity.Vendor;
import com.vento.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@Tag(name = "Recommendations & Comparison", description = "AI-inspired vendor scoring and comparison")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping
    @Operation(summary = "Get top N recommended vendors based on budget, category, location")
    public ResponseEntity<List<VendorDto.Response>> recommend(
            @RequestParam(required = false) BigDecimal budget,
            @RequestParam(required = false) Vendor.ServiceCategory category,
            @RequestParam(required = false) String city,
            @RequestParam(defaultValue = "5") int topN) {
        return ResponseEntity.ok(recommendationService.recommend(budget, category, city, topN));
    }

    @PostMapping("/compare")
    @Operation(summary = "Compare multiple vendors side-by-side with scoring")
    public ResponseEntity<List<VendorDto.Response>> compare(@RequestBody CompareRequest request) {
        return ResponseEntity.ok(recommendationService.compare(
                request.getVendorIds(),
                request.getBudget(),
                request.getEventCity(),
                request.getWeightRating(),
                request.getWeightCost(),
                request.getWeightExperience(),
                request.getWeightProximity(),
                request.getWeightAvailability()
        ));
    }

    @Data
    public static class CompareRequest {
        private List<Long> vendorIds;
        private BigDecimal budget;
        private String eventCity;
        // Optional custom weights (null = use config defaults)
        private Double weightRating;
        private Double weightCost;
        private Double weightExperience;
        private Double weightProximity;
        private Double weightAvailability;
    }
}
