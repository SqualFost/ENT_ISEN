import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CardItem({
  children,
  className,
  title,
}: CardItemProps) {
  return (
    // "cn" pour combiner les classes CSS sans conflit
    <Card
      className={cn(
        "hover:shadow-lg hover:scale-103 transition-transform duration-200 ease-in-out",
        className
      )}
    >
      {/* On a un titleet un children en tant que props qui seront passés afin de créer une carte facilement */}
      <CardHeader>{title}</CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
