import { tokenize } from "./tokenizer";
import { parse } from "./parser";

const WEEK = {
  LUNDI: null,
  MARDI: null,
  MERCREDI: null,
  JEUDI: null,
  VENDREDI: null,
  SAMEDI: null,
  DIMANCHE: null,
  FERIE: false,
};

function parseOpeningHours(text) {
  const tokens = tokenize(text);
  const nodes = parse(tokens);
  const week = { ...WEEK };

  nodes.forEach((node) => {
    if (node.type === "FERIE") {
      week.FERIE = true;
      return;
    }
    if (node.type === "RANGE") {
      applyRange(week, node);
    }
    if (node.type === "DAY") {
      applyDay(week, node);
    }
  });
  return week;
}

function applyRange(week, { dayOpen, dayClose, hourOpen, hourClose }) {
  const days = [
    "LUNDI",
    "MARDI",
    "MERCREDI",
    "JEUDI",
    "VENDREDI",
    "SAMEDI",
    "DIMANCHE",
  ];

  const startIndex = days.indexOf(dayOpen);
  const endIndex = days.indexOf(dayClose);

  const normalizedHourOpen = hourOpen;
  const normalizedHourClose = hourClose;

  if (startIndex <= endIndex) {
    for (let i = startIndex; i <= endIndex; i++) {
      week[days[i]] = {
        ouverture: normalizedHourOpen,
        fermeture: normalizedHourClose,
      };
    }
  } else {
    for (let i = startIndex; i < days.length; i++) {
      week[days[i]] = {
        ouverture: normalizedHourOpen,
        fermeture: normalizedHourClose,
      };
    }
    for (let i = 0; i <= endIndex; i++) {
      week[days[i]] = {
        ouverture: normalizedHourOpen,
        fermeture: normalizedHourClose,
      };
    }
  }
}

function applyDay(week, { dayOpen, hourOpen, hourClose }) {
  week[dayOpen] = {
    ouverture: hourOpen,
    fermeture: hourClose,
  };
}

export { parseOpeningHours };
