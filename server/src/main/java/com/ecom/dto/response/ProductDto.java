package com.ecom.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private String slug;
    private String shortDescription;
    private String thumbnail;
    private Integer warrantyMonths;
    private boolean featured;
    private BigDecimal minPrice;
    private BigDecimal originalPrice;
    private Integer totalStock;
    private String categoryName;
    private String categorySlug;
    private String brandName;
    private String brandSlug;
}
