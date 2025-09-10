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
import Agenda from "@/components/Agenda";

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
      console.log("EDT fetched:", result);
      setPlanning(result || []);
      setLoadingEDT(false);
    };
    fetchEDT();
  }, [startWeek]);

  function changerSemaine(semaineOffset: number, intensite: number) {
    if (intensite === 30) {
      const nouvelleDate = new Date(startWeek);
      nouvelleDate.setMonth(nouvelleDate.getMonth() + semaineOffset);
      setStartWeek(startOfWeek(nouvelleDate, { weekStartsOn: 1 }));
    } else {
      setStartWeek((prev) => addDays(prev, semaineOffset * 7));
    }
  }

  if (loadingEDT) {
    return (
      <div className="flex flex-col lg:flex-row lg:h-screen p-4 gap-4 bg-gray-100">
        <Navbar />
        <Card className="text-blue-600 font-bold text-xl animate-pulse w-full flex justify-center items-center shadow-xl">
          <LoaderCircle className="h-12 w-12 mr-2 animate-spin" />
          Chargement de l&apos;emploi du temps...
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
          <Agenda planning={planning} startWeek={startWeek} loading={loadingEDT} />
        </CardContent>
      </Card>
    </div>
  );
}