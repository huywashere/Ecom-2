'use client';

import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

const REVIEWS = [
  {
    title: 'Cỗ máy RTX 4090 tản nước êm không tưởng!',
    quote: 'Mình làm đồ họa 3D Blender và Unreal Engine 5, dàn máy TITAN BEAST cân mượt mọi cảnh phức tạp. Nhiệt độ render liên tục 8 tiếng chỉ quanh 52°C, đường ống nước cứng đi dây cực kỳ thẩm mỹ.',
    author: 'Hoàng Nam K.',
    badge: 'Verified Buyer • 3D Artist',
  },
  {
    title: 'MacBook Pro M3 Max chuẩn Apple chính hãng!',
    quote: 'Giao siêu tốc 2 giờ nội thành nguyên seal hộp. Máy kích hoạt bảo hành điện tử chính hãng Apple ngay lập tức. Màn hình Liquid Retina XDR chuẩn màu 100% giúp mình tự tin xuất file in ấn và thiết kế.',
    author: 'Minh Trang N.',
    badge: 'Verified Buyer • Senior Designer',
  },
  {
    title: 'Bàn phím Keychron gõ đầm, âm thocky cực mê!',
    quote: 'Khung nhôm CNC nguyên khối chắc nịch, gõ switch được lube sẵn rất êm và mượt. Kết nối không dây Bluetooth chuyển đổi giữa MacBook và PC gaming mượt mà trong nháy mắt. 10/10!',
    author: 'Tuấn Kiệt Đ.',
    badge: 'Verified Buyer • Developer',
  },
];

export default function ParentReviews() {
  return (
    <section className="max-w-[1920px] mx-auto px-4 sm:px-8 xl:px-12 py-12 sm:py-20 border-t border-neutral-200">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <p className="text-xs font-black uppercase tracking-widest text-[#FF007A]">
          VERIFIED CREATOR & GAMER REVIEWS
        </p>

        <div className="flex items-center justify-center gap-1.5 py-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-[#FFDF00] text-[#FFDF00]" />
          ))}
          <span className="text-base font-black text-black ml-2">4.9 / 5.0</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
          Được Tin Tưởng Bởi Hơn 25.000 Creator & Gamer
        </h2>

        <p className="text-xs sm:text-sm font-semibold text-neutral-500">
          Hơn 25.000 đánh giá 5 sao từ cộng đồng sáng tạo nội dung, lập trình viên và game thủ chuyên nghiệp trên toàn quốc.
        </p>
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((review, idx) => (
          <div
            key={idx}
            className="p-6 bg-[#F7F7F8] border border-neutral-200 rounded flex flex-col justify-between space-y-4 shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FFDF00] text-[#FFDF00]" />
                ))}
              </div>
              <h3 className="text-sm font-black uppercase text-black">{review.title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                &ldquo;{review.quote}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-200/80 flex items-center justify-between">
              <span className="text-xs font-black text-black">{review.author}</span>
              <span className="text-[11px] font-bold text-green-700 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-600" /> {review.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
