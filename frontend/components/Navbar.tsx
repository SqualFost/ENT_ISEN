import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  CircleUser,
  CalendarDays,
  GraduationCap,
  KeyRound,
  Tickets,
  File,
  User,
} from "lucide-react";

const liens = [
  { icon: CircleUser, label: "Mon compte", href: "#" },
  { icon: CalendarDays, label: "Planning", href: "#" },
  { icon: GraduationCap, label: "Scolarité", href: "#" },
  { icon: KeyRound, label: "Inscriptions", href: "#" },
  { icon: Tickets, label: "Evenements", href: "#" },
  { icon: File, label: "Documents", href: "#" },
];

export default function Navbar() {
  return (
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
                <a
                  href={link.href}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
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
  );
}
