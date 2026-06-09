/*
=========================================
PLAYER SYSTEM
Snake RPG
Handles:
- Leveling
- XP
- HP
- Stats
- Combo
=========================================
*/

const player = saveData.player;

/*
=========================================
XP SYSTEM
=========================================
*/

function xpRequired(level) {
    return 100 + (level - 1) * 50;
}

function addXP(amount) {

    const multiplier =
        1 + (player.upgrades.xp * 0.2);

    const gained =
        Math.floor(amount * multiplier);

    player.xp += gained;

    showXPFlash();

    checkLevelUp();

    updateUI();
}

/*
=========================================
LEVEL UP
=========================================
*/

function checkLevelUp() {

    let required =
        xpRequired(player.level);

    while (player.xp >= required) {

        player.xp -= required;

        player.level++;

        player.statPoints += 1;

        player.maxHp += 1;

        player.hp = player.maxHp;

        showLevelUp();

        unlockAchievement("first_level");

        required =
            xpRequired(player.level);
    }

    setHighestLevel(player.level);
}

/*
=========================================
DAMAGE SYSTEM
=========================================
*/

function damagePlayer(amount = 1) {

    player.hp -= amount;

    showDamageFlash();

    shakeScreen();

    resetCombo();

    if (player.hp <= 0) {

        handleDeath();
    }

    updateUI();
}

/*
=========================================
HEAL SYSTEM
=========================================
*/

function healPlayer(amount = 1) {

    player.hp += amount;

    if (player.hp > player.maxHp)
        player.hp = player.maxHp;

    updateUI();
}

/*
=========================================
COMBO SYSTEM
=========================================
*/

function addCombo() {

    player.combo++;

    if (player.combo > 10)
        player.combo = 10;

    updateUI();
}

function resetCombo() {

    player.combo = 1;

    updateUI();
}

/*
=========================================
DEATH
=========================================
*/

function handleDeath() {

    addDeath();

    player.hp = player.maxHp;

    player.xp = 0;

    player.level = Math.max(1, player.level - 1);

    showGameOver();

    saveGame();
}

/*
=========================================
UTILS
=========================================
*/

function getXPPercent() {

    return (player.xp / xpRequired(player.level)) * 100;
}

/*
=========================================
STAT UPGRADES
=========================================
*/

function applyUpgrade(type) {

    if (player.statPoints <= 0)
        return;

    player.statPoints--;

    switch (type) {

        case "speed":
            player.upgrades.speed++;
            break;

        case "hp":
            player.upgrades.hp++;
            player.maxHp += 1;
            player.hp += 1;
            break;

        case "food":
            player.upgrades.food++;
            break;

        case "xp":
            player.upgrades.xp++;
            break;
    }

    updateUI();
    saveGame();
}

/*
=========================================
SCORE SYSTEM
=========================================
*/

function addScore(amount) {

    const comboBonus =
        player.combo * 0.2;

    const total =
        Math.floor(amount * (1 + comboBonus));

    player.score += total;

    addScoreStat(total);

    addCombo();

    updateUI();
}

/*
=========================================
RESET PLAYER (optional soft reset)
=========================================
*/

function resetPlayer() {

    player.level = 1;
    player.xp = 0;
    player.hp = player.maxHp;
    player.combo = 1;
    player.score = 0;
    player.statPoints = 0;

    updateUI();
}

/*
=========================================
UI HELPERS
=========================================
*/

function updateUI() {

    document.getElementById("playerLevel").textContent =
        player.level;

    document.getElementById("xpText").textContent =
        `${player.xp} / ${xpRequired(player.level)}`;

    document.getElementById("xpFill").style.width =
        `${getXPPercent()}%`;

    document.getElementById("hp").textContent =
        player.hp;

    document.getElementById("score").textContent =
        player.score;

    document.getElementById("combo").textContent =
        `x${player.combo}`;

    document.getElementById("statPoints").textContent =
        player.statPoints;
}

/*
=========================================
UI EFFECTS HOOKS
(these will be implemented in ui.js)
=========================================
*/

function showLevelUp() {
    if (window.UI) UI.showLevelUp();
}

function showDamageFlash() {
    if (window.UI) UI.damageFlash();
}

function showXPFlash() {
    if (window.UI) UI.xpFlash();
}

function shakeScreen() {
    if (window.UI) UI.shake();
}

function showGameOver() {
    if (window.UI) UI.gameOver();
}