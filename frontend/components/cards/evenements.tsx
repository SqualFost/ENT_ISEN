import CardItem from "../CardItem";
import { DateStrToTimeStamp, formatDate } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import { Cours } from "@/data";
import { setEvent } from "../DataFetch";
import { AlertCircle } from "lucide-react";

export default function Evenements() {
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
  );
}
