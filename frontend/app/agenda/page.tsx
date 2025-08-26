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
          <div className="grid grid-cols-[100px_repeat(6,1fr)] border-gray-300 rounded-lg">
            {/* Ligne d'entête */}
            <div className="bg-gray-200 p-2 font-semibold text-center border-b border-r border-gray-300">
              Heure
            </div>
            {jours.map((jour) => (
              <div
                key={jour}
                className="bg-gray-200 p-2 font-semibold text-center border-b border-r border-gray-300"
              >
                {jour}
              </div>
            ))}

            {/* Lignes horaires */}
            {heures.map((heure) => (
              <>
                <div
                  key={heure}
                  className="bg-gray-100 p-2 text-sm text-center border-b border-x border-gray-300 font-medium"
                >
                  {heure}
                </div>
                {jours.map((jour) => (
                  <div
                    key={jour + heure}
                    className="h-16 border-b border-r border-gray-300 hover:bg-blue-100 transition-colors"
                  ></div>
                ))}
              </>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
