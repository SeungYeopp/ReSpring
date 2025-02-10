import React from "react";
import Onboarding from "@/components/custom/onboarding/Onboarding";

const OnboardingPage: React.FC = () => {
  return (
    <div
      className="
        flex items-center justify-center min-h-screen bg-gray-50
        -mt-14 -mb-16 md:-my-4
      "
    >
      <Onboarding />
    </div>
  );
};

export default OnboardingPage;
