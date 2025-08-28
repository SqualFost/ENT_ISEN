"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import type { Note_temp, Module } from "../data"
import { getCouleurNote } from "@/lib/utils"

interface UnassignedNotesProps {
  notesEnAttente: Note_temp[]
  modules: Module[]
  onAssignNote: (noteIndex: number, moduleId: string, matiereId: string, sousMatiereId: string) => void
  onCreateModule: (nom: string) => void
  onCreateMatiere: (moduleId: string, nom: string, coeff: number) => void
  onCreateSousMatiere: (moduleId: string, matiereId: string, nom: string, coeff: number) => void
}

export function UnassignedNotes({
  notesEnAttente,
  modules,
  onAssignNote,
  onCreateModule,
  onCreateMatiere,
  onCreateSousMatiere,
}: UnassignedNotesProps) {
  const [showCreateModule, setShowCreateModule] = useState(false)
  const [showCreateMatiere, setShowCreateMatiere] = useState(false)
  const [showCreateSousMatiere, setShowCreateSousMatiere] = useState(false)
  const [newModuleName, setNewModuleName] = useState("")
  const [newMatiereName, setNewMatiereName] = useState("")
  const [newMatiereCoeff, setNewMatiereCoeff] = useState("")
  const [newSousMatiereName, setNewSousMatiereName] = useState("")
  const [newSousMatiereCoeff, setNewSousMatiereCoeff] = useState("")
  const [selectedModuleForMatiere, setSelectedModuleForMatiere] = useState("")
  const [selectedModuleForSousMatiere, setSelectedModuleForSousMatiere] = useState("")
  const [selectedMatiereForSousMatiere, setSelectedMatiereForSousMatiere] = useState("")

  if (notesEnAttente.length === 0) return null

  const handleCreateModule = () => {
    if (newModuleName.trim()) {
      onCreateModule(newModuleName.trim())
      setNewModuleName("")
      setShowCreateModule(false)
    }
  }

  const handleCreateMatiere = () => {
    if (newMatiereName.trim() && selectedModuleForMatiere && newMatiereCoeff) {
      onCreateMatiere(selectedModuleForMatiere, newMatiereName.trim(), Number.parseFloat(newMatiereCoeff))
      setNewMatiereName("")
      setNewMatiereCoeff("")
      setSelectedModuleForMatiere("")
      setShowCreateMatiere(false)
    }
  }

  const handleCreateSousMatiere = () => {
    if (
      newSousMatiereName.trim() &&
      selectedModuleForSousMatiere &&
      selectedMatiereForSousMatiere &&
      newSousMatiereCoeff
    ) {
      onCreateSousMatiere(
        selectedModuleForSousMatiere,
        selectedMatiereForSousMatiere,
        newSousMatiereName.trim(),
        Number.parseFloat(newSousMatiereCoeff),
      )
      setNewSousMatiereName("")
      setNewSousMatiereCoeff("")
      setSelectedModuleForSousMatiere("")
      setSelectedMatiereForSousMatiere("")
      setShowCreateSousMatiere(false)
    }
  }

  return (
    <Card className="border-dashed border-2 border-orange-300 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="text-xl text-orange-700 flex items-center gap-2">
          📋 Notes en attente d'assignation
          <Badge variant="outline" className="text-orange-700 border-orange-300">
            {notesEnAttente.length} note{notesEnAttente.length > 1 ? "s" : ""}
          </Badge>
        </CardTitle>
        <p className="text-sm text-orange-600">
          Ces notes n'ont pas encore été assignées à un module. Assignez-les directement ci-dessous.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {notesEnAttente.map((note, noteIndex) => (
            <div key={noteIndex} className="p-4 bg-white rounded-lg border border-orange-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-400" />
                  <div>
                    <span className="font-medium text-gray-900">{note.nom}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">Coeff. {note.coeff}</Badge>
                      <span className={`font-bold ${getCouleurNote(Number.parseFloat(note.score))}`}>
                        {note.score}/20
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {modules.map((module) =>
                  module.matieres.map((matiere) =>
                    matiere.sous_matieres.map((sousMatiere) => (
                      <div
                        key={`${module.id}-${matiere.id}-${sousMatiere.id}`}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                      >
                        <div className="text-sm">
                          <span className="font-medium text-blue-600">{module.nom}</span>
                          <span className="mx-2 text-gray-400">→</span>
                          <span className="font-medium text-green-600">{matiere.nom}</span>
                          <span className="mx-2 text-gray-400">→</span>
                          <span className="text-gray-700">{sousMatiere.nom}</span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700"
                          onClick={() => {
                            console.log("[v0] Assigning note:", {
                              noteIndex,
                              module: module.id,
                              matiere: matiere.id,
                              sousMatiere: sousMatiere.id,
                            })
                            onAssignNote(noteIndex, module.id, matiere.id, sousMatiere.id)
                          }}
                        >
                          Assigner
                        </Button>
                      </div>
                    )),
                  ),
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-orange-200">
          <h3 className="text-lg font-semibold text-orange-700 mb-4">Outils de création</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
              onClick={() => setShowCreateModule(!showCreateModule)}
            >
              + Nouveau Module
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
              onClick={() => setShowCreateMatiere(!showCreateMatiere)}
            >
              + Nouvelle Matière
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-300 text-purple-700 hover:bg-purple-50 bg-transparent"
              onClick={() => setShowCreateSousMatiere(!showCreateSousMatiere)}
            >
              + Nouvelle Sous-matière
            </Button>
          </div>

          {showCreateModule && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Créer un nouveau module</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Nom du module"
                  value={newModuleName}
                  onChange={(e) => setNewModuleName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleCreateModule} disabled={!newModuleName.trim()}>
                  Créer
                </Button>
                <Button variant="outline" onClick={() => setShowCreateModule(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          )}

          {showCreateMatiere && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">Créer une nouvelle matière</h4>
              <div className="grid gap-2">
                <Select value={selectedModuleForMatiere} onValueChange={setSelectedModuleForMatiere}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nom de la matière"
                    value={newMatiereName}
                    onChange={(e) => setNewMatiereName(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Coefficient"
                    type="number"
                    step="0.1"
                    value={newMatiereCoeff}
                    onChange={(e) => setNewMatiereCoeff(e.target.value)}
                    className="w-24"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateMatiere}
                    disabled={!newMatiereName.trim() || !selectedModuleForMatiere || !newMatiereCoeff}
                  >
                    Créer
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateMatiere(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          )}

          {showCreateSousMatiere && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">Créer une nouvelle sous-matière</h4>
              <div className="grid gap-2">
                <Select value={selectedModuleForSousMatiere} onValueChange={setSelectedModuleForSousMatiere}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedMatiereForSousMatiere}
                  onValueChange={setSelectedMatiereForSousMatiere}
                  disabled={!selectedModuleForSousMatiere}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une matière" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedModuleForSousMatiere &&
                      modules
                        .find((m) => m.id === selectedModuleForSousMatiere)
                        ?.matieres.map((matiere) => (
                          <SelectItem key={matiere.id} value={matiere.id}>
                            {matiere.nom}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nom de la sous-matière"
                    value={newSousMatiereName}
                    onChange={(e) => setNewSousMatiereName(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Coefficient"
                    type="number"
                    step="0.1"
                    value={newSousMatiereCoeff}
                    onChange={(e) => setNewSousMatiereCoeff(e.target.value)}
                    className="w-24"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateSousMatiere}
                    disabled={
                      !newSousMatiereName.trim() ||
                      !selectedModuleForSousMatiere ||
                      !selectedMatiereForSousMatiere ||
                      !newSousMatiereCoeff
                    }
                  >
                    Créer
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateSousMatiere(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
