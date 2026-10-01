package com.ecom.service;

import com.ecom.dto.request.AddToCartRequest;
import com.ecom.dto.response.CartDto;
import com.ecom.dto.response.CartItemDto;
import com.ecom.entity.CartItem;
import com.ecom.entity.ProductVariant;
import com.ecom.entity.User;
import com.ecom.exception.BadRequestException;
import com.ecom.exception.ResourceNotFoundException;
import com.ecom.repository.CartItemRepository;
import com.ecom.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;

    @Transactional(readOnly = true)
    public CartDto getCart(User user) {
        List<CartItem> items = cartItemRepository.findByUserId(user.getId());
        return mapToCartDto(items);
    }

    @Transactional
    public CartDto addToCart(User user, AddToCartRequest request) {
        ProductVariant variant = productVariantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiên bản sản phẩm"));

        if (variant.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Số lượng trong kho không đủ (Còn: " + variant.getStockQuantity() + ")");
        }

        CartItem cartItem = cartItemRepository.findByUserIdAndVariantId(user.getId(), variant.getId())
                .map(existing -> {
                    int newQty = existing.getQuantity() + request.getQuantity();
                    if (newQty > variant.getStockQuantity()) {
                        throw new BadRequestException("Tổng số lượng vượt quá tồn kho (Còn: " + variant.getStockQuantity() + ")");
                    }
                    existing.setQuantity(newQty);
                    return existing;
                })
                .orElseGet(() -> CartItem.builder()
                        .user(user)
                        .variant(variant)
                        .quantity(request.getQuantity())
                        .build());

        cartItemRepository.save(cartItem);
        return getCart(user);
    }

    @Transactional
    public CartDto updateCartItem(User user, Long cartItemId, int quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .filter(i -> i.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mục trong giỏ"));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            if (quantity > item.getVariant().getStockQuantity()) {
                throw new BadRequestException("Vượt quá số lượng tồn kho");
            }
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return getCart(user);
    }

    @Transactional
    public CartDto removeCartItem(User user, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .filter(i -> i.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mục trong giỏ"));

        cartItemRepository.delete(item);
        return getCart(user);
    }

    @Transactional
    public void clearCart(User user) {
        cartItemRepository.deleteByUserId(user.getId());
    }

    public CartDto mapToCartDto(List<CartItem> items) {
        List<CartItemDto> itemDtos = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;
        int totalItems = 0;

        for (CartItem item : items) {
            ProductVariant v = item.getVariant();
            BigDecimal subtotal = v.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            totalPrice = totalPrice.add(subtotal);
            totalItems += item.getQuantity();

            itemDtos.add(CartItemDto.builder()
                    .id(item.getId())
                    .variantId(v.getId())
                    .productId(v.getProduct().getId())
                    .productName(v.getProduct().getName())
                    .productSlug(v.getProduct().getSlug())
                    .variantName(v.getVariantName())
                    .sku(v.getSku())
                    .imageUrl(v.getImageUrl() != null ? v.getImageUrl() : v.getProduct().getThumbnail())
                    .price(v.getPrice())
                    .quantity(item.getQuantity())
                    .stockQuantity(v.getStockQuantity())
                    .subtotal(subtotal)
                    .build());
        }

        return CartDto.builder()
                .items(itemDtos)
                .totalItems(totalItems)
                .totalPrice(totalPrice)
                .build();
    }
}
