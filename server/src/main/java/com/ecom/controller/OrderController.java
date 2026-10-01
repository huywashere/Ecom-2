package com.ecom.controller;

import com.ecom.dto.request.CheckoutRequest;
import com.ecom.dto.response.ApiResponse;
import com.ecom.dto.response.OrderDto;
import com.ecom.entity.User;
import com.ecom.service.AuthService;
import com.ecom.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Order", description = "Tạo đơn và tra cứu đơn hàng")
public class OrderController {

    private final OrderService orderService;
    private final AuthService authService;

    @PostMapping
    @Operation(summary = "Tạo đơn hàng mới (Checkout)")
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(@Valid @RequestBody CheckoutRequest request) {
        User user = authService.getCurrentUser();
        OrderDto order = orderService.createOrder(user, request);
        return ResponseEntity.ok(ApiResponse.ok("Đặt hàng thành công", order));
    }

    @GetMapping("/my-orders")
    @Operation(summary = "Xem lịch sử đơn hàng của tôi")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getMyOrders() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.ok(orderService.getUserOrders(user)));
    }

    @GetMapping("/{orderCode}")
    @Operation(summary = "Xem chi tiết đơn hàng theo mã đơn")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderByCode(@PathVariable String orderCode) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrderByCode(orderCode, user)));
    }
}
