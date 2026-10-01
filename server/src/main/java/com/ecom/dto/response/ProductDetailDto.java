package com.ecom.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailDto {
    private Long id;
    private String name;
    private String slug;
    private String shortDescription;
    private String detailDescription;
    private String thumbnail;
    private Integer warrantyMonths;
    private boolean featured;
    private boolean published;
    private String specifications; // JSON specs string
    private CategoryDto category;
    private BrandDto brand;
    private List<ProductVariantDto> variants;
    private BigDecimal minPrice;
}
