const prompt = require('prompt-sync')();

const { fetchCharacters, ENDPOINTS, organizeCharacters } = require('./harry-potter-api-manipulation');

async function answersLists() {
    let i = 0;
    const easyAnswers = [];
    const mediumAnswers = [];
    const hardAnswers = [];
    const allCharacters = await fetchCharacters(ENDPOINTS.ALL_CHARACTERS);
    //const organizedCharacters = organizeCharacters(allCharacters)
     
    const first50 = Object.fromEntries(allCharacters.slice(0, 10).map((character, index) => [index, character.name]))
    
    //console.log(allCharacters)

    for (const [key, value] of Object.entries(first50)) {
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
    
    function hardCompareObjectsAndCreateArrayOfCharactersWithAltenateNames() {
        const hardAnswersObject = Object.fromEntries(hardAnswers.map((characterNameForAnswer, clue) => [characterNameForAnswer, clue]));

        const hardCharactersWithAlternateNames = new Set(
            Object.values(allCharacters)
                .filter(char => char.alternate_names && char.alternate_names.length > 0)
                .map(char => char.name)
        );


        const arrayOfHardCharactersWithAlternateNames = Object.keys(hardAnswersObject)
                        .filter(name => hardCharactersWithAlternateNames.has(name));

        return arrayOfHardCharactersWithAlternateNames
    }

    const arrayOfHardCharactersWithAlternateNames = hardCompareObjectsAndCreateArrayOfCharactersWithAltenateNames()

    function easyCompareObjectsAndCreateArrayOfCharactersWithAltenateNames() {  
        
        const easyAnswersObject = Object.fromEntries(easyAnswers.map((characterNameForAnswer, clue) => [characterNameForAnswer, clue]));

        
        const easyCharactersWithAlternateNames = new Set(
            Object.values(allCharacters)
                .filter(char => char.alternate_names && char.alternate_names.length > 0)
                .map(char => char.name)
        );


        const arrayOfEasyCharactersWithAlternateNames = Object.keys(easyAnswersObject)
                        .filter(name => easyCharactersWithAlternateNames.has(name));

        return arrayOfEasyCharactersWithAlternateNames
    }

    const arrayOfEasyCharactersWithAlternateNames = easyCompareObjectsAndCreateArrayOfCharactersWithAltenateNames()

}

answersLists();