import { Github, Sparkles } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Creado con Next.js & Google Gemini AI</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
