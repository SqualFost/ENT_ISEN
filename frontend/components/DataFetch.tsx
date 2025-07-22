import ISEN_Api from "@/app/api/api";
import { Cours, Presence } from "@/data";
import Cookies from "js-cookie";

const api = new ISEN_Api();
api.setToken(Cookies.get("token"));


export async function loadNotation() {
  try {
    const response = await api.getNotations();
    let notes = []
    let i = 0
    for (const note of response) {
      notes.push(note)
      i++;
      if (i >= 3) break; // Limiter à 3 notes
    }
    console.log("Notes fetched:", notes);
    notes = notes.map(note => ({
      sujet: note.name.split(" - ")[1],
      score: note.note,
    }));
    return notes;
  } catch (error) {
    console.error("Failed to load notation data:", error);
    return [];
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
    return null;
  }
}
export async function loadEDT() {
  try {
    const now = new Date();

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
    console.error("Failed to load EDT data:", error);
    return [];
  }
}