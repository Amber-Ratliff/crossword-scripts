const HP_API_BASE = 'https://hp-api.onrender.com/api/characters';

const ENDPOINTS = {
  ALL_CHARACTERS: `${HP_API_BASE}`,
  STUDENTS: `${HP_API_BASE}/students`,
  STAFF: `${HP_API_BASE}/staff`,
  HOUSE: (house) => `${HP_API_BASE}/house/${house}`,
  SINGLE: (id) => `${HP_API_BASE}/${id}`
};

async function fetchCharacters(endpoint = ENDPOINTS.STUDENTS) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const characters = await response.json();
    return characters;
  } catch (error) {
    console.error('Error fetching characters:', error);
    return [];
  }
}

// function organizeCharacters(characters) {
//   return characters.map(character => ({
//     id: character.id,
//     name: character.name,
//     alternateNames: character.alternate_names || [],
//     house: character.house,
//     actor: character.actor,
//     yearOfBirth: character.yearOfBirth,
//     alive: character.alive,
//   }));
// }

module.exports = { fetchCharacters, ENDPOINTS };