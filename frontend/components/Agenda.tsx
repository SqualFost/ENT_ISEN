"use client";
import { Cours } from "@/data";
import { isToday, format, addDays, startOfWeek } from "date-fns";
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

// Convertit un "date" de l'API → jour en toutes lettres
function getJourLabel(dateStr: string): string {
  const d = new Date(dateStr);
  let dayIndex = d.getDay(); // 0 = Dimanche, 1 = Lundi ...
  if (dayIndex === 0) dayIndex = 7;
  return jours[dayIndex - 1];
}

// Convertit "HH:MM" en minutes
function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

interface AgendaProps {
  planning: Cours[];
  startWeek: Date;
  loading?: boolean;
}

export default function Agenda({ planning, startWeek, loading = false }: AgendaProps) {
  const getDateForColumn = (jourIndex: number): Date => {
    return addDays(startWeek, jourIndex);
  };

  const formatDate = (date: Date): string => {
    return format(date, "dd/MM", { locale: fr });
  };

  if (loading) {
    return (
      <div className="text-blue-600 font-bold text-xl animate-pulse w-full flex justify-center items-center shadow-xl">
        Chargement de l&apos;emploi du temps...
      </div>
    );
  }

  return (
    <table className="border-collapse border border-gray-300 w-full text-center relative">
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
          <tr key={heure} className="relative">
            <td className="bg-gray-100 border border-gray-300 p-2 font-medium w-[100px]">
              {heure}
            </td>

            {jours.map((jour, jourIndex) => {
              const columnDate = getDateForColumn(jourIndex);
              const isCurrentDay = isToday(columnDate);
              const heureMinutes = toMinutes(heure);

              // tous les cours du jour
              const coursDuJour = planning.filter(
                (c) => getJourLabel(c.date) === jour
              );

              // cours qui commence dans cette heure
              const coursDansCellule = coursDuJour.filter((c) => {
                const [startTime] = c.heure.split("-");
                const start = toMinutes(startTime);
                return start >= heureMinutes && start < heureMinutes + 60;
              });

              return (
                <td
                  key={jour + heure}
                  className={`border border-gray-300 relative h-20`}
                  style={{
                    width: "250px",
                    minWidth: "250px",
                    maxWidth: "250px",
                    backgroundColor: isCurrentDay ? "#f0f9ff" : "transparent",
                  }}
                >
                  <div className="relative h-full w-full">
                    {coursDansCellule.map((c, idx) => {
                      const [startTime, endTime] = c.heure.split("-");
                      const start = toMinutes(startTime);
                      const end = toMinutes(endTime);

                      const offset = (start - heureMinutes) / 60; // 0 ou 0.5
                      const dureeHeure = (end - start) / 60;

                      return (
                        <div
                          key={idx}
                          className={`absolute left-1 right-1 rounded-sm px-2 py-1 text-xs text-center shadow overflow-hidden ${
                            isCurrentDay
                              ? "bg-blue-600 text-white"
                              : "bg-blue-500 text-white"
                          }`}
                          style={{
                            top: `${offset * 100}%`,
                            height: `${dureeHeure * 100}%`,
                            zIndex: 10, // Assure que le contenu est au-dessus du fond
                          }}
                        >
                          <div className="font-semibold break-words">
                            {c.matiere}
                          </div>
                          <div className="text-[10px] opacity-70 truncate">
                            {c.salle}
                          </div>
                          <div className="text-[10px] opacity-70 truncate">
                            {c.heure}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}