// use the global variable OverlayScrollbarsGlobal to access the api
// similar to how you can do it in node modules
//     (this is straight from the documentation)
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
        'up-to-6': {
            gradients: [
                ['#A9E4FC', '#77C1F4'],
                ['#9CB9E1', '#C0D1F2'],
                ['#C0D1F2', '#b3b7ee'],
            ],
            transitionSpeed: 3000,
        },
        'up-to-13': {
            gradients: [
                ['#FAF894', '#E67F30'],
                ['#fbf8cc', '#F8A83B'],
                ['#ef6351', '#f9dc5c'],
            ],
            transitionSpeed: 3000,
        },
        'up-to-20': {
            gradients: [
                ['#BDE0F5', '#EBF5FB'],
                ['#cfbaf0', '#7c98b3'],
                ['#AEBFC9', '#A5CDE3'],
            ],
            transitionSpeed: 3000,
        },
        'up-to-27': {
            gradients: [
                ['#c77dff', '#F99BDF'],
                ['#E693D4', '#D175C2'],
                ['#C27CBE', '#ffd6ff'],
            ],
            transitionSpeed: 3000,
        },
    },
} );

// pseudo code: when the class "point-total"'s innertext is a certain number, then change colors

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

// For each ability...
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

    // The interactions for the racial buttons are almost identical to the ability score buttons
    // They don't affect point cost totals though, so they can be a bit simpler
    // They also have different minimum and maximum values
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

    // Same as the plus holder above, we are just using this to visually show an "="
    const equalsHolderTd = document.createElement( 'td' );
    tr.appendChild( equalsHolderTd );
    equalsHolderTd.innerText = '=';
    // /////////  //

    // The total, modifier, and cost will be given default values here and then updated automatically
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
    // We could have added these elements to various arrays to keep track of them,
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
    totalCostSpan.innerText = getTotalCost();
};
// TODO: make the points cap out at 27 by disabling the buttons
//    but decide if you even want this
const getTotalCost = () => {
    let total = 0;
    document.querySelectorAll( '.point-cost' ).forEach( ( e ) => total += parseInt( e.innerText ) );
    return total;
};
