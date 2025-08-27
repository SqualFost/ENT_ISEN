"use client";
import { fetchEDTApi } from "@/components/DataFetch";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Cours } from "@/data";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LoaderCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { addDays, startOfWeek } from "date-fns";
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

// Convertit un "date" de l’API → jour en toutes lettres
function getJourLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const dayIndex = d.getDay(); // 0 = Dimanche, 1 = Lundi ...
  return jours[dayIndex - 1] || "";
}

export default function AgendaPage() {
  const [loadingEDT, setLoadingEDT] = useState(true);
  const [planning, setPlanning] = useState<Cours[]>([]);
  const [startWeek, setStartWeek] = useState(() =>
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

  function changerSemaine(semaineOffset: number, intensite: number) {
    if (intensite === 30) {
      // Aller au début du mois précédent/suivant
      const nouvelleDate = new Date(startWeek);
      nouvelleDate.setMonth(nouvelleDate.getMonth() + semaineOffset);
      setStartWeek(startOfWeek(nouvelleDate, { weekStartsOn: 1 }));
    } else {
      // Aller à la semaine précédente/suivante
      setStartWeek((prev) => addDays(prev, semaineOffset * 7));
    }
  }

  if (loadingEDT) {
    return (
      <div className="flex flex-col lg:flex-row lg:h-screen p-4 gap-4 bg-gray-100">
        <Navbar />
        <Card className="text-blue-600 font-bold text-xl animate-pulse w-full flex justify-center items-center shadow-xl">
          <LoaderCircle className="h-12 w-12 mr-2 animate-spin" />
          Chargement de l’emploi du temps...
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row lg:h-screen p-4 gap-4 bg-gray-100">
      <Navbar />
      <Card className="w-full shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex justify-center gap-5 items-center">
            <Button onClick={() => changerSemaine(-1, 30)}>
              <ChevronsLeft className="h-1 w-1 m-1" />
            </Button>
            <Button onClick={() => changerSemaine(-1, 7)}>
              <ChevronLeft className="h-4 w-4 m-2" />
            </Button>
            <p>Planning de la semaine du {startWeek.toLocaleDateString()}</p>
            <Button onClick={() => changerSemaine(1, 7)}>
              <ChevronRight className="h-4 w-4 m-2" />
            </Button>
            <Button onClick={() => changerSemaine(1, 30)}>
              <ChevronsRight className="h-1 w-1 m-1" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="border-collapse border border-gray-300 w-full text-center">
            <thead>
              <tr>
                <th className="bg-gray-200 border border-gray-300 p-2 w-[100px]">
                  Heure
                </th>
                {jours.map((jour) => (
                  <th
                    key={jour}
                    className="bg-gray-200 border border-gray-300 p-2 w-250 min-w-[250px] max-w-[250px]"
                  >
                    {jour}
                  </th>
                ))}
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
                  {jours.map((jour) => {
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
                      // La case est dans la plage d’un cours déjà rendu → on saute
                      return null;
                    }

                    return (
                      <td
                        key={jour + heure}
                        className="border border-gray-300 h-16"
                        style={{
                          width: "250px",
                          minWidth: "250px",
                          maxWidth: "250px",
                        }}
                        rowSpan={coursCell ? coursCell.duree || 1 : 1}
                      >
                        {coursCell ? (
                          <div className="bg-blue-500 text-white rounded-sm px-2 py-1 text-xs text-center shadow w-full h-full flex flex-col justify-center overflow-hidden">
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
        </CardContent>
      </Card>
    </div>
  );
}
