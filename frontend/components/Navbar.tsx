"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  CircleUser,
  CalendarDays,
  // GraduationCap,
  // KeyRound,
  // Tickets,
  // File,
  User,
  LogOut,
  Home,
} from "lucide-react";
import Cookies from "js-cookie";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InfosPerso } from "@/data";
import { loadInfo } from "./DataFetch";
import { Skeleton } from "./ui/skeleton";

const liens = [
  { icon: Home, label: "Accueil", href: "/" },
  { icon: CircleUser, label: "Mon compte", href: "#" },
  { icon: CalendarDays, label: "Planning", href: "agenda" },
  // { icon: GraduationCap, label: "Scolarité", href: "#" },
  // { icon: KeyRound, label: "Inscriptions", href: "#" },
  // { icon: Tickets, label: "Evenements", href: "#" },
  // { icon: File, label: "Documents", href: "#" },
];

export default function Navbar() {
  const [infos, setInfos] = useState<InfosPerso | null>(null);
  const router = useRouter();
  const handleLogout = () => {
    Cookies.remove("token"); // Supprimer le cookie
    router.push("/login"); // Redirection vers la page de connexion
  };
  const handleRefresh = () => {
    sessionStorage.clear(); // Nettoyer le cache
    window.location.reload(); // Recharger la page
  };

  useEffect(() => {
    const fetchInfos = async () => {
      const data = await loadInfo();
      setInfos(data);
    };
    fetchInfos();
  }, []);
  return (
    <Card className="w-full lg:w-64 h-auto lg:h-full max-h-screen top-0 left-0 sticky lg:static flex flex-col z-2">
      <CardHeader className="border-b">
        <h1 className="text-xl font-bold text-[var(--rouge-isen)] justify-center flex sm:flex-row">
          ISEN Yncrea
        </h1>
      </CardHeader>

      {/* Centre scrollable */}
      <div className="flex-1 overflow-y-auto">
        <CardContent className="lg:py-6 px-0 flex flex-row lg:flex-col justify-center">
          <ul className="lg:space-y-2 px-4 flex flex-row lg:flex-col">
            {liens.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="flex items-center space-x-3 px-2 lg:px-4 lg:py-3 rounded-lg hover:bg-background transition-colors "
                >
                  <link.icon size={20} />
                  <span className="hidden lg:block">{link.label}</span>
                </a>
              </li>
            ))}

            <li className="lg:hidden">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-2 lg:px-4 lg:py-3 rounded-lg hover:bg-background transition-colors text-red-500 hover:text-red-700"
              >
                <LogOut size={20} />
                <span className="hidden lg:block">Déconnexion</span>
              </button>
            </li>
          </ul>
        </CardContent>
      </div>

      {/* Footer toujours collé en bas */}
      <CardFooter className="p-4 border-t flex-col gap-2 hidden lg:flex">
        <div className="flex items-center space-x-3 px-4 pt-3 w-full">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div>
            {infos === null ? (
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : (
              <>
                <p className="text-sm font-medium">{`${infos.prenom} ${infos.nom}`}</p>
                <p className="text-xs text-slate-700">{infos.emailPersonnel}</p>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 flex items-center cursor-pointer"
          >
            <LogOut size={16} className="mr-1" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleRefresh}
        >
          Actualiser la page
        </Button>
      </CardFooter>
    </Card>
  );
}
