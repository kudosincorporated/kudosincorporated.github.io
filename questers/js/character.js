class Character {
    constructor(level = 0.2) {
        this.level = level;

        this.descriptor = rand(DESCRIPTORS);
        this.title = rand(ENEMIES);
        this.name = this.descriptor + " " + this.title;

        this.maxHp = CALC.getHp(level);
        this.hp = this.maxHp;

        this.weapons = [];
        let numOfWeapons = CALC.numOfWeapons(this.level);
        for (let i = 0; i < numOfWeapons; i++) {
            const rarityLevel = CALC.rarityOfWeapon(this.level);
            const foundAdj = getRandomAdjFromRarity(rarityLevel);
            this.addWeapon(foundAdj.name);
        }

        this.valuables = {};
        this.addValuable("gold", CALC.numOfItem(this.level, 1, 5000, 1));
        this.addValuable("gems", CALC.numOfItem(this.level, 1, 500, 0.9));
        this.addValuable("water", CALC.numOfItem(this.level, 1, 1, 0.25));
        this.addValuable("devotion", CALC.numOfItem(this.level, 1, 1, 0.1));
    }

    returnDOM() {
        let $character = $('<div>').addClass('character');

        // hp bar
        let hpPercentage = this.hp / this.maxHp * 100;
        let $progress = $('<div>').addClass('progress');
        let $inner = $('<div>').addClass('inner');
        $inner.css('width', hpPercentage + '%');
        $progress.append($inner);
        $character.append($progress);

        // name
        let $name = $('<div>').addClass('item').text(this.name);

        /*if (this.name == 'Player') {
            if (idle != null) {
                $name.append(idle.returnRuneList());
            }
        }*/

        tippy($name[0], {
            content: 'Maximum Health: ' + this.maxHp + '<br>' + 'Weapon Drop Chance: 5%',
            allowHTML: true,
        });
        $character.append($name);

        // weapons
        $character.append('<div class="subtitle"> is holding </div>');
        $character.append(this.returnWeaponsDOM());

        // valuables
        $character.append('<div class="subtitle"> with pockets full of </div>');
        $character.append(this.returnValuablesDOM());

        return $character;
    }

    returnWeaponsDOM() {
        let $weapons = $('<div>').addClass('weapons');
        for (let i = 0; i < this.weapons.length; i++) {
            let itemDOM = this.weapons[i].returnDOM();
            $weapons.append(itemDOM);
        }

        if (this.weapons.length == 0) {
            $weapons.append('<div class="item subtitle">nothing</div>');
        }

        return $weapons;
    }

    returnValuablesDOM() {
        let $valuables = $('<div>').addClass('valuables');
        let valuablesArray = Object.keys(this.valuables);
        for (let i = 0; i < valuablesArray.length; i++) {
            let $valuable = $('<div>').addClass('item ' + valuablesArray[i]);
            $valuable.text(valuablesArray[i] + ' (•' + this.valuables[valuablesArray[i]] + ')');
            $valuables.append($valuable);
        }

        if (valuablesArray.length == 0) {
            $valuables.append('<div class="item subtitle">dust</div>');
        }

        return $valuables;
    }

    addWeapon(weaponAdjective = null, weaponNoun = null, level = null) {
        let lvl = level || this.level;
        let weapon = new Weapon(weaponAdjective, weaponNoun, lvl); // Instantiate weapon
        this.weapons.push(weapon); // Push to array so we can access it easily
    }

    removeWeapon(fullName) {
        const index = this.weapons.findIndex(obj => obj.name === fullName);
        this.weapons.splice(index, 1);
        if (index <= playerGame.weaponActiveIndex) {
            playerGame.weaponActiveIndex--;
        }
    }

    addValuable(name, amount) {
        if (amount == 0) return; // don't bother adding a valuable if it's 0...

        let valuablesArray = Object.keys(this.valuables);
        if (valuablesArray.indexOf(name) < 0) {
            this.valuables[name] = amount;
        } else {
            this.valuables[name] += amount;
        }

        // receiving water allows movement
        if (dungeon) {
            dungeon.updateMovement();
        }

        if (idle) {
            idle.updateButtons();
        }

        updateMarket();
    }

    hasValuable(name) { // returns null if there is no instance of the valuable, or if there's 0 of it
        let valuablesArray = Object.keys(this.valuables);
        let index = valuablesArray.indexOf(name);
        if (index >= 0) { // they have this valuable
            let amount = this.valuables[valuablesArray[index]];
            return amount > 0 ? amount : null;
        } else {
            return null;
        }
    }

    takeDamage(value) {
        this.hp -= value;
    }
}