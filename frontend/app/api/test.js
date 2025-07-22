// Aujourd’hui à 00h00:00.000
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

console.log("startOfDay:", startOfDay);
console.log("endOfDay:", endOfDay);