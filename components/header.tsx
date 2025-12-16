import { Leaf } from "lucide-react"

export default function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">PlantID</h1>
            <p className="text-xs text-muted-foreground">Powered by Google Gemini AI</p>
          </div>
        </div>
      </div>
    </header>
  )
}
