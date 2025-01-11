const LOWEST_L_VALUE = 0.2;
const J_RANGE = 0.1;
const BENCHMARK_MIN = 5;
const BENCHMARK_MAX = 10000;

const CALC = {

    // normalise the L value, as the "starting" area is actually L = 0.2, when it should be L = 0

    normaliseL(L) {
        return (L - LOWEST_L_VALUE) / (1 - LOWEST_L_VALUE);
    },
    
    rToPercent(rarity) { // dual-purpose; also used for creating rarity+1 weapons
        return (rarity+1)/RARITY_COLOURS.length; // TODO hardcoded
    },

    // weapons

    getDamage(L, rarity) {
        L = this.normaliseL(L);

        let min = linearScale(L, BENCHMARK_MIN * 0.09, BENCHMARK_MAX * 0.09);
        let max = linearScale(L, BENCHMARK_MIN * 0.11, BENCHMARK_MAX * 0.11);

        min *= this.rToPercent(rarity);
        max *= this.rToPercent(rarity);

        min = jitter(min, J_RANGE, BENCHMARK_MIN * 0.09, BENCHMARK_MAX * 0.09);
        max = jitter(max, J_RANGE, BENCHMARK_MIN * 0.11, BENCHMARK_MAX * 0.11);

        min = Math.ceil(min);
        max = Math.ceil(max);

        return {
            min: min,
            max: max,
        }
    },

    getAttackSpeed(L, rarity) {
        L = this.normaliseL(L);

        let v = linearScale(L, 10000, 1000);

        v = jitter(v, J_RANGE, 1000, 10000);

        v = Math.round(v);

        return v;
    },

    getCritChance(L, rarity) {
        return Math.random();
    },

    // characters

    getHp(L) {
        L = this.normaliseL(L);

        let v = linearScale(L, BENCHMARK_MIN, BENCHMARK_MAX);

        v = jitter(v, J_RANGE, BENCHMARK_MIN, BENCHMARK_MAX);

        v = Math.round(v);

        return v;
    },

    numOfWeapons(L) {
        L = this.normaliseL(L);

        let v = linearScale(L, 1, 32);

        v = jitter(v, J_RANGE, 1, 32);

        v = Math.round(v);

        return v;
    },

    rarityOfWeapon(L) {
        L = this.normaliseL(L);

        let v = linearScale(L, 0, 6);

        v = jitter(v, J_RANGE, 0, 6);

        v = Math.round(v);

        return v;
    },

    numOfItem(L, min, max, chance) {
        L = this.normaliseL(L);

        if (Math.random() >= chance) return 0; // don't add item if it fails the chance check

        let v = linearScale(L, min, max);

        v = jitter(v, J_RANGE, min, max);

        v = Math.round(v);

        return v;
    },

    // dungeon

    getWaterCost() { // TODO implement
        return 1;
    },

    // game

    numOfEnemies(L) {
        L = this.normaliseL(L);

        let v = linearScale(L, 1, 3);

        v = jitter(v, J_RANGE, 1, 3);

        v = Math.round(v);

        return v;
    }

}