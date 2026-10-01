import React from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import ValuePropsBar from '@/components/home/ValuePropsBar';
import CategoryBlock from '@/components/home/CategoryBlock';
import CrowdFavorites from '@/components/home/CrowdFavorites';
import EditorialBook from '@/components/home/EditorialBook';
import BringOnTheChill from '@/components/home/BringOnTheChill';
import EditorialFootball from '@/components/home/EditorialFootball';
import HalloweenSection from '@/components/home/HalloweenSection';
import PhilanthropySection from '@/components/home/PhilanthropySection';
import ParentReviews from '@/components/home/ParentReviews';
import BeastInTheWild from '@/components/home/BeastInTheWild';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. XL Hero Banner: MrBeast Football Drop */}
      <HeroBanner />

      {/* 2. Value Props Bar: Free Ship $75+ | 30-Day Returns | 1% Donated */}
      <ValuePropsBar />

      {/* 3. Category Block (4 Grid Cards: TOYS, APPAREL, ATHLETICS, FEASTABLES) */}
      <CategoryBlock />

      {/* 4. The Crowd Favorites (Featured Collection Grid) */}
      <CrowdFavorites />

      {/* 5. Editorial: The Book Event Of The Year */}
      <EditorialBook />

      {/* 6. Bring On The Chill (Tabs: Halloween, Glow, Feastables, Football, Athletics) */}
      <BringOnTheChill />

      {/* 7. Editorial: Football Season Is Here */}
      <EditorialFootball />

      {/* 8. Halloween 2026 Collection */}
      <HalloweenSection />

      {/* 9. Philanthropy: We Give Back, In a Big Way */}
      <PhilanthropySection />

      {/* 10. Parent Reviews: 4.9 Average Star Rating */}
      <ParentReviews />

      {/* 11. Beast in the Wild: Fan Community Gallery */}
      <BeastInTheWild />
    </div>
  );
}
