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

const pointTable = document.querySelector( '#point-table' );

const ablities = [
    'Strength',
    'Dexterity',
    'Constitution',
    'Intelligence',
    'Wisdom',
    'Charisma',
];

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

    const scoreSpan = document.createElement( 'span' );
    scoreTd.appendChild( scoreSpan );
    scoreSpan.innerText = 8;

    const scorePlusBtn = document.createElement( 'button' );
    scoreTd.appendChild( scorePlusBtn );
    scorePlusBtn.innerText = '+';

    scoreMinusBtn.addEventListener( 'click', () => {
        const currentValue = +scoreSpan.innerText; // + forces it to be a number
        // TODO: enforce a minimum value by disabling the button and retuning so we don't decrement
        scoreSpan.innerText = currentValue - 1;
    } );

    scorePlusBtn.addEventListener( 'click', () => {
        const currentValue = +scoreSpan.innerText; // + forces it to be a number
        // TODO: enforce a maximum value by disabling the button and retuning so we don't increment
        scoreSpan.innerText = currentValue + 1;
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

    const racialPlusBtn = document.createElement( 'button' );
    racialTd.appendChild( racialPlusBtn );
    racialPlusBtn.innerText = '+';

    racialMinusBtn.addEventListener( 'click', () => {
        const currentValue = +racialSpan.innerText; // + forces it to be a number
        // TODO: enforce a minimum value by disabling the button and retuning so we don't decrement
        racialSpan.innerText = currentValue - 1;
    } );

    racialPlusBtn.addEventListener( 'click', () => {
        const currentValue = +racialSpan.innerText; // + forces it to be a number
        // TODO: enforce a maximum value by disabling the button and retuning so we don't increment
        racialSpan.innerText = currentValue + 1;
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

    const modifierTd = document.createElement( 'td' );
    tr.appendChild( modifierTd );
    const modifierSpan = document.createElement( 'span' );
    modifierTd.appendChild( modifierSpan );
    modifierSpan.innerText = -1;

    const pointCostTd = document.createElement( 'td' );
    tr.appendChild( pointCostTd );
    const pointCostSpan = document.createElement( 'span' );
    pointCostTd.appendChild( pointCostSpan );
    pointCostSpan.innerText = 0;
} );
