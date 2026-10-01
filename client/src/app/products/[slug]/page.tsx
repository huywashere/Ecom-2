'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Zap,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Ruler,
  X,
  ChevronDown,
} from 'lucide-react';
import { productService } from '@/services/product.service';
import { ProductDetail, ProductVariant } from '@/types';
import { formatPrice } from '@/lib/formatters';
import { useCartStore } from '@/store/cart-store';
import { useCurrencyStore } from '@/store/currency-store';
import { DEMO_PRODUCT_DETAILS, DEMO_PRODUCTS } from '@/lib/demo-data';
import ProductCard from '@/components/product/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { addItem, setIsOpen: setCartOpen } = useCartStore();
  const { currency } = useCurrencyStore();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);
  const [sizeChartOpen, setSizeChartOpen] = useState<boolean>(false);

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    description: true,
    shipping: false,
    care: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await productService.getProductBySlug(slug);
        if (res.data) {
          setProduct(res.data);
          setSelectedImage(res.data.thumbnail || '');
          if (res.data.variants?.length) {
            setSelectedVariant(res.data.variants[0]);
          }
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to local demo product details
      }

      const fallback = DEMO_PRODUCT_DETAILS[slug] || {
        ...DEMO_PRODUCTS.find((p) => p.slug === slug) || DEMO_PRODUCTS[0],
        detailDescription:
          'Official 100% authentic MrBeast merchandise. Features high-definition graphics, comfortable relaxed cut, and tagless neckline for maximum daily comfort.',
        specifications: JSON.stringify({
          Material: '100% Ring-Spun Combed Cotton',
          Fit: 'Custom Relaxed Fit',
          Origin: 'Designed in North Carolina, USA',
        }),
        variants: [
          { id: 101, sku: `${slug}-S`, variantName: 'Small', price: 24.49, originalPrice: 28.00, stockQuantity: 20, active: true },
          { id: 102, sku: `${slug}-M`, variantName: 'Medium', price: 24.49, originalPrice: 28.00, stockQuantity: 25, active: true },
          { id: 103, sku: `${slug}-L`, variantName: 'Large', price: 24.49, originalPrice: 28.00, stockQuantity: 30, active: true },
          { id: 104, sku: `${slug}-XL`, variantName: 'XL', price: 24.49, originalPrice: 28.00, stockQuantity: 15, active: true },
        ],
      };

      setProduct(fallback);
      setSelectedImage(fallback.thumbnail || '');
      if (fallback.variants?.length) {
        setSelectedVariant(fallback.variants[0]);
      }
      setLoading(false);
    }

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  if (loading || !product) {
    return (
      <div className="max-w-[1920px] mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-xs font-black uppercase text-neutral-500">Loading Product...</p>
      </div>
    );
  }
  const currentPrice = selectedVariant?.price ?? product.minPrice;
  const currentOriginalPrice = selectedVariant?.originalPrice ?? product.originalPrice;
  const isOutOfStock: boolean = Boolean(product.totalStock === 0 || (selectedVariant && selectedVariant.stockQuantity <= 0));

  const getProductGallery = (prod: ProductDetail) => {
    const list = [prod.thumbnail];
    if (prod.categorySlug === 'laptops') {
      list.push(
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1000&auto=format&fit=crop&q=80'
      );
    } else if (prod.categorySlug === 'gaming-pc') {
      list.push(
        'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1000&auto=format&fit=crop&q=80'
      );
    } else if (prod.categorySlug === 'monitors') {
      list.push(
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=1000&auto=format&fit=crop&q=80'
      );
    } else if (prod.categorySlug === 'keyboards') {
      list.push(
        'https://images.unsplash.com/photo-1595225476474-87563907a212?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1000&auto=format&fit=crop&q=80'
      );
    } else if (prod.categorySlug === 'mice') {
      list.push(
        'https://images.unsplash.com/photo-1626218174358-7769486c4b79?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1000&auto=format&fit=crop&q=80'
      );
    } else if (prod.categorySlug === 'audio') {
      list.push(
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1000&auto=format&fit=crop&q=80'
      );
    } else if (prod.categorySlug === 'components') {
      list.push(
        'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1562976540-1502c2145186?w=1000&auto=format&fit=crop&q=80'
      );
    } else {
      list.push(
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80'
      );
    }
    return list.filter(Boolean) as string[];
  };

  const galleryImages = getProductGallery(product);

  let parsedSpecs: Record<string, string> = {};
  try {
    if (product.specifications) {
      parsedSpecs = JSON.parse(product.specifications);
    }
  } catch {
    parsedSpecs = {};
  }

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;
    addItem(product, selectedVariant, quantity);
    setAddedSuccess(true);
    setCartOpen(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedVariant || isOutOfStock) return;
    addItem(product, selectedVariant, quantity);
    router.push('/checkout');
  };

  const relatedProducts = DEMO_PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 4);

  return (
    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-bold uppercase text-neutral-400 mb-6">
        <Link href="/" className="hover:text-black transition">Trang Chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-black transition">Bộ Sưu Tập</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-black truncate max-w-xs">{product.name}</span>
      </nav>

      {/* 2. Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails list */}
          <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[560px] no-scrollbar">
            {galleryImages.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(imgUrl)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 bg-neutral-100 rounded overflow-hidden shrink-0 border-2 transition ${
                  selectedImage === imgUrl ? 'border-black shadow-md' : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <Image src={imgUrl} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>

          {/* Main Large Display Image */}
          <div className="flex-1 relative aspect-square bg-[#F7F7F8] rounded border border-neutral-200 overflow-hidden">
            <Image
              src={selectedImage || product.thumbnail || ''}
              alt={product.name}
              fill
              priority
              className="object-contain p-4 hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
        </div>

        {/* Right: Product Buy Box */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
          {/* Brand & Title */}
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#00B2FE]">
              {product.brandName || 'TITAN TECH'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight mt-1 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing & Stock */}
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl font-black text-black">
              {formatPrice(currentPrice, currency)}
            </span>
            {currentOriginalPrice && currentOriginalPrice > currentPrice && (
              <span className="text-base text-neutral-400 font-bold line-through">
                {formatPrice(currentOriginalPrice, currency)}
              </span>
            )}
            <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase rounded ${
              isOutOfStock ? 'bg-neutral-200 text-neutral-600' : 'bg-green-100 text-green-800'
            }`}>
              {isOutOfStock ? 'HẾT HÀNG' : 'CÒN HÀNG SẴN'}
            </span>
          </div>

          {/* Value Prop Banner */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded flex items-center gap-3 text-xs font-bold text-neutral-700">
            <Truck className="w-4 h-4 text-[#00B2FE] shrink-0" />
            <span>Đơn hàng từ $75 nhận <strong>MIỄN PHÍ VẬN CHUYỂN HỎA TỐC 2 GIỜ</strong>!</span>
          </div>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-black">
                  Chọn Cấu Hình / Phiên Bản: <span className="font-bold text-neutral-600">{selectedVariant?.variantName}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSizeChartOpen(true)}
                  className="flex items-center gap-1 text-xs font-bold text-black hover:underline"
                >
                  <Ruler className="w-3.5 h-3.5" /> Thông Số Chi Tiết
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3.5 py-2 text-xs font-black uppercase rounded border transition ${
                        isSelected
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-neutral-300 hover:border-black'
                      }`}
                    >
                      {v.variantName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Stepper */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">Số Lượng</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-neutral-300 rounded">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 hover:bg-neutral-100 transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-black min-w-[36px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2.5 hover:bg-neutral-100 transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-4 text-xs font-black uppercase tracking-widest transition flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  : addedSuccess
                  ? 'bg-green-600 text-white'
                  : 'bg-black hover:bg-neutral-800 text-white shadow-md'
              }`}
            >
              {isOutOfStock ? (
                'Hết Hàng'
              ) : addedSuccess ? (
                <>
                  <Check className="w-4 h-4" /> Đã Thêm Vào Giỏ Hàng
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Thêm Vào Giỏ Hàng
                </>
              )}
            </button>

            {!isOutOfStock && (
              <button
                onClick={handleBuyNow}
                className="w-full py-4 bg-[#00B2FE] hover:bg-[#009ce0] text-black font-black uppercase text-xs tracking-widest transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-black" /> Mua Ngay Bây Giờ
              </button>
            )}
          </div>

          {/* Accordion Dropdowns */}
          <div className="border-t border-neutral-200 divide-y divide-neutral-200 pt-2">
            {/* Description */}
            <div>
              <button
                onClick={() => toggleAccordion('description')}
                className="w-full py-3.5 flex items-center justify-between text-xs font-black uppercase text-black"
              >
                <span>Mô Tả & Điểm Nhấn Công Nghệ</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.description ? 'rotate-180' : ''}`} />
              </button>
              {openAccordions.description && (
                <div className="pb-4 text-xs text-neutral-600 font-medium leading-relaxed">
                  <p>{product.detailDescription || product.shortDescription}</p>
                </div>
              )}
            </div>

            {/* Hardware Specs */}
            <div>
              <button
                onClick={() => toggleAccordion('shipping')}
                className="w-full py-3.5 flex items-center justify-between text-xs font-black uppercase text-black"
              >
                <span>Thông Số Kỹ Thuật (Hardware Specifications)</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.shipping ? 'rotate-180' : ''}`} />
              </button>
              {openAccordions.shipping && (
                <div className="pb-4 text-xs text-neutral-600 font-medium space-y-2">
                  {Object.keys(parsedSpecs).length > 0 ? (
                    <div className="divide-y divide-neutral-100 border border-neutral-200 rounded">
                      {Object.entries(parsedSpecs).map(([key, val]) => (
                        <div key={key} className="flex justify-between py-2 px-3 text-xs">
                          <span className="font-bold text-neutral-800">{key}:</span>
                          <span className="text-neutral-600 text-right">{val}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>• Bảo hành chính hãng: {product.warrantyMonths || 24} tháng.</p>
                  )}
                </div>
              )}
            </div>

            {/* Warranty & Returns */}
            <div>
              <button
                onClick={() => toggleAccordion('care')}
                className="w-full py-3.5 flex items-center justify-between text-xs font-black uppercase text-black"
              >
                <span>Chính Sách Bảo Hành & Đổi Mới (12 - 36 Tháng)</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.care ? 'rotate-180' : ''}`} />
              </button>
              {openAccordions.care && (
                <div className="pb-4 text-xs text-neutral-600 font-medium space-y-1">
                  <p>• 100% Sản phẩm chính hãng phân phối tại thị trường Việt Nam & Quốc Tế.</p>
                  <p>• 1 đổi 1 trong 30 ngày đầu tiên nếu có lỗi phần cứng hoặc điểm chết màn hình.</p>
                  <p>• Bảo hành phần cứng chính hãng {product.warrantyMonths || 24} tháng tận nơi hoặc qua trung tâm ủy quyền.</p>
                  <p>• Hỗ trợ kỹ thuật trực tuyến và cân màu màn hình miễn phí trọn đời sản phẩm.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tech Specs Modal */}
      {sizeChartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white max-w-2xl w-full p-6 rounded shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
              <h3 className="text-base font-black uppercase text-black">Bảng Thông Số Kỹ Thuật Chi Tiết</h3>
              <button
                onClick={() => setSizeChartOpen(false)}
                className="p-1 hover:bg-neutral-100 rounded text-neutral-500 hover:text-black transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {Object.keys(parsedSpecs).length > 0 ? (
              <div className="divide-y divide-neutral-200 border border-neutral-200 rounded">
                {Object.entries(parsedSpecs).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-2.5 px-4 text-xs">
                    <span className="font-bold text-neutral-800">{key}</span>
                    <span className="text-neutral-600 font-medium text-right max-w-xs">{val}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 py-4">Sản phẩm chính hãng với tiêu chuẩn chất lượng cao nhất.</p>
            )}
          </div>
        </div>
      )}

      {/* 4. Related / Recommended Products */}
      <section className="mt-16 pt-12 border-t border-neutral-200">
        <h2 className="text-xl sm:text-2xl font-black uppercase text-black tracking-tight mb-6">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
