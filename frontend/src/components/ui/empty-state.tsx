import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface EmptyStateProps {
  title: string
  description: string
  message?: string
}

export function EmptyState({ 
  title, 
  description, 
  message = "Aucune donnée disponible" 
}: EmptyStateProps) {
  return (
    <Card className="bg-black/80 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        <CardDescription className="text-white/60">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center min-h-[300px]">
        <div className="text-white/60">
          {message}
        </div>
      </CardContent>
    </Card>
  )
} 