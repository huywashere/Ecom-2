package com.ecom.service;

import com.ecom.constant.OrderStatus;
import com.ecom.constant.PaymentStatus;
import com.ecom.dto.request.AddToCartRequest;
import com.ecom.dto.request.CheckoutRequest;
import com.ecom.dto.request.UpdateOrderStatusRequest;
import com.ecom.dto.response.OrderDto;
import com.ecom.dto.response.OrderItemDto;
import com.ecom.dto.response.PageResponse;
import com.ecom.entity.CartItem;
import com.ecom.entity.Order;
import com.ecom.entity.OrderItem;
import com.ecom.entity.ProductVariant;
import com.ecom.entity.User;
import com.ecom.exception.BadRequestException;
import com.ecom.exception.ResourceNotFoundException;
import com.ecom.repository.CartItemRepository;
import com.ecom.repository.OrderItemRepository;
import com.ecom.repository.OrderRepository;
import com.ecom.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final SecureRandom random = new SecureRandom();

    @Transactional
    public OrderDto createOrder(User user, CheckoutRequest request) {
        List<CartItem> cartItems = new ArrayList<>();
        boolean fromUserCart = false;

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (AddToCartRequest itemReq : request.getItems()) {
                ProductVariant variant = productVariantRepository.findById(itemReq.getVariantId())
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy biến thể: " + itemReq.getVariantId()));
                cartItems.add(CartItem.builder()
                        .user(user)
                        .variant(variant)
                        .quantity(itemReq.getQuantity())
                        .build());
            }
        } else if (user != null) {
            cartItems = cartItemRepository.findByUserId(user.getId());
            fromUserCart = true;
        }

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Không có sản phẩm nào để đặt hàng");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItemsToSave = new ArrayList<>();

        for (CartItem item : cartItems) {
            ProductVariant variant = item.getVariant();
            if (variant.getStockQuantity() < item.getQuantity()) {
                throw new BadRequestException("Sản phẩm " + variant.getProduct().getName() + " (" + variant.getVariantName() + ") không đủ hàng trong kho");
            }

            // Deduct stock
            variant.setStockQuantity(variant.getStockQuantity() - item.getQuantity());
            productVariantRepository.save(variant);

            BigDecimal subtotal = variant.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            OrderItem orderItem = OrderItem.builder()
                    .variant(variant)
                    .productName(variant.getProduct().getName())
                    .variantName(variant.getVariantName())
                    .sku(variant.getSku())
                    .imageUrl(variant.getImageUrl() != null ? variant.getImageUrl() : variant.getProduct().getThumbnail())
                    .price(variant.getPrice())
                    .quantity(item.getQuantity())
                    .subtotal(subtotal)
                    .build();

            orderItemsToSave.add(orderItem);
        }

        String orderCode = generateOrderCode();
        BigDecimal shippingFee = BigDecimal.ZERO;
        BigDecimal finalAmount = totalAmount.add(shippingFee);

        Order order = Order.builder()
                .orderCode(orderCode)
                .user(user)
                .recipientName(request.getRecipientName())
                .recipientPhone(request.getRecipientPhone())
                .shippingAddress(request.getShippingAddress())
                .notes(request.getNotes())
                .totalAmount(totalAmount)
                .shippingFee(shippingFee)
                .discountAmount(BigDecimal.ZERO)
                .finalAmount(finalAmount)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .orderStatus(OrderStatus.PENDING)
                .build();

        Order savedOrder = orderRepository.save(order);

        for (OrderItem oi : orderItemsToSave) {
            oi.setOrder(savedOrder);
            orderItemRepository.save(oi);
        }

        savedOrder.setItems(orderItemsToSave);

        // If placed from user cart, clear the cart
        if (fromUserCart && user != null) {
            cartItemRepository.deleteByUserId(user.getId());
        }

        return mapToDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderByCode(String orderCode, User user) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng: " + orderCode));

        return mapToDto(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getUserOrders(User user) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderDto> getAllOrders(Pageable pageable) {
        Page<Order> page = orderRepository.findAllByOrderByCreatedAtDesc(pageable);
        return PageResponse.from(page.map(this::mapToDto));
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng: " + orderId));

        if (request.getOrderStatus() != null) {
            order.setOrderStatus(request.getOrderStatus());
        }
        if (request.getPaymentStatus() != null) {
            order.setPaymentStatus(request.getPaymentStatus());
        }

        return mapToDto(orderRepository.save(order));
    }

    private String generateOrderCode() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int rand = 1000 + random.nextInt(9000);
        return "ORD-" + dateStr + "-" + rand;
    }

    public OrderDto mapToDto(Order order) {
        List<OrderItemDto> itemDtos = new ArrayList<>();
        if (order.getItems() != null) {
            itemDtos = order.getItems().stream()
                    .map(i -> OrderItemDto.builder()
                            .id(i.getId())
                            .variantId(i.getVariant() != null ? i.getVariant().getId() : null)
                            .productName(i.getProductName())
                            .variantName(i.getVariantName())
                            .sku(i.getSku())
                            .imageUrl(i.getImageUrl())
                            .price(i.getPrice())
                            .quantity(i.getQuantity())
                            .subtotal(i.getSubtotal())
                            .build())
                    .collect(Collectors.toList());
        }

        return OrderDto.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .recipientName(order.getRecipientName())
                .recipientPhone(order.getRecipientPhone())
                .shippingAddress(order.getShippingAddress())
                .notes(order.getNotes())
                .totalAmount(order.getTotalAmount())
                .shippingFee(order.getShippingFee())
                .discountAmount(order.getDiscountAmount())
                .finalAmount(order.getFinalAmount())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .orderStatus(order.getOrderStatus())
                .createdAt(order.getCreatedAt())
                .items(itemDtos)
                .build();
    }
}
