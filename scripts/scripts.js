console.log( 'hello world' );

const API_BASE = 'https://www.dnd5eapi.co';

const getJsonFromUrl = async ( url ) => {
    const response = await fetch( url );
    const parsed = await response.json();
    return parsed;
};

const getSpellsList = async () => {
    // this endpoint returns an object with a "count" property and a "results" property
    // we just want the results so get that. We can use .length if we want the count
    return ( await getJsonFromUrl( `${API_BASE}/api/spells` ) ).results;
};

const getSpellFromUrl = async ( spellPath ) => {
    return await getJsonFromUrl( `${API_BASE}${spellPath}` );
};

( async () => {
    const spellsList = await getSpellsList();
    console.log( spellsList );

    const firstSpell = spellsList[0];
    console.log( firstSpell );
    console.log( await getSpellFromUrl( firstSpell.url ) );
} )();
