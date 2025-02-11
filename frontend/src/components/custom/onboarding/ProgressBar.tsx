import type React from "react"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="w-full max-w-2xl mb-6">
      <div className="bg-[#f0f0f0] h-2 rounded-full">
        <div
          className="bg-[#96b23c] h-full rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-[#638d3e] text-sm mt-2 text-right">
        {currentStep + 1} / {totalSteps}
      </div>
    </div>
  )
}

export default ProgressBar

