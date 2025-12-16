import PlantIdentifier from "@/components/plant-identifier"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <PlantIdentifier />
      </main>
      <Footer />
    </div>
  )
}
