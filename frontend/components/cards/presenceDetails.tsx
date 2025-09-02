import { useEffect, useState } from "react";
import CardItem from "../CardItem";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { classes, Presence } from "@/data";
import { loadAbscences } from "../DataFetch";
import { Clock } from "lucide-react";

export default function PresenceDetails() {
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
  
  return (
    <CardItem
      className="lg:col-span-1 md:col-span-2 col-span-1 row-span-2"
      title="Présence"
      contenuEtendu={
        PresenceDetails && Array.isArray(PresenceDetails.absences) && PresenceDetails.absences.length > 0 ? (
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
                {PresenceDetails.absencesJustifiees || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-800">Absences non justifiées</span>
              <span className="font-medium text-destructive">
                {PresenceDetails.absencesNonJustifiees || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-800">Retards</span>
              <span className="font-medium text-gray-800">
                {PresenceDetails.retards || 0}
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
                Dernière absence:{" "}
                {PresenceDetails?.absences?.[0]
                  ? `${PresenceDetails.absences[0].date || ""} ${PresenceDetails.absences[0].heure || ""}`
                  : "Aucune absence"}
              </span>
            </div>
            <p className={`text-xs mt-1 ${classes.textSub}`}>
              {PresenceDetails?.absences?.[0]
                ? `${PresenceDetails.absences[0].cours || "Cours inconnu"} – ${PresenceDetails.absences[0].justifiee
                  ? "Justifiée"
                  : "Non justifiée"
                }`
                : "Aucune absence"}
            </p>
          </div>
        </div>
      )}
    </CardItem>
  );
}