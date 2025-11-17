"use client";

import { useState } from "react";
import IndividualCourses from "./IndividualCourses";
import MembershipPlans from "./MembershipPlans";
import PricingHeader from "./PricingHeader";

const PricingPlans = () => {
  const [activeTab, setActiveTab] = useState<"memberships" | "courses">(
    "memberships"
  );

  return (
    <div id="pricing" className="min-h-screen py-12 px-4 sm:px-8 lg:px-16 mb-12">
      <div className="max-w-7xl mx-auto">
        <PricingHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="relative min-h-[800px] sm:min-h-[900px] md:min-h-[600px]">
          <div
            className={`transition-all duration-500 ease-in-out ${
              activeTab === "memberships"
                ? "opacity-100 translate-x-0 relative"
                : "opacity-0 -translate-x-8 absolute inset-0 pointer-events-none"
            }`}
          >
            <MembershipPlans />
          </div>

          <div
            className={`transition-all duration-500 ease-in-out ${
              activeTab === "courses"
                ? "opacity-100 translate-x-0 relative"
                : "opacity-0 translate-x-8 absolute inset-0 pointer-events-none"
            }`}
          >
            <IndividualCourses />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
