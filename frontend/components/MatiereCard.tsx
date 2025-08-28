import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Matiere } from "../data"
import { calculerMoyenneMatiere, getCouleurNote } from "@/lib/utils"
import { SousMatiereCard } from "./SousMatiereCard"

interface MatiereCardProps {
  matiere: Matiere
}

export function MatiereCard({ matiere }: MatiereCardProps) {
  const moyenneMatiere = calculerMoyenneMatiere(matiere.sous_matieres)

  return (
    <AccordionItem value={matiere.id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center justify-between w-full mr-4">
          <div className="flex items-center gap-3">
            <span className="font-medium">{matiere.nom}</span>
            <Badge variant="secondary">Coeff. {matiere.coefficient}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${getCouleurNote(moyenneMatiere)}`}>{moyenneMatiere.toFixed(2)}/20</span>
            <Progress value={(moyenneMatiere / 20) * 100} className="w-20 h-2" />
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-4">
          {matiere.sous_matieres.map((sousMatiere) => (
            <SousMatiereCard key={sousMatiere.id} sousMatiere={sousMatiere} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
