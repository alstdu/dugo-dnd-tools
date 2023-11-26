console.log( 'hello world' );

const getSpells = async () => {
    const response = await fetch( 'https://www.dnd5eapi.co/api/spells' );
    const spells = await response.json();
    return spells;
};

( async () => {
    console.log( await getSpells() );
} )();
