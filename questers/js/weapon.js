class Weapon {
    constructor(weaponAdjective = null, weaponNoun = null, level = 0.2) {
        this.model = new Zdog.Anchor(); // pass through options
        
        // Name
        if (weaponAdjective != null) {
            this.adjective = weaponAdjective;
            this.rarity = getRarityFromAdj(weaponAdjective);
        } else {
            const adjectiveIndex = randInt(0, ADJECTIVES.length-1);
            this.adjective = ADJECTIVES[adjectiveIndex].name;
            this.rarity = ADJECTIVES[adjectiveIndex].rarity;
        }
        this.noun = weaponNoun != null ? weaponNoun : rand(WEAPONS);
        this.name = this.adjective + " " + this.noun;
        // Values
        const dmg = CALC.getDamage(level, this.rarity);
        this.minDamage = dmg.min;
        this.maxDamage = dmg.max;
        this.attackSpeed = CALC.getAttackSpeed(level, this.rarity);
        this.critChance = CALC.getCritChance(level, this.rarity);

        // Visuals
        this.stroke = STROKE;
        this.fill = true;
        this.color = RARITY_COLOURS[this.rarity];

        // Animations
        this.animating = false;
        this.animTimer = 0;

        // Create model
        this.createWeapon(this.noun);
    }

    returnDOM() {
        let $info = $('<div>');
        $info.addClass('item ' + this.color);
        $info.text(this.name);

        let textContent = '';
        textContent += 'Rarity: ' + this.rarity;
        textContent += '<br>';
        textContent += 'Damage: ' + this.minDamage + '-' + this.maxDamage;
        textContent += '<br>';
        textContent += 'Attack Speed: ' + (this.attackSpeed/100).toFixed(0);
        textContent += '<br>';
        textContent += 'Critical Chance: ' + (this.critChance*100).toFixed(0) + '%';

        tippy($info[0], { // Use $info[0] to get the DOM element from the jQuery object
            content: textContent,
            allowHTML: true,
        });
        
        return $info;
    }

    createWeapon(weaponName) {

        let baseAnchor = new Zdog.Anchor({
            addTo: this.model,
            rotate: { z: Math.PI }, // face inwards
        });

        switch (weaponName.toLowerCase()) {
            case "bola":
                let bola = new Zdog.Ellipse({
                    addTo: baseAnchor,
                    rotate: { z: Math.PI+Math.PI/2 },
                    diameter: UNIT,
                    quarters: 3,
                    stroke: this.stroke,
                    fill: false,
                    color: this.color,
                });

                bola.copy({
                    translate: { y: UNIT },
                    rotate: { z: Math.PI-Math.PI/2 },
                });

                let bola2 = new Zdog.Shape({
                    addTo: baseAnchor,
                    translate: { x: -UNIT/2 },
                    stroke: UNIT/2,
                    fill: this.fill,
                    color: this.color,
                });

                bola2.copy({
                    translate: { x: UNIT/2, y: UNIT },
                });
                break;
            case "boomerang":
                let boomerang = new Zdog.Shape({
                    addTo: baseAnchor,
                    path: [
                        { x: 0, y: 0 },
                        { x: UNIT/2, y: -UNIT },
                    ],
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });

                boomerang.copy({
                    path: [
                        { x: 0, y: 0 },
                        { x: UNIT/2, y: UNIT },
                    ],
                });
                break;
            case "bow":
                let bow = new Zdog.Shape({
                    addTo: baseAnchor,
                    translate: { y: -UNIT/4 },
                    path: [
                        { x: -UNIT, y: 0 },
                        { x: UNIT, y: 0 },
                    ],
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });

                let bow2 = new Zdog.Ellipse({
                    addTo: baseAnchor,
                    rotate: { z: -Math.PI/2 },
                    diameter: UNIT*2,
                    quarters: 2,
                    stroke: this.stroke,
                    fill: false,
                    color: this.color,
                });
                break;
            case "crossbow":
                let crossbow = new Zdog.Shape({
                    addTo: baseAnchor,
                    translate: { y: UNIT },
                    path: [
                        { x: 0, y: 0 },
                        { x: 0, y: -UNIT*3 },
                    ],
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });

                let crossbow2 = new Zdog.Ellipse({
                    addTo: baseAnchor,
                    rotate: { z: -Math.PI/2 },
                    height: UNIT*2,
                    width: UNIT*3,
                    quarters: 2,
                    stroke: this.stroke,
                    fill: false,
                    color: this.color,
                });
                break;
            case "longbow":
                let longbow = new Zdog.Shape({
                    addTo: baseAnchor,
                    translate: { y: -UNIT/4 },
                    path: [
                        { x: -UNIT*1.5, y: 0 },
                        { x: UNIT*1.5, y: 0 },
                    ],
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });

                let longbow2 = new Zdog.Ellipse({
                    addTo: baseAnchor,
                    rotate: { z: -Math.PI/2 },
                    height: UNIT*3,
                    width: UNIT*2,
                    quarters: 2,
                    stroke: this.stroke,
                    fill: false,
                    color: this.color,
                });
                break;
            case "slingshot":
                let slingshot = new Zdog.Shape({
                    addTo: baseAnchor,
                    translate: { y: UNIT },
                    path: [
                        { x: 0, y: 0 },
                        { x: 0, y: -UNIT*2 },
                    ],
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });

                let slingshot2 = new Zdog.Ellipse({
                    addTo: baseAnchor,
                    translate: { y: -UNIT*2 },
                    rotate: { z: Math.PI/2 },
                    diameter: UNIT*2,
                    quarters: 2,
                    stroke: this.stroke,
                    fill: false,
                    color: this.color,
                });
                break;
            case "dagger":
                let dagger = new Zdog.Shape({
                    addTo: baseAnchor,
                    path: [
                        { x: 0, y: 0 },
                        { x: 0, y: UNIT },
                    ],
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });

                let dagger2 = new Zdog.Ellipse({
                    addTo: baseAnchor,
                    rotate: { x: Math.PI/2 },
                    diameter: UNIT/2,
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });

                dagger.copy({
                    path: [
                        { x: 0, y: 0 },
                        { x: 0, y: -UNIT*2 },
                    ],
                });
                break;
            case "tomahawk":
                let tomahawk = new Zdog.Shape({
                    addTo: baseAnchor,
                    translate: { y: UNIT },
                    path: [
                        { x: 0, y: 0 },
                        { x: 0, y: -UNIT*3 },
                    ],
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });

                tomahawk.copy({
                    translate: { y: -UNIT*1.5 },
                    path: [
                        { x: 0, y: 0 },
                        { x: UNIT, y: -UNIT },
                        { x: UNIT, y: UNIT },
                    ],
                });
                break; 
            case "spear":
                let spear = new Zdog.Shape({
                    addTo: baseAnchor,
                    translate: { y: UNIT },
                    path: [
                        { x: 0, y: 0 },
                        { x: 0, y: -UNIT*4 },
                    ],
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });

                let spear2 = new Zdog.Cone({
                    addTo: baseAnchor,
                    translate: { y: -UNIT*3 },
                    rotate: { x: Math.PI/2 },
                    diameter: UNIT/2,
                    length: UNIT,
                    fill: this.fill,
                    color: this.color,
                });
                break;
            case "club":
                let club = new Zdog.Cylinder({
                    addTo: baseAnchor,
                    translate: { y: -UNIT },
                    rotate: { x: Math.PI/2 },
                    diameter: UNIT/2,
                    length: UNIT*3,
                    fill: this.fill,
                    color: this.color,
                });
                break;
            case "halberd":
                let halberd = new Zdog.Shape({
                    addTo: baseAnchor,
                    translate: { y: UNIT },
                    path: [
                        { x: 0, y: 0 },
                        { x: 0, y: -UNIT*4 },
                    ],
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });

                halberd.copy({
                    translate: { y: -UNIT*2 },
                    path: [
                        { x: 0, y: 0 },
                        { x: UNIT/2, y: -UNIT/2 },
                        { x: UNIT/2, y: UNIT/2 },
                    ],
                });
                break;
            case "lance":
                let lance = new Zdog.Shape({
                    addTo: baseAnchor,
                    translate: { y: UNIT },
                    path: [
                        { x: 0, y: 0 },
                        { x: 0, y: -UNIT },
                    ],
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });

                let lance2 = new Zdog.Cone({
                    addTo: baseAnchor,
                    rotate: { x: Math.PI/2 },
                    diameter: UNIT/2,
                    length: UNIT*4,
                    fill: this.fill,
                    color: this.color,
                });
                break;
            case "sabre":
                let sabre = new Zdog.Shape({
                    addTo: baseAnchor,
                    translate: { y: UNIT },
                    path: [
                        { x: 0, y: 0 },
                        { x: 0, y: -UNIT*4 },
                    ],
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });

                let sabre2 = new Zdog.Ellipse({
                    addTo: baseAnchor,
                    rotate: { z: Math.PI },
                    diameter: UNIT,
                    quarters: 2,
                    stroke: this.stroke,
                    fill: false,
                    color: this.color,
                });
                break;
            case "sword":
                let sword = new Zdog.Shape({
                    addTo: baseAnchor,
                    path: [
                        { x: 0, y: 0 },
                        { x: 0, y: UNIT },
                    ],
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });

                let sword2 = new Zdog.Ellipse({
                    addTo: baseAnchor,
                    rotate: { x: Math.PI/2 },
                    diameter: UNIT,
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });

                sword.copy({
                    path: [
                        { x: 0, y: 0 },
                        { x: 0, y: -UNIT*3 },
                    ],
                });
                break;
            case "longsword":
                let longsword = new Zdog.Shape({
                    addTo: baseAnchor,
                    path: [
                        { x: 0, y: 0 },
                        { x: 0, y: UNIT },
                    ],
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });

                longsword.copy({
                    path: [
                        { x: -UNIT, y: 0 },
                        { x: UNIT, y: 0 },
                    ],
                });

                longsword.copy({
                    path: [
                        { x: 0, y: 0 },
                        { x: 0, y: -UNIT*4 },
                    ],
                });
                break;
            case "shield":
                let shield = new Zdog.Shape({
                    addTo: baseAnchor,
                    path: [
                        { x: -UNIT, y: -UNIT },
                        { x: 0, y: -UNIT },
                        { x: UNIT, y: -UNIT },
                        { x: UNIT, y: 0 },
                        { x: 0, y: UNIT },
                        { x: -UNIT, y: 0 },
                    ],
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });
                break;
            case "spellbook":
                let spellbook = new Zdog.Box({
                    addTo: baseAnchor,
                    height: UNIT*2,
                    width: UNIT,
                    depth: UNIT/2,
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });
                break;
            case "trinket":
                let trinket = new Zdog.Cone({
                    addTo: baseAnchor,
                    rotate: { x: Math.PI/2 },
                    diameter: UNIT,
                    length: UNIT,
                    fill: this.fill,
                    color: this.color,
                });
                break;
            case "gemstone":
                let gemstone = new Zdog.Box({
                    addTo: baseAnchor,
                    height: UNIT,
                    width: UNIT,
                    depth: UNIT,
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });
                break;
            case "orbstone":
                let orbstone = new Zdog.Shape({
                    addTo: baseAnchor,
                    stroke: UNIT,
                    fill: this.fill,
                    color: this.color,
                });
                break;
            case "staff":
                let staff = new Zdog.Shape({
                    addTo: baseAnchor,
                    translate: { y: UNIT },
                    path: [
                        { x: 0, y: 0 },
                        { x: 0, y: -UNIT*3 },
                    ],
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });
                
                let staff2 = new Zdog.Shape({
                    addTo: baseAnchor,
                    translate: { y: -UNIT*2 },
                    stroke: UNIT,
                    fill: this.fill,
                    color: this.color,
                });
                break;
            case "wand":
                let wand = new Zdog.Shape({
                    addTo: baseAnchor,
                    path: [
                        { x: 0, y: 0 },
                        { x: 0, y: -UNIT*2 },
                    ],
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });
                break;
            case "scepter":
                let scepter = new Zdog.Shape({
                    addTo: baseAnchor,
                    translate: { y: UNIT },
                    path: [
                        { x: 0, y: 0 },
                        { x: 0, y: -UNIT*3 },
                    ],
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });
                
                let scepter2 = new Zdog.Box({
                    addTo: baseAnchor,
                    translate: { y: -UNIT*2 },
                    rotate: { x: Math.PI/4, z: Math.PI/4 },
                    height: UNIT/2,
                    width: UNIT/2,
                    depth: UNIT/2,
                    stroke: this.stroke,
                    fill: this.fill,
                    color: this.color,
                });
                break;
        }
    }
}