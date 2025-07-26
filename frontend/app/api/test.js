const start = new Date();
const end = new Date();
start.setHours(0, 0, 0, 0);
start.setDate(start.getDate() - start.getDay()); // Début de la semaine
end.setDate(end.getDate() + (6 - end.getDay())); // Fin de la semaine
end.setHours(23, 59, 59, 999);
//Timestamp milliseconds
const startTimestamp = Math.floor(start.getTime());
const endTimestamp = Math.floor(end.getTime());
console.log("Start timestamp:", startTimestamp);
console.log("End timestamp:", endTimestamp);