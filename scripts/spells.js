// set up the canvas and states for the gradients
//      these states will trigger as the point count goes up

// The MIT License (MIT)

// Copyright (c) [2018-2020] [Adrian Padua, Christopher Ward]

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const API_BASE = 'https://www.dnd5eapi.co';
const DEBUG = false; // TODO: set to false before submit
const DEBUG_AMOUNT = 5;

const SPELLS_PER_PAGE = 20;
let currentPage = 0;
let cachedSpells = new Map();

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

// use the global variable OverlayScrollbarsGlobal to access the api
// similar to how you can do it in node modules
//     (this is straight from the documentation)

// The MIT License (MIT)

// Copyright (c) 2022 Rene Haas

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const {
    OverlayScrollbars,
    ScrollbarsHidingPlugin,
    SizeObserverPlugin,
    ClickScrollPlugin,
} = OverlayScrollbarsGlobal;

// set up overlay scrollbar
// eslint-disable-next-line new-cap
OverlayScrollbars( document.querySelector( '.scrollable-main-container' ), {} );

// set up the canvas and states for the gradients
//      these states will trigger on hover and focus depending on the school

// The MIT License (MIT)

// Copyright (c) 2016 Benjamin Blonde

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const granimInstance = new Granim( {
    element: '#granim-background',
    name: 'granim-background',
    elToSetClassOn: 'body',
    direction: 'diagonal',
    isPausedWhenNotInView: true,
    stateTransitionSpeed: 500,
    states: {
        'default-state': {
            gradients: [
                ['#333333', '#888888'],
            ],
            transitionSpeed: 0,
        },
        'abjuration': {
            gradients: [
                ['#A9E4FC', '#77C1F4'],
                ['#9CB9E1', '#C0D1F2'],
                ['#C0D1F2', '#b3b7ee'],
            ],
            transitionSpeed: 4000,
        },
        'conjuration': {
            gradients: [
                ['#FAF894', '#E67F30'],
                ['#fbf8cc', '#F8A83B'],
                ['#ef6351', '#f9dc5c'],
            ],
            transitionSpeed: 4000,
        },
        'divination': {
            gradients: [
                ['#BDE0F5', '#EBF5FB'],
                ['#cfbaf0', '#7c98b3'],
                ['#AEBFC9', '#A5CDE3'],
            ],
            transitionSpeed: 4000,
        },
        'enchantment': {
            gradients: [
                ['#c77dff', '#F99BDF'],
                ['#E693D4', '#D175C2'],
                ['#C27CBE', '#ffd6ff'],
            ],
            transitionSpeed: 4000,
        },
        'evocation': {
            gradients: [
                ['#CAA19D', '#B56459'],
                ['#bc8034', '#ED593C'],
                ['#5C2F28', '#f63e02'],
            ],
            transitionSpeed: 4000,
        },
        'illusion': {
            gradients: [
                ['#EBD8FF', '#CFB0FC'],
                ['#D7B2FE', '#B88DFB'],
                ['#B88DFB', '#EBD8FF'],
            ],
            transitionSpeed: 4000,
        },
        'necromancy': {
            gradients: [
                ['#DDF19D', '#AFF07B'],
                ['#B5F499', '#7B920A'],
                ['#46494c', '#9ef01a'],
            ],
            transitionSpeed: 4000,
        },
        'transmutation': {
            gradients: [
                ['#B8874E', '#DB9453'],
                ['#F9AD71', '#B8874E'],
                ['#DB9453', '#F9AD71'],
            ],
            transitionSpeed: 4000,
        },
    },
} );

( async () => {
    let spellsList = await getSpellsList();

    // get a random set of spells for testing
    // we don't want to overload the api with requests
    //      and we don't want to wait for them all to load yet
    if ( DEBUG ) {
        const seed = Math.random();
        const len = DEBUG_AMOUNT;
        const offset = Math.floor( seed * ( spellsList.length - len ) );
        spellsList = spellsList.slice( offset, len + offset );
    }

    // set up configuration for list.js
    // TODOL: create custom sort function for range. it sorts alphabetical right now

    // The MIT License (MIT)

    // Copyright (c) 2011-2018 Jonny Strömberg, jonnystromberg.com

    // Permission is hereby granted, free of charge, to any person obtaining a copy
    // of this software and associated documentation files (the "Software"), to deal
    // in the Software without restriction, including without limitation the rights
    // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    // copies of the Software, and to permit persons to whom the Software is
    // furnished to do so, subject to the following conditions:

    // The above copyright notice and this permission notice shall be included in all
    // copies or substantial portions of the Software.

    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    // SOFTWARE.

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
        searchDelay: 250, // debounce to help performance with large list
    };
    
    const spellsTable = new List( 'listjs-container', options, [] );

    // Add this new function to handle search
    const handleSearch = async (searchTerm) => {
        // Clear existing items
        spellsTable.clear();
        
        // Remove load more button during search
        const loadMore = document.querySelector('#load-more');
        if (loadMore) loadMore.remove();

        if (!searchTerm) {
            // If search is cleared, reset to initial state
            currentPage = 0;
            await loadSpellsBatch(0);
            return;
        }

        // Filter spells list based on search term
        const filteredSpells = spellsList.filter(spell => 
            spell.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Load all matching spells
        await Promise.all(filteredSpells.map(async (spellSummary) => {
            if (!cachedSpells.has(spellSummary.index)) {
                const spell = await getSpellFromUrl(spellSummary.url);
                cachedSpells.set(spellSummary.index, spell);
            }

            const spell = cachedSpells.get(spellSummary.index);
            const formattedSpell = {
                'spell-item-name': spell.name,
                'spell-item-level': spell.level > 0 ? spell.level : 'Cantrip',
                'spell-item-time': spell.casting_time,
                'spell-item-school': spell.school.name,
                'spell-item-concentration': spell.concentration ? 'C' : '-',
                'spell-item-range': spell.range,
            };

            // double destructuring ooo fancy
            // get the "elm" property from the first object in array
            const [{elm}] = spellsTable.add( formattedSpell );

            // add an extra td for the button that will allow TAB to be used
            // to expand the rows
            const expandCell = document.createElement( 'td' );
            elm.insertBefore( expandCell, elm.firstChild );
            // add a button inside of the new td we created
            const expandButton = document.createElement( 'button' );
            expandButton.innerText = '+';
            expandButton.className = 'expand-button';
            expandCell.appendChild( expandButton );

            // TODO: evaluate if the following tabIndex logic is actually a good idea
            elm.tabIndex = 0;
            // TODO: can we set this to -1 if we let enter/space expand the row while tabbed?
            expandButton.tabIndex = 0;

            // configure detail
            const detailElm = document.createElement( 'td' );
            detailElm.style.display = 'none';
            detailElm.style.flexBasis = '100%';
            detailElm.style.minHeight = '300px';
            detailElm.classList.add( 'spell-item-detail' );

            console.log( spell );

            // append inner stuff to detail
            const levelElm = document.createElement( 'p' );
            const levelSpanElm = document.createElement( 'span' );
            levelSpanElm.style.fontWeight = 'bold';
            levelSpanElm.innerText = 'Level: ';
            levelElm.appendChild( levelSpanElm );
            // if level is greater than 0, display the level. Else cantrip
            levelElm.innerHTML += spell.level > 0 ? spell.level : 'Cantrip';
            detailElm.appendChild( levelElm );

            const timeElm = document.createElement( 'p' );
            const timeSpanElm = document.createElement( 'span' );
            timeSpanElm.style.fontWeight = 'bold';
            timeSpanElm.innerText = 'Casting Time: ';
            timeElm.appendChild( timeSpanElm );
            timeElm.innerHTML += spell.casting_time;
            detailElm.appendChild( timeElm );

            const schoolElm = document.createElement( 'p' );
            const schoolSpanElm = document.createElement( 'span' );
            schoolSpanElm.style.fontWeight = 'bold';
            schoolSpanElm.innerText = 'School: ';
            schoolElm.appendChild( schoolSpanElm );
            schoolElm.innerHTML += spell.school.name;
            detailElm.appendChild( schoolElm );

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

            const rangeElm = document.createElement( 'p' );
            const rangeTitleSpan = document.createElement( 'span' );
            rangeTitleSpan.innerText = 'Range: ';
            rangeElm.appendChild( rangeTitleSpan );
            rangeTitleSpan.style.fontWeight = 'bold';
            rangeElm.innerHTML += spell.range;
            detailElm.appendChild( rangeElm );

            const concentrationElm = document.createElement( 'p' );
            const concentrationSpan = document.createElement( 'span' );
            concentrationSpan.innerText = 'Concentration: ';
            concentrationElm.appendChild( concentrationSpan );
            concentrationSpan.style.fontWeight = 'bold';
            concentrationElm.innerHTML += spell.concentration;
            detailElm.appendChild( concentrationElm );

            const componentsElm = document.createElement( 'p' );
            const componentsSpanElm = document.createElement( 'span' );
            componentsSpanElm.style.fontWeight = 'bold';
            componentsSpanElm.innerText = 'Components: ';
            componentsElm.appendChild( componentsSpanElm );
            // using join to add the comma and space to each item in the list
            componentsElm.innerHTML += spell.components.join( ', ' );
            // if the spell uses a material, then we will display the material text
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

            // if the spell has higher_level, it will display. else it won't show up
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

            const setBg = () => granimInstance.changeState( spell.school.index );
            const unsetBg = ( e ) => {
                // TODO: use e.target to keep bg if we have a row open
                granimInstance.changeState( 'default-state' );
            };
            // add highlight on both mouseover and focus
            //     adding on focus makes the effect work with tabIndex
            elm.addEventListener( 'mouseover', setBg );
            elm.addEventListener( 'focus', setBg );
            expandButton.addEventListener( 'focus', setBg );
            // remove highlight when mouseout and on blur
            //     which is apparently when it's not in focus
            //     which makes sense I guess but... why not focus lost ?
            elm.addEventListener( 'mouseout', unsetBg );
            elm.addEventListener( 'blur', unsetBg );
            expandButton.addEventListener( 'blur', unsetBg );
        }));
    };

    // Add this after spellsTable initialization
    const searchField = document.querySelector('.search');
    let searchTimeout;
    searchField.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            handleSearch(e.target.value);
        }, options.searchDelay);
    });

    const loadSpellsBatch = async (startIndex) => {
        const endIndex = startIndex + SPELLS_PER_PAGE;
        const batchSpells = spellsList.slice(startIndex, endIndex);
        
        await Promise.all(batchSpells.map(async (spellSummary) => {
            if (!cachedSpells.has(spellSummary.index)) {
                const spell = await getSpellFromUrl(spellSummary.url);
                cachedSpells.set(spellSummary.index, spell);
            }

            const spell = cachedSpells.get(spellSummary.index);
            const formattedSpell = {
                'spell-item-name': spell.name,
                'spell-item-level': spell.level > 0 ? spell.level : 'Cantrip',
                'spell-item-time': spell.casting_time,
                'spell-item-school': spell.school.name,
                'spell-item-concentration': spell.concentration ? 'C' : '-',
                'spell-item-range': spell.range,
            };

            // double destructuring ooo fancy
            // get the "elm" property from the first object in array
            const [{elm}] = spellsTable.add( formattedSpell );

            // add an extra td for the button that will allow TAB to be used
            // to expand the rows
            const expandCell = document.createElement( 'td' );
            elm.insertBefore( expandCell, elm.firstChild );
            // add a button inside of the new td we created
            const expandButton = document.createElement( 'button' );
            expandButton.innerText = '+';
            expandButton.className = 'expand-button';
            expandCell.appendChild( expandButton );

            // TODO: evaluate if the following tabIndex logic is actually a good idea
            elm.tabIndex = 0;
            // TODO: can we set this to -1 if we let enter/space expand the row while tabbed?
            expandButton.tabIndex = 0;

            // configure detail
            const detailElm = document.createElement( 'td' );
            detailElm.style.display = 'none';
            detailElm.style.flexBasis = '100%';
            detailElm.style.minHeight = '300px';
            detailElm.classList.add( 'spell-item-detail' );

            console.log( spell );

            // append inner stuff to detail
            const levelElm = document.createElement( 'p' );
            const levelSpanElm = document.createElement( 'span' );
            levelSpanElm.style.fontWeight = 'bold';
            levelSpanElm.innerText = 'Level: ';
            levelElm.appendChild( levelSpanElm );
            // if level is greater than 0, display the level. Else cantrip
            levelElm.innerHTML += spell.level > 0 ? spell.level : 'Cantrip';
            detailElm.appendChild( levelElm );

            const timeElm = document.createElement( 'p' );
            const timeSpanElm = document.createElement( 'span' );
            timeSpanElm.style.fontWeight = 'bold';
            timeSpanElm.innerText = 'Casting Time: ';
            timeElm.appendChild( timeSpanElm );
            timeElm.innerHTML += spell.casting_time;
            detailElm.appendChild( timeElm );

            const schoolElm = document.createElement( 'p' );
            const schoolSpanElm = document.createElement( 'span' );
            schoolSpanElm.style.fontWeight = 'bold';
            schoolSpanElm.innerText = 'School: ';
            schoolElm.appendChild( schoolSpanElm );
            schoolElm.innerHTML += spell.school.name;
            detailElm.appendChild( schoolElm );

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

            const rangeElm = document.createElement( 'p' );
            const rangeTitleSpan = document.createElement( 'span' );
            rangeTitleSpan.innerText = 'Range: ';
            rangeElm.appendChild( rangeTitleSpan );
            rangeTitleSpan.style.fontWeight = 'bold';
            rangeElm.innerHTML += spell.range;
            detailElm.appendChild( rangeElm );

            const concentrationElm = document.createElement( 'p' );
            const concentrationSpan = document.createElement( 'span' );
            concentrationSpan.innerText = 'Concentration: ';
            concentrationElm.appendChild( concentrationSpan );
            concentrationSpan.style.fontWeight = 'bold';
            concentrationElm.innerHTML += spell.concentration;
            detailElm.appendChild( concentrationElm );

            const componentsElm = document.createElement( 'p' );
            const componentsSpanElm = document.createElement( 'span' );
            componentsSpanElm.style.fontWeight = 'bold';
            componentsSpanElm.innerText = 'Components: ';
            componentsElm.appendChild( componentsSpanElm );
            // using join to add the comma and space to each item in the list
            componentsElm.innerHTML += spell.components.join( ', ' );
            // if the spell uses a material, then we will display the material text
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

            // if the spell has higher_level, it will display. else it won't show up
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

            const setBg = () => granimInstance.changeState( spell.school.index );
            const unsetBg = ( e ) => {
                // TODO: use e.target to keep bg if we have a row open
                granimInstance.changeState( 'default-state' );
            };
            // add highlight on both mouseover and focus
            //     adding on focus makes the effect work with tabIndex
            elm.addEventListener( 'mouseover', setBg );
            elm.addEventListener( 'focus', setBg );
            expandButton.addEventListener( 'focus', setBg );
            // remove highlight when mouseout and on blur
            elm.addEventListener( 'mouseout', unsetBg );
            elm.addEventListener( 'blur', unsetBg );
            expandButton.addEventListener( 'blur', unsetBg );
        }));

        // Add Load More button if needed
        if (endIndex < spellsList.length && !document.querySelector('#load-more')) {
            const loadMoreButton = document.createElement('button');
            loadMoreButton.id = 'load-more';
            loadMoreButton.innerText = 'Load More Spells';
            loadMoreButton.addEventListener('click', () => {
                currentPage++;
                loadSpellsBatch(currentPage * SPELLS_PER_PAGE);
            });
            document.querySelector('.table-wrapper').appendChild(loadMoreButton);
        } else if (endIndex >= spellsList.length) {
            const loadMore = document.querySelector('#load-more');
            if (loadMore) loadMore.remove();
        }
    };

    // Load initial batch
    await loadSpellsBatch(0);

    document.querySelector('.preload').classList.remove('preload');
    const overlay = document.querySelector('#loading-overlay');
    overlay.style.opacity = '0%';
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 1000);
})();
