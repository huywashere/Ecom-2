package com.ecom.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequest {

    @NotNull(message = "variantId không được để trống")
    private Long variantId;

    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    @Builder.Default
    private Integer quantity = 1;
}
