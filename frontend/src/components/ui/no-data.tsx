import { cn } from "@/lib/utils"

interface NoDataProps {
  message?: string
  className?: string
}

export function NoData({ 
  message = "Aucune donnée disponible", 
  className 
}: NoDataProps) {
  return (
    <div className={cn(
      "flex items-center justify-center w-full h-full min-h-[200px]",
      "bg-black/40 rounded-lg backdrop-blur-sm",
      className
    )}>
      <p className="text-muted-foreground">
        {message}
      </p>
    </div>
  )
} 