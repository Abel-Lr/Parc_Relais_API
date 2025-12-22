import { parseOpeningHours } from "../lib/hour_parser/parseOpeningHours";
import getJoursFeries from "jours-feries-fr";

const weekdays = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
];

export function displayOnlyOpened(items, toggled) {
  if(!toggled) return items;
  return items.filter((el) => {
    return !el.closed
  })
}

export function fuzzySearch(query, items, options = {}) {
  // Normalize query
  const normalizedQuery = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return items.filter((item) => {
    // Normalize item name
    const normalizedName = item.nom
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Check if the normalized query is included in the normalized name
    return normalizedName.includes(normalizedQuery);
  });
}

function forceFirstLetterUpper(str) {
  let first_char = str[0].toUpperCase();
  return first_char + str.slice(1).toLowerCase();
}

// Example
// {
//     "LUNDI": {
//         "ouverture": "4h30",
//         "fermeture": "1h00"
//     },
//     "MARDI": {
//         "ouverture": "4h30",
//         "fermeture": "1h00"
//     },
//     "MERCREDI": {
//         "ouverture": "4h30",
//         "fermeture": "1h00"
//     },
//     "JEUDI": {
//         "ouverture": "4h30",
//         "fermeture": "1h00"
//     },
//     "VENDREDI": {
//         "ouverture": "4h30",
//         "fermeture": "3h00"
//     },
//     "SAMEDI": {
//         "ouverture": "12h00",
//         "fermeture": "3h00"
//     },
//     "DIMANCHE": null,
//     "FERIE": true
// }
export function reformatHoursJSON(week) {
  let ret_obj = { week: {}, ferie: false };
  const week_obj = parseOpeningHours(week);
  Object.keys(week_obj).forEach((week) => {
    const index = week;
    const value = week_obj[index];
    if (index == "FERIE") return;
    if (!value) return (ret_obj["week"][forceFirstLetterUpper(index)] = null);
    const open_value = value["ouverture"].split("h");
    const closed_value = value["fermeture"].split("h");
    ret_obj["week"][forceFirstLetterUpper(index)] = {
      open: { hour: open_value[0], minute: open_value[1] },
      closed: { hour: closed_value[0], minute: closed_value[1] },
    };
  });
  ret_obj.ferie = week_obj.FERIE;
  return ret_obj;
}

export function isWeekdayToday(weekday) {
  const weekday_idx = weekdays.indexOf(weekday);
  const today = new Date().getDay();
  return weekday_idx == today;
}

export function isTodayFerie() {
  const today = new Date();
  const jours_feries = getJoursFeries(today.getFullYear());
  return jours_feries.has(today.toLocaleDateString("fr"));
}

export function isClosed(horaires) {
  // Fermé car Ferié ?
  const ferie = horaires.ferie;
  if(ferie) return true;
  if (ferie && isTodayFerie()) return true;

  const todayWeekDay = forceFirstLetterUpper(weekdays[new Date().getDay()]);
  const horaireToday = horaires["week"][todayWeekDay];

  // Fermé car pas d'horaires ajd ?
  if (!horaireToday) return true;

  // Calculate OpenHour
  const openHourToday = horaireToday["open"];
  const openHourDate = new Date();
  openHourDate.setHours(openHourToday["hour"], openHourToday["minute"], 0);

  // Closed Hour
  const closedHourToday = horaireToday["closed"];
  const closedHourDate = new Date();
  closedHourDate.setHours(
    closedHourToday["hour"],
    closedHourToday["minute"],
    0
  );

  // Ex : Ouvert de 4h à 1h => Ouvert J à 4h jusqu'à J+1 à 1h
  if (closedHourDate.getHours() <= openHourDate.getHours())
    closedHourDate.setDate(closedHourDate.getDate() + 1);

  const today = new Date();

  // Fermé car en dehors des horaires d'ouverture
  return today < openHourDate || today > closedHourDate;
}

export const displayDate = (txt) => {
  const date = new Date(txt);
  const today = new Date();
  let date_ret =
    date.toDateString() === today.toDateString()
      ? "Aujourd'hui"
      : `Le ${date.toLocaleDateString()}`;

  return `${date_ret} à ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};
