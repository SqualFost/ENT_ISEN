import ISEN_Api from "./api.js";

const api = new ISEN_Api();

async function run() {
  try {
    // Étape 1 : Login
    const token = await api.login("matteo.sautron", "AGWEJD");
    console.log(":white_check_mark: Token reçu :", token);

    // Étape 2 : Appels aux méthodes
    const absences = await api.getAbscences();
    console.log(":pushpin: Absences :", absences);

    const userInfo = await api.getUserInfo();
    console.log(":bust_in_silhouette: Infos utilisateur :", userInfo);

    const agenda = await api.getAgenda();
    console.log(":date: Agenda :", agenda);

    const notations = await api.getNotations();
    console.log(":pencil: Notes :", notations);
  } catch (err) {
    console.error(":x: Une erreur est survenue :", err);
  }
}

run();
