'use client';

import React, { useState, useEffect, useCallback, useTransition, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, SlidersHorizontal, Search, RotateCcw, Cpu } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { productService } from '@/services/product.service';
import { Category, Brand, Product } from '@/types';
import { DEMO_CATEGORIES, DEMO_BRANDS, DEMO_PRODUCTS } from '@/lib/demo-data';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES);
  const [brands, setBrands] = useState<Brand[]>(DEMO_BRANDS);
  const [loading, setLoading] = useState(false);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get('brand') || '');
  const [query, setQuery] = useState<string>(searchParams.get('query') || '');
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');

  // Load Categories & Brands
  useEffect(() => {
    async function loadMeta() {
      try {
        const [catRes, brandRes] = await Promise.all([
          productService.getCategories(),
          productService.getBrands(),
        ]);
        if (catRes.data?.length) setCategories(catRes.data);
        if (brandRes.data?.length) setBrands(brandRes.data);
      } catch {
        // use fallback
      }
    }
    loadMeta();
  }, []);

  // Fetch Products based on current filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts({
        category: selectedCategory || undefined,
        brand: selectedBrand || undefined,
        query: query || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy,
        direction,
        size: 20,
      });

      if (res.data?.items) {
        setProducts(res.data.items);
      } else {
        // Filter demo products locally if backend is unavailable
        let filtered = [...DEMO_PRODUCTS];
        if (selectedCategory) {
          filtered = filtered.filter((p) => p.categorySlug === selectedCategory);
        }
        if (selectedBrand) {
          filtered = filtered.filter((p) => p.brandSlug === selectedBrand);
        }
        if (query) {
          const q = query.toLowerCase();
          filtered = filtered.filter(
            (p) => p.name.toLowerCase().includes(q) || p.shortDescription?.toLowerCase().includes(q)
          );
        }
        if (minPrice) filtered = filtered.filter((p) => p.minPrice >= Number(minPrice));
        if (maxPrice) filtered = filtered.filter((p) => p.minPrice <= Number(maxPrice));

        if (sortBy === 'minPrice') {
          filtered.sort((a, b) => (direction === 'asc' ? a.minPrice - b.minPrice : b.minPrice - a.minPrice));
        }
        setProducts(filtered);
      }
    } catch {
      // Local fallback filter
      let filtered = [...DEMO_PRODUCTS];
      if (selectedCategory) filtered = filtered.filter((p) => p.categorySlug === selectedCategory);
      if (selectedBrand) filtered = filtered.filter((p) => p.brandSlug === selectedBrand);
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter((p) => p.name.toLowerCase().includes(q));
      }
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedBrand, query, minPrice, maxPrice, sortBy, direction]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setQuery('');
    setMinPrice('');
    setMaxPrice('');
    startTransition(() => {
      router.push('/products');
    });
  };

  return (
    <div className="py-6 space-y-6">
      {/* Header breadcrumb & title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-cyan-400" /> Danh Mục Thiết Bị Điện Tử
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Hiển thị {products.length} sản phẩm công nghệ cao cấp
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={`${sortBy}-${direction}`}
            onChange={(e) => {
              const [sb, dir] = e.target.value.split('-');
              setSortBy(sb);
              setDirection(dir as 'asc' | 'desc');
            }}
            className="bg-slate-900 border border-white/10 text-xs font-semibold text-white rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400"
          >
            <option value="createdAt-desc">Mới nhất</option>
            <option value="minPrice-asc">Giá: Thấp đến Cao</option>
            <option value="minPrice-desc">Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 rounded-2xl glass-panel p-5 space-y-6 border border-white/10">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-cyan-400" /> Bộ Lọc Sản Phẩm
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" /> Đặt lại
            </button>
          </div>

          {/* Search inside filter */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Tìm kiếm từ khóa</label>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="MacBook, RTX 4090..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl text-xs text-white pl-8 pr-3 py-2 focus:border-cyan-400 outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Danh mục</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
                  selectedCategory === ''
                    ? 'bg-cyan-400 text-black font-bold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Tất cả danh mục
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
                    selectedCategory === cat.slug
                      ? 'bg-cyan-400 text-black font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Thương hiệu</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedBrand('')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
                  selectedBrand === ''
                    ? 'bg-cyan-400 text-black font-bold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Tất cả thương hiệu
              </button>
              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBrand(b.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
                    selectedBrand === b.slug
                      ? 'bg-cyan-400 text-black font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Khoảng giá (VNĐ)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Từ (₫)"
                className="w-full bg-slate-900 border border-white/10 rounded-xl text-xs text-white px-2.5 py-1.5 focus:border-cyan-400 outline-none"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Đến (₫)"
                className="w-full bg-slate-900 border border-white/10 rounded-xl text-xs text-white px-2.5 py-1.5 focus:border-cyan-400 outline-none"
              />
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="rounded-2xl bg-slate-900/50 p-4 animate-pulse h-96 border border-white/5" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-3xl glass-panel p-12 text-center border border-white/10">
              <Cpu className="w-16 h-16 mx-auto text-slate-600 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Không tìm thấy sản phẩm nào</h3>
              <p className="text-xs text-slate-400 mb-6">
                Hãy thử nới lỏng bộ lọc hoặc tìm kiếm với từ khóa khác.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-cyan-400 text-black font-bold text-xs rounded-xl hover:bg-cyan-300 transition"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-xs text-slate-400">
          Đang tải danh mục sản phẩm...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

