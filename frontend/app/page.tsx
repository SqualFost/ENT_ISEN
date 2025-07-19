import CardItem from "@/components/CardItem"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { CircleUser, CalendarDays, GraduationCap, KeyRound, Tickets, File, User } from "lucide-react"

const liens = [
  { icon: CircleUser, label: "Mon compte", href: "#" },
  { icon: CalendarDays, label: "Planning", href: "#" },
  { icon: GraduationCap, label: "Scolarité", href: "#" },
  { icon: KeyRound, label: "Inscriptions", href: "#" },
  { icon: Tickets, label: "Evenements", href: "#" },
  { icon: File, label: "Documents", href: "#" },
]

export default function HomePage() {  
  return (
    <div className="flex h-screen bg-gray-50 p-4 gap-4">
      {/* Navbar verticale */}
      <Card className="w-64 flex flex-col h-full max-h-screen">
        <CardHeader className="border-b">
          <h1 className="text-xl font-bold text-gray-800">Isen Yncrea</h1>
        </CardHeader>

        {/* Centre scrollable */}
        <div className="flex-1 overflow-y-auto">
          <CardContent className="py-6 px-0">
            <ul className="space-y-2 px-4">
              {liens.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <link.icon size={20} />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </div>

        {/* Footer toujours collé en bas */}
        <CardFooter className="p-4 border-t">
          <div className="flex items-center space-x-3 px-4 pt-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Etudiant Genial</p>
              <p className="text-xs text-gray-500">etudiant@genial.com</p>
            </div>
          </div>
        </CardFooter>
      </Card>


      {/* Contenu principal */}
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 h-full text-center">
          {/* Card 1 */}
          <CardItem className="col-span-1" title="Notes Récentes">20/20</CardItem>

          {/* Card 2 */}
          <CardItem className="col-span-1" title="Moyenne">14,05/20</CardItem>

          {/* Card 3 */}
          <CardItem className="col-span-1 row-span-3" title="Notifications">Rendu de la CVEC</CardItem>

          {/* Card 4 */}
          <CardItem className="col-span-1" title="Evenements">Réunion semestre à l'étranger</CardItem>

          {/* Card 5 */}
          <CardItem className="col-span-1" title="ER">Validé</CardItem>

          {/* Card 6 */}
          <CardItem className="col-span-1 md:col-span-2 row-span-3" title="Emploi du temps">Lundi .... Mardi ....</CardItem>

          {/* Card 7 */}
          <CardItem className="col-span-1 row-span-2" title="Présence">Absence du 07/07</CardItem>
        </div>
      </div>
    </div>
  )
}
