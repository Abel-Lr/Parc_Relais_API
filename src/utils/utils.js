export function fuzzySearch(query, items, options = {}) {
    // Normalize query
    const normalizedQuery = query.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  
    return items.filter(item => {
      // Normalize item name
      const normalizedName = item.nom.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
  
      // Check if the normalized query is included in the normalized name
      return normalizedName.includes(normalizedQuery);
    });
  }
  
