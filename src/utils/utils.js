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

export function extractHours(description) {
  // Function to extract main hours
  const extractMainHours = (desc) => {
    const hourPattern = /Ouvert de (\d{1,2}h\d{2}) à (\d{1,2}h\d{2})/;
    const matchBase = desc.match(hourPattern);

    if (!matchBase) {
      // Handle "En accès libre" case
      if (/accès libre/i.test(desc)) {
        return {
          weekdays: { open: null, close: null },
          weekends: { open: null, close: null },
        };
      }
      return null;
    }

    // Check for different day ranges
    const weekdayPatterns = [
      /du lundi au jeudi/,
      /du dimanche au jeudi/,
      /du lundi au vendredi/,
      /du lundi au dimanche/,
    ];

    const weekendPatterns = [
      /de 4h30 à 3h00 les vendredis et samedis/,
      /vendredi et samedi/,
    ];

    const defaultHours = {
      open: matchBase[1],
      close: matchBase[2],
    };

    const result = {
      weekdays: defaultHours,
      weekends: defaultHours,
    };

    // Specific day range modifications
    if (weekdayPatterns.some((pattern) => pattern.test(desc))) {
      result.weekdays = defaultHours;
    }

    if (weekendPatterns.some((pattern) => pattern.test(desc))) {
      result.weekends = {
        open: "4h30",
        close: "3h00",
      };
    }

    return result;
  };

  // Function to extract modalities
  const extractModalities = (desc) => {
    const modalities = [];

    // List of potential modality patterns
    const modalityPatterns = [
      /Réservé aux abonnés TCL/,
      /Réservé aux abonnés PREMIUM/,
      /Fermé les dimanches et jours fériés/,
      /Accès libre en dehors de ces horaires/,
      /Présence de \d+ arceaux et \d+ consignes vélos/,
      /Niveau \d+ réservé aux abonnés/,
    ];

    modalityPatterns.forEach((pattern) => {
      const match = desc.match(pattern);
      if (match) {
        modalities.push(match[0]);
      }
    });

    return modalities.length > 0 ? modalities : null;
  };

  // Combine hours and modalities
  return {
    hours: extractMainHours(description),
    modalities: extractModalities(description),
  };
}

export const displayDate = (txt) => {
  const date = new Date(txt);
  const today = new Date();
  let date_ret =
    date.toDateString() === today.toDateString()
      ? "Aujourd'hui"
      : `Le ${date.toLocaleDateString()}`;

  return `${date_ret} à ${date.toLocaleTimeString()}`;
};
