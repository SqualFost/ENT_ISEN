"use client";

import CardItem from "@/components/CardItem";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatDate, DateStrToTimeStamp } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";
import {
  CircleCheckBig,
  Ban,
  Calendar,
  AlertCircle,
  Clock,
} from "lucide-react";

import { Cours, Note, Presence, ERDetails, classes } from "@/data";
import {
  loadAbscences,
  fetchEDTApi,
  loadNotation,
  setEvent,
  loadEDTDay,
} from "./DataFetch";

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

export default function CardConteneur() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  useEffect(() => {
    const fetchNotes = async () => {
      const result = await loadNotation();
      setNotes(result || []);
      setLoadingNotes(false);
    };
    fetchNotes();
  }, []);

  const [loadingAbcences, setLoadingAbcences] = useState(true);
  const [PresenceDetails, setAbsences] = useState<Presence | null>(null);
  useEffect(() => {
    const fetchAbsences = async () => {
      const result = await loadAbscences();
      setAbsences(result || null);
      setLoadingAbcences(false);
    };
    fetchAbsences();
  }, []);

  const [loadingEDT, setLoadingEDT] = useState(true);
  const [planning, setPlanning] = useState<Cours[]>([]);

  useEffect(() => {
    const fetchEDT = async () => {
      const result = await loadEDTDay();
      setPlanning(result || []);
      setLoadingEDT(false);
    };
    fetchEDT();
  }, []);

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [Events, setEventList] = useState<Cours[] | null>(null);
  useEffect(() => {
    const setEvents = async () => {
      const result = await setEvent();
      setEventList(result);
      setLoadingEvents(false);
    };
    setEvents();
  }, []);
  return (
    <>
      {/* Card Notes Récentes */}
      <CardItem className="col-span-1" title="Notes Récentes">
        {loadingNotes ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-12 rounded-md" />
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              Pas de notes récentes
            </div>
          </div>
        ) : notes[0].isError ? (
          <div className="space-y-2">
            <div
              className="flex justify-between items-center"
              style={{ color: "red" }}
            >
              Erreur API
            </div>
          </div>
        ) : (
          notes.map((note, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-800">
                  {note.sujet} {note.nom}{" "}
                </span>
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
        {loadingEvents ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div className="flex items-center gap-3" key={index}>
                <Skeleton className="w-2 h-2 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : !Events || Events.length === 0 ? (
          <div className="flex items-center justify-center text-sm text-gray-500 py-4">
            Aucun événement à venir
          </div>
        ) : Events[0].isError ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle size={16} />
              <span className="text-sm">
                Erreur lors du chargement des événements
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {Events.filter((event) => event.isEvent).map((event, index) => (
              <div className="flex items-center gap-3" key={index}>
                <div className="w-2 h-2 rounded-full bg-blue-400" />{" "}
                {/* Couleur par défaut */}
                <div>
                  <p className="text-sm text-gray-800 font-medium">
                    {event.matiere}{" "}
                    {/* Utilisation de cours si titre n'existe pas */}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(DateStrToTimeStamp(event.date))}{" "}
                    {event.heure && `à ${event.heure}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
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
        title={`Planning du ${formatDate(Date.now())}`}
      >
        {/* Version condensée - jour actuel seulement */}
        {loadingEDT ? (
          <div className="space-y-1">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-2 pt-2 rounded border-l-4 bg-blue-50 border-blue-400"
              >
                <Skeleton className="h-4 w-16 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : planning.length === 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center text-sm text-gray-500 py-4">
              Aucun cours prévu aujourd&apos;hui
            </div>
          </div>
        ) : planning[0].isError ? (
          <div className="space-y-2">
            <div
              className="flex justify-between items-center"
              style={{ color: "red" }}
            >
              Erreur API
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {planning.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-2 rounded border-l-4 ${
                  item.isPause
                    ? "bg-gray-50 border-gray-300"
                    : "bg-blue-50 border-blue-400"
                }`}
              >
                <div
                  className={`text-xs font-medium w-16 ${
                    item.isPause ? "text-gray-500" : "text-blue-600"
                  }`}
                >
                  {item.heure}
                </div>
                <div className="flex-1">
                  {item.isPause ? (
                    <p className="text-sm text-gray-600 italic">
                      {item.matiere}
                    </p>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-blue-800">
                        {item.matiere}
                      </p>
                      <p className="text-xs text-blue-600">{item.salle}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardItem>

      {/* Card Absences/Retards */}
      <CardItem
        className="lg:col-span-1 md:col-span-2 col-span-1 row-span-2"
        title="Présence"
        contenuEtendu={
          PresenceDetails && Array.isArray(PresenceDetails.absences) ? (
            <div className="space-y-2">
              {PresenceDetails.absences.map((absence, index) => (
                <div
                  key={index}
                  className={`${classes.bg} p-2 rounded border-l-4 ${classes.border}`}
                >
                  <div className="flex items-center gap-2">
                    <Clock size={12} className={classes.icon} />
                    <span className={`text-xs ${classes.textMain}`}>
                      Absence: {absence.date + " " + (absence.heure || "")}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${classes.textSub}`}>
                    {absence.cours} –{" "}
                    {absence.justifiee ? "Justifiée" : "Non justifiée"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`${classes.bg} p-2 rounded border-l-4 ${classes.border}`}
            >
              <div className="flex items-center gap-2">
                <Clock size={12} className={classes.icon} />
                <span className={`text-xs ${classes.textMain}`}>
                  Aucune absence
                </span>
              </div>
            </div>
          )
        }
      >
        {loadingAbcences ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-4 w-8 rounded" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-4 w-8 rounded" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-4 w-8 rounded" />
              </div>
            </div>
            <Separator />
            <div className="p-2 rounded border-l-4 bg-zinc-100 border-zinc-300">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32 rounded" />
              </div>
              <Skeleton className="h-3 w-40 mt-1 rounded" />
            </div>
          </div>
        ) : !PresenceDetails ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              Pas de données sur les absences
            </div>
          </div>
        ) : PresenceDetails.isError ? (
          <div className="space-y-2">
            <div
              className="flex justify-between items-center"
              style={{ color: "red" }}
            >
              Erreur API
            </div>
          </div>
        ) : (
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
                  Dernière absences:{" "}
                  {PresenceDetails.absences[0].date +
                    " " +
                    (PresenceDetails.absences[0].heure || "")}
                </span>
              </div>
              <p className={`text-xs mt-1 ${classes.textSub}`}>
                {PresenceDetails.absences.length > 0
                  ? `${PresenceDetails.absences[0].cours} – ${
                      PresenceDetails.absences[0].justifiee
                        ? "Justifiée"
                        : "Non justifiée"
                    }`
                  : "Aucune absence"}
              </p>
            </div>
          </div>
        )}
      </CardItem>
    </>
  );
}
