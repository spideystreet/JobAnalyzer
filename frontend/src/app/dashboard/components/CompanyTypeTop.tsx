import React from 'react';
import { GlowEffect } from '@/components/ui/glow-effect';
import { CardTitle } from '@/components/ui/card';

interface CompanyTypeTopProps {
  data: Array<{
    company_type: string;
    count: number;
  }>;
}

export function CompanyTypeTop({ data }: CompanyTypeTopProps) {
  return (
    <div className="relative w-full aspect-[1.5/1]">
      <GlowEffect
        colors={['#FFD700', '#C0C0C0', '#CD7F32']}
        mode="static"
        blur="medium"
      />
      <div className="relative w-full h-full rounded-lg bg-black/90 p-6">
        <CardTitle className="text-white">Top 3 Types d&apos;Entreprises</CardTitle>
        <div className="space-y-4">
          {data.slice(0, 3).map((item, index) => (
            <div 
              key={item.company_type} 
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`
                  size-8 rounded-full flex items-center justify-center font-semibold text-black
                  ${index === 0 ? 'bg-[#FFD700]' : ''}
                  ${index === 1 ? 'bg-[#C0C0C0]' : ''}
                  ${index === 2 ? 'bg-[#CD7F32]' : ''}
                `}>
                  #{index + 1}
                </div>
                <span className="font-medium text-white">{item.company_type}</span>
              </div>
              <span className="text-sm text-white/70 font-medium">{item.count} offres</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 