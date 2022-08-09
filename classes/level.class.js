class Level {
    endboss;
    coins;
    collectable; /* bottles */
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 3500; /* where game scenario ends */

    constructor(enemies, endboss, clouds, backgroundObjects, collectable, coins) {
        this.enemies = enemies;
        this.endboss = endboss;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.collectable = collectable;
        this.coins = coins;
    }
}