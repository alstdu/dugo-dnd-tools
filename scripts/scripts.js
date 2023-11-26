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
        const len = 5;
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
        item: `<tr id="spell-item" aria-expanded="false">
                <th class="spell-item-name"></th>
                <td class="spell-item-level"></td>
                <td class="spell-item-time"></td>
                <td class="spell-item-school"></td>
                <td class="spell-item-concentration"></td>
                <td class="spell-item-range"></td>
            </tr>`,
    };

    // initialize the spells table with an empty array because we're going to fill it later async
    const spellsTable = new List( 'spells-table', options, [] );

    const populatedList = Promise.all( spellsList.map( async ( spellSummary ) => {
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

        // double destructuring ooo fancy
        const [{elm}] = spellsTable.add( formattedSpell );

        // configure detail
        const detailElm = document.createElement( 'td' );
        detailElm.style.display = 'none';
        detailElm.style.flexBasis = '100%';
        detailElm.style.minHeight = '300px';

        console.log( spell );

        // append inner stuff to detail
        // spell.desc is a list of strings that represent paragraphs
        spell.desc.forEach( ( paragraphText ) => {
            const descriptionElm = document.createElement( 'p' );
            descriptionElm.innerText = paragraphText;
            detailElm.appendChild( descriptionElm );
        } );

        if ( spell.higher_level.length > 0 ) {
            const atHigherLevelsElm = document.createElement( 'p' );
            atHigherLevelsElm.innerText = 'At higher levels:';
            atHigherLevelsElm.style.fontWeight = 'bold';
            detailElm.appendChild( atHigherLevelsElm );
        }

        // spell.higher_level is a list of strings that represent paragraphs
        spell.higher_level.forEach( ( paragraphText ) => {
            const higherLevelElm = document.createElement( 'p' );
            higherLevelElm.innerText = paragraphText;
            detailElm.appendChild( higherLevelElm );
        } );

        // append detail
        elm.appendChild( detailElm );

        elm.addEventListener( 'click', () => {
            const isCurrentlyExpanded = elm.getAttribute( 'aria-expanded' ) === 'true';
            elm.setAttribute( 'aria-expanded', !isCurrentlyExpanded );
            // if it's currently expanded, get rid of it - else make it show.
            detailElm.style.display = isCurrentlyExpanded ? 'none' : 'table-cell';
        } );
    } ) );

    console.log( await populatedList );
} )();
