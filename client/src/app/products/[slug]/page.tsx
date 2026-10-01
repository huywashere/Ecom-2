'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  ShoppingCart, 
  Zap, 
  ChevronRight, 
  Plus, 
  Minus, 
  Check, 
  Cpu
} from 'lucide-react';
import { productService } from '@/services/product.service';
import { ProductDetail, ProductVariant } from '@/types';
import { formatVND } from '@/lib/formatters';
import { useCartStore } from '@/store/cart-store';
import VariantSelector from '@/components/product/VariantSelector';
import ProductSpecsTable from '@/components/product/ProductSpecsTable';
import { DEMO_PRODUCT_DETAILS, DEMO_PRODUCTS } from '@/lib/demo-data';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { addItem } = useCartStore();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await productService.getProductBySlug(slug);
        if (res.data) {
          setProduct(res.data);
          if (res.data.variants?.length) {
            setSelectedVariant(res.data.variants[0]);
          }
          return;
        }
      } catch {
        // Use demo fallback
      }

      // Fallback
      const fallback = DEMO_PRODUCT_DETAILS[slug] || {
        ...DEMO_PRODUCTS[0],
        detailDescription: 'Sản phẩm công nghệ cao cấp chính hãng.',
        specifications: JSON.stringify({
          'Bảo hành': '12 tháng chính hãng',
          'Tình trạng': 'Mới 100% nguyên seal',
        }),
        variants: [
          {
            id: 999,
            sku: `${slug}-std`,
            variantName: 'Phiên bản tiêu chuẩn',
            price: DEMO_PRODUCTS[0].minPrice,
            originalPrice: DEMO_PRODUCTS[0].originalPrice,
            stockQuantity: 20,
            active: true,
          },
        ],
      };
      setProduct(fallback);
      if (fallback.variants?.length) {
        setSelectedVariant(fallback.variants[0]);
      }
      setLoading(false);
    }

    if (slug) loadProduct();
  }, [slug]);

  const currentPrice = selectedVariant ? selectedVariant.price : product?.minPrice || 0;
  const currentOriginalPrice = selectedVariant?.originalPrice || product?.originalPrice;
  const discountPercent =
    currentOriginalPrice && currentOriginalPrice > currentPrice
      ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    addItem(product, selectedVariant, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handleBuyNow = () => {
    if (!product || !selectedVariant) return;
    addItem(product, selectedVariant, quantity);
    router.push('/checkout');
  };

  if (loading && !product) {
    return (
      <div className="py-20 text-center">
        <Cpu className="w-12 h-12 text-cyan-400 mx-auto animate-spin mb-4" />
        <p className="text-sm text-slate-400">Đang tải thông tin sản phẩm công nghệ...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Không tìm thấy sản phẩm</h2>
        <Link href="/products" className="text-xs text-cyan-400 underline">
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-cyan-400">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-cyan-400">Sản phẩm</Link>
        {product.categoryName && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/products?category=${product.categorySlug}`} className="hover:text-cyan-400">
              {product.categoryName}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Media Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl glass-panel p-8 flex items-center justify-center border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950 aspect-square relative overflow-hidden">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-500/30">
                Giảm {discountPercent}%
              </span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedVariant?.imageUrl || product.thumbnail || '/placeholder.png'}
              alt={product.name}
              className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Guarantee Perks List */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl glass-panel border border-white/5 text-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-white">Bảo Hành {product.warrantyMonths} Tháng</p>
              <p className="text-[10px] text-slate-500">Chính hãng 100%</p>
            </div>
            <div className="p-3 rounded-2xl glass-panel border border-white/5 text-center">
              <RefreshCw className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-white">1 Đổi 1 Trong 30 Ngày</p>
              <p className="text-[10px] text-slate-500">Nếu có lỗi phần cứng</p>
            </div>
            <div className="p-3 rounded-2xl glass-panel border border-white/5 text-center">
              <Truck className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-white">Giao Miễn Phí</p>
              <p className="text-[10px] text-slate-500">Toàn quốc 2-48h</p>
            </div>
          </div>
        </div>

        {/* Right: Info, Variant Selection, Purchase Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                {product.brandName || 'Chính Hãng'}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{product.categoryName}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
              {product.name}
            </h1>

            {selectedVariant && (
              <p className="text-xs text-slate-400 font-mono mt-1">
                Mã SKU: <span className="text-slate-300">{selectedVariant.sku}</span>
              </p>
            )}
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 bg-cyan-950/10 flex items-baseline gap-3">
            <span className="text-3xl font-black text-cyan-400 tracking-tight">
              {formatVND(currentPrice)}
            </span>
            {currentOriginalPrice && currentOriginalPrice > currentPrice && (
              <span className="text-sm text-slate-500 line-through">
                {formatVND(currentOriginalPrice)}
              </span>
            )}
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelect={(v) => setSelectedVariant(v)}
            />
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-300 uppercase">Số lượng:</span>
            <div className="flex items-center gap-2 bg-slate-900 rounded-xl p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1.5 hover:text-cyan-400 text-slate-400 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-xs font-bold text-white">{quantity}</span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => {
                    const max = selectedVariant ? selectedVariant.stockQuantity : 99;
                    return Math.min(max, q + 1);
                  })
                }
                className="p-1.5 hover:text-cyan-400 text-slate-400 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {selectedVariant && (
              <span className="text-xs text-slate-400">
                (Kho còn: <strong className="text-cyan-400">{selectedVariant.stockQuantity}</strong> sản phẩm)
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="py-3.5 px-4 rounded-2xl bg-slate-900 border border-cyan-500/40 hover:bg-slate-800 text-cyan-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" /> Đã thêm vào giỏ!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" /> Thêm Vào Giỏ
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-500/25"
            >
              <Zap className="w-4 h-4" /> Mua Ngay
            </button>
          </div>
        </div>
      </div>

      {/* Specifications & Description Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-white/10">
        {/* Specs Table */}
        <div className="lg:col-span-7">
          <ProductSpecsTable
            specificationsJson={product.specifications}
            warrantyMonths={product.warrantyMonths}
          />
        </div>

        {/* Detailed article description */}
        <div className="lg:col-span-5 rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-base pb-3 border-b border-white/10">
            Đặc Điểm Nổi Bật & Bài Viết Đánh Giá
          </h3>
          <div
            className="text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: product.detailDescription || product.shortDescription || '',
            }}
          />
        </div>
      </div>
    </div>
  );
}
