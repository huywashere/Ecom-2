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
public class CartItemDto {
    private Long id;
    private Long variantId;
    private Long productId;
    private String productName;
    private String productSlug;
    private String variantName;
    private String sku;
    private String imageUrl;
    private BigDecimal price;
    private Integer quantity;
    private Integer stockQuantity;
    private BigDecimal subtotal;
}
