// src/app/onboarding/page.tsx
import React from "react";
import Onboarding from "@/components/custom/onboarding/Onboarding";

const OnboardingPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Onboarding />
    </div>
  );
};

export default OnboardingPage;
