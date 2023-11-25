class upgradeManager {
    constructor() {

        this.bought = [];

        this.available = ['bullet_0','pulse_0','dash_0','poison_0'];

        this.shop = [];

        this.inUpgradeWorld = false;
        
        this.savedWorld = {};

        this.list = {
            score_: {
                title: "Score++",
                description: "Nothing more to unlock."
            },



            bullet_0: {
                title: "Unlock Gun",
                description: "Shoot nearby enemies.",
                unlocks: ["bullet_1","bullet_3"],
            },
            bullet_1: {
                title: "Fire Rate x2",
                description: "Doubled gun fire rate.",
                unlocks: ["bullet_3"],
            },
            bullet_2: {
                title: "Double Shot",
                description: "Fire two rounds of bullets.",
                unlocks: ["bullet_4"],
            },
            bullet_3: {
                title: "Damage x2",
                description: "Doubled gun damage.",
                unlocks: ["bullet_5"],
            },
            bullet_4: {
                title: "Triple Shot",
                description: "Fire three rounds of bullets.",
                unlocks: ["bullet_5"],
            },
            bullet_5: {
                title: "Super Soaker",
                description: "Tripled rate, halved damage.",
            },



            pulse_0: {
                title: "Unlock Pulse",
                description: "Deal damage to close enemies.",
                unlocks: ["pulse_1","pulse_2"],
            },
            pulse_1: {
                title: "Pulse Rate x2",
                description: "Doubled rate of pulse.",
                unlocks: ["pulse_3"],
            },
            pulse_2: {
                title: "XP = Speed",
                description: "Each XP gives permanent speed.",
                unlocks: ["pulse_4"],
            },
            pulse_3: {
                title: "Pulse Damage x2",
                description: "Doubled damage of pulse.",
                unlocks: ["pulse_5"],
            },
            pulse_4: {
                title: "XP = Damage",
                description: "Each XP gives permanent damage.",
                unlocks: ["pulse_5"],
            },
            pulse_5: {
                title: "Alien Invasion",
                description: "Enemies HP halved, spawning doubled.",
            },



            dash_0: {
                title: "Unlock Dash",
                description: "Space to dash at nearby enemies.",
                unlocks: ["dash_1","dash_2"],
            },
            dash_1: {
                title: "Dash Speed x2",
                description: "Doubled dash speed.",
                unlocks: ["dash_3"],
            },
            dash_2: {
                title: "Double Dash",
                description: "Chain two dashes together.",
                unlocks: ["dash_4"],
            },
            dash_3: {
                title: "Dash Damage x2",
                description: "Doubled dash damage.",
                unlocks: ["dash_5"],
            },
            dash_4: {
                title: "Triple Dash",
                description: "Chain three dashes together.",
                unlocks: ["dash_5"],
            },
            dash_5: {
                title: "Combo Enlightened",
                description: "Chain infinite dashes for more damage.",
            },



            poison_0: {
                title: "Unlock Poison",
                description: "Infect random enemies.",
                unlocks: ["poison_1","poison_2"],
            },
            poison_1: {
                title: "Poison Rate x2",
                description: "Doubled rate of infection.",
                unlocks: ["poison_3"],
            },
            poison_2: {
                title: "Infection x2",
                description: "Two infected at once.",
                unlocks: ["poison_4"],
            },
            poison_3: {
                title: "Poison Damage x2",
                description: "Doubled damage of poison.",
                unlocks: ["poison_5"],
            },
            poison_4: {
                title: "Infection x3",
                description: "Three infected at once.",
                unlocks: ["poison_5"],
            },
            poison_5: {
                title: "Shatter Plague",
                description: "Infected enemies explode on death.",
            },
        }
    }
    addUpgrade(upgrade) {
        this.bought.push(upgrade);
		this.bought = [...new Set(this.bought)]; //Remove duplicates
    }
    unlockNewUpgrades(boughtUpgrade) {
        if (this.list[boughtUpgrade].unlocks) {
            this.available = this.available.concat(this.list[boughtUpgrade].unlocks);
        }
        let index = this.available.indexOf(boughtUpgrade);
        this.available.splice(index, 1);
    }
    getUpgradeType(upgrade) {
        return upgrade.substring(0, upgrade.indexOf('_'));
    }
    getColourFromUpgrade(type) {
        switch (type) {
            case 'score':
                return 'white';
            case 'bullet':
                return 'yellow';
            case 'pulse':
                return 'aqua';
            case 'dash':
                return 'red';
            case 'poison':
                return 'limegreen';
            case 'bullet':
                return 'yellow';
            default:
                return 'blue';
        }
    }
    chooseNewUpgrades() {
        this.shop = [];
        let available = [...this.available]; //Clone array
        for (let i = 0; i < 2; i++) {
            if (available.length >= 1) {
                const r = randInt(0, available.length-1);
                this.shop.push(available[r]);
                available.splice(r, 1);
            } else {
                this.shop.push('score_');
            }
        }
    }
    addFloorUpgrade(name, x, y) {
        const upgradeType = this.getUpgradeType(name);
        const upgradeColour = this.getColourFromUpgrade(upgradeType);
        const finalNumber = name.charAt(name.length-1);

        GAME.world.floor.push(new Mover(ENTITY.upgrade, {
            upgrade: name,
            shape: upgradeType,
            colour: upgradeColour,
            x: x,
            y: y,
        }));

        if (finalNumber == '0' || finalNumber == '5') {
            GAME.world.confettiCanon(
                x, //centerX
                y, //centerY
                0, //radius
                19, //numElements
                0, //defaultAngle
                0, //accuracy
                1/1.5, //speed
                900, //lifespan
                [upgradeColour] //colours
            );
        }
    }
    toggleUpgradeWorld() {
        this.inUpgradeWorld = !this.inUpgradeWorld;

        if (this.inUpgradeWorld) {

            this.chooseNewUpgrades();

            this.savedWorld.enemies = GAME.world.enemies;
            this.savedWorld.bullets = GAME.world.bullets;
            this.savedWorld.orbs = GAME.world.orbs;

            GAME.world.enemies = [];
            GAME.world.bullets = [];
            GAME.world.orbs = [];

            this.addFloorUpgrade(this.shop[0], GAME.world.player[0].x-canvas.width/3-1, GAME.world.player[0].y);
            this.addFloorUpgrade(this.shop[1], GAME.world.player[0].x+canvas.width/3, GAME.world.player[0].y);

            GAME.world.confettiCanon(
                canvas.width/2, //centerX
                canvas.height/2, //centerY
                canvas.width/2, //radius
                99, //numElements
                Math.PI/2, //defaultAngle
                0.9, //accuracy
                1, //speed
                900, //lifespan
                [] //colours
            );

        } else {

            GAME.world.enemies = this.savedWorld.enemies;
            GAME.world.bullets = this.savedWorld.bullets;
            GAME.world.orbs = this.savedWorld.orbs;
            
            GAME.world.floor = [];

            GAME.world.enemies.forEach((item) => {
                item.takeDamage(999);
            });
        }
    }
}