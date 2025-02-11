import type React from "react"
import Onboarding from "@/components/custom/onboarding/Onboarding"

const OnboardingPage: React.FC = () => {
  return (
    <div
      className="
        flex items-center justify-center min-h-screen bg-gray-50
        -mt-14 -mb-16 md:-my-4
        px-4 py-6 md:px-8 md:py-12 // 추가된 패딩
      "
    >
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
        {" "}
        <Onboarding />
      </div>
    </div>
  )
}

export default OnboardingPage

