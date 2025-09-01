import { useEffect, useState } from "react";
import CardItem from "../CardItem";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { loadNotation } from "../DataFetch";
import { Note } from "@/data";

export default function NotesRecentes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  useEffect(() => {
    const fetchNotes = async () => {
      const result = await loadNotation();
      setNotes(result || []);
      setLoadingNotes(false);
    };
    fetchNotes();
  }, []);
  return (
    <CardItem className="col-span-1" title="Notes Récentes">
      {loadingNotes ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex justify-between items-center">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-12 rounded-md" />
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            Pas de notes récentes
          </div>
        </div>
      ) : notes[0].isError ? (
        <div className="space-y-2">
          <div
            className="flex justify-between items-center"
            style={{ color: "red" }}
          >
            Erreur API
          </div>
        </div>
      ) : (
        notes.map((note, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-800">
                {note.sujet} {note.nom}{" "}
              </span>
              <Badge variant="secondary" className="bg-gray-100 text-black">
                {note.score}
              </Badge>
            </div>
            {index < notes.length - 1 && <Separator className="my-2" />}
          </div>
        ))
      )}
    </CardItem>
  );
}
