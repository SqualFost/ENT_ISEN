"use client";
import NotesRecentes from "./cards/notesRecentes";
import Moyenne from "./cards/moyenne";
import Notifications from "./cards/notifications";
import Evenements from "./cards/evenements";
import EnseignementsRespo from "./cards/enseignementsRespo";
import EmploiDuTemps from "./cards/emploiTemps";
import PresenceDetails from "./cards/presenceDetails";

export default function CardConteneur() {
  return (
    <>
      {/* Card Notes Récentes */}
      <NotesRecentes />
      {/* Card Moyenne */}
      <Moyenne />
      {/* Card Notifications */}
      <Notifications />
      {/* Card evenement */}
      <Evenements />
      {/* Card ER */}
      <EnseignementsRespo />

      {/* Card EDT */}
      <EmploiDuTemps />

      {/* Card Absences/Retards */}
      <PresenceDetails />
    </>
  );
}
