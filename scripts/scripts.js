console.log( 'hello world' );

const API_BASE = 'https://www.dnd5eapi.co';
const DEBUG = true; // TODO: set to false before submit

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
    let spellsList = await getSpellsList();

    if ( DEBUG ) {
        const seed = Math.random();
        const len = 10;
        const offset = Math.floor( seed * ( spellsList.length - len ) );
        spellsList = spellsList.slice( offset, len + offset );
    }

    const options = {
        valueNames: [
            'spell-item-name',
            'spell-item-level',
            'spell-item-time',
            'spell-item-school',
            'spell-item-concentration',
            'spell-item-range',
        ],
        item: `<tr id="spell-item">
                <td class="spell-item-name"></td>
                <td class="spell-item-level"></td>
                <td class="spell-item-time"></td>
                <td class="spell-item-school"></td>
                <td class="spell-item-concentration"></td>
                <td class="spell-item-range"></td>
            </tr>`,
    };

    // initialize the spells table with an empty array because we're going to fill it later async
    const spellsTable = new List( 'spells-table', options, [] );

    spellsList.forEach( async ( spellSummary ) => {
        const url = spellSummary?.url;
        if ( !url ) {
            return;
        }
        const spell = await getSpellFromUrl( url );
        const formattedSpell = {
            'spell-item-name': spell.name,
            'spell-item-level': spell.level,
            'spell-item-time': spell.casting_time,
            'spell-item-school': spell.school.name,
            'spell-item-concentration': spell.concentration ? 'C' : '-',
            'spell-item-range': spell.range,
        };

        spellsTable.add( formattedSpell );
    } );
} )();
