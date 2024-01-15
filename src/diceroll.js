
// The MIT License (MIT)

// Copyright (c) 2021 3Ddice

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

// import dice plugin and initialize
import DiceBox from '@3d-dice/dice-box';

const diceBox = new DiceBox( '#dice-box', {
    assetPath: '/public/assets/',
    scale: 8, // how big the dice are
} );

const diceBoxInit = diceBox.init();

const diceControls = document.querySelectorAll( '.dice-controls-container' );
console.log( diceControls );

diceControls.forEach( ( diceControl ) => {
    const p = diceControl.querySelector( '.dice-counter' );

    const addDice = diceControl.querySelector( '.add-dice' );
    addDice.addEventListener( 'click', () => {
        let pText = parseInt( p.innerText );
        p.innerHTML = ++pText;
        removeDice.disabled = false;
    } );

    const removeDice = diceControl.querySelector( '.remove-dice' );
    removeDice.addEventListener( 'click', () => {
        let pText = parseInt( p.innerText );
        p.innerHTML = --pText;
        if ( p.innerHTML - 1 <= 0 ) {
            removeDice.disabled = true;
        };
    } );

    const rollDice = diceControl.querySelector( '.roll-button' );
    rollDice.addEventListener( 'click', async () => {
        const currentDiceCount = p.innerHTML;
        const sides = parseInt( rollDice.dataset.sides );
        const color = rollDice.dataset.color;
        await diceBoxInit;
        const result = await diceBox.roll( {
            qty: currentDiceCount,
            sides: sides,
            themeColor: color,
        } );
        setDiceResult( result.reduce( ( sum, val ) => sum += val.value, 0 ) );
    } );
} );

// set whatever our dice result value from each roll was to the innerText of the div
const setDiceResult = ( diceResult ) => {
    document.querySelector( '.display-dice-result' ).innerHTML = diceResult;
};

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
    },
} );
