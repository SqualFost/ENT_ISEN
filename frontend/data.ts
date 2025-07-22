//Structures

export interface CardItemProps {
  className?: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  contenuEtendu?: React.ReactNode;
}
export type Note = {
  sujet: string;
  score: number;
};
export type Cours = {
  heure: string;
  cours: string;
  salle: string | null;
  isPause?: boolean;
  isExam: boolean;
}

export type Presence = {
  absencesJustifiees: number;
  absencesNonJustifiees: number;
  retards: number;
  derniereAbsence: { date: string; cours: string; justifiee: boolean }[];
};
// Data provisioires

export const notes = [
  { sujet: "Mathématiques", score: "20/20" },
  { sujet: "Physique", score: "18/20" },
  { sujet: "Informatique", score: "16/20" },
];

export const evenements = [
  {
    titre: "Réunion semestre à l'étranger",
    date: "Aujourd'hui 14h30",
    color: "orange",
  },
  { titre: "Forum entreprises", date: "Demain 9h00", color: "blue" },
];

export const ERDetails = {
  type: "ER N1/N2",
  periode: "28/09/2023 - 05/07/2024",
  intitule: "Pôle Dev",
  referent: "CRAPE Amaury",
  goNoGo: false,
};

export const planning = [
  {
    heure: "8h-10h",
    cours: "Sécurité web",
    salle: "Salle 321",
  },
  {
    heure: "10h-12h",
    cours: "Web dev",
    salle: "Salle 320",
  },
  {
    heure: "12h-13h",
    cours: "Pause déjeuner",
    salle: null,
    isPause: true,
  },
  {
    heure: "13h-14h",
    cours: "Espagnol",
    salle: "Salle 110",
  },
  {
    heure: "14h-16h",
    cours: "Électronique",
    salle: "Salle 520",
  },
  {
    heure: "16h-18h",
    cours: "Mathématiques",
    salle: "Salle 521",
  },
];

export const PresenceDetails = {
  absencesJustifiees: 2,
  absencesNonJustifiees: 1,
  retards: 3,
  derniereAbsence: [
    {
      date: "07/01",
      cours: "Mathématiques",
      justifiee: false,
    },
  ],
};

export const classes = PresenceDetails.derniereAbsence[0].justifiee
  ? {
      bg: "bg-yellow-50",
      border: "border-yellow-400",
      icon: "text-yellow-500",
      textMain: "text-yellow-700",
      textSub: "text-yellow-600",
    }
  : {
      bg: "bg-red-50",
      border: "border-red-400",
      icon: "text-red-500",
      textMain: "text-red-700",
      textSub: "text-red-600",
    };

export const notifColors = {
  red: {
    bg: "bg-red-50",
    border: "border-red-400",
    text: {
      title: "text-red-800",
      message: "text-red-600",
      icon: "text-red-500",
    },
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-400",
    text: {
      title: "text-blue-800",
      message: "text-blue-600",
      icon: "text-blue-500",
    },
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-400",
    text: {
      title: "text-green-800",
      message: "text-green-600",
      icon: "text-green-500",
    },
  },
};
