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
            'spell-item-level': spell.level > 0 ? spell.level : 'Cantrip',
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
        const levelElm = document.createElement( 'p' );
        const levelSpanElm = document.createElement( 'span' );
        levelSpanElm.style.fontWeight = 'bold';
        levelSpanElm.innerText = 'Level: ';
        levelElm.appendChild( levelSpanElm );
        // If level is greater than 0, display the level. Else cantrip
        levelElm.innerHTML += spell.level > 0 ? spell.level : 'Cantrip';
        detailElm.appendChild( levelElm );

        // create a p tag with a span inside
        const durationElm = document.createElement( 'p' );
        const durationSpanElm = document.createElement( 'span' );
        durationSpanElm.style.fontWeight = 'bold';
        durationSpanElm.innerText = 'Duration: ';
        // durationSpanElm needs to be appended first so that it shows up on the left
        durationElm.appendChild( durationSpanElm );
        // now that we appended the span we can ADD the text
        // note: we are adding the text with += not overwriting it with =, lest we nuke the poor span :(
        // note also that: we are using innerHTML instead of innerText, else...
        // the text from the span stays but the span itself dissapears...
        // which is very fun to debug as a beginner
        durationElm.innerHTML += spell.duration;
        detailElm.appendChild( durationElm );

        const componentsElm = document.createElement( 'p' );
        const componentsSpanElm = document.createElement( 'span' );
        componentsSpanElm.style.fontWeight = 'bold';
        componentsSpanElm.innerText = 'Components: ';
        componentsElm.appendChild( componentsSpanElm );
        componentsElm.innerHTML += spell.components.join( ', ' );
        if ( spell.material ) {
            componentsElm.innerHTML += ' (' + spell.material + ')';
        }
        detailElm.appendChild( componentsElm );

        // spell.desc is a list of strings that represent paragraphs
        // note: the spell "confusion" is an interesting test case here...
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
