import DiceBox from '@3d-dice/dice-box';

const diceBox = new DiceBox( '#dice-box', {
    assetPath: '/public/assets/',
    scale: 8,
} );

const diceBoxInit = diceBox.init();

// document.querySelector( '#roll-button' ).addEventListener( 'click', diceBox.roll );
// document.querySelector( '#roll-button' ).addEventListener( 'click', diceBox.roll( {
//     qty: 1, // optional - the number of dice to be rolled. Defaults to 1
//     sides: 20, // the type of die to be rolled. Either a number such as 20
//     themeColor: '#ffffff', // optional - HEX value for the theme's material color
// } ) );
document.querySelector( '.d20-roll-button' )?.addEventListener( 'click', async () => {
    await diceBoxInit;
    const result = await diceBox.roll( {
        qty: 1, // optional - the number of dice to be rolled. Defaults to 1
        sides: 20, // the type of die to be rolled. Either a number such as 20
        themeColor: '#ffffff', // optional - HEX value for the theme's material color
    } );
    console.log( result );
} );

document.querySelector( '.d10-roll-button' )?.addEventListener( 'click', async () => {
    await diceBoxInit;
    const result = await diceBox.roll( {
        qty: 1, // optional - the number of dice to be rolled. Defaults to 1
        sides: 10, // the type of die to be rolled. Either a number such as 20
        themeColor: '#ffdfdd', // optional - HEX value for the theme's material color
    } );
    console.log( result );
} );

document.querySelector( '.d8-roll-button' )?.addEventListener( 'click', async () => {
    await diceBoxInit;
    const result = await diceBox.roll( {
        qty: 1, // optional - the number of dice to be rolled. Defaults to 1
        sides: 8, // the type of die to be rolled. Either a number such as 20
        themeColor: '#424242', // optional - HEX value for the theme's material color
    } );
    console.log( result );
} );

document.querySelector( '.d6-roll-button' )?.addEventListener( 'click', async () => {
    await diceBoxInit;
    const result = await diceBox.roll( {
        qty: 1, // optional - the number of dice to be rolled. Defaults to 1
        sides: 6, // the type of die to be rolled. Either a number such as 20
        themeColor: '#62C3F1', // optional - HEX value for the theme's material color
    } );
    console.log( result );
} );

document.querySelector( '.d4-roll-button' )?.addEventListener( 'click', async () => {
    await diceBoxInit;
    const result = await diceBox.roll( {
        qty: 1, // optional - the number of dice to be rolled. Defaults to 1
        sides: 4, // the type of die to be rolled. Either a number such as 20
        themeColor: '#62C322', // optional - HEX value for the theme's material color
    } );
    setDiceResult( result[0].value );
} );

const setDiceResult = ( diceResult ) => {
    document.querySelector( '.display-dice-result' ).innerHTML = diceResult;
};

// set up the canvas and states for the gradients
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
    },
} );
