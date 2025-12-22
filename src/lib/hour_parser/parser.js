function parse(tokens, statements = [], index = 0) {
  if (index >= tokens.length) return statements;
  const token = tokens[index];

  if (token.type === "FERIE") {
    statements.push({ type: "FERIE" });
    return parse(tokens, statements, index + 1);
  }

  if (token.type === "HOUR" && tokens[index + 1]?.type === "HOUR") {
    const hourOpen = token.value;
    const hourClose = tokens[index + 1].value;

    if (isDay(tokens[index + 2]?.type) && isDay(tokens[index + 3]?.type)) {
      statements.push({
        type: "RANGE",
        hourOpen,
        hourClose,
        dayOpen: tokens[index + 2].type,
        dayClose: tokens[index + 3].type,
      });
      return parse(tokens, statements, index + 4);
    }

    if (isDay(tokens[index + 2]?.type)) {
      statements.push({
        type: "DAY",
        hourOpen,
        hourClose,
        dayOpen: tokens[index + 2].type,
      });

      return parse(tokens, statements, index + 3);
    }
  }

  return parse(tokens, statements, index + 1);
}

function isDay(type) {
  return [
    "LUNDI",
    "MARDI",
    "MERCREDI",
    "JEUDI",
    "VENDREDI",
    "SAMEDI",
    "DIMANCHE",
  ].includes(type);
}

export { parse };
