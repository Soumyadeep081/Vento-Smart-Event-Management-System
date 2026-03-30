package com.vento.service;

import com.vento.dto.ReviewDto;
import com.vento.entity.Review;
import com.vento.entity.User;
import com.vento.entity.Vendor;
import com.vento.exception.BadRequestException;
import com.vento.exception.ResourceNotFoundException;
import com.vento.exception.UnauthorizedException;
import com.vento.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Review & Rating service with automatic average recalculation.
 */
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final VendorService vendorService;

    @Transactional
    public ReviewDto.Response create(ReviewDto.CreateRequest request, User user) {
        Vendor vendor = vendorService.getVendorEntity(request.getVendorId());

        // Prevent duplicate reviews
        if (reviewRepository.findByUserIdAndVendorId(user.getId(), vendor.getId()).isPresent()) {
            throw new BadRequestException("You have already reviewed this vendor");
        }

        Review review = Review.builder()
                .user(user)
                .vendor(vendor)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        reviewRepository.save(review);

        // Recalculate average rating
        recalculateVendorRating(vendor);

        return ReviewDto.Response.from(review);
    }

    @Transactional
    public ReviewDto.Response update(Long reviewId, ReviewDto.CreateRequest request, User user) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", reviewId));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only update your own reviews");
        }

        review.setRating(request.getRating());
        if (request.getComment() != null) review.setComment(request.getComment());

        reviewRepository.save(review);
        recalculateVendorRating(review.getVendor());

        return ReviewDto.Response.from(review);
    }

    @Transactional
    public void delete(Long reviewId, User user) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", reviewId));

        if (!review.getUser().getId().equals(user.getId()) && !user.getRole().equals(User.Role.ADMIN)) {
            throw new UnauthorizedException("You can only delete your own reviews");
        }

        Vendor vendor = review.getVendor();
        reviewRepository.delete(review);
        recalculateVendorRating(vendor);
    }

    @Transactional(readOnly = true)
    public List<ReviewDto.Response> getVendorReviews(Long vendorId) {
        return reviewRepository.findByVendorIdOrderByCreatedAtDesc(vendorId).stream()
                .map(ReviewDto.Response::from)
                .collect(Collectors.toList());
    }

    private void recalculateVendorRating(Vendor vendor) {
        Double avg = reviewRepository.calculateAverageRating(vendor.getId());
        Integer count = reviewRepository.countByVendorId(vendor.getId());
        vendorService.updateRating(vendor, avg, count);
    }
}
