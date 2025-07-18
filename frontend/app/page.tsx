import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { CircleUser, CalendarDays, GraduationCap, KeyRound, Tickets, File, User } from "lucide-react"
export default function HomePage() {
  return (
    <div className="flex h-screen bg-gray-50 p-4 gap-4">
      {/* Navbar verticale */}
      <Card className="w-64 flex flex-col">
        <CardHeader className="border-b">
          <h1 className="text-xl font-bold text-gray-800">Isen Yncrea</h1>
        </CardHeader>

        <CardContent className="flex-1 py-6 px-0">
          <ul className="space-y-2 px-4">
            <li>
              <a
                href="#"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <CircleUser size={20} />
                <span>Mon compte</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <CalendarDays size={20} />
                <span>Planning</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <GraduationCap size={20} />
                <span>Scolarité</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <KeyRound size={20} />
                <span>Inscriptions</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Tickets size={20} />
                <span>Evenements</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <File size={20} />
                <span>Documents</span>
              </a>
            </li>
          </ul>
        </CardContent>

        {/* Footer avec informations utilisateur */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3 px-4 pt-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Etudiant Genial</p>
              <p className="text-xs text-gray-500">etudiant@genial.com</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Contenu principal */}
      <div className="flex-1">
        <div className="grid grid-cols-3 auto-rows-[full] gap-4 h-full">
          {/* Card 1 */}
          <Card className="col-span-1">
            <CardHeader>Notes récentes</CardHeader>
          </Card>

          {/* Card 2 */}
          <Card className="col-span-1">
            <CardHeader>Moyenne</CardHeader>
          </Card>

          {/* Card 3 */}
          <Card className="col-span-1 row-span-3">
            <CardHeader>Notifications</CardHeader>
          </Card>

          {/* Card 4 */}
          <Card className="col-span-1">
            <CardHeader>Evenements</CardHeader>
          </Card>

          {/* Card 5 */}
          <Card className="col-span-1">
            <CardHeader>ER</CardHeader>
          </Card>

          {/* Card 6 */}
          <Card className="col-span-2 row-span-3">
            <CardHeader>Emploi du temps</CardHeader>
          </Card>

          {/* Card 7 */}
          <Card className="col-span-1 row-span-2">
            <CardHeader>Présence</CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
