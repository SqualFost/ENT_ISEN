import CardItem from "../CardItem";
import { Progress } from "../ui/progress";

export default function Moyenne() {
  return (
    <CardItem className="col-span-1" title="Moyenne Générale">
      <div className="text-center space-y-3">
        <div className="text-3xl font-bold text-black">14,05/20</div>
        <Progress value={70.25} className="w-full" />
        <br />
        <div className="text-xs text-gray-500">Classement: 15ème/60</div>
      </div>
    </CardItem>
  );
}
