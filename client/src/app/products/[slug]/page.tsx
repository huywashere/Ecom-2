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
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-xs font-black uppercase text-neutral-500">Loading Product...</p>
      </div>
    );
  }
  const currentPrice = selectedVariant?.price ?? product.minPrice;
  const currentOriginalPrice = selectedVariant?.originalPrice ?? product.originalPrice;
  const isOutOfStock: boolean = Boolean(product.totalStock === 0 || (selectedVariant && selectedVariant.stockQuantity <= 0));

  const galleryImages = [
    product.thumbnail,
    'https://mrbeast.store/cdn/shop/files/B2S_NoiseTee_BLK_BACK.jpg?v=1785206597&width=800',
    'https://cdn.shopify.com/s/files/1/0016/1975/5059/files/Particle_Front_1.jpg?v=1778269853&width=800',
  ].filter(Boolean) as string[];

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-bold uppercase text-neutral-400 mb-6">
        <Link href="/" className="hover:text-black transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-black transition">Collections</Link>
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
              {product.brandName || 'MrBeast Official'}
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
              {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK'}
            </span>
          </div>

          {/* Value Prop Banner */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded flex items-center gap-3 text-xs font-bold text-neutral-700">
            <Truck className="w-4 h-4 text-[#00B2FE] shrink-0" />
            <span>Orders over $75 qualify for <strong>FREE SHIPPING</strong>!</span>
          </div>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-black">
                  Select Size / Style: <span className="font-bold text-neutral-600">{selectedVariant?.variantName}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSizeChartOpen(true)}
                  className="flex items-center gap-1 text-xs font-bold text-black hover:underline"
                >
                  <Ruler className="w-3.5 h-3.5" /> Size Guide
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
            <span className="text-xs font-black uppercase tracking-wider text-black">Quantity</span>
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
                'Sold Out'
              ) : addedSuccess ? (
                <>
                  <Check className="w-4 h-4" /> Added To Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add To Cart
                </>
              )}
            </button>

            {!isOutOfStock && (
              <button
                onClick={handleBuyNow}
                className="w-full py-4 bg-[#00B2FE] hover:bg-[#009ce0] text-black font-black uppercase text-xs tracking-widest transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-black" /> Buy It Now
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
                <span>Description & Fit</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.description ? 'rotate-180' : ''}`} />
              </button>
              {openAccordions.description && (
                <div className="pb-4 text-xs text-neutral-600 font-medium leading-relaxed">
                  <p>{product.detailDescription || product.shortDescription}</p>
                </div>
              )}
            </div>

            {/* Shipping & Returns */}
            <div>
              <button
                onClick={() => toggleAccordion('shipping')}
                className="w-full py-3.5 flex items-center justify-between text-xs font-black uppercase text-black"
              >
                <span>Shipping & 30-Day Returns</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.shipping ? 'rotate-180' : ''}`} />
              </button>
              {openAccordions.shipping && (
                <div className="pb-4 text-xs text-neutral-600 font-medium space-y-2">
                  <p>• Free standard shipping on all US orders over $75.</p>
                  <p>• Orders are processed within 24-48 hours from our fulfillment center.</p>
                  <p>• 30-day hassle-free return window for unworn items with original tags.</p>
                </div>
              )}
            </div>

            {/* Fabric Care */}
            <div>
              <button
                onClick={() => toggleAccordion('care')}
                className="w-full py-3.5 flex items-center justify-between text-xs font-black uppercase text-black"
              >
                <span>Fabric & Care Instructions</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.care ? 'rotate-180' : ''}`} />
              </button>
              {openAccordions.care && (
                <div className="pb-4 text-xs text-neutral-600 font-medium space-y-1">
                  <p>• 100% Pre-shrunk cotton</p>
                  <p>• Machine wash cold inside out with like colors</p>
                  <p>• Tumble dry low or hang dry to preserve graphic vibrancy</p>
                  <p>• Do not iron decoration</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Official Size Chart Modal */}
      {sizeChartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white max-w-2xl w-full p-6 rounded shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
              <h3 className="text-base font-black uppercase text-black">Official MrBeast Sizing Guide</h3>
              <button
                onClick={() => setSizeChartOpen(false)}
                className="p-1 hover:bg-neutral-100 rounded text-neutral-500 hover:text-black transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative w-full aspect-[4/3] bg-neutral-50 rounded overflow-hidden">
              <Image
                src="https://mrbeast.store/cdn/shop/files/mrbeast-size-chart-adult_600x.png?v=13960938186185848989"
                alt="MrBeast Size Measurement Chart"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
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
