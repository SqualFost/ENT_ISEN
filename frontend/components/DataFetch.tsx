import ISEN_Api from "@/app/api/api";
import { Cours, Presence, Note, Absences, JourneeCours } from "@/data";
import Cookies from "js-cookie";

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
    const notes: Note[] = [];
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
    // Vérifie si les absences sont déjà en cache
    const cached = sessionStorage.getItem("absences-cache");
    if (cached) {
      const Presence = JSON.parse(cached) as Presence;
      console.log("Absences from cache:", Presence);
      return Presence;
    }
    const response = await api.getAbscences();
    // Stocker dans le sessionStorage

    console.log("Absences fetched:", response);
    let justifie = 0;
    let nonJustifie = 0;
    const absences: Absences[] = [];
    for (const absence of response) {
      if (absence.reason == "Absence non excusée") {
        nonJustifie += 1;
      } else {
        justifie += 1;
      }
      absences.push({
        date: absence.date,
        cours: absence.subject,
        justifiee: !(absence.reason == "Absence non excusée"),
        heure: absence.hours,
      });
    }
    const PresenceDetails: Presence = {
      absencesJustifiees: justifie,
      absencesNonJustifiees: nonJustifie,
      retards: 0, // Assuming no retards data available
      absences: absences,
    };
    sessionStorage.setItem("absences-cache", JSON.stringify(PresenceDetails));
    return PresenceDetails;
  } catch (error) {
    console.error("Failed to load absence data:", error);
    const errorPresence: Presence = {
      isError: true, // Indique que c'est une erreur
      absencesJustifiees: 0,
      absencesNonJustifiees: 0,
      retards: 0,
      absences: [],
    };
    return errorPresence; // Retourne une présence d'erreur
  }
}
export async function loadEDT(
  start: number,
  end: number,
  EDTcomplet = false
): Promise<Cours[]> {
  try {
    // Vérifie si le planning est déjà en cache
    if (EDTcomplet) {
      const cached = sessionStorage.getItem("edt-cache-complet");
      if (cached) {
        const planning = JSON.parse(cached) as Cours[];
        console.log("EDT complet from cache:", planning);
        return planning;
      }
    } else {
      const cached = sessionStorage.getItem("edt-cache");
      if (cached) {
        const planning = JSON.parse(cached) as Cours[];

        console.log("EDT from cache:", planning);
        return planning;
      }
    }
    const response = await api.getAgenda(start, end);
    // Stocker dans le sessionStorage

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
          date: item.start.split("T")[0],
        });
      } else {
        planning.push({
          heure: title[0] + "-" + title[1],
          cours: title[2],
          salle: title[5],
          isPause: false,
          isExam: item.className === "est-epreuve" ? true : false,
          date: item.start.split("T")[0],
        });
      }
    }
    if (EDTcomplet) {
      sessionStorage.setItem("edt-cache-complet", JSON.stringify(planning));
    } else {
      sessionStorage.setItem("edt-cache", JSON.stringify(planning));
    }
    return planning;
  } catch (error) {
    // En cas d'erreur, retourner un tableau vide ou une valeur par défaut
    const errorCours: Cours = {
      isError: true, // Indique que c'est une erreur
      heure: "Erreur de chargement",
      cours: "Erreur de chargement",
      salle: "",
      isPause: false,
      isExam: false,
      date: "",
    };

    console.error("Failed to load EDT data:", error);
    return [errorCours]; // Retourne un cours d'erreur
  }
}

export async function setEdtForAgenda() {
  const start = new Date();
  const end = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay()); // Début de la semaine
  end.setDate(end.getDate() + (6 - end.getDay())); // Fin de la semaine
  end.setHours(23, 59, 59, 999);
  //Timestamp milliseconds
  //const startTimestamp = Math.floor(start.getTime());
  //const endTimestamp = Math.floor(end.getTime());
  // 1730679782000 1731108182000 semaine pour test
  // const edt = await loadEDT(startTimestamp, endTimestamp, true);
  const edt: Cours[] = [
    {
      heure: "08h00-10h00",
      cours: "Herbology Class - Professor Sprout",
      salle: "GreenHouse",
      isPause: false,
      isExam: false,
      date: "2001-12-05", // Mercredi
    },
    {
      heure: "10h00-12h00",
      cours: "Potions Class - Professor Snape",
      salle: "Dungeons",
      isPause: false,
      isExam: false,
      date: "2001-12-05", // même jour pour déclencher ajout
    },
    {
      heure: "13h00-15h00",
      cours: "Potions Class 2 - Professor Snape",
      salle: "Dungeons",
      isPause: false,
      isExam: false,
      date: "2001-12-05", // même jour pour déclencher ajout
    },
    {
      heure: "14h00-16h00",
      cours: "Defense Against the Dark Arts",
      salle: "Classroom 3C",
      isPause: false,
      isExam: false,
      date: "2001-12-06", // Jeudi
    },
  ];
  const joursSemaine = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];

  // Grouper les cours par date
  const coursParDate = new Map<string, Cours[]>();

  edt.forEach((cours) => {
    if (!coursParDate.has(cours.date)) {
      coursParDate.set(cours.date, []);
    }
    coursParDate.get(cours.date)!.push(cours);
  });

  const agenda: JourneeCours[] = [];

  // Traiter chaque jour
  coursParDate.forEach((coursJour, date) => {
    // Trier les cours par heure de début
    coursJour.sort((a, b) => {
      const heureA = parseInt(a.heure.split("h")[0]);
      const heureB = parseInt(b.heure.split("h")[0]);
      return heureA - heureB;
    });

    // Obtenir le nom du jour de la semaine
    const dateObj = new Date(date);
    const jourIndex = dateObj.getDay();
    const nomJour = joursSemaine[jourIndex === 0 ? 6 : jourIndex - 1]; // Dimanche = 0, donc ajuster

    const journee: JourneeCours = {
      cours: [],
      day: nomJour,
      date: date,
    };

    // Ajouter les cours avec pauses automatiques
    for (let i = 0; i < coursJour.length; i++) {
      const coursActuel = coursJour[i];
      journee.cours.push(coursActuel);

      // Vérifier s'il y a un cours suivant
      if (i < coursJour.length - 1) {
        const coursSuivant = coursJour[i + 1];

        // Extraire les heures de fin et de début
        const finActuel = coursActuel.heure.split("-")[1];
        const debutSuivant = coursSuivant.heure.split("-")[0];

        // Si les heures ne se suivent pas directement, ajouter une pause
        if (finActuel !== debutSuivant) {
          const pause: Cours = {
            heure: `${finActuel}-${debutSuivant}`,
            cours: "Pause",
            salle: "",
            isPause: true,
            isExam: false,
            date: coursActuel.date,
          };
          journee.cours.push(pause);
        }
      }
    }

    agenda.push(journee);
  });

  // Trier l'agenda par date
  agenda.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return agenda;
}
