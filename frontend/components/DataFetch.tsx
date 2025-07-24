import ISEN_Api from "@/app/api/api";
import { Cours, Presence } from "@/data";
import Cookies from "js-cookie";
import { Note } from "@/data";
const api = new ISEN_Api();
api.setToken(Cookies.get("token"));


export async function loadNotation(estNoteRecente = true): Promise<Note[]> {
  try {
    // Vérifie si les notes sont déjà en cache
    const cached = sessionStorage.getItem("notation-cache");
    if (cached) {
      const notes = JSON.parse(cached) as Note[];
      console.log("Notes from cache:", notes);
      if (estNoteRecente) {
        return notes.slice(0, 3); // Retourne les 3 dernières notes
      }
      return notes;
    }

    // Sinon, appel API
    const response = await api.getNotations();
    let notes: Note[] = [];

    for (let i = 0; i < response.length; i++) {
      const note = response[i];
      const parts = note.name.split(" - ");
      notes.push({
        nom: parts[2] || null,
        sujet: parts[1],
        score: note.note,
      });
    }

    console.log("Notes fetched:", notes);

    // Stocker dans le sessionStorage
    sessionStorage.setItem("notation-cache", JSON.stringify(notes));
    if (estNoteRecente) {
      return notes.slice(0, 3); // Retourne les 3 dernières notes
    }
    return notes;

  } catch (error) {
    console.error("Failed to load notation data:", error);
    const errorNote: Note = {
      sujet: "Erreur de chargement",
      score: 0,
      isError: true,
    };
    return [errorNote];
  }
}


export async function loadAbscences() {
  try {
    const response = await api.getAbscences();
    console.log("Absences fetched:", response);
    const derniereAbsence = response[0];
    let justifie = [];
    let nonJustifie = [];
    for (const absence of response) {
      if (absence.reason == "Absence non excusée") {
        nonJustifie.push(absence);
      }
      else {
        justifie.push(absence);
      }
    }
    const PresenceDetails: Presence = {
      absencesJustifiees: justifie.length,
      absencesNonJustifiees: nonJustifie.length,
      retards: 0, // Assuming no retards data available
      derniereAbsence: [
        {
          date: derniereAbsence.date,
          cours: derniereAbsence.subject,
          justifiee: derniereAbsence.reason !== "Absence non excusée",
        },
      ],
    };
    return PresenceDetails;
  } catch (error) {
    console.error("Failed to load absence data:", error);
    const errorPresence: Presence = {
      isError: true, // Indique que c'est une erreur
      absencesJustifiees: 0,
      absencesNonJustifiees: 0,
      retards: 0,
      derniereAbsence: [],
    };
    return errorPresence; // Retourne une présence d'erreur
  }
}
export async function loadEDT() {
  try {
    const now = new Date();
    // Aujourd’hui à 00h00:00.000
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0, 0, 0, 0
    ).getTime();

    // Aujourd’hui à 23h59:59.999
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23, 59, 59, 999
    ).getTime();
    const response = await api.getAgenda(startOfDay, endOfDay);

    console.log("EDT fetched:", response);
    const planning: Cours[] = [];
    for (const item of response) {
      const title = item.title.split(" - ");
      if (title.length === 11) {
        planning.push({
          heure: title[0] + "-" + title[1],
          cours: title[2] + " " + title[3],
          salle: title[6],
          isPause: false,
          isExam: item.className === "est-epreuve" ? true : false,
        });
      }
      else {
        planning.push({
          heure: title[0] + "-" + title[1],
          cours: title[2],
          salle: title[5],
          isPause: false,
          isExam: item.className === "est-epreuve" ? true : false,
        });
      }

    }
    return planning;
  } catch (error) {
    // En cas d'erreur, retourner un tableau vide ou une valeur par défaut
    const errorCours: Cours = {
      isError: true, // Indique que c'est une erreur
      heure: "Erreur de chargement",
      cours: "Erreur de chargement",
      salle: null,
      isPause: false,
      isExam: false,
    };
    console.error("Failed to load EDT data:", error);
    return [errorCours]; // Retourne un cours d'erreur
  }
}