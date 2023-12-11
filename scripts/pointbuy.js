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

// for each ability...
//    do a lot of things
ablities.forEach( ( ability ) => {
    const tr = document.createElement( 'tr' );
    pointTable.appendChild( tr );

    const th = document.createElement( 'th' );
    tr.appendChild( th );
    th.innerText = ability;

    // ////// //
    // Score  //
    const scoreTd = document.createElement( 'td' );
    tr.appendChild( scoreTd );

    const scoreMinusBtn = document.createElement( 'button' );
    scoreTd.appendChild( scoreMinusBtn );
    scoreMinusBtn.innerText = '-';
    // score starts at 8 which is our minimum value, so disable button
    scoreMinusBtn.disabled = true;
    scoreMinusBtn.classList.add( 'disable-me-on-reset' );

    const scoreSpan = document.createElement( 'span' );
    scoreTd.appendChild( scoreSpan );
    scoreSpan.innerText = 8;
    scoreSpan.classList.add( 'score' );

    const scorePlusBtn = document.createElement( 'button' );
    scoreTd.appendChild( scorePlusBtn );
    scorePlusBtn.innerText = '+';
    scorePlusBtn.classList.add( 'enable-me-on-reset' );

    scoreMinusBtn.addEventListener( 'click', () => {
        const currentValue = +scoreSpan.innerText; // + forces it to be a number
        scoreSpan.innerText = currentValue - 1;
        // we want all these values to update when we update the ability score
        updateTotal();
        updateModifier();
        updatePointCost();
        updateTotalCost();
        // if you subtract from the max value, button becomes enabled again
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
        updatePointCost();
        updateTotalCost();
        // if we add to the score from the minimum 8, then enable the minus button
        scoreMinusBtn.disabled = false;
        // 15 is the maximum
        if ( currentValue + 1 >= 15 ) {
            scorePlusBtn.disabled = true;
        }
    } );
    // END Score //
    // ////////  //

    const plusHolderTd = document.createElement( 'td' );
    tr.appendChild( plusHolderTd );
    plusHolderTd.innerText = '+';

    // /////// //
    // Racial  //
    const racialTd = document.createElement( 'td' );
    tr.appendChild( racialTd );

    const racialMinusBtn = document.createElement( 'button' );
    racialTd.appendChild( racialMinusBtn );
    racialMinusBtn.innerText = '-';

    const racialSpan = document.createElement( 'span' );
    racialTd.appendChild( racialSpan );
    racialSpan.innerText = 0;
    racialSpan.classList.add( 'racial' );
    // we start at 0 so disable the button
    racialMinusBtn.disabled = true;
    racialMinusBtn.classList.add( 'disable-me-on-reset' );

    const racialPlusBtn = document.createElement( 'button' );
    racialTd.appendChild( racialPlusBtn );
    racialPlusBtn.innerText = '+';
    racialPlusBtn.classList.add( 'enable-me-on-reset' );

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
        // enforce a maximum value by disabling the button and retuning so we don't increment
        if ( currentValue + 1 >= 2 ) {
            racialPlusBtn.disabled = true;
        }
    } );
    // END Racial //
    // /////////  //

    const equalsHolderTd = document.createElement( 'td' );
    tr.appendChild( equalsHolderTd );
    equalsHolderTd.innerText = '=';

    // /////////  //

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
} );

const tr = document.createElement( 'tr' );
pointTable.appendChild( tr );

tr.appendChild( document.createElement( 'td' ) );

const resetBtn = document.createElement( 'button' );
tr.appendChild( resetBtn );
resetBtn.innerText = 'Reset';

resetBtn.addEventListener( 'click', () => {
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
const totalCostSpan = document.createElement( 'span' );
totalCostTd.appendChild( totalCostSpan );
totalCostSpan.innerText = '0';
const totalCostOutOfSpan = document.createElement( 'span' );
totalCostTd.appendChild( totalCostOutOfSpan );
totalCostOutOfSpan.innerText = '/27';

const updateTotalCost = () => {
    totalCostSpan.innerText = getTotalCost();
};
// TODOL: make the points cap out at 27 by disabling the buttons
const getTotalCost = () => {
    let total = 0;
    document.querySelectorAll( '.point-cost' ).forEach( ( e ) => total += parseInt( e.innerText ) );
    return total;
};
