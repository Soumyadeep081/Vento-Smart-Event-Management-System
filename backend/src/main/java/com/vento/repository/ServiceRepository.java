package com.vento.repository;

import com.vento.entity.Service;
import com.vento.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {

    List<Service> findByVendor(Vendor vendor);

    List<Service> findByVendorId(Long vendorId);

    List<Service> findByVendorIdAndActiveTrue(Long vendorId);

    @Query("SELECT s FROM Service s WHERE s.active = true AND " +
           "(:category IS NULL OR s.category = :category) AND " +
           "(:maxPrice IS NULL OR s.price <= :maxPrice) AND " +
           "(:minPrice IS NULL OR s.price >= :minPrice) AND " +
           "s.available = true")
    List<Service> filterServices(
            @Param("category") Vendor.ServiceCategory category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice
    );
}
