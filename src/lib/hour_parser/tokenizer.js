function tokenize(text) {
  const tokens = [];
  const normalized = text.replace(/,/g, "");
  const words = normalized.split(" ").map((word) => word.trim());

  for (const word of words) {
    if (/^\d+h(\d{2})?$/.test(word)) {
      tokens.push({
        type: "HOUR",
        value: normalizeTime(word),
      });
    } else if (/^lundis?$/.test(word)) {
      tokens.push({
        type: "LUNDI",
      });
    } else if (/^mardis?$/.test(word)) {
      tokens.push({
        type: "MARDI",
      });
    } else if (/^mercredis?$/.test(word)) {
      tokens.push({
        type: "MERCREDI",
      });
    } else if (/^jeudis?$/.test(word)) {
      tokens.push({
        type: "JEUDI",
      });
    } else if (/^vendredis?$/.test(word)) {
      tokens.push({
        type: "VENDREDI",
      });
    } else if (/^samedis?$/.test(word)) {
      tokens.push({
        type: "SAMEDI",
      });
    } else if (/^dimanches?$/.test(word)) {
      tokens.push({
        type: "DIMANCHE",
      });
    } else if (/^Fermé$/.test(word)) {
      tokens.push({
        type: "FERME",
      });
    } else if (/^fériés?$/.test(word)) {
      tokens.push({
        type: "FERIE",
      });
    }
  }

  return tokens;
}

function normalizeTime(value) {
  if (/^\d+h$/.test(value)) {
    return value + "00";
  }
  return value;
}

export { tokenize };
