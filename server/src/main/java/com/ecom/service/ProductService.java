package com.ecom.service;

import com.ecom.dto.response.BrandDto;
import com.ecom.dto.response.CategoryDto;
import com.ecom.dto.response.PageResponse;
import com.ecom.dto.response.ProductDetailDto;
import com.ecom.dto.response.ProductDto;
import com.ecom.dto.response.ProductVariantDto;
import com.ecom.entity.Product;
import com.ecom.entity.ProductVariant;
import com.ecom.exception.ResourceNotFoundException;
import com.ecom.repository.BrandRepository;
import com.ecom.repository.CategoryRepository;
import com.ecom.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    @Transactional(readOnly = true)
    public List<ProductDto> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndPublishedTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductDto> getProducts(
            String query,
            String categorySlug,
            String brandSlug,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    ) {
        Specification<Product> spec = (root, queryObj, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("published")));

            if (StringUtils.hasText(query)) {
                String likePattern = "%" + query.toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), likePattern);
                Predicate descMatch = cb.like(cb.lower(root.get("shortDescription")), likePattern);
                predicates.add(cb.or(nameMatch, descMatch));
            }

            if (StringUtils.hasText(categorySlug)) {
                predicates.add(cb.equal(root.get("category").get("slug"), categorySlug));
            }

            if (StringUtils.hasText(brandSlug)) {
                predicates.add(cb.equal(root.get("brand").get("slug"), brandSlug));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Product> page = productRepository.findAll(spec, pageable);
        return PageResponse.from(page.map(this::mapToDto));
    }

    @Transactional(readOnly = true)
    public ProductDetailDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với slug: " + slug));

        return mapToDetailDto(product);
    }

    @Transactional(readOnly = true)
    public ProductDetailDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với id: " + id));

        return mapToDetailDto(product);
    }

    public ProductDto mapToDto(Product product) {
        BigDecimal minPrice = BigDecimal.ZERO;
        BigDecimal origPrice = BigDecimal.ZERO;
        int totalStock = 0;

        if (product.getVariants() != null && !product.getVariants().isEmpty()) {
            minPrice = product.getVariants().stream()
                    .map(ProductVariant::getPrice)
                    .min(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO);

            origPrice = product.getVariants().stream()
                    .filter(v -> v.getOriginalPrice() != null)
                    .map(ProductVariant::getOriginalPrice)
                    .min(BigDecimal::compareTo)
                    .orElse(minPrice);

            totalStock = product.getVariants().stream()
                    .mapToInt(ProductVariant::getStockQuantity)
                    .sum();
        }

        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .shortDescription(product.getShortDescription())
                .thumbnail(product.getThumbnail())
                .warrantyMonths(product.getWarrantyMonths())
                .featured(product.isFeatured())
                .minPrice(minPrice)
                .originalPrice(origPrice)
                .totalStock(totalStock)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .categorySlug(product.getCategory() != null ? product.getCategory().getSlug() : null)
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .brandSlug(product.getBrand() != null ? product.getBrand().getSlug() : null)
                .build();
    }

    public ProductDetailDto mapToDetailDto(Product product) {
        List<ProductVariantDto> variantDtos = new ArrayList<>();
        if (product.getVariants() != null) {
            variantDtos = product.getVariants().stream()
                    .map(v -> ProductVariantDto.builder()
                            .id(v.getId())
                            .sku(v.getSku())
                            .variantName(v.getVariantName())
                            .price(v.getPrice())
                            .originalPrice(v.getOriginalPrice())
                            .stockQuantity(v.getStockQuantity())
                            .imageUrl(v.getImageUrl())
                            .active(v.isActive())
                            .build())
                    .collect(Collectors.toList());
        }

        CategoryDto catDto = null;
        if (product.getCategory() != null) {
            catDto = CategoryDto.builder()
                    .id(product.getCategory().getId())
                    .name(product.getCategory().getName())
                    .slug(product.getCategory().getSlug())
                    .icon(product.getCategory().getIcon())
                    .build();
        }

        BrandDto brandDto = null;
        if (product.getBrand() != null) {
            brandDto = BrandDto.builder()
                    .id(product.getBrand().getId())
                    .name(product.getBrand().getName())
                    .slug(product.getBrand().getSlug())
                    .logoUrl(product.getBrand().getLogoUrl())
                    .build();
        }

        return ProductDetailDto.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .shortDescription(product.getShortDescription())
                .detailDescription(product.getDetailDescription())
                .thumbnail(product.getThumbnail())
                .warrantyMonths(product.getWarrantyMonths())
                .featured(product.isFeatured())
                .published(product.isPublished())
                .specifications(product.getSpecifications())
                .category(catDto)
                .brand(brandDto)
                .variants(variantDtos)
                .minPrice(product.getMinPrice())
                .build();
    }
}
