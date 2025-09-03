import { Badge } from "@/components/ui/badge"
import type { Note_temp } from "../data"
import { getCouleurNote } from "@/lib/utils"

interface NoteItemProps {
  note: Note_temp
}

export function NoteItem({ note }: NoteItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="font-medium">{note.nom}</span>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="secondary">Coeff. {note.coeff}</Badge>
        <span className={`font-bold text-lg ${getCouleurNote(Number.parseFloat(note.score))}`}>{note.score}/20</span>
      </div>
    </div>
  )
}
