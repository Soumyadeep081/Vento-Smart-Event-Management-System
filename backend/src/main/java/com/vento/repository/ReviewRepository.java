package com.vento.repository;

import com.vento.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByVendorIdOrderByCreatedAtDesc(Long vendorId);

    Optional<Review> findByUserIdAndVendorId(Long userId, Long vendorId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.vendor.id = :vendorId")
    Double calculateAverageRating(@Param("vendorId") Long vendorId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.vendor.id = :vendorId")
    Integer countByVendorId(@Param("vendorId") Long vendorId);
}
