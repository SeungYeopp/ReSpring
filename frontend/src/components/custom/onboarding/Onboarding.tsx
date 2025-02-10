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
import ProgressBar from "./ProgressBar"
import Logo from "./Logo"

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(0)
  const totalSteps = 6

  const nextStep = () =>
    setStep((prevStep) => {
      if (prevStep === 3) {
        return 4
      }
      return Math.min(prevStep + 1, totalSteps - 1)
    })
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 0))
  const skipToHome = () => {
    console.log("Skipping to home")
  }

  const handleWriteRecord = () => {
    console.log("Navigating to write spring record")
  }

  const handleGoToMainPage = () => {
    console.log("Navigating to main page")
  }

  const components = [
    <WelcomeScreen key="welcome" onStart={nextStep} onSkip={skipToHome} />,
    <StorytellingIntro key="storytelling" onNext={nextStep} onPrevious={prevStep} />,
    <TimelineCreation key="timeline" onNext={nextStep} onPrevious={prevStep} />,
    <SocialFeatureIntro key="social" onNext={nextStep} onPrevious={prevStep} />,
    <GoalSetting key="goal" onNext={nextStep} onPrevious={prevStep} />,
    <FinalStep key="final" onWriteRecord={handleWriteRecord} onGoToMainPage={handleGoToMainPage} onGoBack={prevStep} />,
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

