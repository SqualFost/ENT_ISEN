import { AlertCircle, Calendar, CircleCheckBig } from "lucide-react";
import CardItem from "../CardItem";

const notifications = [
  {
    icon: <AlertCircle size={16} className="text-red-500 mt-0.5" />,
    title: "Urgent",
    message: "Rendu de la CVEC avant le 15/09",
    color: "red",
  },
  {
    icon: <Calendar size={16} className="text-blue-500 mt-0.5" />,
    title: "Rappel",
    message: "Inscription en 3ème année jusqu'au 20/10",
    color: "blue",
  },
  {
    icon: <CircleCheckBig size={16} className="text-green-500 mt-0.5" />,
    title: "Validé",
    message: "Alternance acceptée",
    color: "green",
  },
];

export default function Notifications() {
  return (
    <CardItem className="col-span-1 row-span-3" title="Notifications">
      <div className="space-y-4">
        {notifications.map((notif, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 bg-${notif.color}-50 rounded-lg border-l-4 border-${notif.color}-400`}
          >
            {notif.icon}
            <div>
              <p className={`text-sm font-medium text-${notif.color}-800`}>
                {notif.title}
              </p>
              <p className={`text-xs text-${notif.color}-600`}>
                {notif.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardItem>
  );
}
