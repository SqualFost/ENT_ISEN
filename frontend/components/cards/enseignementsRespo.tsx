import { Ban, CircleCheckBig } from "lucide-react";
import CardItem from "../CardItem";
import { Badge } from "../ui/badge";
import { ERDetails } from "@/data";

export default function EnseignementsRespo() {
  return (
    <CardItem className="col-span-1" title="Enseignement Responsable">
      <div className="space-y-3">
        <div className="bg-background rounded-lg p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium text-gray-500">Type ER:</span>
              <p className="text-gray-800">{ERDetails.type}</p>
            </div>
            <div>
              <span className="font-medium text-gray-500">Période:</span>
              <p className="text-gray-800">{ERDetails.periode}</p>
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-500 text-xs">Intitulé:</span>
            <p className="text-gray-800 text-xs">{ERDetails.intitule}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500 text-xs">
              ER Référent:
            </span>
            <p className="text-gray-800 text-xs">{ERDetails.referent}</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            {ERDetails.goNoGo ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">
                    Go/noGo:
                  </span>

                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 text-xs"
                  >
                    Go
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <CircleCheckBig size={14} className="text-green-500" />
                  <span className="text-xs font-medium text-green-600">
                    Validé
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">
                    Go/noGo:
                  </span>

                  <Badge
                    variant="destructive"
                    className="bg-red-100 text-red-800 text-xs"
                  >
                    noGo
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Ban size={14} className="text-red-500" />
                  <span className="text-xs font-medium text-red-600">
                    Non validé
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </CardItem>
  );
}
