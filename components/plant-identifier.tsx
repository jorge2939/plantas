"use client"

import { useState } from "react"
import ImageUploader from "./image-uploader"
import PlantResults from "./plant-results"
import { identifyPlant } from "@/lib/gemini-ai"
import type { PlantInfo } from "@/types/plant"

export default function PlantIdentifier() {
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleImageUpload = async (imageData: string) => {
    setIsLoading(true)
    setUploadedImage(imageData)
    setPlantInfo(null)

    try {
      const result = await identifyPlant(imageData)
      setPlantInfo(result)
    } catch (error) {
      console.error("[v0] Error identifying plant:", error)
      setPlantInfo({
        name: "Error",
        scientificName: "",
        confidence: 0,
        description:
          "No se pudo identificar la planta. Por favor, intenta con otra imagen o verifica tu API key de Google Gemini.",
        care: {
          water: "",
          light: "",
          temperature: "",
          humidity: "",
        },
        characteristics: [],
        tips: [],
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setPlantInfo(null)
    setUploadedImage(null)
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Identifica cualquier planta al instante
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Sube una foto y descubre el nombre, características y cuidados de tu planta usando inteligencia artificial
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <ImageUploader
            onImageUpload={handleImageUpload}
            isLoading={isLoading}
            uploadedImage={uploadedImage}
            onReset={handleReset}
          />

          <PlantResults plantInfo={plantInfo} isLoading={isLoading} uploadedImage={uploadedImage} />
        </div>
      </div>
    </div>
  )
}
