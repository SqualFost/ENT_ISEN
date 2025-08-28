import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SousMatiere } from "../data"
import { calculerMoyenneSousMatiere, getCouleurNote } from "@/lib/utils"
import { NoteItem } from "./NoteItem"

interface SousMatiereCardProps {
  sousMatiere: SousMatiere
}

export function SousMatiereCard({ sousMatiere }: SousMatiereCardProps) {
  const moyenneSM = calculerMoyenneSousMatiere(sousMatiere.notes)

  return (
    <Card className="bg-muted/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{sousMatiere.nom}</CardTitle>
            {sousMatiere.coefficient && <Badge variant="secondary">Coeff. {sousMatiere.coefficient}</Badge>}
          </div>
          <Badge variant="outline" className={getCouleurNote(moyenneSM)}>
            Moyenne: {moyenneSM.toFixed(2)}/20
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {sousMatiere.notes.map((note, index) => (
            <NoteItem key={index} note={note} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
