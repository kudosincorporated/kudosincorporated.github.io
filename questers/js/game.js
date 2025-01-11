class Game {
    constructor(connectedDOM, zDogScene, opponentGame) {
        // weapons admin
        this.animationSpeed = 500;
        this.weaponActiveIndex = 0;
        this.timeUntilSwitch = 50; // arbitrary, just can't be 0

        // for clicking the "fight" button
        this.buttonStrength = 500;

        // typically a single player or enemy
        this.units = [];

        this.renderedWeapons = [];

        this.parentDOM = connectedDOM;
        this.scene = zDogScene;
        this.attacking = opponentGame;
    }
    
    setAttacking(game) {
        this.attacking = game;
    }

    update(dt) {
        if (PAUSED) return;
        if (this.units[0].weapons.length <= 0) return;

        // weapons attacking
        if (this.timeUntilSwitch <= 0) {
            this.nudgeWeapon(this.weaponActiveIndex);
            this.weaponActiveIndex++;
            if (this.weaponActiveIndex >= this.renderedWeapons.length) this.weaponActiveIndex = 0;
            this.timeUntilSwitch = this.units[0].weapons[this.weaponActiveIndex].attackSpeed;
        } else {
            this.timeUntilSwitch -= 1 * dt;
        }

        // timer
        this.updateTimer();

        // animation
        this.updateWeaponAttackAnim(dt);
    }

    updateCharacters() {
        this.parentDOM.find('.characters').html('');

        this.units.forEach((elem, index) => {
            let charDOM = elem.returnDOM();
            this.parentDOM.find('.characters').append(charDOM);
        });

        this.updateOpponent();
    }

    softRefreshCharacters() {
        this.units.forEach((elem, index) => {
            // refresh HP bar
            let $unit = this.parentDOM.find('.characters .character').eq(index);
            let hpPercentage = elem.hp / elem.maxHp * 100;
            $unit.find('.progress .inner').css('width', hpPercentage + '%');
        });
    }

    updateOpponent() {
        if (this.attacking == null) {
            return;
        }

        if (this.attacking.units.length <= 0) {
            return;
        }

        //console.log('updateOpponent() from ' + this.parentDOM.attr('id'));

        this.parentDOM.find('.attacker').html(this.units[0].name);
        this.parentDOM.find('.opponent').html(this.attacking.units[0].name);
    }
    
    updateWeapons() {
        this.scene.children = [];
        this.renderedWeapons = [];

        this.units[0].weapons.forEach((elem, index) => {
            let renderedWeapon = elem.model.copyGraph({ addTo: this.scene, }); // use copyGraph instead of copy for a deep clone
            this.renderedWeapons.push(renderedWeapon);
        });

        this.updateWeaponPositions();
    }

    updateWeaponPositions() {
        let elements = this.renderedWeapons;
        const radius = 200;
        elements.forEach((elem, index) => {
            const angle = (index / elements.length) * 2 * Math.PI;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            elem.translate.x = x;
            elem.translate.y = y;
            elem.rotate.z = angle + Math.PI / 2;
        });
    }

    nudgeWeapon(index) {
        if (this.units[0].weapons.length <= 0) return;

        let weapon = this.units[0].weapons[index];
        let renderedWeapon = this.renderedWeapons[index];

        // start animation
        renderedWeapon.animating = true;
        renderedWeapon.animTimer = this.animationSpeed;

        // deal damage to enemy
        let enemyDamage = randInt(weapon.minDamage, weapon.maxDamage);
        if (Math.random() <= weapon.critChance) {
            enemyDamage *= 1.5;
        }
        if (this.attacking == null) return;

        let yourUnit = this.units[0];
        let enemyUnit = this.attacking.units[0];

        enemyUnit.takeDamage(enemyDamage);
        this.attacking.softRefreshCharacters();

        this.log(yourUnit.name + ' attacks ' + enemyUnit.name, 'subtitle');

        this.attacking.deathCheck();
    }

    deathCheck() {
        if (this.units[0].hp <= 0) {
            if (this.units[0].name.toLowerCase() == "player") {
                this.log('<b>Heal up!</b>', 'gems-bg');
                PAUSED = true;
            } else { // enemy is slain
                // experience gain
                const expGain = this.units[0].level;
                const expProgress = this.attacking.units[0].exp / this.attacking.units[0].maxExp * 100;
                this.log('Looted: The ' + this.units[0].name + '.');
                this.attacking.units[0].addExperience(expGain);
                
                // looting process
                // valuables
                let valuablesArray = Object.keys(this.units[0].valuables);
                for (let i = 0; i < valuablesArray.length; i++) {
                    let lootChance = 0.75; // TODO extricate this!
                    let lootPercentage = Math.random();

                    if (Math.random() >= lootChance) {
                        if (idle != null) {
                            if (!idle.getLucky()) {
                                continue;
                            } else {
                                this.log('Got lucky! Thanks faeries!', 'faerie');
                            }
                        } else {
                            continue;
                        }
                    }

                    let lootString = valuablesArray[i];
                    let amount = Math.ceil(this.units[0].valuables[valuablesArray[i]] * lootPercentage);
                    this.attacking.units[0].addValuable(
                        lootString,
                        amount
                    );
                    this.log('You find ' + amount + ' ' + lootString + '.', lootString);
                }
                // weapons
                for (let i = 0; i < this.units[0].weapons.length; i++) {
                    let weaponLootChance = 0.1; // TODO extricate this!
                    
                    if (Math.random() >= weaponLootChance) {
                        if (idle != null) {
                            if (!idle.getLucky()) {
                                continue;
                            } else {
                                this.log('Got lucky! Thanks faeries!', 'faerie');
                            }
                        } else {
                            continue;
                        }
                    }

                    let weapon = this.units[0].weapons[i];

                    let rarity = getRarityFromAdj(weapon.adjective);

                    let newRarity = rarity + 1;
                    let newAdjective = getRandomAdjFromRarity(newRarity);
                    let newName = newAdjective.name + ' ' + weapon.noun;
                    let newColor = RARITY_COLOURS[newRarity];
                    
                    console.log(CALC.rToPercent(newRarity));

                    this.attacking.units[0].addWeapon(newAdjective.name, weapon.noun, CALC.rToPercent(newRarity));
                    this.log('<b>You loot a ' + newName + '.</b>', newColor);
                    
                    this.attacking.updateWeapons(); // only update this here because otherwise it looks glitchy
                }
                // and refresh
                this.attacking.updateCharacters();

                this.units.splice(0, 1); // remove the dead unit

                if (this.units.length <= 0) {
                    // new enemies!
                    this.encounter();
                } else {
                    this.updateWeapons();
                    this.updateCharacters();
                }

                this.attacking.updateOpponent();
            }
        }
    }

    encounter() {
        if (dungeon == null) return;

        let numOfEnemies = CALC.numOfEnemies(dungeon.level);
        for (let i = 0; i < numOfEnemies; i++) {
            this.addCharacter(dungeon.level);
        }

        // reset wheel
        this.weaponActiveIndex = 0;
        this.timeUntilSwitch = this.units[0].weapons[0].attackSpeed;
        
        this.log(rand(MESSAGES.end));
    }

    updateWeaponAttackAnim(dt) {
        this.renderedWeapons.forEach((elem, index) => {
            if (elem.animating) {
                // state changes
                if (elem.animTimer <= 0) {
                    elem.animating = false;
                } else {
                    elem.animTimer -= 1 * dt;
                }

                // actual animation (there's an /even/ better way to do this with anchors I suspect)
                let displacement = elem.animTimer < this.animationSpeed/2 ? elem.animTimer : this.animationSpeed - elem.animTimer;
                displacement *= 0.25;
                elem.children[0].translate.y = displacement;
            }
        });
    }

    addCharacter(level) {
        let character = new Character(level);
        this.units.push(character);

        this.updateWeapons();
        this.updateCharacters();
    }

    updateTimer() {
        if (this.units[0].weapons.length <= 0) return;

        let timerPercentage = this.timeUntilSwitch / this.units[0].weapons[this.weaponActiveIndex].attackSpeed * 100;
        if (timerPercentage > 100) timerPercentage = 100;
        this.parentDOM.find('.timer .progress .inner').css('width', timerPercentage + '%');
    }

    log(string, classes) {
        const LOG_MAX_LENGTH = 9;

        let $message = $('<div>').addClass('message');
        let $text = $('<div>').addClass('text ' + classes);
        $text.html(string);
        $message.append($text);
    
        let oldMessage = false;
        for (let i = 0; i < 2; i++) { // checks previous two messages
            let prevMessage = $('#log .message').eq(i).text();
            if (prevMessage.includes(string)) {
                $('#log .message').eq(i).find('.text').prepend('•');
                $('#log .message').eq(i).find('.text').append('•');
                oldMessage = true;
            }
        }

        if (!oldMessage) {
            $('#log').prepend($message);

            // remove excess messages
            if ($('#log .message').length > LOG_MAX_LENGTH) {
                $('#log .message:last-of-type').remove();
            }
        }

        // opacity
        $('#log .message').each(function(index) {
            $(this).css('opacity', Math.abs(index / LOG_MAX_LENGTH - 1));
        });
    }
}