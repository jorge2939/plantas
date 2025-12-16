import type { PlantInfo } from "@/types/plant"

export async function identifyPlant(imageData: string): Promise<PlantInfo> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error(
      "API key de Google Gemini no configurada. Agrega NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY en las variables de entorno.",
    )
  }

  // Remove data URL prefix
  const base64Image = imageData.split(",")[1]

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `Eres un experto botánico. Analiza esta imagen de una planta e identifícala. 
          
Responde SOLO con un objeto JSON válido (sin markdown, sin bloques de código) con esta estructura exacta:
{
  "name": "nombre común de la planta",
  "scientificName": "nombre científico en latín",
  "confidence": número del 0 al 100,
  "description": "descripción detallada de 2-3 oraciones",
  "care": {
    "water": "frecuencia y cantidad de riego",
    "light": "requisitos de luz solar",
    "temperature": "rango de temperatura ideal",
    "humidity": "nivel de humedad necesario"
  },
  "characteristics": ["característica1", "característica2", "característica3"],
  "tips": ["consejo1", "consejo2", "consejo3"]
}

Si no puedes identificar la planta con certeza, responde con confidence menor a 50 y explica por qué en la descripción.`,
          },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: base64Image,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 2048,
    },
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
  )

  if (!response.ok) {
    const error = await response.text()
    console.error("[v0] Gemini API error:", error)
    throw new Error(`Error de la API de Gemini: ${response.status}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error("No se recibió respuesta de la API")
  }

  // Clean up the response - remove markdown code blocks if present
  const cleanedText = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim()

  try {
    const plantInfo: PlantInfo = JSON.parse(cleanedText)
    return plantInfo
  } catch (error) {
    console.error("[v0] Error parsing JSON:", error, "Raw text:", cleanedText)
    throw new Error("Error al procesar la respuesta de la IA")
  }
}
