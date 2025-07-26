import ISEN_Api from "@/app/api/api";
import {
  Cours,
  Presence,
  Note,
  Absences,
  JourneeCours,
  InfosPerso,
} from "@/data";
import Cookies from "js-cookie";

const api = new ISEN_Api();
api.setToken(Cookies.get("token"));

function recupCache<T>(key: string): T | null {
  const cached = sessionStorage.getItem(key);
  return cached ? (JSON.parse(cached) as T) : null;
}

function setCache<T>(key: string, data: T) {
  sessionStorage.setItem(key, JSON.stringify(data));
}

export async function loadNotation(estNoteRecente = true): Promise<Note[]> {
  try {
    const cached = recupCache<Note[]>("notation-cache");
    if (cached) return estNoteRecente ? cached.slice(0, 3) : cached;

    const response = await api.getNotations();
    const notes: Note[] = response.map((note: any) => {
      const parts = note.name.split(" - ");
      return {
        nom: parts[2] || null,
        sujet: parts[1],
        score: note.note,
      };
    });

    setCache("notation-cache", notes);
    return estNoteRecente ? notes.slice(0, 3) : notes;
  } catch (error) {
    console.error("Failed to load notation data:", error);
    return [
      {
        sujet: "Erreur de chargement",
        score: 0,
        isError: true,
      },
    ];
  }
}

export async function loadAbscences(): Promise<Presence> {
  try {
    const cached = recupCache<Presence>("absences-cache");
    if (cached) return cached;

    const response = await api.getAbscences();
    let justifie = 0;
    let nonJustifie = 0;
    const absences: Absences[] = [];

    for (const absence of response) {
      const isJustified = absence.reason !== "Absence non excusée";
      isJustified ? justifie++ : nonJustifie++;
      absences.push({
        date: absence.date,
        cours: absence.subject,
        justifiee: isJustified,
        heure: absence.hours,
      });
    }

    const result: Presence = {
      absencesJustifiees: justifie,
      absencesNonJustifiees: nonJustifie,
      retards: 0,
      absences,
    };

    setCache("absences-cache", result);
    return result;
  } catch (error) {
    console.error("Failed to load absence data:", error);
    return {
      isError: true,
      absencesJustifiees: 0,
      absencesNonJustifiees: 0,
      retards: 0,
      absences: [],
    };
  }
}

export async function loadEDT(
  start: number,
  end: number,
  EDTcomplet = false
): Promise<Cours[]> {
  try {
    const cacheKey = EDTcomplet ? "edt-cache-complet" : "edt-cache";
    const cached = recupCache<Cours[]>(cacheKey);
    if (cached) return cached;

    const response = await api.getAgenda(start, end);
    const planning: Cours[] = response.map((item: any) => {
      const title = item.title.split(" - ");
      const heure = `${title[0]}-${title[1]}`;
      const cours = title.length === 11 ? `${title[2]} ${title[3]}` : title[2];
      const salle = title.length === 11 ? title[6] : title[5];
      return {
        heure,
        cours,
        salle,
        isPause: false,
        isExam: item.className === "est-epreuve",
        date: item.start.split("T")[0],
      };
    });

    setCache(cacheKey, planning);
    return planning;
  } catch (error) {
    console.error("Failed to load EDT data:", error);
    return [
      {
        isError: true,
        heure: "Erreur de chargement",
        cours: "Erreur de chargement",
        salle: "",
        isPause: false,
        isExam: false,
        date: "",
      },
    ];
  }
}

export async function setEdtForAgenda(): Promise<JourneeCours[]> {
  // const start = new Date();
  // const end = new Date();
  // start.setHours(0, 0, 0, 0);
  // start.setDate(start.getDate() - start.getDay());
  // end.setDate(end.getDate() + (6 - end.getDay()));
  // end.setHours(23, 59, 59, 999);

  // const startTimestamp = Math.floor(start.getTime());
  // const endTimestamp = Math.floor(end.getTime());
  // const edt = await loadEDT(startTimestamp, endTimestamp, true);

  const edt: Cours[] = [
    {
      heure: "08h00-10h00",
      cours: "Herbology Class - Professor Sprout",
      salle: "GreenHouse",
      isPause: false,
      isExam: false,
      date: "2001-12-05",
    },
    {
      heure: "10h00-12h00",
      cours: "Potions Class - Professor Snape",
      salle: "Dungeons",
      isPause: false,
      isExam: false,
      date: "2001-12-05",
    },
    {
      heure: "13h00-15h00",
      cours: "Potions Class 2 - Professor Snape",
      salle: "Dungeons",
      isPause: false,
      isExam: false,
      date: "2001-12-05",
    },
    {
      heure: "14h00-16h00",
      cours: "Defense Against the Dark Arts",
      salle: "Classroom 3C",
      isPause: false,
      isExam: false,
      date: "2001-12-06",
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

  const coursParDate = new Map<string, Cours[]>();
  edt.forEach((cours) => {
    if (!coursParDate.has(cours.date)) coursParDate.set(cours.date, []);
    coursParDate.get(cours.date)!.push(cours);
  });

  const agenda: JourneeCours[] = [];

  coursParDate.forEach((coursJour, date) => {
    coursJour.sort((a, b) => {
      const [hA, mA] = a.heure.split("-")[0].split("h").map(Number);
      const [hB, mB] = b.heure.split("-")[0].split("h").map(Number);
      return hA * 60 + (mA || 0) - (hB * 60 + (mB || 0));
    });

    const dateObj = new Date(date);
    const nomJour =
      joursSemaine[dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1];

    const journee: JourneeCours = {
      day: nomJour,
      date,
      cours: [],
    };

    for (let i = 0; i < coursJour.length; i++) {
      journee.cours.push(coursJour[i]);
      if (i < coursJour.length - 1) {
        const finActuel = coursJour[i].heure.split("-")[1];
        const debutSuivant = coursJour[i + 1].heure.split("-")[0];
        if (finActuel !== debutSuivant) {
          journee.cours.push({
            heure: `${finActuel}-${debutSuivant}`,
            cours: "Pause",
            salle: "",
            isPause: true,
            isExam: false,
            date,
          });
        }
      }
    }

    agenda.push(journee);
  });

  agenda.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  return agenda;
}

export async function loadInfo(): Promise<InfosPerso | null> {
  try {
    const cached = sessionStorage.getItem("infos-persos-cache");
    if (cached) {
      const infos: InfosPerso = JSON.parse(cached);
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

    console.log("Infos perso chargées :", infos);
    return infos;
  } catch (error) {
    console.error(
      "Erreur lors du chargement des informations personnelles :",
      error
    );
    return null;
  }
}
