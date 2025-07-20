import CardItem from "@/components/CardItem";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Calendar, AlertCircle, Clock } from "lucide-react";

const notes = [
  { sujet: "Mathématiques", score: "20/20" },
  { sujet: "Physique", score: "18/20" },
  { sujet: "Informatique", score: "16/20" },
];

export default function CardConteneur() {
  return (
    <>
      <CardItem className="col-span-1" title="Notes Récentes">
        {notes.map((note, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600">{note.sujet}</span>
              <Badge variant="secondary" className="bg-gray-100 text-black">
                {note.score}
              </Badge>
            </div>
            {/* Ajouter un Separator sauf après le dernier élément */}
            {index < notes.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
      </CardItem>

      {/* Card Moyenne */}
      <CardItem className="col-span-1" title="Moyenne Générale">
        <div className="text-center space-y-3">
          <div className="text-3xl font-bold text-black">14,05/20</div>
          <Progress value={70.25} className="w-full" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Objectif: 12/20</span>
            <span className="text-green-600">✓ Atteint</span>
          </div>
          <div className="text-xs text-gray-600">Classement: 15ème/60</div>
        </div>
      </CardItem>

      {/* Card Notifications */}
      <CardItem className="col-span-1 row-span-3" title="Notifications">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
            <AlertCircle size={16} className="text-red-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Urgent</p>
              <p className="text-xs text-red-600">
                Rendu de la CVEC avant le 15/09
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <Calendar size={16} className="text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Rappel</p>
              <p className="text-xs text-blue-600">
                Inscription en 3ème année jusqu'au 20/10
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
            <CheckCircle size={16} className="text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">Validé</p>
              <p className="text-xs text-green-600">Alternance acceptée</p>
            </div>
          </div>
        </div>
      </CardItem>

      {/* Card evenement */}
      <CardItem className="col-span-1" title="Événements">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <div>
              <p className="text-sm font-medium">
                Réunion semestre à l'étranger
              </p>
              <p className="text-xs text-gray-500">Aujourd'hui 14h30</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div>
              <p className="text-sm font-medium">Forum entreprises</p>
              <p className="text-xs text-gray-500">Demain 9h00</p>
            </div>
          </div>
        </div>
      </CardItem>

      {/* Card ER */}
      <CardItem className="col-span-1" title="Enseignement Responsable">
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium text-gray-600">Type ER:</span>
                <p className="text-gray-800">ER N1/N2</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Période:</span>
                <p className="text-gray-800">28/09/2023 - 05/07/2024</p>
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-600 text-xs">
                Intitulé:
              </span>
              <p className="text-gray-800 text-xs">Pôle Dev</p>
            </div>
            <div>
              <span className="font-medium text-gray-600 text-xs">
                ER Référent:
              </span>
              <p className="text-gray-800 text-xs">CRAPE Amaury</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">
                  Go/noGo:
                </span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 text-xs"
                >
                  Go
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                <span className="text-xs font-medium text-green-600">
                  Validé
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardItem>

      {/* Card EDT */}
      <CardItem
        className="col-span-1 md:col-span-2 row-span-3"
        title="Planning du jour"
        contenuEtendu={
          <div className="space-y-4">
            {/* Version complète - toute la semaine */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Semaine du DD - DD MOIS YYYY</strong> • Semestre N
              </p>
            </div>

            {/* En-têtes */}
            <div className="grid grid-cols-6 gap-3 text-sm font-semibold">
              <div className="text-zinc-600 text-center py-3 bg-zinc-300 rounded">
                Horaires
              </div>
              <div className="text-zinc-100 text-center py-3 bg-zinc-400 rounded">
                Lundi
              </div>
              <div className="text-zinc-600 text-center py-3 bg-zinc-300 rounded">
                Mardi
              </div>
              <div className="text-zinc-100 text-center py-3 bg-zinc-400 rounded">
                Mercredi
              </div>
              <div className="text-zinc-600 text-center py-3 bg-zinc-300 rounded">
                Jeudi
              </div>
              <div className="text-zinc-100 text-center py-3 bg-zinc-400 rounded">
                Vendredi
              </div>
            </div>

            {/* Contenu complet */}
            <div className="grid grid-cols-6 gap-3 text-sm">
              {/* Colonne Horaires */}
              <div className="bg-zinc-300 rounded p-3 space-y-4">
                <div className="font-medium text-zinc-700 py-2 text-center border-b border-zinc-400">
                  8h-10h
                </div>
                <div className="font-medium text-zinc-700 py-2 text-center border-b border-zinc-400">
                  10h-12h
                </div>
                <div className="font-medium text-zinc-700 py-2 text-center border-b border-zinc-400">
                  12h-13h
                </div>
                <div className="font-medium text-zinc-700 py-2 text-center border-b border-zinc-400">
                  13h-14h
                </div>
                <div className="font-medium text-zinc-700 py-2 text-center border-b border-zinc-400">
                  14h-16h
                </div>
                <div className="font-medium text-zinc-700 py-2 text-center">
                  16h-18h
                </div>
              </div>

              {/* Colonne Lundi */}
              <div className="bg-zinc-400 rounded p-3 space-y-4">
                <div className="bg-zinc-300 text-zinc-700 p-2 rounded text-center font-medium">
                  Algorithmie
                </div>
                <div className="bg-zinc-300 text-zinc-700 p-2 rounded text-center font-medium">
                  Sciences humaines
                </div>
                <div className="text-zinc-700 text-center py-2 italic">
                  Pause
                </div>
                <div className="text-zinc-700 text-center py-2">-</div>
                <div className="bg-zinc-300 text-zinc-700 p-2 rounded text-center font-medium">
                  Informatique
                </div>
                <div className="bg-zinc-300 text-zinc-700 p-2 rounded text-center font-medium">
                  Informatique
                </div>
              </div>

              {/* Colonne Mardi */}
              <div className="bg-zinc-300 rounded p-3 space-y-4">
                <div className="bg-zinc-400 text-zinc-100 p-2 rounded text-center font-medium">
                  Sécurité web
                </div>
                <div className="bg-zinc-400 text-zinc-100 p-2 rounded text-center font-medium">
                  Web dev
                </div>
                <div className="text-zinc-700 text-center py-2 italic">
                  Pause
                </div>
                <div className="bg-zinc-400 text-zinc-100 p-2 rounded text-center font-medium">
                  Espagnol
                </div>
                <div className="bg-zinc-400 text-zinc-100 p-2 rounded text-center font-medium">
                  Électronique
                </div>
                <div className="bg-zinc-400 text-zinc-100 p-2 rounded text-center font-medium">
                  Mathématiques
                </div>
              </div>

              {/* Colonne Mercredi */}
              <div className="bg-zinc-400 rounded p-3 space-y-4">
                <div className="bg-zinc-300 text-zinc-700 p-2 rounded text-center font-medium">
                  Physique
                </div>
                <div className="bg-zinc-300 text-zinc-700 p-2 rounded text-center font-medium">
                  Algorithmie
                </div>
                <div className="text-zinc-700 text-center py-2 italic">
                  Pause
                </div>
                <div className="text-zinc-700 text-center py-2">-</div>
                <div className="bg-zinc-300 text-zinc-700 p-2 rounded text-center font-medium">
                  TP Info
                </div>
                <div className="text-zinc-700 text-center py-2">-</div>
              </div>

              {/* Colonne Jeudi */}
              <div className="bg-zinc-300 rounded p-3 space-y-4">
                <div className="bg-zinc-400 text-zinc-100 p-2 rounded text-center font-medium">
                  Projet info
                </div>
                <div className="bg-zinc-400 text-zinc-100 p-2 rounded text-center font-medium">
                  Projet info
                </div>
                <div className="text-zinc-700 text-center py-2 italic">
                  Pause
                </div>
                <div className="text-zinc-700 text-center py-2">-</div>
                <div className="bg-zinc-400 text-zinc-100 p-2 rounded text-center font-medium">
                  Anglais
                </div>
                <div className="bg-zinc-400 text-zinc-100 p-2 rounded text-center font-medium">
                  Sciences humaines
                </div>
              </div>

              {/* Colonne Vendredi */}
              <div className="bg-zinc-400 rounded p-3 space-y-4">
                <div className="bg-zinc-300 text-zinc-700 p-2 rounded text-center font-medium">
                  Mathématiques
                </div>
                <div className="bg-zinc-300 text-zinc-700 p-2 rounded text-center font-medium">
                  TP Électronique
                </div>
                <div className="text-zinc-700 text-center py-2 italic">
                  Pause
                </div>
                <div className="text-zinc-700 text-center py-2">-</div>
                <div className="text-zinc-700 text-center py-2">-</div>
                <div className="text-zinc-700 text-center py-2">-</div>
              </div>
            </div>
          </div>
        }
      >
        {/* Version condensée - jour actuel seulement */}
        <div>
          {/* Planning du jour */}
          <div className="space-y-1">
            <div className="flex items-center gap-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
              <div className="text-xs font-medium text-blue-600 w-16">
                8h-10h
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">
                  Sécurité web
                </p>
                <p className="text-xs text-blue-600">Salle 321</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
              <div className="text-xs font-medium text-blue-600 w-16">
                10h-12h
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Web dev</p>
                <p className="text-xs text-blue-600">Salle 320</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded border-l-4 border-gray-300">
              <div className="text-xs font-medium text-gray-500 w-16">
                12h-13h
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 italic">Pause déjeuner</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
              <div className="text-xs font-medium text-blue-600 w-16">
                13h-14h
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Espagnol</p>
                <p className="text-xs text-blue-600">Salle 110</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
              <div className="text-xs font-medium text-blue-600 w-16">
                14h-16h
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">
                  Électronique
                </p>
                <p className="text-xs text-blue-600">Salle 520</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
              <div className="text-xs font-medium text-blue-600 w-16">
                16h-18h
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">
                  Mathématiques
                </p>
                <p className="text-xs text-blue-600">Salle 521</p>
              </div>
            </div>
          </div>
        </div>
      </CardItem>

      {/* Card Absences/Retards */}
      <CardItem
        className="lg:col-span-1 md:col-span-2 col-span-1 row-span-2"
        title="Présence"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">94%</div>
            <p className="text-xs text-gray-500">Taux de présence</p>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Absences justifiées</span>
              <span className="font-medium">2</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Absences non justifiées</span>
              <span className="font-medium text-red-600">1</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Retards</span>
              <span className="font-medium">3</span>
            </div>
          </div>
          <div className="bg-red-50 p-2 rounded border-l-4 border-red-400">
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-red-500" />
              <span className="text-xs text-red-700">
                Dernière absence: 07/01
              </span>
            </div>
            <p className="text-xs text-red-600 mt-1">
              Mathématiques - Non justifiée
            </p>
          </div>
        </div>
      </CardItem>
    </>
  );
}
