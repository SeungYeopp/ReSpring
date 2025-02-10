import React from 'react'
import { Sprout } from 'lucide-react'

interface LogoProps {
  className?: string
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Sprout className="w-8 h-8 text-[#96b23c]" />
    </div>
  )
}

export default Logo

