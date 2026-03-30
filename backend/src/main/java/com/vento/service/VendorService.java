package com.vento.service;

import com.vento.dto.VendorDto;
import com.vento.entity.User;
import com.vento.entity.Vendor;
import com.vento.exception.BadRequestException;
import com.vento.exception.ResourceNotFoundException;
import com.vento.exception.UnauthorizedException;
import com.vento.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Vendor management service.
 */
@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;

    @Transactional
    public VendorDto.Response create(VendorDto.CreateRequest request, User user) {
        if (!user.getRole().equals(User.Role.VENDOR) && !user.getRole().equals(User.Role.ADMIN)) {
            throw new UnauthorizedException("Only vendors can create vendor profiles");
        }
        if (vendorRepository.existsByUserId(user.getId())) {
            throw new BadRequestException("Vendor profile already exists for this user");
        }

        Vendor vendor = Vendor.builder()
                .user(user)
                .businessName(request.getBusinessName())
                .category(request.getCategory())
                .description(request.getDescription())
                .experience(request.getExperience() != null ? request.getExperience() : 0)
                .city(request.getCity())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();

        return VendorDto.Response.from(vendorRepository.save(vendor));
    }

    @Transactional
    public VendorDto.Response update(Long id, VendorDto.UpdateRequest request, User user) {
        Vendor vendor = findByIdAndUser(id, user);

        if (request.getBusinessName() != null) vendor.setBusinessName(request.getBusinessName());
        if (request.getCategory() != null) vendor.setCategory(request.getCategory());
        if (request.getDescription() != null) vendor.setDescription(request.getDescription());
        if (request.getExperience() != null) vendor.setExperience(request.getExperience());
        if (request.getCity() != null) vendor.setCity(request.getCity());
        if (request.getLatitude() != null) vendor.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) vendor.setLongitude(request.getLongitude());

        return VendorDto.Response.from(vendorRepository.save(vendor));
    }

    @Transactional(readOnly = true)
    public VendorDto.Response getById(Long id) {
        return VendorDto.Response.from(
                vendorRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Vendor", id))
        );
    }

    @Transactional(readOnly = true)
    public VendorDto.Response getByCurrentUser(User user) {
        return vendorRepository.findByUserId(user.getId())
                .map(VendorDto.Response::from)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor profile not found"));
    }

    @Transactional(readOnly = true)
    public List<VendorDto.Response> search(Vendor.ServiceCategory category, String city,
                                           Double minRating, Integer minExperience, String keyword) {
        return vendorRepository.searchVendors(category, city, minRating, minExperience, keyword)
                .stream()
                .map(VendorDto.Response::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<VendorDto.Response> getAll(Pageable pageable) {
        return vendorRepository.findAll(pageable).map(VendorDto.Response::from);
    }

    public Vendor getVendorEntity(Long id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", id));
    }

    /**
     * Update average rating after a review.
     */
    @Transactional
    public void updateRating(Vendor vendor, Double avgRating, Integer reviewCount) {
        vendor.setAverageRating(avgRating != null ? avgRating : 0.0);
        vendor.setReviewCount(reviewCount != null ? reviewCount : 0);
        vendorRepository.save(vendor);
    }

    private Vendor findByIdAndUser(Long id, User user) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", id));
        if (!vendor.getUser().getId().equals(user.getId()) &&
                !user.getRole().equals(User.Role.ADMIN)) {
            throw new UnauthorizedException("You don't have permission to modify this vendor");
        }
        return vendor;
    }
}
