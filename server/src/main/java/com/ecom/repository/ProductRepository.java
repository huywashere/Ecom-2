package com.ecom.repository;

import com.ecom.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlug(String slug);

    List<Product> findByFeaturedTrueAndPublishedTrue();

    Page<Product> findByPublishedTrue(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.published = true AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Product> searchProducts(@Param("query") String query, Pageable pageable);

    Page<Product> findByCategoryIdAndPublishedTrue(Long categoryId, Pageable pageable);

    Page<Product> findByBrandIdAndPublishedTrue(Long brandId, Pageable pageable);
}
