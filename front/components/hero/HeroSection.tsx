"use client";

import CreativityBadge from "./CreativityBadge";
import EmailSubscription from "./EmailSubscription";
import HeroCards from "./HeroCards";

const HeroSection = () => {
  return (
    <div className="min-h-screen pt-10 pb-20 relative overflow-hidden">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
        <CreativityBadge />
        <HeroCards />
        <EmailSubscription />
      </div>
    </div>
  );
};

export default HeroSection;
