"use client";
import { fetchEDTApi } from "@/components/DataFetch";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Cours } from "@/data";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const fetchEDT = async () => {


      const result = await fetchEDTApi(1733724797000, 1734156797000);
      setPlanning(result || []);
      setLoadingEDT(false);
    };
    fetchEDT();
  }, []);

  if (loadingEDT) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
        <div className="text-blue-600 font-bold text-xl animate-pulse">
          Chargement de l’emploi du temps...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row lg:h-screen p-4 gap-4 bg-gray-100">
      <Navbar />
      <Card className="w-full shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Planning de la semaine du 25/08
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="border-collapse border border-gray-300 w-full text-center">
            <thead>
              <tr>
                <th className="bg-gray-200 border border-gray-300 p-2">Heure</th>
                {jours.map((jour) => (
                  <th
                    key={jour}
                    className="bg-gray-200 border border-gray-300 p-2"
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
                        rowSpan={coursCell ? coursCell.duree || 1 : 1}
                      >
                        {coursCell ? (
                          <div className="bg-blue-500 text-white rounded-lg px-2 py-1 text-xs text-center shadow w-full h-full flex flex-col justify-center overflow-hidden">
                            <div className="font-semibold truncate whitespace-nowrap">{coursCell.matiere}</div>
                            <div className="text-[10px] opacity-70 truncate">{coursCell.salle}</div>
                            <div className="text-[10px] opacity-70 truncate">{coursCell.heure}</div>
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
