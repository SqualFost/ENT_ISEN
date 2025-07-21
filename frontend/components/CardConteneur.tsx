"use client";

import CardItem from "@/components/CardItem";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  CircleCheckBig,
  Ban,
  Calendar,
  AlertCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  notes,
  evenements,
  ERDetails,
  planning,
  PresenceDetails,
  classes,
  notifColors,
} from "@/data";
import ISEN_Api from "@/app/api/api";
import { use, useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
type Note = {
  sujet: string;
  score: number;
};
const api = new ISEN_Api();

const notifications = [
  {
    icon: <AlertCircle size={16} className="text-red-500 mt-0.5" />,
    title: "Urgent",
    message: "Rendu de la CVEC avant le 15/09",
    color: "red",
  },
  {
    icon: <Calendar size={16} className="text-blue-500 mt-0.5" />,
    title: "Rappel",
    message: "Inscription en 3ème année jusqu'au 20/10",
    color: "blue",
  },
  {
    icon: <CircleCheckBig size={16} className="text-green-500 mt-0.5" />,
    title: "Validé",
    message: "Alternance acceptée",
    color: "green",
  },
];
async function loadNotation() {
  try {
    const response = await api.getNotations();
    let notes = []
    let i = 0
    for (const note of response) {
      notes.push(note)
      i++;
      if (i >= 3) break; // Limiter à 3 notes
    }
    console.log("Notes fetched:", notes);
    notes = notes.map(note => ({
      sujet: note.name.split(" - ")[1],
      score: note.note,
    }));
    return notes;
  } catch (error) {
    console.error("Failed to load notation data:", error);
    return [];
  }

}
export default function CardConteneur() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchNotes = async () => {
      const result = await loadNotation();
      setNotes(result);
      setLoading(false);
    };
    fetchNotes();
  }, []);
  return (
    <>
      <CardItem className="col-span-1" title="Notes Récentes">
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-12 rounded-md" />
              </div>
            ))}
          </div>
        ) : (
          notes.map((note, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-800">{note.sujet}</span>
                <Badge variant="secondary" className="bg-gray-100 text-black">
                  {note.score}
                </Badge>
              </div>
              {index < notes.length - 1 && <Separator className="my-2" />}
            </div>
          ))
        )}
      </CardItem>

      {/* Card Moyenne */}
      <CardItem className="col-span-1" title="Moyenne Générale">
        <div className="text-center space-y-3">
          <div className="text-3xl font-bold text-black">14,05/20</div>
          <Progress value={70.25} className="w-full" />
          <br />
          <div className="text-xs text-gray-500">Classement: 15ème/60</div>
        </div>
      </CardItem>

      {/* Card Notifications */}
      <CardItem className="col-span-1 row-span-3" title="Notifications">
        <div className="space-y-4">
          {notifications.map((notif, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 bg-${notif.color}-50 rounded-lg border-l-4 border-${notif.color}-400`}
            >
              {notif.icon}
              <div>
                <p className={`text-sm font-medium text-${notif.color}-800`}>
                  {notif.title}
                </p>
                <p className={`text-xs text-${notif.color}-600`}>
                  {notif.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardItem>

      {/* Card evenement */}
      <CardItem className="col-span-1" title="Événements">
        <div className="space-y-3">
          {evenements.map((event, index) => (
            <div className="flex items-center gap-3" key={index}>
              <div
                className={cn("w-2 h-2 rounded-full", `bg-${event.color}-400`)}
              />
              <div>
                <p className="text-sm text-gray-800 font-medium">
                  {event.titre}
                </p>
                <p className="text-xs text-gray-500">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardItem>

      {/* Card ER */}
      <CardItem className="col-span-1" title="Enseignement Responsable">
        <div className="space-y-3">
          <div className="bg-background rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium text-gray-500">Type ER:</span>
                <p className="text-gray-800">{ERDetails.type}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Période:</span>
                <p className="text-gray-800">{ERDetails.periode}</p>
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-500 text-xs">
                Intitulé:
              </span>
              <p className="text-gray-800 text-xs">{ERDetails.intitule}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500 text-xs">
                ER Référent:
              </span>
              <p className="text-gray-800 text-xs">{ERDetails.referent}</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              {ERDetails.goNoGo ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">
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
                    <CircleCheckBig size={14} className="text-green-500" />
                    <span className="text-xs font-medium text-green-600">
                      Validé
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">
                      Go/noGo:
                    </span>

                    <Badge
                      variant="destructive"
                      className="bg-red-100 text-red-800 text-xs"
                    >
                      noGo
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ban size={14} className="text-red-500" />
                    <span className="text-xs font-medium text-red-600">
                      Non validé
                    </span>
                  </div>
                </>
              )}
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
        <div className="space-y-1">
          {planning.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-2 rounded border-l-4 ${item.isPause
                ? "bg-gray-50 border-gray-300"
                : "bg-blue-50 border-blue-400"
                }`}
            >
              <div
                className={`text-xs font-medium w-16 ${item.isPause ? "text-gray-500" : "text-blue-600"
                  }`}
              >
                {item.heure}
              </div>

              <div className="flex-1">
                {item.isPause ? (
                  <p className="text-sm text-gray-600 italic">{item.cours}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-blue-800">
                      {item.cours}
                    </p>
                    <p className="text-xs text-blue-600">{item.salle}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardItem>

      {/* Card Absences/Retards */}
      <CardItem
        className="lg:col-span-1 md:col-span-2 col-span-1 row-span-2"
        title="Présence"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-800">Absences justifiées</span>
              <span className="font-medium text-gray-800">
                {PresenceDetails.absencesJustifiees}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-800">Absences non justifiées</span>
              <span className="font-medium text-destructive">
                {PresenceDetails.absencesNonJustifiees}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-800">Retards</span>
              <span className="font-medium text-gray-800">
                {PresenceDetails.retards}
              </span>
            </div>
          </div>
          <Separator />
          <div
            className={`${classes.bg} p-2 rounded border-l-4 ${classes.border}`}
          >
            <div className="flex items-center gap-2">
              <Clock size={12} className={classes.icon} />
              <span className={`text-xs ${classes.textMain}`}>
                Dernière absence: {PresenceDetails.derniereAbsence[0].date}
              </span>
            </div>
            <p className={`text-xs mt-1 ${classes.textSub}`}>
              {PresenceDetails.derniereAbsence[0].cours} –{" "}
              {PresenceDetails.derniereAbsence[0].justifiee
                ? "Justifiée"
                : "Non justifiée"}
            </p>
          </div>
        </div>
      </CardItem>
    </>
  );
}