/*
=========================================
UPGRADES SYSTEM
Snake RPG
=========================================
*/

const upgradeConfig = {

    speed: {
        name: "Speed",
        max: 5,
        baseCost: 1
    },

    hp: {
        name: "Max HP",
        max: 5,
        baseCost: 1
    },

    food: {
        name: "Food Value",
        max: 5,
        baseCost: 1
    },

    xp: {
        name: "XP Gain",
        max: 5,
        baseCost: 1
    }
};

const upgrades = saveData.player.upgrades;

/*
=========================================
GET COST
=========================================
*/

function getUpgradeCost(type) {

    const level = upgrades[type];

    return upgradeConfig[type].baseCost + level;
}

/*
=========================================
CAN UPGRADE
=========================================
*/

function canUpgrade(type) {

    const cfg = upgradeConfig[type];

    return (
        saveData.player.statPoints > 0 &&
        upgrades[type] < cfg.max
    );
}

/*
=========================================
APPLY UPGRADE
=========================================
*/

function buyUpgrade(type) {

    if (!canUpgrade(type)) return;

    saveData.player.statPoints--;

    upgrades[type]++;

    applyUpgradeEffects(type);

    updateUpgradeUI();
    saveGame();
}

/*
=========================================
EFFECTS
=========================================
*/

function applyUpgradeEffects(type) {

    const p = saveData.player;

    switch (type) {

        case "speed":
            p.speedMultiplier =
                (p.speedMultiplier || 1) + 0.1;
            break;

        case "hp":
            p.maxHp += 1;
            p.hp += 1;
            break;

        case "food":
            p.foodMultiplier =
                (p.foodMultiplier || 1) + 0.2;
            break;

        case "xp":
            p.xpMultiplier =
                (p.xpMultiplier || 1) + 0.2;
            break;
    }
}

/*
=========================================
UI UPDATE
=========================================
*/

function updateUpgradeUI() {

    document.getElementById("upgradePoints").textContent =
        saveData.player.statPoints;

    for (let key in upgradeConfig) {

        const el =
            document.getElementById(key + "Level");

        if (el) {
            el.textContent =
                upgrades[key];
        }

        const btn =
            document.querySelector(
                `[data-upgrade="${key}"]`
            );

        if (!btn) continue;

        if (upgrades[key] >= upgradeConfig[key].max) {
            btn.classList.add("maxed");
        }
    }
}

/*
=========================================
CLICK HANDLERS
=========================================
*/

function initUpgrades() {

    document.querySelectorAll(".upgrade-btn")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                const type =
                    btn.dataset.upgrade;

                buyUpgrade(type);
            });
        });

    updateUpgradeUI();
}

initUpgrades();