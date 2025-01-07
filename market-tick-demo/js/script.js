const WIDTH = 1280;
const HEIGHT = 720;
const UNIT = 40;

const EMOJIS = ["😄", "😢", "😡", "😱", "🤔", "🥰", "😷", "🥳", "😐", "😴"];
const GOODS = ["🐟", "🥕", "🍒"];
const POSITIVE_EVENTS = ["🎆", "🎉", "🌈", "🏗️", "📈", "💎", "🏦", "🛍️", "🚅", "🌟", "🪙", "🌿"];
const NEGATIVE_EVENTS = ["🌩️", "🌪️", "🔥", "💥", "📉", "🏚️", "🛑", "🚫", "🪦", "💸", "🪫", "⛈️"];
const NEUTRAL_EVENTS = ["⛅", "🌊", "🏙️", "🚧", "🏛️", "⚖️", "🛤️", "📜", "⚙️", "🏗️", "🌍", "📂"];

const HEADS = [
    "#fde6a9", // skin
    "#fde6a9", // skin
    "#e69974", // auburn
    "#e8c1d6", // pink
];
const BODIES = [
    "#a0e1fd", // blue
    "#fd9483", // red
]

let illo = new Zdog.Illustration({
    element: '.zdog-canvas',
    dragRotate: true,
    rotate: { x: -Math.PI/4, y: -Math.PI/4 },
    onPrerender: function( ctx ) {

        if (!game) return;

        const eventsLen = game.events.length;
        game.events.forEach((elem, index) => {
            let x = index * UNIT*1.1 - eventsLen / 2 * UNIT*1.1;
            let y = -UNIT * 5;

            if (game.index == 0) {
                let percent = game.timer / game.maxTimer;
                let sin = Math.sin(percent * Math.PI);
                y += -sin * UNIT;
            }

            ctx.fillStyle = elem.color;
            ctx.fillRect(
                x,
                y,
                UNIT,
                UNIT
            );
        });

    },
});

let anchor = new Zdog.Anchor({
    addTo: illo,
});

class Event {
    constructor() {
        this.color = getRandomColor();
    }
}

class Agent {
    constructor(type = "") {
        this.face = rand(EMOJIS);
        this.good = rand(GOODS);

        this.x = 0;
        this.y = 0;
        this.rx = 0;
        this.ry = 0;

        this.model = new Zdog.Anchor();

        if (type == "puck") {
            let puck = new Zdog.Cylinder({
                addTo: this.model,
                diameter: UNIT,
                length: UNIT/8,
                stroke: false,
                fill: true,
                color: "#808080",
            });
        } else {
            let head = new Zdog.Shape({
                addTo: this.model,
                stroke: UNIT,
                color: rand(HEADS),
            });
            let body = new Zdog.Cone({
                addTo: this.model,
                translate: { z: -UNIT },
                diameter: UNIT*0.75,
                length: UNIT,
                stroke: false,
                color: rand(BODIES),
            });
        }
    }
}

class Game {
    constructor() {
        this.consumers = this.createAgents(20);
        this.producers = this.createAgents(20);

        this.consumerShapes = [];
        this.producerShapes = [];

        this.pucks = this.createAgents(2, "puck");
        this.puckShapes = [];

        this.timer = 0;
        this.maxTimer = 100;
        this.tickspeed = 1 / 10;

        this.index = 0;
        this.maxLen = 0;
        
        this.events = this.createEvents(randInt(3,9));
        this.swapEvents = true;
    }
    
    createEvents(count) {
        const events = [];
        for (let i = 0; i < count; i++) {
            events.push(new Event());
        }
        return events;
    }

    createAgents(count, type = "") {
        const agents = [];
        for (let i = 0; i < count; i++) {
            agents.push(new Agent(type));
        }
        return agents;
    }

    advanceTick(dt) {
        if (this.timer < this.maxTimer) {
            this.timer += this.tickspeed * dt;
            if (this.timer > this.maxTimer) this.timer = this.maxTimer;

            if (this.index == 0 && this.timer >= this.maxTimer/2 && this.swapEvents) {
                this.events = this.createEvents(randInt(3,9));
                this.swapEvents = false;
            }
        } else {
            this.timer = 0;
            this.index++;
            if (this.index > this.maxLen-1) {
                this.index = 0;
                this.swapEvents = true;
            }
        }

        this.puckShapes.forEach((elem, index) => {
            if (this.index == this.maxLen-1) {
                const x = this.timer / this.maxTimer * (this.maxLen-1) * UNIT * -1 + (this.maxLen-1) * UNIT;
                elem.translate.x = x;
            } else {
                elem.translate.x = this.index * UNIT + this.timer / this.maxTimer * UNIT;
            }
            elem.translate.z = index * UNIT;
        });
    }

    updateAgents() {
        this.maxLen = Math.max(this.consumers.length, this.producers.length);

        anchor.children = []; // reset

        illo.zoom = 1 / this.maxLen * UNIT/1.75;

        this.consumerShapes = [];
        this.producerShapes = [];

        this.instantiateZDog(0, 0, 0, this.consumers, this.consumerShapes);
        this.instantiateZDog(0, 0, UNIT, this.producers, this.producerShapes);

        this.puckShapes = [];
        this.instantiateZDog(0, -UNIT * 2, 0, this.pucks, this.puckShapes);
        anchor.translate.x = -UNIT * this.maxLen / 2;
    }

    instantiateZDog(x, y, z, fromArray, arrayToAdd) {
        fromArray.forEach((elem, index) => {
            let agent = elem.model.copyGraph({
                addTo: anchor,
                translate: { x: x + index * UNIT, y: y, z: z },
                rotate: { x: Math.PI/2 },
            });
            arrayToAdd.push(agent);
        });
    }
}

// Usage example
let game = new Game();
game.updateAgents();

$(function () {
    var time;
    var dt;

    function gameLoop() {
        requestAnimationFrame(gameLoop);

        var now = new Date().getTime();
        dt = now - (time || now);
        time = now;

        update(dt);
        
        //illo.rotate.y += 1/10000 * dt;
        illo.updateRenderGraph();
    }

    function update(dt) {
        game.advanceTick(dt);
    }

    $(document).on('input change', function() {
        doChanges();
    });

    function doChanges() {

        let agents = $('#agents').val();
        if (agents != game.maxLen) {
            game.consumers = game.createAgents(agents);
            game.producers = game.createAgents(agents);
            game.updateAgents();
        }

        const doubleSpeed = $('#doubleSpeed').prop('checked');
        const halfSpeed = $('#halfSpeed').prop('checked');
        
        let value = $('#speed').val();
        value = 1 / value;
        if (doubleSpeed) value *= 5;
        if (halfSpeed) value *= 1/5;
        game.tickspeed = value;
    }

    gameLoop();
});
