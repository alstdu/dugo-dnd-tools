import DiceBox from '@3d-dice/dice-box'

console.log(DiceBox);

const diceBox = new DiceBox("#dice-box", {
    assetPath: '/public/assets/' // include the trailing backslash
});

diceBox.init().then(() => {
    diceBox.roll('2d20')
});

// set up the canvas and states for the gradients
const granimInstance = new Granim({
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
});
