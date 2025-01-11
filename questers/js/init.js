let PAUSED = true;

// Create Illustration
let zDogPlayerCanvas = new Zdog.Illustration({
    element: '.zdog-player',
    dragRotate: true,
    zoom: 1,
    rotate: { z: -Math.PI/2 }, // x: -Math.PI/16 to have a slight tilt
});

let zDogEnemyCanvas = new Zdog.Illustration({
    element: '.zdog-enemy',
    dragRotate: true,
    zoom: 1,
    rotate: { z: -Math.PI/2 },
});

let zDogDungeonCanvas = new Zdog.Illustration({
    element: '.zdog-dungeon',
    zoom: 0.6,
    rotate: { x: Math.PI/4, z: -Math.PI/4 },
});

var time;
var dt;

let enemyGame;
let playerGame;

// Step 1: Create the Game objects
playerGame = new Game($('#player'), zDogPlayerCanvas, null);
enemyGame = new Game($('#enemy'), zDogEnemyCanvas, playerGame);

// Step 2: Update the references
playerGame.setAttacking(enemyGame);

// dungeon
let dungeon = new Dungeon();

// idle
let idle = new Idle();

$(function() {

    // initialisation
    playerGame.addCharacter();
    playerGame.units[0].name = "Player";
    playerGame.units[0].maxHp *= 5;
    playerGame.units[0].hp = playerGame.units[0].maxHp;
    playerGame.units[0].valuables = {};
    //playerGame.units[0].addValuable("devotion", 9);

    enemyGame.addCharacter();
    enemyGame.units[0].name = "Dungeon Door";
    enemyGame.units[0].maxHp = 5;
    enemyGame.units[0].hp = enemyGame.units[0].maxHp;
    enemyGame.units[0].weapons = [];
    enemyGame.units[0].valuables = {};
    
    playerGame.updateWeapons();
    playerGame.updateCharacters();

    enemyGame.updateWeapons();
    enemyGame.updateCharacters();

    dungeon.updateMovement(); // redo movement after water has been added
    idle.updateButtons(); // redo after adding devotion

    // log
    playerGame.log('You enter the dungeon with only a ' + playerGame.units[0].weapons[0].name.toLowerCase() + ' by your side.');
    playerGame.log('Perk: Weapons you loot are +1 rarity.', 'entrance');

    // fight button
    $('.fight').on('click', function() {
        if (PAUSED && playerGame.units[0].hp > 0) PAUSED = false;

        playerGame.timeUntilSwitch -= playerGame.buttonStrength;
    });

    // clicking weapons to sell
    $('#player').on('click', ' .characters .character .weapons .item', function() {
        if (playerGame.units[0].weapons.length <= 1) {
            playerGame.log(`"It's dangerous to go alone..."`);
            playerGame.log(`The vendor refuses to buy your final weapon.`);
            return;
        }

        let fullName = $(this).text();
        playerGame.units[0].removeWeapon(fullName);
        playerGame.units[0].addValuable('gems', 10);
        playerGame.updateCharacters();
        playerGame.updateWeapons();
    });

    // tabmenu buttons
    $('.tabmenu button').on('click', function() {
        let id = $(this).attr('id');
        clickTab(id);
    });

    clickTab(); // init

    function clickTab(id = 'asdfghjkl') {
        $('.page').hide();
        $('#'+id+'.page').show();
    }

    // idle buttons
    $('#idle').on('click', '.plus', function() {
        let id = $(this).parent().parent().attr('id'); // TODO this probably isn't best practice
        idle.addPerson(id, 1);
        playerGame.units[0].addValuable('devotion', -1);

        idle.updateIdle(); // full update
        playerGame.updateCharacters(); // full update
    });

    $('#idle').on('click', '.minus', function() {
        let id = $(this).parent().parent().attr('id'); // TODO this probably isn't best practice
        idle.removePerson(id, 1);
        playerGame.units[0].addValuable('devotion', 1);

        idle.updateIdle(); // full update
        playerGame.updateCharacters(); // full update
    });

    // movement buttons
    $('.topleft button').on('click', function() {
        playerGame.units[0].addValuable('water', -1);
        playerGame.updateCharacters();

        dungeon.moveParty(dungeon.party.x, dungeon.party.y - 1);
    });
    
    $('.topright button').on('click', function() {
        playerGame.units[0].addValuable('water', -1);
        playerGame.updateCharacters();

        dungeon.moveParty(dungeon.party.x + 1, dungeon.party.y);
    });
    
    $('.bottomright button').on('click', function() {
        playerGame.units[0].addValuable('water', -1);
        playerGame.updateCharacters();

        dungeon.moveParty(dungeon.party.x, dungeon.party.y + 1);
    });

    $('.bottomleft button').on('click', function() {
        playerGame.units[0].addValuable('water', -1);
        playerGame.updateCharacters();

        dungeon.moveParty(dungeon.party.x - 1, dungeon.party.y);
    });

    // market buttons
    $('.ware').on('click', function() {
        let id = $(this).attr('id');
        
        switch (id) {
            case 'armament':
                if (playerGame.units[0].hasValuable("gold") < 500) return;
                playerGame.units[0].addWeapon();
                playerGame.units[0].addValuable("gold", -500);
                
                playerGame.updateCharacters();
                playerGame.updateWeapons();
                break;
            case 'lifeblood':
                if (playerGame.units[0].hasValuable("gold") < 100) return;
                playerGame.units[0].addValuable("water", 1);
                playerGame.units[0].addValuable("gold", -100);

                playerGame.updateCharacters();
                break;
            case 'miracle':
                if (playerGame.units[0].hasValuable("gems") < 25) return;
                playerGame.units[0].addValuable("devotion", 1);
                playerGame.units[0].addValuable("gems", -25);

                playerGame.updateCharacters();
                break;
            case 'infusion':
                if (playerGame.units[0].hasValuable("gems") < 10) return;
                playerGame.units[0].hp = playerGame.units[0].maxHp;
                playerGame.units[0].addValuable("gems", -25);

                playerGame.updateCharacters();
                break;
        }
        
        updateMarket();
    });

    // TODO extricate this into it's own class. time pressure :>
    // ALSO TODO: lots of hardcoded values above and below here
    updateMarket();

    // testing buttons
    $('#addWeapon').on('click', function() {
        playerGame.units[0].addWeapon();
        enemyGame.units[0].addWeapon();
        playerGame.updateWeapons();
        enemyGame.updateWeapons();
        playerGame.updateCharacters();
        enemyGame.updateCharacters();
    });

    $('#logSomething').on('click', function() {
        playerGame.log('An adventure awaits!' + Math.random().toFixed(1));
    });

    $('#resetView').on('click', function() {
        zDogPlayerCanvas.rotate.x = zDogPlayerCanvas.rotate.y = zDogEnemyCanvas.rotate.x = zDogEnemyCanvas.rotate.y = 0;
        zDogPlayerCanvas.rotate.z = zDogEnemyCanvas.rotate.z = -Math.PI/2;
    });

    $('#killEnemy').on('click', function() {
        enemyGame.units[0].hp = -1;
        enemy.deathCheck();
    });

    $('#enemyPrintout').on('click', function() {
        updateEnemyPrintout();
    });

    $('#addWater').on('click', function() {
        playerGame.units[0].addValuable("water", 3);
        playerGame.updateCharacters();
    });

    //updateEnemyPrintout();

    function updateEnemyPrintout() {
        $('#enemyReadout').html('');

        for (let i = 0; i <= 10; i++) { // 10 rows
            let level = i / 10;
            $('#enemyReadout').append('<div class="group">' + CALC.normaliseL(level).toFixed(1) + '</div>');
            let numOfEnemies = CALC.numOfEnemies(level);
            for (let j = 0; j < numOfEnemies; j++) {
                let enemy = new Character(level);
                $('#enemyReadout .group:last-of-type').append(enemy.returnDOM());
            }
        }
    }

    // After page is ready, start the update loop
    gameLoop();

    // And finally, remove the loader
    $('#loading').hide();
});

function gameLoop() {
    var now = new Date().getTime();
    dt = now - (time || now);
    time = now;

    update(dt);

    requestAnimationFrame(gameLoop);
}

//zDogPlayerCanvas.rotate.x = zDogEnemyCanvas.rotate.x = Math.PI/8;

function update(dt) {
    playerGame.update(dt);
    enemyGame.update(dt);

    idle.update(dt);

    // zdog rendering
    zDogPlayerCanvas.rotate.y -= 1/1000 * dt;
    zDogEnemyCanvas.rotate.y += 1/1000 * dt;

    // move the party
    dungeon.party.rx = lerp(dungeon.party.rx, dungeon.party.x, 1/100 * dt);
    dungeon.party.ry = lerp(dungeon.party.ry, dungeon.party.y, 1/100 * dt);

    dungeon.party.model.translate = dungeon.getTranslatePosition(dungeon.party.rx, dungeon.party.ry, dungeon.width, dungeon.height);
    let z = dungeon.party.model.translate.z;
    dungeon.party.model.translate.z += Math.abs(z/100 - 1) * UNIT;

    zDogPlayerCanvas.updateRenderGraph();
    zDogEnemyCanvas.updateRenderGraph();
    zDogDungeonCanvas.updateRenderGraph();
}

// TODO extricate this
function updateMarket() {
    if (playerGame == null) return;
    if (playerGame.units.length <= 0) return;
    
    $('.ware').each(function(index) {
        let id = $(this).attr('id');
        
        switch (id) {
            case 'armament':
                $(this).attr('disabled', playerGame.units[0].hasValuable("gold") < 500);
                break;
            case 'lifeblood':
                if (playerGame == null) return;
                $(this).attr('disabled', playerGame.units[0].hasValuable("gold") < 100);
                break;
            case 'miracle':
                if (playerGame == null) return;
                $(this).attr('disabled', playerGame.units[0].hasValuable("gems") < 25);
                break;
            case 'infusion':
                if (playerGame == null) return;
                $(this).attr('disabled', playerGame.units[0].hasValuable("gems") < 10);
                break;
        }
    });
}