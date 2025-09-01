import { useEffect, useState } from "react";
import CardItem from "../CardItem";
import { Cours } from "@/data";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { loadEDTDay } from "../DataFetch";

export default function EmploiDuTemps() {
  const [loadingEDT, setLoadingEDT] = useState(true);
  const [planning, setPlanning] = useState<Cours[]>([]);

  useEffect(() => {
    const fetchEDT = async () => {
      const result = await loadEDTDay();
      setPlanning(result || []);
      setLoadingEDT(false);
    };
    fetchEDT();
  }, []);
  return (
    <CardItem
      className="col-span-1 md:col-span-2 row-span-3"
      title={`Planning du ${formatDate(Date.now())}`}
    >
      {/* Version condensée - jour actuel seulement */}
      {loadingEDT ? (
        <div className="space-y-1">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-2 pt-2 rounded border-l-4 bg-blue-50 border-blue-400"
            >
              <Skeleton className="h-4 w-16 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : planning.length === 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-center text-sm text-gray-500 py-4">
            Aucun cours prévu aujourd&apos;hui
          </div>
        </div>
      ) : planning[0].isError ? (
        <div className="space-y-2">
          <div
            className="flex justify-between items-center"
            style={{ color: "red" }}
          >
            Erreur API
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          {planning.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-2 rounded border-l-4 ${
                item.isPause
                  ? "bg-gray-50 border-gray-300"
                  : "bg-blue-50 border-blue-400"
              }`}
            >
              <div
                className={`text-xs font-medium w-16 ${
                  item.isPause ? "text-gray-500" : "text-blue-600"
                }`}
              >
                {item.heure}
              </div>
              <div className="flex-1">
                {item.isPause ? (
                  <p className="text-sm text-gray-600 italic">{item.matiere}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-blue-800">
                      {item.matiere}
                    </p>
                    <p className="text-xs text-blue-600">{item.salle}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </CardItem>
  );
}
