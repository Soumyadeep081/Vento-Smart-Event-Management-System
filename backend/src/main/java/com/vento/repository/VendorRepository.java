package com.vento.repository;

import com.vento.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long>, JpaSpecificationExecutor<Vendor> {

    Optional<Vendor> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    List<Vendor> findByCategory(Vendor.ServiceCategory category);

    List<Vendor> findByCityIgnoreCase(String city);

    @Query("SELECT v FROM Vendor v WHERE " +
           "(:category IS NULL OR v.category = :category) AND " +
           "(:city IS NULL OR LOWER(v.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:minRating IS NULL OR v.averageRating >= :minRating) AND " +
           "(:minExperience IS NULL OR v.experience >= :minExperience) AND " +
           "(:keyword IS NULL OR LOWER(v.businessName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "   OR LOWER(v.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Vendor> searchVendors(
            @Param("category") Vendor.ServiceCategory category,
            @Param("city") String city,
            @Param("minRating") Double minRating,
            @Param("minExperience") Integer minExperience,
            @Param("keyword") String keyword
    );

    @Query("SELECT v FROM Vendor v WHERE v.id IN :ids")
    List<Vendor> findAllByIdIn(@Param("ids") List<Long> ids);
}
