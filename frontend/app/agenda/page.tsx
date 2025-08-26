import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

// Exemple de planning avec durée
const cours = [
  { jour: "Lundi", heure: "10:00", duree: 2, matiere: "Maths", prof: "M. Dupont" },   // 10h-12h
  { jour: "Mardi", heure: "14:00", duree: 1, matiere: "Physique", prof: "Mme Durand" }, // 14h-15h
  { jour: "Jeudi", heure: "09:00", duree: 3, matiere: "Histoire", prof: "M. Martin" }, // 9h-12h
  { jour: "Vendredi", heure: "16:00", duree: 2, matiere: "Anglais", prof: "Mme Smith" }, // 16h-18h
];

export default function AgendaPage() {
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
                    // Vérifie si un cours commence à cette heure
                    const coursCell = cours.find(
                      (c) => c.jour === jour && c.heure === heure
                    );

                    // Vérifie si la case est couverte par un cours déjà affiché
                    const coursEnCours = cours.find((c) => {
                      const startIndex = heures.indexOf(c.heure);
                      const endIndex = startIndex + c.duree - 1;
                      return (
                        c.jour === jour &&
                        i > startIndex &&
                        i <= endIndex
                      );
                    });

                    if (coursEnCours && !coursCell) {
                      // On ne met pas de case : déjà fusionnée par rowSpan
                      return null;
                    }

                    return (
                      <td
                        key={jour + heure}
                        className="border border-gray-300 h-16"
                        rowSpan={coursCell ? coursCell.duree : 1}
                      >
                        {coursCell ? (
                          <div className="bg-blue-500 text-white rounded-lg px-2 py-1 text-xs text-center shadow w-full h-full flex flex-col justify-center">
                            <div className="font-semibold">
                              {coursCell.matiere}
                            </div>
                            <div className="text-[10px] opacity-80">
                              {coursCell.prof}
                            </div>
                            <div className="text-[10px] opacity-70">
                              {coursCell.heure} →{" "}
                              {
                                heures[
                                heures.indexOf(coursCell.heure) +
                                coursCell.duree
                                ]
                              }
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
