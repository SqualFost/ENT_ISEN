//Structures

export interface CardItemProps {
  className?: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  contenuEtendu?: React.ReactNode;
}
export type Note = {
  sujet: string;
  nom: string;
  score: number;
  semestre: number;
  isError?: boolean; // Indique si la note est une erreur
};
export type NoteParMatiere = {
  matiere: string;
  notes: Note[];
  isError?: boolean; // Indique si la matière est une erreur
}
export type Cours = {
  isError?: boolean; // Indique si le cours est une erreur
  heure: string;
  matiere: string;
  prof: string;
  salle: string;
  isEvent?: boolean;
  isExam: boolean;
  jour: string;
  isPause?: boolean;
  date: string;
  duree: number; // Durée en heures
};

export type Absences = {
  date: string;
  cours: string;
  justifiee: boolean;
  heure?: string; // Optionnel si l'heure n'est pas disponible
};
export type Presence = {
  isError?: boolean; // Indique si la présence est une erreur
  absencesJustifiees: number;
  absencesNonJustifiees: number;
  retards: number;
  absences: Absences[];
};

export type JourneeCours = {
  cours: Cours[];
  day: string; // Nom du jour de la semaine
  date: string; // Date au format YYYY-MM-DD
};

export type InfosPerso = {
  civilite: string;
  nom: string;
  prenom: string;
  deuxiemePrenoms?: string;
  sexe: string;
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  adressePersonnelle: Adresse;
  adresseParents: Adresse;
  adresseEnvoiBulletins: Adresse;
  adresseFacturation: Adresse;
  telephonePersonnel: string;
  telephoneParents: string;
  emailEnvoiBulletins: string;
  emailParents: string;
  emailPersonnel: string;
  dernierDiplome: string;
  bac: Bac;
  pere: Parent;
  mere: Parent;
  aValideReglementInterieur: boolean;
  aValideCharteVieEtudiante: boolean;
  autoriseUtilisationImage: boolean;
};

export type Adresse = {
  civilite: string;
  nom: string;
  ligneAdresse1: string;
  ligneAdresse2: string;
  ligneAdresse3: string;
  codePostalVille: string;
  pays: string;
};

export type Bac = {
  academie: string;
  annee: string;
  type: string;
  note: string;
  mention: string;
  etablissement: string;
  codeEtablissement: string;
};

export type Parent = {
  nom: string;
  prenom: string;
  profession: string;
};



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
export interface Note_temp {
  nom: string
  sous_matiere_id: string
  score: string
  coeff: string
  code?: string
}

export interface SousMatiere {
  id: string
  nom: string
  coefficient: number
  notes: Note_temp[]
}

export interface Matiere {
  id: string
  nom: string
  coefficient: number
  sous_matieres: SousMatiere[]
}

export interface Module {
  id: string
  nom: string
  matieres: Matiere[]
}

export const modulesData: Module[] = [
  {
    id: "1",
    nom: "Informatique",
    matieres: [
      {
        id: "1",
        nom: "Programmation Web",
        coefficient: 3,
        sous_matieres: [
          {
            id: "1",
            nom: "Examens",
            coefficient: 6,
            notes: [
              { nom: "Examen 1", sous_matiere_id: "1", score: "16.50", coeff: "3" },
              { nom: "Examen 2", sous_matiere_id: "1", score: "14.00", coeff: "3" },
            ],
          },
          {
            id: "2",
            nom: "TP",
            coefficient: 6,
            notes: [
              { nom: "TP 1 - HTML/CSS", sous_matiere_id: "2", score: "18.00", coeff: "2" },
              { nom: "TP 2 - JavaScript", sous_matiere_id: "2", score: "15.50", coeff: "2" },
              { nom: "TP 3 - React", sous_matiere_id: "2", score: "17.00", coeff: "2" },
            ],
          },
          {
            id: "3",
            nom: "IE (Interrogation Écrite)",
            coefficient: 2,
            notes: [
              { nom: "IE 1", sous_matiere_id: "3", score: "12.00", coeff: "1" },
              { nom: "IE 2", sous_matiere_id: "3", score: "15.00", coeff: "1" },
            ],
          },
        ],
      },
      {
        id: "2",
        nom: "Base de Données",
        coefficient: 2,
        sous_matieres: [
          {
            id: "4",
            nom: "Examens",
            coefficient: 4,
            notes: [{ nom: "Examen SQL", sous_matiere_id: "4", score: "13.50", coeff: "4" }],
          },
          {
            id: "5",
            nom: "TP",
            coefficient: 4,
            notes: [
              { nom: "TP MySQL", sous_matiere_id: "5", score: "16.00", coeff: "2" },
              { nom: "TP PostgreSQL", sous_matiere_id: "5", score: "14.50", coeff: "2" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    nom: "Mathématiques",
    matieres: [
      {
        id: "3",
        nom: "Analyse",
        coefficient: 4,
        sous_matieres: [
          {
            id: "6",
            nom: "Examens",
            coefficient: 7,
            notes: [
              { nom: "Partiel", sous_matiere_id: "6", score: "11.00", coeff: "3" },
              { nom: "Final", sous_matiere_id: "6", score: "13.50", coeff: "4" },
            ],
          },
          {
            id: "7",
            nom: "TD",
            coefficient: 2,
            notes: [
              { nom: "TD 1", sous_matiere_id: "7", score: "15.00", coeff: "1" },
              { nom: "TD 2", sous_matiere_id: "7", score: "16.50", coeff: "1" },
            ],
          },
        ],
      },
    ],
  },
]

export const notesNonAssignees: Note_temp[] = [
  { nom: "Quiz Surprise", sous_matiere_id: "-1", score: "17.50", coeff: "1" },
  { nom: "Projet Final", sous_matiere_id: "-1", score: "19.00", coeff: "5" },
  { nom: "Présentation Orale", sous_matiere_id: "-1", score: "14.50", coeff: "2" },
  { nom: "Devoir Maison", sous_matiere_id: "-1", score: "16.00", coeff: "2" },
]
