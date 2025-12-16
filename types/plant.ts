export interface PlantInfo {
  name: string
  scientificName: string
  confidence: number
  description: string
  care: {
    water: string
    light: string
    temperature: string
    humidity: string
  }
  characteristics: string[]
  tips: string[]
}
