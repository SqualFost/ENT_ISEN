"use client"

import { useEffect, useState } from "react"
import type { Module, Note, Note_temp } from "../../data"
import { modulesData, notesNonAssignees } from "../../data"
import { ModuleCard } from "@/components/ModuleCard"
import { UnassignedNotes } from "@/components/UnassignedNotes"
import { UserService } from "../supabase/user/user"
import { User } from "lucide-react"

export default function NotesPage() {

  const [modules, setModules] = useState<Module[]>(modulesData)
  const [notesEnAttente, setNotesEnAttente] = useState<Note_temp[]>(notesNonAssignees)

  const assignerNote = (noteIndex: number, moduleId: string, matiereId: string, sousMatiereId: string) => {
    console.log("[v0] assignerNote called with:", { noteIndex, moduleId, matiereId, sousMatiereId })

    const noteToAssign = notesEnAttente[noteIndex]
    if (!noteToAssign) {
      console.log("[v0] Note not found at index:", noteIndex)
      return
    }

    console.log("[v0] Note to assign:", noteToAssign)

    const updatedNote = { ...noteToAssign, sous_matiere_id: sousMatiereId }

    setModules((prevModules) => {
      const newModules = prevModules.map((module) => {
        if (module.id !== moduleId) return module

        return {
          ...module,
          matieres: module.matieres.map((matiere) => {
            if (matiere.id !== matiereId) return matiere

            return {
              ...matiere,
              sous_matieres: matiere.sous_matieres.map((sousMatiere) => {
                if (sousMatiere.id !== sousMatiereId) return sousMatiere

                return {
                  ...sousMatiere,
                  notes: [...sousMatiere.notes, updatedNote],
                }
              }),
            }
          }),
        }
      })

      console.log("[v0] Updated modules:", newModules)
      return newModules
    })

    setNotesEnAttente((prev) => {
      const newNotes = prev.filter((_, index) => index !== noteIndex)
      console.log("[v0] Remaining notes:", newNotes)
      return newNotes
    })
  }

  const creerModule = (nom: string) => {
    const newModule: Module = {
      id: `module_${Date.now()}`,
      nom,
      matieres: [],
    }
    setModules((prev) => [...prev, newModule])
  }

  const creerMatiere = (moduleId: string, nom: string, coeff: number) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.id !== moduleId) return module

        const newMatiere = {
          id: `matiere_${Date.now()}`,
          nom,
          coefficient: coeff,
          sous_matieres: [],
        }

        return {
          ...module,
          matieres: [...module.matieres, newMatiere],
        }
      }),
    )
  }

  const creerSousMatiere = (moduleId: string, matiereId: string, nom: string, coeff: number) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.id !== moduleId) return module

        return {
          ...module,
          matieres: module.matieres.map((matiere) => {
            if (matiere.id !== matiereId) return matiere

            const newSousMatiere = {
              id: `sous_matiere_${Date.now()}`,
              nom,
              coefficient: coeff,
              notes: [],
            }

            return {
              ...matiere,
              sous_matieres: [...matiere.sous_matieres, newSousMatiere],
            }
          }),
        }
      }),
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance mb-2">Mes Notes</h1>
        <p className="text-muted-foreground">
          Consultez toutes vos notes organisées par modules, matières et sous-matières
        </p>
      </div>

      <div className="space-y-6">
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>

      <div className="mt-8">
        <UnassignedNotes
          notesEnAttente={notesEnAttente}
          modules={modules}
          onAssignNote={assignerNote}
          onCreateModule={creerModule}
          onCreateMatiere={creerMatiere}
          onCreateSousMatiere={creerSousMatiere}
        />
      </div>
    </div>
  )
}
