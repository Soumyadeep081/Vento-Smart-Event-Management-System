package com.vento.service;

import com.vento.dto.ServiceDto;
import com.vento.entity.Service;
import com.vento.entity.User;
import com.vento.entity.Vendor;
import com.vento.exception.ResourceNotFoundException;
import com.vento.exception.UnauthorizedException;
import com.vento.repository.ServiceRepository;
import com.vento.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Vendor service/package management.
 */
@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceManagementService {

    private final ServiceRepository serviceRepository;
    private final VendorRepository vendorRepository;

    @Transactional
    public ServiceDto.Response create(Long vendorId, ServiceDto.CreateRequest request, User user) {
        Vendor vendor = getVendorForUser(vendorId, user);

        Service service = Service.builder()
                .vendor(vendor)
                .name(request.getName())
                .category(request.getCategory())
                .description(request.getDescription())
                .price(request.getPrice())
                .availableFrom(request.getAvailableFrom())
                .availableTo(request.getAvailableTo())
                .available(request.isAvailable())
                .build();

        return ServiceDto.Response.from(serviceRepository.save(service));
    }

    @Transactional
    public ServiceDto.Response update(Long serviceId, ServiceDto.UpdateRequest request, User user) {
        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service", serviceId));

        if (!service.getVendor().getUser().getId().equals(user.getId()) &&
                !user.getRole().equals(User.Role.ADMIN)) {
            throw new UnauthorizedException("Not authorized to modify this service");
        }

        if (request.getName() != null) service.setName(request.getName());
        if (request.getCategory() != null) service.setCategory(request.getCategory());
        if (request.getDescription() != null) service.setDescription(request.getDescription());
        if (request.getPrice() != null) service.setPrice(request.getPrice());
        if (request.getAvailableFrom() != null) service.setAvailableFrom(request.getAvailableFrom());
        if (request.getAvailableTo() != null) service.setAvailableTo(request.getAvailableTo());
        if (request.getAvailable() != null) service.setAvailable(request.getAvailable());
        if (request.getActive() != null) service.setActive(request.getActive());

        return ServiceDto.Response.from(serviceRepository.save(service));
    }

    @Transactional
    public void delete(Long serviceId, User user) {
        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service", serviceId));
        if (!service.getVendor().getUser().getId().equals(user.getId()) &&
                !user.getRole().equals(User.Role.ADMIN)) {
            throw new UnauthorizedException("Not authorized to delete this service");
        }
        serviceRepository.delete(service);
    }

    @Transactional(readOnly = true)
    public List<ServiceDto.Response> getByVendor(Long vendorId) {
        return serviceRepository.findByVendorIdAndActiveTrue(vendorId).stream()
                .map(ServiceDto.Response::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ServiceDto.Response getById(Long id) {
        return ServiceDto.Response.from(
                serviceRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Service", id))
        );
    }

    @Transactional(readOnly = true)
    public List<ServiceDto.Response> filter(Vendor.ServiceCategory category,
                                            BigDecimal minPrice, BigDecimal maxPrice) {
        return serviceRepository.filterServices(category, minPrice, maxPrice).stream()
                .map(ServiceDto.Response::from)
                .collect(Collectors.toList());
    }

    public Service getServiceEntity(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", id));
    }

    private Vendor getVendorForUser(Long vendorId, User user) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", vendorId));
        if (!vendor.getUser().getId().equals(user.getId()) && !user.getRole().equals(User.Role.ADMIN)) {
            throw new UnauthorizedException("Not authorized");
        }
        return vendor;
    }
}
