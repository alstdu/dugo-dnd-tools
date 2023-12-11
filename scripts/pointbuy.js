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
//      these states will trigger as the point count goes up

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
        'under-budget': {
            gradients: [
                ['#16697a', '#489fb5'],
                ['#489fb5', '#82c0cc'],
                ['#82c0cc', '#ede7e3'],
                ['#ede7e3', '#ffa62b'],
                ['#ffa62b', '#16697a'],
            ],
            transitionSpeed: 3000,
        },
        'on-budget': {
            gradients: [
                ['#52b69a', '#99d98c'],
                ['#99d98c', '#b5e48c'],
                ['#b5e48c', '#2b9348'],
            ],
            transitionSpeed: 3000,
        },
        'over-budget': {
            gradients: [
                ['#f7b267', '#f27059'],
                ['#f27059', '#a11d33'],
                ['#a11d33', '#f7b267'],
            ],
            transitionSpeed: 3000,
        },
    },
} );


// we are going to make the whole table in js to facilitate interactivity
const pointTable = document.querySelector( '#point-table' );

// make an array with all of the abilities for easier access
const ablities = [
    'Strength',
    'Dexterity',
    'Constitution',
    'Intelligence',
    'Wisdom',
    'Charisma',
];

// for each ability...
ablities.forEach( ( ability ) => {
    // create a new row for the ability
    const tr = document.createElement( 'tr' );
    pointTable.appendChild( tr );

    // add a title for the row
    const th = document.createElement( 'th' );
    tr.appendChild( th );
    th.innerText = ability;

    // ////////////  //
    // ABILITY SCORE //
    const scoreTd = document.createElement( 'td' );
    tr.appendChild( scoreTd );

    const scoreMinusBtn = document.createElement( 'button' );
    scoreTd.appendChild( scoreMinusBtn );
    scoreMinusBtn.innerText = '-';
    // score starts at 8 which is our minimum value, so disable button
    scoreMinusBtn.disabled = true;
    scoreMinusBtn.classList.add( 'disable-me-on-reset' );
    scoreMinusBtn.classList.add( 'table-button' );

    const scoreSpan = document.createElement( 'span' );
    scoreTd.appendChild( scoreSpan );
    scoreSpan.innerText = 8;
    scoreSpan.classList.add( 'score' );

    const scorePlusBtn = document.createElement( 'button' );
    scoreTd.appendChild( scorePlusBtn );
    scorePlusBtn.innerText = '+';
    scorePlusBtn.classList.add( 'enable-me-on-reset' );
    scorePlusBtn.classList.add( 'table-button' );

    scoreMinusBtn.addEventListener( 'click', () => {
        const currentValue = +scoreSpan.innerText; // + forces it to be a number
        scoreSpan.innerText = currentValue - 1;
        // we want all these values to update when we update the ability score
        updateTotal();
        updateModifier();
        updatePointCost(); // point costs get updated when ability scores change, but not racial
        updateTotalCost(); // because we just changed a point cost, update the total
        // if we just subtracted from the score, we must be allowed to add
        // this could be redundant if it's already enabled, but it's faster than checking
        scorePlusBtn.disabled = false;
        // enforce a minimum value of 8
        //    if our currentValue is 8, then disable the minus button
        if ( currentValue - 1 <= 8 ) {
            scoreMinusBtn.disabled = true;
        }
    } );

    scorePlusBtn.addEventListener( 'click', () => {
        const currentValue = +scoreSpan.innerText; // + forces it to be a number
        // enforce a maximum value by disabling the button
        scoreSpan.innerText = currentValue + 1;
        // we want to update all these values again if we subtract
        updateTotal();
        updateModifier();
        updatePointCost(); // point costs get updated when ability scores change, but not racial
        updateTotalCost(); // because we just changed a point cost, update the total
        // if we just added to the score, we must be allowed to subtract from it
        // this could be redundant if it's already enabled, but it's faster than checking
        scoreMinusBtn.disabled = false;
        // 15 is the maximum
        if ( currentValue + 1 >= 15 ) {
            scorePlusBtn.disabled = true;
        }
    } );
    // ABILITY SCORE //
    // ////////////  //

    // We visually want to see ability score + racial bonus = total
    // So we are adding a "+" button here in a td.
    const plusHolderTd = document.createElement( 'td' );
    tr.appendChild( plusHolderTd );
    plusHolderTd.innerText = '+';
    // //////////////////////////////////////////////////////// //

    // ///////////  //
    // RACIAL BONUS //
    const racialTd = document.createElement( 'td' );
    tr.appendChild( racialTd );

    const racialMinusBtn = document.createElement( 'button' );
    racialTd.appendChild( racialMinusBtn );
    racialMinusBtn.innerText = '-';
    // we start at 0 so disable the button
    racialMinusBtn.disabled = true;
    racialMinusBtn.classList.add( 'disable-me-on-reset' );
    racialMinusBtn.classList.add( 'table-button' );

    const racialSpan = document.createElement( 'span' );
    racialTd.appendChild( racialSpan );
    racialSpan.innerText = 0;
    racialSpan.classList.add( 'racial' );

    const racialPlusBtn = document.createElement( 'button' );
    racialTd.appendChild( racialPlusBtn );
    racialPlusBtn.innerText = '+';
    racialPlusBtn.classList.add( 'enable-me-on-reset' );
    racialPlusBtn.classList.add( 'table-button' );

    // the interactions for the racial buttons are almost identical to the ability score buttons
    // they don't affect point cost totals though, so they can be a bit simpler
    // they also have different minimum and maximum values
    racialMinusBtn.addEventListener( 'click', () => {
        const currentValue = +racialSpan.innerText; // + forces it to be a number
        racialSpan.innerText = currentValue - 1;
        updateTotal();
        updateModifier();
        racialPlusBtn.disabled = false;
        // enforce a minimum value by disabling the button
        if ( currentValue - 1 == 0 ) {
            racialMinusBtn.disabled = true;
        }
    } );

    racialPlusBtn.addEventListener( 'click', () => {
        const currentValue = +racialSpan.innerText; // + forces it to be a number
        racialSpan.innerText = currentValue + 1;
        updateTotal();
        updateModifier();
        racialMinusBtn.disabled = false;
        // enforce a maximum value by disabling the button
        if ( currentValue + 1 >= 2 ) {
            racialPlusBtn.disabled = true;
        }
    } );
    // RACIAL BONUS //
    // ///////////  //

    // same as the plus holder above, we are just using this to visually show an "="
    const equalsHolderTd = document.createElement( 'td' );
    tr.appendChild( equalsHolderTd );
    equalsHolderTd.innerText = '=';
    // /////////  //

    // the total, modifier, and cost will be given default values here and then updated automatically
    const totalTd = document.createElement( 'td' );
    tr.appendChild( totalTd );
    const totalSpan = document.createElement( 'span' );
    totalTd.appendChild( totalSpan );
    totalSpan.innerText = 8;
    totalSpan.classList.add( 'total' );

    const modifierTd = document.createElement( 'td' );
    tr.appendChild( modifierTd );
    const modifierSpan = document.createElement( 'span' );
    modifierTd.appendChild( modifierSpan );
    modifierSpan.innerText = -1;
    modifierSpan.classList.add( 'modifier' );

    const pointCostTd = document.createElement( 'td' );
    tr.appendChild( pointCostTd );
    const pointCostSpan = document.createElement( 'span' );
    pointCostTd.appendChild( pointCostSpan );
    pointCostSpan.innerText = 0;
    pointCostSpan.classList.add( 'point-cost' ); // for referencing when totalling

    // //////////////// //
    // UPDATE FUNCTIONS //
    const updateTotal = () => {
        totalSpan.innerText = getTotal();
    };

    const getTotal = () => {
        const as = parseInt( scoreSpan.innerText );
        const rm = parseInt( racialSpan.innerText );
        return as + rm;
    };

    const updateModifier = () => {
        modifierSpan.innerText = getModifier();
    };

    const getModifier = () => {
        const t = parseInt( totalSpan.innerText );
        return Math.floor( ( t - 10 ) / 2 );
    };

    const updatePointCost = () => {
        pointCostSpan.innerText = getPointCost();
    };

    const getPointCost = () => {
        const as = parseInt( scoreSpan.innerText );
        switch ( as ) {
        case 15:
            return 9;
        case 14:
            return 7;
        default:
            return as - 8;
        }
    };
    // UPDATE FUNCTIONS //
    // //////////////// //
} );

const tr = document.createElement( 'tr' );
pointTable.appendChild( tr );

tr.appendChild( document.createElement( 'td' ) );

const resetBtn = document.createElement( 'button' );
tr.appendChild( resetBtn );
resetBtn.innerText = 'Reset';
resetBtn.classList.add( 'table-button' );

resetBtn.addEventListener( 'click', () => {
    // we could have added these elements to various arrays to keep track of them,
    // but we can use classes to make the DOM keep track of them for us.
    // we can call it space efficiency and not laziness :) though performance isn't much of a concern here
    document.querySelectorAll( '.score' ).forEach( ( e ) => e.innerText = '8' );
    document.querySelectorAll( '.racial' ).forEach( ( e ) => e.innerText = '0' );
    document.querySelectorAll( '.total' ).forEach( ( e ) => e.innerText = '8' );
    document.querySelectorAll( '.modifier' ).forEach( ( e ) => e.innerText = '0' );
    document.querySelectorAll( '.point-cost' ).forEach( ( e ) => e.innerText = '0' );
    document.querySelectorAll( '.disable-me-on-reset' ).forEach( ( e ) => e.disabled = true );
    document.querySelectorAll( '.enable-me-on-reset' ).forEach( ( e ) => e.disabled = false );
    updateTotalCost();
} );

// TODO: use colspan instead of this monstrosity
tr.appendChild( document.createElement( 'td' ) );
tr.appendChild( document.createElement( 'td' ) );
tr.appendChild( document.createElement( 'td' ) );
tr.appendChild( document.createElement( 'td' ) );

const totalCostTitleTd = document.createElement( 'td' );
tr.appendChild( totalCostTitleTd );
const totalCostTitleSpan = document.createElement( 'span' );
totalCostTitleTd.appendChild( totalCostTitleSpan );
totalCostTitleSpan.innerText = 'Total Points:';

const totalCostTd = document.createElement( 'td' );
tr.appendChild( totalCostTd );
// use two separate spans so that it is easier to edit and read the number
// if we had made it '0/27' as a single span that would have been a nightmare to parse every time
const totalCostSpan = document.createElement( 'span' );
totalCostTd.appendChild( totalCostSpan );
totalCostSpan.innerText = '0';
const totalCostOutOfSpan = document.createElement( 'span' );
totalCostTd.appendChild( totalCostOutOfSpan );
totalCostOutOfSpan.innerText = '/27';

const updateTotalCost = () => {
    const totalCost = getTotalCost();
    totalCostSpan.innerText = totalCost;
    // when total cost is a certain number, then change colors
    if ( totalCost <= 0 ) {
        granimInstance.changeState( 'default-state' );
    } else if ( totalCost < 27 ) {
        granimInstance.changeState( 'under-budget' );
    } else if ( totalCost == 27 ) {
        granimInstance.changeState( 'on-budget' );
    } else if ( totalCost > 27 ) {
        granimInstance.changeState( 'over-budget' );
    }
};

const getTotalCost = () => {
    let total = 0;
    document.querySelectorAll( '.point-cost' ).forEach( ( e ) => total += parseInt( e.innerText ) );
    return total;
};
