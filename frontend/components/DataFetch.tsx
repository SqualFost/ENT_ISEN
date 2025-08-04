import ISEN_Api from "@/app/api/api";
import {
  Cours,
  Presence,
  Note,
  Absences,
  JourneeCours,
  InfosPerso,
  NoteParMatiere,
} from "@/data";
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
    console.log("Response note", response);
    const notes: Note[] = [];
    for (let i = 0; i < response.length; i++) {
      const note = response[i];
      const parts = note.name.split(" - ");
      const semestre = parts[0] ? parts[0].replace(/\D/g, "") : 0; // Par défaut, semestre 1
      let sujet = parts[1];
      let nom = parts.slice(2).join(" - ");
      if (nom == "") {
        //Pour les notes mal formatées (très casse couille)
        const code_parts = note.code.split("_");
        const sIndex = code_parts.findIndex(
          (part: string) => part === "S" + semestre
        );
        nom = code_parts.slice(sIndex + 2).join(" - ");
        if (sujet.split(" ").length > 1) {
          sujet = sujet.split(" ").slice(0, -1).join(" "); // Enlève le dernier mot
        }
      }
      notes.push({
        nom: nom,
        sujet: sujet,
        score: note.note,
        semestre: semestre, // Par défaut, semestre 1
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
      nom: "",
      semestre: 1, // Par défaut, semestre 1
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
          isEvent:
            item.className !== "est-epreuve" &&
            item.className !== "CM" &&
            item.className !== "TD" &&
            item.className !== "TP"
              ? true
              : false,
          date: item.start.split("T")[0],
        });
      } else {
        planning.push({
          heure: title[0] + "-" + title[1],
          cours: title[2],
          salle: title[5],
          isPause: false,
          isExam: item.className === "est-epreuve" ? true : false,
          isEvent:
            item.className !== "est-epreuve" &&
            item.className !== "CM" &&
            item.className !== "TD" &&
            item.className !== "TP"
              ? true
              : false,
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
export async function loadInfo(): Promise<InfosPerso | null> {
  try {
    const cached = sessionStorage.getItem("infos-persos-cache");
    if (cached) {
      const infos = JSON.parse(cached) as InfosPerso;
      console.log("Infos perso depuis le cache :", infos);
      return infos;
    }

    const response = await api.getUserInfo();
    const infos: InfosPerso = {
      civilite: response.title,
      nom: response.name,
      prenom: response.firstName,
      deuxiemePrenoms: response.middleNames,
      sexe: response.sex,
      dateNaissance: response.birthDate,
      lieuNaissance: response.birthPlace,
      nationalite: response.nationality,
      adressePersonnelle: {
        civilite: response.personalAddress.title,
        nom: response.personalAddress.name,
        ligneAdresse1: response.personalAddress.streetAddressLine1,
        ligneAdresse2: response.personalAddress.streetAddressLine2,
        ligneAdresse3: response.personalAddress.streetAddressLine3,
        codePostalVille: response.personalAddress.postalCodeCity,
        pays: response.personalAddress.country,
      },
      adresseParents: {
        civilite: response.parentsAddress.title,
        nom: response.parentsAddress.name,
        ligneAdresse1: response.parentsAddress.streetAddressLine1,
        ligneAdresse2: response.parentsAddress.streetAddressLine2,
        ligneAdresse3: response.parentsAddress.streetAddressLine3,
        codePostalVille: response.parentsAddress.postalCodeCity,
        pays: response.parentsAddress.country,
      },
      adresseEnvoiBulletins: {
        civilite: response.reportSendingAddress.title,
        nom: response.reportSendingAddress.name,
        ligneAdresse1: response.reportSendingAddress.streetAddressLine1,
        ligneAdresse2: response.reportSendingAddress.streetAddressLine2,
        ligneAdresse3: response.reportSendingAddress.streetAddressLine3,
        codePostalVille: response.reportSendingAddress.postalCodeCity,
        pays: response.reportSendingAddress.country,
      },
      adresseFacturation: {
        civilite: response.billingAddress.title,
        nom: response.billingAddress.name,
        ligneAdresse1: response.billingAddress.streetAddressLine1,
        ligneAdresse2: response.billingAddress.streetAddressLine2,
        ligneAdresse3: response.billingAddress.streetAddressLine3,
        codePostalVille: response.billingAddress.postalCodeCity,
        pays: response.billingAddress.country,
      },
      telephonePersonnel: response.personalPhone,
      telephoneParents: response.parentsPhone,
      emailEnvoiBulletins: response.reportSendingEmail,
      emailParents: response.parentsEmail,
      emailPersonnel: response.personalEmail,
      dernierDiplome: response.lastCertificate,
      bac: {
        academie: response.bac.academy,
        annee: response.bac.year,
        type: response.bac.type,
        note: response.bac.note,
        mention: response.bac.merit,
        etablissement: response.bac.school,
        codeEtablissement: response.bac.schoolCode,
      },
      pere: {
        nom: response.father.name,
        prenom: response.father.firstName,
        profession: response.father.occupation,
      },
      mere: {
        nom: response.mother.name,
        prenom: response.mother.firstName,
        profession: response.mother.occupation,
      },
      aValideReglementInterieur: response.haveAcknowledgeGlobalRules,
      aValideCharteVieEtudiante: response.haveAcknowledgeStudentLifeCharter,
      autoriseUtilisationImage: response.canIsenUsePersonalImage,
    };
    sessionStorage.setItem("infos-persos-cache", JSON.stringify(infos));
    return infos;
  } catch (error) {
    console.error(
      "Erreur lors du chargement des informations personnelles :",
      error
    );
    return null;
  }
}
export async function setEdtForAgenda() {
  try {
    const start = new Date();
    const end = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay()); // Début de la semaine
    end.setDate(end.getDate() + (6 - end.getDay())); // Fin de la semaine
    end.setHours(23, 59, 59, 999);
    //Timestamp milliseconds
    const startTimestamp = Math.floor(start.getTime());
    const endTimestamp = Math.floor(end.getTime());
    // 1730679782000 1731108182000 semaine pour test
    const edt = await loadEDT(startTimestamp, endTimestamp, true);

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
  } catch (error) {
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

export async function setEvent() {
  try {
    const start = new Date();
    const end = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay()); // Début de la semaine
    end.setDate(end.getDate() + (6 - end.getDay())); // Fin de la semaine
    end.setHours(23, 59, 59, 999);
    //Timestamp milliseconds
    const startTimestamp = Math.floor(start.getTime());
    const endTimestamp = Math.floor(end.getTime());
    const event = await loadEDT(startTimestamp, endTimestamp, true);
    console.log("Event :", event);
    const eventList = event.filter((obj) => obj.isEvent);
    return eventList;
  } catch (error) {
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

export async function TriNoteParMatiere() {
  const notes = await loadNotation(false);
  const notesParMatiere: NoteParMatiere[] = [];
  notes.forEach((note) => {
    const matiere = note.sujet;
    let matiereExistante = notesParMatiere.find((m) => m.matiere === matiere);
    if (!matiereExistante) {
      matiereExistante = { matiere: matiere, notes: [] };
      notesParMatiere.push(matiereExistante);
    }
    matiereExistante.notes.push(note);
  });

  console.log("Notes par matière :", notesParMatiere);
  return notesParMatiere;
}
TriNoteParMatiere();
