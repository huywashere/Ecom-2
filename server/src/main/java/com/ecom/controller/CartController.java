package com.ecom.controller;

import com.ecom.dto.request.AddToCartRequest;
import com.ecom.dto.response.ApiResponse;
import com.ecom.dto.response.CartDto;
import com.ecom.entity.User;
import com.ecom.service.AuthService;
import com.ecom.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Quản lý giỏ hàng trực tuyến")
public class CartController {

    private final CartService cartService;
    private final AuthService authService;

    @GetMapping
    @Operation(summary = "Xem giỏ hàng của người dùng hiện tại")
    public ResponseEntity<ApiResponse<CartDto>> getCart() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.ok(cartService.getCart(user)));
    }

    @PostMapping
    @Operation(summary = "Thêm sản phẩm vào giỏ hàng")
    public ResponseEntity<ApiResponse<CartDto>> addToCart(@Valid @RequestBody AddToCartRequest request) {
        User user = authService.getCurrentUser();
        CartDto updatedCart = cartService.addToCart(user, request);
        return ResponseEntity.ok(ApiResponse.ok("Thêm vào giỏ hàng thành công", updatedCart));
    }

    @PutMapping("/{itemId}")
    @Operation(summary = "Cập nhật số lượng sản phẩm trong giỏ hàng")
    public ResponseEntity<ApiResponse<CartDto>> updateCartItem(
            @PathVariable Long itemId,
            @RequestParam int quantity
    ) {
        User user = authService.getCurrentUser();
        CartDto updatedCart = cartService.updateCartItem(user, itemId, quantity);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật giỏ hàng thành công", updatedCart));
    }

    @DeleteMapping("/{itemId}")
    @Operation(summary = "Xóa một sản phẩm khỏi giỏ hàng")
    public ResponseEntity<ApiResponse<CartDto>> removeCartItem(@PathVariable Long itemId) {
        User user = authService.getCurrentUser();
        CartDto updatedCart = cartService.removeCartItem(user, itemId);
        return ResponseEntity.ok(ApiResponse.ok("Xóa sản phẩm khỏi giỏ hàng thành công", updatedCart));
    }

    @DeleteMapping("/clear")
    @Operation(summary = "Xóa toàn bộ giỏ hàng")
    public ResponseEntity<ApiResponse<Void>> clearCart() {
        User user = authService.getCurrentUser();
        cartService.clearCart(user);
        return ResponseEntity.ok(ApiResponse.ok("Đã làm trống giỏ hàng", null));
    }
}
