import DiceBox from '@3d-dice/dice-box';

console.log( DiceBox );

const diceBox = new DiceBox( '#dice-box', {
    assetPath: '/public/assets/',
    scale: 9,
} );

diceBox.init().then( () => {
    diceBox.roll( {
        qty: 1, // optional - the number of dice to be rolled. Defaults to 1
        sides: 20, // the type of die to be rolled. Either a number such as 20
        themeColor: '#ffffff', // optional - HEX value for the theme's material color
    } );
} );

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
