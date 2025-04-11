import { mapObject } from "./utilities.js";

const object = { a: 1, b: 2, c: 3 };
const mapped = mapObject(object, (value, key) => [
  key.toUpperCase(),  // Convert key to uppercase
  value * 2,          // Multiply value by 2
]);
console.log(mapped);  // { A: 2, B: 4, C: 6 }
