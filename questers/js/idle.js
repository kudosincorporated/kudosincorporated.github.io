class Idle {
    constructor() {
        this.maxTimer = 100;
        this.timer = this.maxTimer;
        this.tickspeed = 1/100;
        this.ticks = 0;

        this.buttonStrength = 5;

        this.healingPercent = 0.1; // healer
        this.goldAdded = 2; // goldmaster
        this.goldTaken = 10; // gemsmith
        this.gemsAdded = 3;

        this.fightExtraClick = 100;
        this.timeExtraClick = 1;

        this.jobs = [
            {
                name: "cleric",
                colorClass: "chartreuse",
                description: "Heals the player for +" + (this.healingPercent * 100) + "% current health.",
                doJob: () => {
                    if (playerGame == null) return;
                    playerGame.units[0].hp += playerGame.units[0].hp * this.healingPercent;
                    if (playerGame.units[0].hp >= playerGame.units[0].maxHp) playerGame.units[0].hp = playerGame.units[0].maxHp; // No over-healing
                    playerGame.softRefreshCharacters();
                }
            },
            {
                name: "goldmaster",
                colorClass: "gold",
                description: "Creates " + this.goldAdded + " gold.",
                doJob: () => {
                    if (playerGame == null) return;
                    playerGame.units[0].addValuable("gold", this.goldAdded);
                    playerGame.updateCharacters();
                }
            },
            {
                name: "gemsmith",
                colorClass: "crimson",
                description: "Converts " + this.goldTaken + " gold to " + this.gemsAdded + " gems.",
                doJob: () => {
                    if (playerGame == null) return;
                    if (playerGame.units[0].hasValuable("gold") < this.goldTaken) return;
                    playerGame.units[0].addValuable("gold", -this.goldTaken);
                    playerGame.units[0].addValuable("gems", this.gemsAdded);
                    playerGame.updateCharacters();
                }
            },
            {
                name: "prophet",
                colorClass: "slateblue",
                description: "If you fail to loot, roll again for each prophet.",
                doJob: () => {
                    // calculated in game.js on enemy death
                    // see function this.getLucky()
                }
            },
            {
                name: "boxer",
                colorClass: "coral",
                description: "Manual clicking is stronger everywhere.",
                doJob: () => {
                    // TODO
                }
            },
        ];

        this.belt = [];

        this.updateIdle();
    }

    update(dt) {
        if (this.belt.length <= 0) return;

        this.timer -= this.tickspeed * dt;
        if (this.timer <= 0) {
            this.timer = this.maxTimer;
            this.ticks++;

            this.tickOver();
        }

        this.updateIdleTimer();
    }

    tickOver() {
        this.belt.forEach((person, index) => {
            const result = this.stringToJobObject(person);
            result.doJob();
        });
    }

    stringToJobObject(jobString) {
        return this.jobs.find(obj => obj.name === jobString);
    }

    updateIdleTimer() {
        let percentage = this.timer / this.maxTimer * 100;
        $('#idle-timer').find('.inner').css('width', percentage + '%');
    }

    updateIdle() {
        $('#idle').html('');

        this.jobs.forEach((job, index) => {
            let count = this.hasPerson(job.name);
            let amount = count != null ? count : 0;

            let $tr = $('<tr>').attr('id', job.name);

            let amountString = '';
            if (amount <= 5) {
                for (let i = 0; i < count; i++) {
                    amountString += '•';
                }
            } else {
                amountString = '•' + count;
            }
            //let classString = amount > 0 ? job.name : 'subtitle';
            let classString = job.colorClass;
            let $job = $('<div>').addClass('item ' + classString).text(job.name);
            $tr.append( $('<td>').html($job) );

            let $amount = $('<div>').addClass(classString).text(amountString);
            $tr.append( $('<td>').html($amount) );
            
            let $minus = $('<button>').addClass('minus').html('-');
            $tr.append( $('<td>').html($minus) );
            
            let $plus = $('<button>').addClass('plus').html('+ <span class="subtitle">Cost: <span class="devotion">•1 devotion</span></span>');
            $tr.append( $('<td>').html($plus) );

            tippy($job[0], {
                content: job.description,
                allowHTML: true,
            });

            $('#idle').append($tr);
        });

        this.updateButtons();
    }

    updateButtons() {
        $('.timeClick').attr('disabled', this.belt.length <= 0);

        $('#idle button').attr('disabled', true);

        // minus
        let self = this;
        $('#idle .minus').each(function(index) {
            let id = $(this).parent().parent().attr('id'); // TODO this probably isn't best practice
            if (self.hasPerson(id) != null) {
                $(this).attr('disabled', false);
            }
        });

        // plus
        if (playerGame == null) return;
        if (playerGame.units.length <= 0) return;
        $('#idle .plus').each(function(index) {
            if (playerGame.units[0].hasValuable('devotion') >= 1) {
                $(this).attr('disabled', false);
                // technically we don't have to do a loop but
                // maybe a surprise tool that'll help us later?
            }
        });
    }

    addPerson(personString, amount) {
        for (let i = 0; i < amount; i++) {
            this.belt.push(personString);
        }

        this.updateRuneList();
    }

    removePerson(personString, amount) {
        for (let i = 0; i < amount; i++) {
            const index = this.belt.indexOf(personString);
            if (index !== -1) {
                this.belt.splice(index, 1);
            } else {
                // stop early if the person is not found
                break;
            }
        }

        this.updateRuneList();
    }

    hasPerson(personString) {
        if (this.belt.includes(personString) == false) return null; // returns null if person doesn't exist
        let count = this.belt.filter(person => person === personString).length;
        return count;
    }

    extraFightStrength() { // fight
        let count = this.hasPerson("boxer");
        if (count == null) return 0;
        count *= this.fightExtraClick;
        return count;
    }

    extraTimeStrength() { // time
        let count = this.hasPerson("boxer");
        if (count == null) return 0;
        count *= this.timeExtraClick;
        return count;
    }
    
    getLucky() {
        let faerieCount = this.hasPerson("prophet");
        if (faerieCount) {
            for (let i = 0; i < faerieCount; i++) {
                if (Math.random() < 0.01) {
                    return true;
                }
            }
        }
        return false;
    }

    updateRuneList() {
        $('#belt').html(this.returnRuneList());
    }

    returnRuneList() {
        let list = $('<span>').addClass('belt');
        this.jobs.forEach((job, index) => {
            const amount = this.hasPerson(job.name);
            if (amount == null) return;
            
            let $rune = $('<div>').addClass('icon diamond ' + job.name + '-bg');
            let $amount = $('<span>').addClass(job.name).text(amount);
            list.append($rune);
            list.append($amount);
        });
        return list;
    }
}