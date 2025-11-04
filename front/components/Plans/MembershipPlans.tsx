"use client";

import { memberships } from "@/helpers/moks";
import { FaCheck, FaStar } from "react-icons/fa";

const MembershipPlans = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {memberships.map((plan, index) => (
        <div
          key={index}
          className={`relative bg-slate-800/40 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-[1.02] ${
            plan.popular
              ? "border-button/60 hover:border-button hover:shadow-2xl hover:shadow-button/20"
              : "border-border-light/50 hover:border-border-light/70 hover:shadow-xl"
          }`}
          style={{
            transitionDelay: `${index * 50}ms`,
          }}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-button text-font-light px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <FaStar className="text-xs" />
                Más Popular
              </div>
            </div>
          )}

          {plan.savings && (
            <div className="absolute -top-3 -right-3">
              <div className="bg-accent-medium text-font-dark px-3 py-1 rounded-full text-xs font-bold">
                {plan.savings}
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="text-font-light text-2xl font-bold mb-2">
              {plan.name}
            </h3>
            <div className="mb-2">
              <span className="text-font-light text-4xl font-bold">
                ${plan.price}
              </span>
              <span className="text-slate-300 text-base">{plan.period}</span>
            </div>
            <span className="text-slate-400 text-sm">{plan.duration}</span>
          </div>

          <div className="space-y-3 mb-8">
            {plan.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-1">
                  <FaCheck className="text-accent-medium text-sm" />
                </div>
                <span className="text-slate-200 text-sm leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <button
            className={`w-full font-semibold py-3 rounded-lg transition-all duration-300 ${
              plan.popular
                ? "bg-button/80 hover:bg-button text-font-light cursor-pointer hover:shadow-lg hover:shadow-button/30"
                : "bg-button/40 hover:bg-button/60 text-font-light cursor-pointer hover:shadow-lg hover:shadow-button/30"
            }`}
          >
            Comenzar ahora
          </button>
        </div>
      ))}
    </div>
  );
};

export default MembershipPlans;