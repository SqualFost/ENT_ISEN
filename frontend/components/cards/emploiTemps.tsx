import { useEffect, useState } from "react";
import CardItem from "../CardItem";
import { Cours } from "@/data";
import { Skeleton } from "../ui/skeleton";
import { fetchEDTApi, loadEDTDay } from "../DataFetch";
import { addDays, format, isToday, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale";

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const heures = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

function getJourLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const dayIndex = d.getDay(); // 0 = Dimanche, 1 = Lundi ...
  return jours[dayIndex - 1] || "";
}

export default function EmploiDuTemps() {
  const [loadingEDT, setLoadingEDT] = useState(true);
  const [planning, setPlanning] = useState<Cours[]>([]);
  const [startWeek] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  useEffect(() => {
    const fetchEDT = async () => {
      setLoadingEDT(true);
      const startTimestamp = startWeek.getTime();
      const endTimestamp = addDays(startWeek, 6).setHours(23, 59, 59, 999);
      const result = await fetchEDTApi(startTimestamp, endTimestamp);
      setPlanning(result || []);
      setLoadingEDT(false);
    };
    fetchEDT();
  }, [startWeek]);

  // Fonction pour obtenir la date correspondant à chaque colonne de jour
  const getDateForColumn = (jourIndex: number): Date => {
    return addDays(startWeek, jourIndex);
  };

  // Fonction pour formater la date
  const formatDate = (date: Date): string => {
    return format(date, "dd/MM", { locale: fr });
  };

  useEffect(() => {
    const fetchEDT = async () => {
      const result = await loadEDTDay();
      setPlanning(result || []);
      setLoadingEDT(false);
    };
    fetchEDT();
  }, []);
  return (
    <CardItem
      className="col-span-1 md:col-span-2 row-span-3"
      title={`Planning du ${formatDate(new Date())}`}
      contenuEtendu={
        <div className="overflow-x-auto">
          <table className="border-collapse border border-gray-300 w-full text-center">
            <thead>
              <tr>
                <th className="bg-gray-200 border border-gray-300 p-2 w-[100px]">
                  Heure
                </th>
                {jours.map((jour, index) => {
                  const columnDate = getDateForColumn(index);
                  const isCurrentDay = isToday(columnDate);

                  return (
                    <th
                      key={jour}
                      className={`border border-gray-300 p-2 w-250 min-w-[250px] max-w-[250px] ${
                        isCurrentDay
                          ? "bg-blue-100 font-bold text-blue-800"
                          : "bg-gray-200"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>{jour}</span>
                        <span
                          className={`text-sm ${
                            isCurrentDay ? "text-blue-600" : "text-gray-600"
                          }`}
                        >
                          {formatDate(columnDate)}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {heures.map((heure, i) => (
                <tr key={heure}>
                  {/* Colonne Heure */}
                  <td className="bg-gray-100 border border-gray-300 p-2 font-medium w-[100px]">
                    {heure}
                  </td>

                  {/* Colonnes jours */}
                  {jours.map((jour, jourIndex) => {
                    const columnDate = getDateForColumn(jourIndex);
                    const isCurrentDay = isToday(columnDate);

                    // Vérifie si un cours commence à cette heure précise
                    const coursCell = planning.find(
                      (c) =>
                        getJourLabel(c.date) === jour &&
                        c.heure.startsWith(heure)
                    );

                    // Vérifie si la case est couverte par un cours déjà affiché
                    const coursEnCours = planning.find((c) => {
                      if (getJourLabel(c.date) !== jour) return false;

                      const startIndex = heures.indexOf(c.heure.split("-")[0]);
                      const endIndex = startIndex + (c.duree || 1) - 1;

                      return i > startIndex && i <= endIndex;
                    });

                    if (coursEnCours && !coursCell) {
                      // La case est dans la plage d'un cours déjà rendu → on saute
                      return null;
                    }

                    return (
                      <td
                        key={jour + heure}
                        className={`border border-gray-300 h-16 ${
                          isCurrentDay ? "bg-blue-50" : ""
                        }`}
                        style={{
                          width: "250px",
                          minWidth: "250px",
                          maxWidth: "250px",
                        }}
                        rowSpan={coursCell ? coursCell.duree || 1 : 1}
                      >
                        {coursCell ? (
                          <div
                            className={`rounded-sm px-2 py-1 text-xs text-center shadow w-full h-full flex flex-col justify-center overflow-hidden ${
                              isCurrentDay
                                ? "bg-blue-600 text-white"
                                : "bg-blue-500 text-white"
                            }`}
                          >
                            <div className="font-semibold break-words mx-7">
                              {coursCell.matiere}
                            </div>
                            <div className="text-[10px] opacity-70 truncate">
                              {coursCell.salle}
                            </div>
                            <div className="text-[10px] opacity-70 truncate">
                              {coursCell.heure}
                            </div>
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
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
          {planning
            .filter((item) => {
              const itemDate = new Date(item.date);
              return isToday(itemDate);
            })
            .map((item, index) => (
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
  );
}
