
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

// document.querySelector( '#roll-button' ).addEventListener( 'click', diceBox.roll );
// document.querySelector( '#roll-button' ).addEventListener( 'click', diceBox.roll( {
//     qty: 1, // optional - the number of dice to be rolled. Defaults to 1
//     sides: 20, // the type of die to be rolled. Either a number such as 20
//     themeColor: '#ffffff', // optional - HEX value for the theme's material color
// } ) );
// TODO: honestly need to understand why this worked a bit more
document.querySelector( '.d20-roll-button' )?.addEventListener( 'click', async () => {
    await diceBoxInit;
    const result = await diceBox.roll( { // .roll returns a promise
        qty: 1, // optional - the number of dice to be rolled. Defaults to 1
        sides: 20, // the type of die to be rolled. Either a number such as 20
        themeColor: '#ffffff', // optional - HEX value for the theme's material color
    } );
    setDiceResult( result[0].value ); // passes the .value of the result array to our innerText function
} );

// and now repeat with the other dice

document.querySelector( '.d10-roll-button' )?.addEventListener( 'click', async () => {
    await diceBoxInit;
    const result = await diceBox.roll( { 
        qty: 1,
        sides: 10,
        themeColor: '#ffdfdd',
    } );
    setDiceResult( result[0].value );
} );

document.querySelector( '.d8-roll-button' )?.addEventListener( 'click', async () => {
    await diceBoxInit;
    const result = await diceBox.roll( {
        qty: 1,
        sides: 8,
        themeColor: '#424242',
    } );
    setDiceResult( result[0].value );
} );

document.querySelector( '.d6-roll-button' )?.addEventListener( 'click', async () => {
    await diceBoxInit;
    const result = await diceBox.roll( {
        qty: 1,
        sides: 6,
        themeColor: '#62C3F1',
    } );
    setDiceResult( result[0].value );
} );

document.querySelector( '.d4-roll-button' )?.addEventListener( 'click', async () => {
    await diceBoxInit;
    const result = await diceBox.roll( {
        qty: 1,
        sides: 4,
        themeColor: '#62C322',
    } );
    setDiceResult( result[0].value );
} );

// set whatever our dice result value from each roll was to the innerText of the div
const setDiceResult = ( diceResult ) => {
    document.querySelector( '.display-dice-result' ).innerHTML = diceResult;
};

// set up the canvas and states for the gradients
// for this one we just want one background state

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
