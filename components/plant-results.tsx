import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, Sun, Thermometer, Wind, Leaf, Sparkles } from "lucide-react"
import type { PlantInfo } from "@/types/plant"

interface PlantResultsProps {
  plantInfo: PlantInfo | null
  isLoading: boolean
  uploadedImage: string | null
}

export default function PlantResults({ plantInfo, isLoading, uploadedImage }: PlantResultsProps) {
  if (!uploadedImage && !isLoading) {
    return (
      <Card className="p-8 lg:p-12 flex items-center justify-center bg-muted/30">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Leaf className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Esperando imagen</h3>
          <p className="text-sm text-muted-foreground">
            Sube una foto de una planta para comenzar la identificación con IA
          </p>
        </div>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="p-8 lg:p-12">
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-muted rounded" />
            <div className="h-24 bg-muted rounded" />
          </div>
        </div>
      </Card>
    )
  }

  if (!plantInfo) {
    return null
  }

  const careIcons = {
    water: Droplets,
    light: Sun,
    temperature: Thermometer,
    humidity: Wind,
  }

  return (
    <Card className="p-6 lg:p-8 space-y-6">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">{plantInfo.name}</h3>
            {plantInfo.scientificName && (
              <p className="text-sm italic text-muted-foreground">{plantInfo.scientificName}</p>
            )}
          </div>
          {plantInfo.confidence > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              {plantInfo.confidence}% confianza
            </Badge>
          )}
        </div>

        {plantInfo.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{plantInfo.description}</p>
        )}
      </div>

      {plantInfo.care && (
        <div>
          <h4 className="text-base font-semibold text-foreground mb-3">Cuidados necesarios</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(plantInfo.care).map(([key, value]) => {
              if (!value) return null
              const Icon = careIcons[key as keyof typeof careIcons]
              const labels = {
                water: "Riego",
                light: "Luz",
                temperature: "Temperatura",
                humidity: "Humedad",
              }

              return (
                <div key={key} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground mb-0.5">{labels[key as keyof typeof labels]}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {plantInfo.characteristics && plantInfo.characteristics.length > 0 && (
        <div>
          <h4 className="text-base font-semibold text-foreground mb-3">Características</h4>
          <div className="flex flex-wrap gap-2">
            {plantInfo.characteristics.map((char, index) => (
              <Badge key={index} variant="outline">
                {char}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {plantInfo.tips && plantInfo.tips.length > 0 && (
        <div>
          <h4 className="text-base font-semibold text-foreground mb-3">Consejos útiles</h4>
          <ul className="space-y-2">
            {plantInfo.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-0.5">•</span>
                <span className="flex-1">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
