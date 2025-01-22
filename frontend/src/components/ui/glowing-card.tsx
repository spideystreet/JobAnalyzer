"use client" 

import * as React from "react"
import { cn } from "@/lib/utils"

interface GridBackgroundProps {
  title: string
  description: string
  showAvailability?: boolean
  className?: string
}

export function GridBackground({
  title,
  description,
  showAvailability = true,
  className,
}: GridBackgroundProps) {
  return (
    <div 
      className={cn(
        'px-2 py-5 rounded-md relative mx-10 flex items-center justify-center',
        className
      )}
      style={{
        backgroundColor: 'rgba(15, 15, 15, 1)',
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}
    >
      <div 
        className="w-3 h-3 rounded-full absolute shadow-[0_0_15px] shadow-current z-10 bg-current"
        style={{
          animation: `
            border-follow 6s linear infinite,
            color-change 6s linear infinite
          `
        }}
      />
      <div 
        className="absolute inset-0 border-2 rounded-md"
        style={{
          animation: 'border-color-change 6s linear infinite'
        }}
      />

      <div className="relative z-20 text-center max-w-7xl">
        <h1 className='text-4xl font-bold'>{title}</h1>
        {description && (
          <p className='text-md mt-5 text-gray-300'>{description}</p>
        )}

        {showAvailability && (
          <div className="available-now text-[#20bb5a] text-sm flex items-center justify-center mt-5">
            <div className="w-2 h-2 bg-[#20bb5a] rounded-full inline-block mr-2 animate-pulse shadow-[0_0_8px_#20bb5a]" />
            Call Now
          </div>
        )}
      </div>
    </div>
  )
} 