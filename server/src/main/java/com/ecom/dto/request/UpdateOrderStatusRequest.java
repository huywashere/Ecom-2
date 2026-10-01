package com.ecom.dto.request;

import com.ecom.constant.OrderStatus;
import com.ecom.constant.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusRequest {
    private OrderStatus orderStatus;
    private PaymentStatus paymentStatus;
}
