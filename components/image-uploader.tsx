"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Upload, ImageIcon, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface ImageUploaderProps {
  onImageUpload: (imageData: string) => void
  isLoading: boolean
  uploadedImage: string | null
  onReset: () => void
}

export default function ImageUploader({ onImageUpload, isLoading, uploadedImage, onReset }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const { toast } = useToast()

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Por favor, sube solo archivos de imagen",
        })
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Archivo muy grande",
          description: "La imagen debe ser menor a 10MB",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onImageUpload(result)
      }
      reader.readAsDataURL(file)
    },
    [onImageUpload, toast],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile],
  )

  return (
    <Card className="p-6 lg:p-8 h-fit lg:sticky lg:top-24">
      <h3 className="text-xl font-semibold mb-4 text-foreground">Sube tu imagen</h3>

      {uploadedImage ? (
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <img src={uploadedImage || "/placeholder.svg"} alt="Planta subida" className="w-full h-full object-cover" />
            {!isLoading && (
              <button
                onClick={onReset}
                className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Analizando planta...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-lg transition-all ${
            isDragging ? "border-primary bg-accent/20" : "border-border bg-muted/30 hover:bg-muted/50"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            disabled={isLoading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center py-12 px-4 cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              {isDragging ? (
                <ImageIcon className="w-8 h-8 text-primary" />
              ) : (
                <Upload className="w-8 h-8 text-primary" />
              )}
            </div>
            <p className="text-base font-medium text-foreground mb-2">
              {isDragging ? "Suelta la imagen aquí" : "Arrastra una imagen"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">o haz clic para seleccionar</p>
            <Button type="button" variant="outline" size="sm">
              Seleccionar archivo
            </Button>
          </label>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-4 text-center">Formatos: JPG, PNG, WEBP • Máx: 10MB</p>
    </Card>
  )
}
