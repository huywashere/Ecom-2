package com.ecom.controller;

import com.ecom.dto.request.UpdateOrderStatusRequest;
import com.ecom.dto.response.ApiResponse;
import com.ecom.dto.response.OrderDto;
import com.ecom.dto.response.PageResponse;
import com.ecom.dto.response.ProductDetailDto;
import com.ecom.dto.response.ProductDto;
import com.ecom.dto.response.StatsResponse;
import com.ecom.service.OrderService;
import com.ecom.service.ProductService;
import com.ecom.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Các API dành riêng cho quản trị viên")
public class AdminController {

    private final StatsService statsService;
    private final OrderService orderService;
    private final ProductService productService;

    @GetMapping("/stats")
    @Operation(summary = "Lấy thống kê tổng quan doanh thu và số liệu hệ thống")
    public ResponseEntity<ApiResponse<StatsResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok(statsService.getDashboardStats()));
    }

    @GetMapping("/orders")
    @Operation(summary = "Xem toàn bộ đơn hàng trong hệ thống")
    public ResponseEntity<ApiResponse<PageResponse<OrderDto>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getAllOrders(PageRequest.of(page, size))));
    }

    @PutMapping("/orders/{id}/status")
    @Operation(summary = "Cập nhật trạng thái đơn hàng và thanh toán")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody UpdateOrderStatusRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật đơn hàng thành công", orderService.updateOrderStatus(id, request)));
    }

    @GetMapping("/products")
    @Operation(summary = "Xem danh sách sản phẩm quản trị")
    public ResponseEntity<ApiResponse<PageResponse<ProductDto>>> getAdminProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getProducts(null, null, null, null, null, PageRequest.of(page, size, Sort.by("createdAt").descending()))));
    }
}
