const prompt = require('prompt-sync')();
const sql = require('sqlite3').verbose();

const { fetchCharacters, ENDPOINTS } = require('./harry-potter-api-manipulation.js');

async function answersLists() {
    let i = 0;
    const easyAnswers = [];
    const mediumAnswers = [];
    const hardAnswers = [];
    const allCharacters = await fetchCharacters(ENDPOINTS.ALL_CHARACTERS);
    const characterNameAndIndexObject = Object.fromEntries(allCharacters.map((character, index) => [index, character.name]))
    
    for (const [key, value] of Object.entries(characterNameAndIndexObject)) {
        const response = prompt(`${key}: ${value} - Include this character in easy medium or hard? matches on [e]easy,m[medium],h[hard]`)

        
        if (/^(e|easy)$/i.test(response)) {

            easyAnswers.push(value);

        } else if (/^(m|medium)$/i.test(response)) {

            mediumAnswers.push(value);

        } else if (/(^h|hard)$/i.test(response)) {

            hardAnswers.push(value)

        } else {

            throw new Error(console.error(`${response} is invalid input!`))
        }
    }
    
    function compareObjectsAndCreateCharacterAlternateNames(answersArray, allCharacters) {

        const answersObject = Object.fromEntries(answersArray.map((characterNameForAnswer, clue) => [characterNameForAnswer, clue]));
        const dbCharacterNameAndAlternateNameObject = {};

        const charactersWithAlternateNames = new Set(
            Object.values(allCharacters)
                .filter(char => char.alternate_names && char.alternate_names.length > 0)
                .map(char => char.name)
        );

        const arrayOfCharactersWithAlternateNames = Object.keys(answersObject)
            .filter(name => charactersWithAlternateNames.has(name));

        arrayOfCharactersWithAlternateNames.forEach(character => {
            const characterObj = allCharacters.find(char => char.name === character);
            dbCharacterNameAndAlternateNameObject[character] = characterObj.alternate_names[0];
        });

        return dbCharacterNameAndAlternateNameObject;
    }

    const easyDbCharacterNameAndAlternateNameObject = compareObjectsAndCreateCharacterAlternateNames(easyAnswers, allCharacters);
    const mediumDbCharacterNameAndAlternateNameObject = compareObjectsAndCreateCharacterAlternateNames(mediumAnswers, allCharacters);
    const hardDbCharacterNameAndAlternateNameObject = compareObjectsAndCreateCharacterAlternateNames(hardAnswers, allCharacters);

    const easyDb = new sql.Database('easyAnswersAndClues.db', (err) => {
        if (err) {
            console.error('Database creation failed', err);
            return;
        }
        console.log('Database created');
    });

    easyDb.serialize(() => {
        easyDb.run('CREATE TABLE IF NOT EXISTS easyAnswersAndClues (id INTEGER PRIMARY KEY AUTOINCREMENT, characterName TEXT UNIQUE, alternateName TEXT UNIQUE)', (err) => {
            if (err) {
                console.error('table creation failed', err);
                return;
            }
            console.log('Table successfully created!');
        });

        const stmt = easyDb.prepare('INSERT INTO easyAnswersAndClues (characterName, alternateName) VALUES (?, ?)', (err) => {
            if (err) {
                console.error('preperation unsuccessful', err);
                return;
            }
            console.log('preperation successful');
        });

        Object.entries(easyDbCharacterNameAndAlternateNameObject).forEach(([character, alternate]) => stmt.run(character, alternate));
        stmt.finalize();

        easyDb.close(err => {
            if (err) {
                console.error('error closing db', err.message);
            }
        });
    });

    const mediumDb = new sql.Database('mediumAnswersAndClues.db', (err) => {
        if (err) {
            console.error('database creation unsuccessful', err)
            return;
        }
        console.log('Database created');
    });

    mediumDb.serialize(() => {
        mediumDb.run('CREATE TABLE IF NOT EXISTS mediumAnswersAndClues (id INTEGER PRIMARY KEY AUTOINCREMENT, characterName TEXT UNIQUE, alternateName TEXT UNIQUE)', (err) => {
            if (err) {
                console.error('table creation failed', err);
                return;
            }
            console.log('Table successfully created!');
        });

        const stmt = mediumDb.prepare('INSERT INTO mediumAnswersAndClues (characterName, alternateName) VALUES (?, ?)', (err) => {
            if (err) {
                console.error('preperation unsuccessful', err);
                return;
            }
            console.log('preperation successful');
        });

        Object.entries(mediumDbCharacterNameAndAlternateNameObject).forEach(([character, alternate]) => stmt.run(character, alternate));
        stmt.finalize();

        mediumDb.close(err => {
            if (err) {
                console.error('error closing db', err.message);
            }
        });
    });

    const hardDb = new sql.Database('hardAnswersAndClues.db', (err) => {
        if (err) {
            console.error('database creation unsuccessful', err);
            return;
        }
        console.log('Database created');
    });

    hardDb.serialize(() => {
        hardDb.run('CREATE TABLE IF NOT EXISTS hardAnswersAndClues (id INTEGER PRIMARY KEY AUTOINCREMENT, characterName TEXT UNIQUE, alternateName TEXT UNIQUE)', (err) => {
            if (err) {
                console.error('table creation failed', err);
                return;
            }
            console.log('Table successfully created!');
        });

        const stmt = hardDb.prepare('INSERT INTO hardAnswersAndClues (characterName, alternateName) VALUES (?, ?)', (err) => {
            if (err) {
                console.error('preperation unsuccessful', err);
                return;
            }
            console.log('preperation successful');
        });

        Object.entries(hardDbCharacterNameAndAlternateNameObject).forEach(([character, alternate]) => stmt.run(character, alternate));
        stmt.finalize();

        hardDb.close(err => {
            if (err) {
                console.error('error closing db', err.message);
            }
        });
    });

}

answersLists();