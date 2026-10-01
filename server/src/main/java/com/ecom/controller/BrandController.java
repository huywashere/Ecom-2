package com.ecom.controller;

import com.ecom.dto.response.ApiResponse;
import com.ecom.dto.response.BrandDto;
import com.ecom.service.BrandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
@Tag(name = "Brand", description = "Quản lý và tra cứu thương hiệu")
public class BrandController {

    private final BrandService brandService;

    @GetMapping
    @Operation(summary = "Lấy tất cả thương hiệu")
    public ResponseEntity<ApiResponse<List<BrandDto>>> getAllBrands() {
        return ResponseEntity.ok(ApiResponse.ok(brandService.getAllBrands()));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Lấy chi tiết thương hiệu theo slug")
    public ResponseEntity<ApiResponse<BrandDto>> getBrandBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(brandService.getBrandBySlug(slug)));
    }
}
