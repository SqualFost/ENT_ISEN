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
  GraduationCap,
  KeyRound,
  Tickets,
  File,
  User,
  LogOut,
} from "lucide-react";
import Cookies from "js-cookie";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InfosPerso } from "@/data";
import { loadInfo } from "./DataFetch";
import { Skeleton } from "./ui/skeleton";

const liens = [
  { icon: CircleUser, label: "Mon compte", href: "#" },
  { icon: CalendarDays, label: "Planning", href: "#" },
  { icon: GraduationCap, label: "Scolarité", href: "#" },
  { icon: KeyRound, label: "Inscriptions", href: "#" },
  { icon: Tickets, label: "Evenements", href: "#" },
  { icon: File, label: "Documents", href: "#" },
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
    <Card className="w-64 flex flex-col h-full max-h-screen">
      <CardHeader className="border-b">
        <h1 className="text-xl font-bold text-[var(--rouge-isen)]">
          ISEN Yncrea
        </h1>
      </CardHeader>

      {/* Centre scrollable */}
      <div className="flex-1 overflow-y-auto">
        <CardContent className="py-6 px-0">
          <ul className="space-y-2 px-4">
            {liens.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-background transition-colors"
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
      <CardFooter className="p-4 border-t flex flex-col gap-2">
        <div className="flex items-center space-x-3 px-4 pt-3 w-full">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div>
            {infos === null ? (
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
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
