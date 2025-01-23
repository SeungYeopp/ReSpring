import { useState, useCallback } from "react"
import { saveOnboardingStep, getOnboardingStatus } from "@/lib/api"

export function useOnboarding() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const saveStep = useCallback(async (step: number, data: any) => {
    setIsLoading(true)
    try {
      const result = await saveOnboardingStep(step, data)
      if (result.success) {
        setCurrentStep(step + 1)
      }
      return result
    } finally {
      setIsLoading(false)
    }
  }, [])

  const checkStatus = useCallback(async () => {
    const status = await getOnboardingStatus()
    setCurrentStep(status.currentStep)
    return status
  }, [])

  return {
    isLoading,
    currentStep,
    saveStep,
    checkStatus,
  }
}

