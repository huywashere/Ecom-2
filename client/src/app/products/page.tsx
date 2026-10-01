'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, RotateCcw, Search, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { productService } from '@/services/product.service';
import { Product } from '@/types';
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from '@/lib/demo-data';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [loading, setLoading] = useState(false);

  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || searchParams.get('query') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [searchQuery, setSearchQuery] = useState<string>(searchParam);
  const [sortBy, setSortBy] = useState<string>('featured');

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  // Load from server if available, otherwise DEMO_PRODUCTS
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await productService.getProducts({ size: 50 });
        if (res.data?.items?.length) {
          setProducts(res.data.items);
          setLoading(false);
          return;
        }
      } catch {
        // fallback
      }
      setProducts(DEMO_PRODUCTS);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(
        (p) =>
          p.categorySlug === selectedCategory ||
          (selectedCategory === 'new' && p.featured)
      );
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.minPrice - b.minPrice);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.minPrice - a.minPrice);
    } else if (sortBy === 'best-selling') {
      result.sort((a, b) => (b.totalStock || 0) - (a.totalStock || 0));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    router.replace(`/products?${params.toString()}`);
  };

  const currentCategoryTitle =
    selectedCategory === 'laptops'
      ? 'Laptops & MacBooks Flagship'
      : selectedCategory === 'gaming-pc'
      ? 'Custom Gaming PCs & Workstations'
      : selectedCategory === 'monitors'
      ? 'Màn Hình Gaming & OLED 240Hz'
      : selectedCategory === 'keyboards'
      ? 'Bàn Phím Cơ Custom Cao Cấp'
      : selectedCategory === 'mice'
      ? 'Chuột Gaming & Gears Esports'
      : selectedCategory === 'audio'
      ? 'Tai Nghe & Âm Thanh Hi-End'
      : selectedCategory === 'components'
      ? 'Linh Kiện Máy Tính & GPUs'
      : selectedCategory === 'smartphones'
      ? 'Điện Thoại Flagship & Handhelds'
      : selectedCategory === 'new'
      ? 'Sản Phẩm Công Nghệ Mới Nhất'
      : 'Tất Cả Sản Phẩm Máy Tính & Điện Tử';

  return (
    <div className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-12 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="border-b border-neutral-200 pb-8 mb-8 space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
          {currentCategoryTitle}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-neutral-500 max-w-xl">
          100% hàng chính hãng full VAT, bảo hành 12-36 tháng chính hãng, miễn phí vận chuyển hỏa tốc cho đơn từ $75.
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded transition shrink-0 ${
              !selectedCategory || selectedCategory === 'all'
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All Products
          </button>
          {DEMO_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded transition shrink-0 ${
                selectedCategory === cat.slug
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort and Count */}
        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 text-xs">
          <span className="font-bold text-neutral-400">
            {filteredProducts.length} Products
          </span>

          <div className="flex items-center gap-1 border border-neutral-300 rounded px-2.5 py-1.5 bg-white">
            <span className="font-bold text-neutral-500 uppercase">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-black uppercase text-black focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="best-selling">Best Selling</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4">
          <p className="text-base font-black uppercase text-black">No products found</p>
          <p className="text-xs text-neutral-500">
            Try adjusting your category or search query to find what you&apos;re looking for.
          </p>
          <button
            onClick={() => handleCategoryChange('all')}
            className="px-6 py-2.5 bg-black text-white text-xs font-black uppercase tracking-wider rounded"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-black">Loading Collections...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
