class Dungeon {
    constructor() {
        this.width = 16;
        this.height = 16;

        this.tunnelLength = 2;
        this.emptyChance = 0.1;

        this.party = {
            model: {},
            x: 6,
            y: 9,
            rx: 6,
            ry: 9
        }

        this.level = this.getLevel();

        this.arr = [];
        this.createDungeon();
        
        this.updateRoom();

        this.updateDungeonZdog();
        this.updateMovement();
    }

    getLevel() {
        const x = this.party.x;
        const y = this.party.y;
        const centerX = this.width / 2;
        const centerY = this.height / 2;
    
        const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
    
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    
        // normalise distance
        const t = Math.min(distance / maxDistance, 1);

        return t;
    }

    createDungeon() {
        this.arr = []; // reset
        for (let y = 0; y < this.height; y++) {
            this.arr.push([]);
            for (let x = 0; x < this.width; x++) {

                let tile = { // type defined here
                    type: 'hallway',
                    topColor: 'orange',
                    leftColor: 'orange',
                    rightColor: 'orange',
                    eventComplete: false,
                };

                let z = Math.min(x, this.width - 1 - x, y, this.height - 1 - y);
                tile.topColor = z % 2 == 0 ? 'turquoise' : 'gold';
                tile.leftColor = z % 2 == 0 ? 'limegreen' : 'coral';
                tile.rightColor = z % 2 == 0 ? 'dodgerblue' : 'orchid';

                if (
                    x % (this.tunnelLength+1) == 0 &&
                    y % (this.tunnelLength+1) == 0
                ) {
                    tile.topColor = 'orange';
                    if (x == 6 && y == 9) {
                        tile.topColor = 'palegreen';
                        tile.eventComplete = true;
                    }
                }

                // empty holes, plus chance for dilapidation
                if (
                    x * y % (this.tunnelLength+1) != 0 ||
                    Math.random() < this.emptyChance
                ) {
                    tile.type = 'empty';
                }

                this.arr[y][x] = tile;
            }
        }
    }

    moveParty(newX, newY) { // partyMove
        this.party.x = newX;
        this.party.y = newY;

        this.level = this.getLevel();
        this.updateMovement();
        this.updateRoom();

        // encounter a new enemy (you're fleeing from the old one)
        if (enemyGame == null) return;
        enemyGame.units = [];
        enemyGame.encounter();
    }

    updateDungeonZdog() {
        zDogDungeonCanvas.children = []; // clear children

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let t = this.arr[y][x];

                if (t.type == 'empty') continue;

                let translate = this.getTranslatePosition(x, y, this.width, this.height);
                let z = translate.z / UNIT;

                let tile = new Zdog.Box({
                    addTo: zDogDungeonCanvas,
                    translate: {
                        x: translate.x,
                        y: translate.y
                    },
                    width: UNIT,
                    height: UNIT,
                    depth: (z+1) * UNIT,
                    stroke: STROKE,
                    color: t.topColor,
                    leftFace: t.leftColor,
                    bottomFace: t.rightColor,
                });
            }
        }

        this.party.model = new Zdog.Shape({
            addTo: zDogDungeonCanvas,
            translate: this.getTranslatePosition(this.party.x, this.party.y, this.width, this.height),
            stroke: STROKE*5,
            color: 'orangered',
        });
    }

    getTranslatePosition(x, y, width, height) {
        let z = this.getZFromCoords(x, y, width, height);
        let pos = {
            x: x * UNIT*1.5 - Math.floor(width/2) * UNIT*1.5 + UNIT*1.5/2,
            y: y * UNIT*1.5 - Math.floor(height/2) * UNIT*1.5 + UNIT*1.5/2,
            z: z * UNIT/1.5
        };

        return pos;
    }

    getZFromCoords(x, y, width, height) {
        return Math.min(x, width - 1 - x, y, height - 1 - y);
    }

    updateMovement() {
        $('#movement_canvas_cover button').attr('disabled', true);

        if (playerGame == null) return;
        if (playerGame.units.length <= 0) return;
        if (playerGame.units[0].hasValuable('water') == null) return;
        if (playerGame.units[0].hp <= 0) return;

        for (let a = -1; a <= 1; a++) {
            for (let b = -1; b <= 1; b++) {
                let x = this.party.x + a;
                let y = this.party.y + b;

                if (
                    a == -1 && b == -1 ||
                    a == 1 && b == 1 ||
                    a == -1 && b == 1 ||
                    a == 1 && b == -1 ||
                    a == 0 && b == 0
                ) {
                    //
                } else if (
                    x < 0 ||
                    x > this.arr[0].length-1 ||
                    y < 0 ||
                    y > this.arr.length-1
                ) {
                    //
                } else if (
                    this.arr[y][x].type == 'empty'
                ) {
                    //
                } else {
                    let direction = '';
                    if (a < 0) direction += 'bottomleft';
                    if (a > 0) direction += 'topright';
                    if (b < 0) direction += 'topleft';
                    if (b > 0) direction += 'bottomright';

                    $('#movement_canvas_cover').find('.' + direction + ' button').attr('disabled', false);
                }
            }
        }
    }

    updateRoom() {
        let t = this.arr[this.party.y][this.party.x];

        if (t.eventComplete) {
            $('#event_cover').hide();
        } else {
            $('#event_cover').show();
        }
    }

    /*updateDungeonDOM() {
        $('#dungeon-flat').html('');
        for (let y = 0; y < this.height; y++) {
            $('#dungeon-flat').append('<div class="d-row"></div>');
            for (let x = 0; x < this.width; x++) {
                let isEmpty = this.arr[y][x].type == 'empty' ? 'empty' : '';
                let $room = $('<button>').addClass('room ' + isEmpty);
                $('#dungeon-flat .d-row').eq(y).append($room);
            }
        }
    }*/
}