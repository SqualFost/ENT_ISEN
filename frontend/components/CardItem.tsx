"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { X } from "lucide-react";
import { CardItemProps } from "@/data";

export default function CardItem({
  children,
  className,
  title,
  contenuEtendu,
}: CardItemProps) {
  const [etendu, setEtendu] = useState(false);

  const clicSurCard = () => {
    setEtendu(true);
  };

  const fermetureCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEtendu(false);
  };

  const clicOverlay = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setEtendu(false);
    }
  };
  return (
    // "cn" pour combiner les classes CSS sans conflit
    <>
      <Card
        className={cn(
          "hover:shadow-lg hover:scale-103 transition-transform duration-200 ease-in-out cursor-pointer",
          className
        )}
        onClick={clicSurCard}
      >
        {/* On a un titleet un children en tant que props qui seront passés afin de créer une carte facilement */}
        <CardHeader>{title}</CardHeader>
        <CardContent>{children}</CardContent>
      </Card>

      {etendu && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center"
          onClick={clicOverlay}
        >
          <Card
            className="relative min-w-[500px] max-w-[95vw] px-4 py-3"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex justify-between items-center border-b">
              <h2 className="text-xl font-bold">{title}</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={fermetureCard}
              >
                <X size={20} />
              </button>
            </CardHeader>
            <CardContent className="whitespace-nowrap">
              {contenuEtendu || children}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
