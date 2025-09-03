import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(timestamp: number) {
  const date = new Date(timestamp);

  // Tableau des jours et mois en français
  const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

  // Jour, date, mois
  const jourSemaine = jours[date.getDay()];
  const jour = date.getDate();
  const moisNom = mois[date.getMonth()];

  // Calcul de la semaine ISO
  function getWeekNumber(d: Date): number {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo;
  }


  const semaine = getWeekNumber(date);

  return `${jourSemaine} ${jour} ${moisNom} semaine ${semaine}`;
}
export function DateStrToTimeStamp(dateStr: string): number {
  const [day, month, year] = dateStr.split('-').map(Number);
  
  // Crée une date en tenant compte du fuseau horaire local
  const date = new Date(year, month - 1, day);
  
  // Retourne le timestamp
  return date.getTime();
}
import type { Note_temp, SousMatiere, Matiere } from "../data.ts"

export function calculerMoyenneSousMatiere(notes: Note_temp[]): number {
  if (notes.length === 0) return 0

  const totalPoints = notes.reduce((sum, note) => {
    return sum + Number.parseFloat(note.score) * Number.parseFloat(note.coeff)
  }, 0)

  const totalCoeff = notes.reduce((sum, note) => {
    return sum + Number.parseFloat(note.coeff)
  }, 0)

  return totalPoints / totalCoeff
}

export function calculerMoyenneMatiere(matieres: SousMatiere[]): number {
  if (matieres.length === 0) return 0

  const moyennes = matieres.map((sm) => calculerMoyenneSousMatiere(sm.notes))
  return moyennes.reduce((sum, moy) => sum + moy, 0) / moyennes.length
}

export function calculerMoyenneModule(matieres: Matiere[]): number {
  if (matieres.length === 0) return 0

  const totalPoints = matieres.reduce((sum, matiere) => {
    const moyenneMatiere = calculerMoyenneMatiere(matiere.sous_matieres)
    return sum + moyenneMatiere * matiere.coefficient
  }, 0)

  const totalCoeff = matieres.reduce((sum, matiere) => {
    return sum + matiere.coefficient
  }, 0)

  return totalPoints / totalCoeff
}

export function getCouleurNote(note: number): string {
  if (note >= 16) return "text-green-600"
  if (note >= 14) return "text-blue-600"
  if (note >= 12) return "text-orange-600"
  if (note >= 10) return "text-yellow-600"
  return "text-red-600"
}
