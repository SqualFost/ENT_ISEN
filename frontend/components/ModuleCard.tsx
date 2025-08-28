import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import type { Module } from "../data"
import { calculerMoyenneModule } from "@/lib/utils"
import { MatiereCard } from "./MatiereCard"

interface ModuleCardProps {
  module: Module
}

export function ModuleCard({ module }: ModuleCardProps) {
  const moyenneModule = calculerMoyenneModule(module.matieres)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-primary">📚 {module.nom}</CardTitle>
          <div className="flex items-center gap-3">
            <Badge variant="default" className={`text-white ${moyenneModule >= 10 ? "bg-green-600" : "bg-red-600"}`}>
              Moyenne Module: {moyenneModule.toFixed(2)}/20
            </Badge>
            <Progress value={(moyenneModule / 20) * 100} className="w-24 h-3" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {module.matieres.map((matiere) => (
            <MatiereCard key={matiere.id} matiere={matiere} />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
