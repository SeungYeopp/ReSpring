"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import WelcomeScreen from "./WelcomeScreen"
import StorytellingIntro from "./StorytellingIntro"
import TimelineCreation from "./TimelineCreation"
import SocialFeatureIntro from "./SocialFeatureIntro"
import GoalSetting from "./GoalSetting"
import FinalStep from "./FinalStep"
import { SignUpForm } from "@/components/SignUpForm"
import ProgressBar from "./ProgressBar"
import Logo from "./Logo"

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(0)
  const totalSteps = 7 // Increased by 1 to include SignUpForm

  const nextStep = () =>
    setStep((prevStep) => Math.min(prevStep + 1, totalSteps - 1))
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 0))
  const skipStep = () => setStep(totalSteps - 1)

  const components = [
    <WelcomeScreen key="welcome" onStart={nextStep} onSkip={skipStep}/>,
    <StorytellingIntro key="storytelling" onNext={nextStep} onPrevious={prevStep} />,
    <TimelineCreation key="timeline" onNext={nextStep} onPrevious={prevStep} />,
    <SocialFeatureIntro key="social" onNext={nextStep} onPrevious={prevStep} />,
    <GoalSetting key="goal" onNext={nextStep} onPrevious={prevStep} />,
    <FinalStep key="final" onGoBack={prevStep} onSignUp={nextStep} />,
    <SignUpForm key="signup" onPrevious={prevStep} />,
  ]

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {step > 0 && <Logo className="mb-6 md:mb-8" />}
      <ProgressBar currentStep={step} totalSteps={totalSteps} />
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {components[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Onboarding