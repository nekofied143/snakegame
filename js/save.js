/*
=========================================
SAVE SYSTEM
Snake RPG
=========================================
*/

const SAVE_KEY = "snake_rpg_save_v1";

const DEFAULT_SAVE = {

    version: 1,

    player: {
        level: 1,
        xp: 0,
        statPoints: 0,

        hp: 5,
        maxHp: 5,

        score: 0,

        combo: 1,

        upgrades: {
            speed: 0,
            hp: 0,
            food: 0,
            xp: 0
        }
    },

    achievements: [],

    stats: {

        foodEaten: 0,
        totalScore: 0,

        deaths: 0,

        highestLevel: 1,

        playTime: 0
    }
};

let saveData = null;

/*
=========================================
CREATE DEFAULT SAVE
=========================================
*/

function createDefaultSave() {

    return JSON.parse(
        JSON.stringify(DEFAULT_SAVE)
    );
}

/*
=========================================
LOAD
=========================================
*/

function loadSave() {

    try {

        const raw =
            localStorage.getItem(
                SAVE_KEY
            );

        if (!raw) {

            saveData =
                createDefaultSave();

            saveGame();

            return saveData;
        }

        const parsed =
            JSON.parse(raw);

        saveData =
            mergeSave(parsed);

        return saveData;

    }
    catch (err) {

        console.error(
            "Failed loading save",
            err
        );

        saveData =
            createDefaultSave();

        return saveData;
    }
}

/*
=========================================
MERGE OLD SAVE
=========================================
*/

function mergeSave(data) {

    const fresh =
        createDefaultSave();

    if (!data)
        return fresh;

    return {

        ...fresh,

        ...data,

        player: {

            ...fresh.player,

            ...(data.player || {}),

            upgrades: {

                ...fresh.player.upgrades,

                ...(data.player?.upgrades || {})
            }
        },

        stats: {

            ...fresh.stats,

            ...(data.stats || {})
        }
    };
}

/*
=========================================
SAVE
=========================================
*/

function saveGame() {

    try {

        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(saveData)
        );

        showSaveStatus("Saved");

        return true;
    }
    catch (err) {

        console.error(err);

        showSaveStatus("Save Failed");

        return false;
    }
}

/*
=========================================
RESET
=========================================
*/

function resetSave() {

    const yes =
        confirm(
            "Delete all progress?"
        );

    if (!yes)
        return;

    saveData =
        createDefaultSave();

    saveGame();

    location.reload();
}

/*
=========================================
EXPORT
=========================================
*/

function exportSave() {

    try {

        const json =
            JSON.stringify(
                saveData,
                null,
                2
            );

        const blob =
            new Blob(
                [json],
                {
                    type:
                        "application/json"
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const a =
            document.createElement("a");

        a.href = url;

        a.download =
            "snake-rpg-save.json";

        document.body.appendChild(a);

        a.click();

        a.remove();

        URL.revokeObjectURL(
            url
        );

        showSaveStatus(
            "Exported"
        );

    }
    catch (err) {

        console.error(err);

        showSaveStatus(
            "Export Failed"
        );
    }
}

/*
=========================================
IMPORT
=========================================
*/

function importSave(file) {

    const reader =
        new FileReader();

    reader.onload = () => {

        try {

            const data =
                JSON.parse(
                    reader.result
                );

            saveData =
                mergeSave(data);

            saveGame();

            location.reload();

        }
        catch (err) {

            alert(
                "Invalid save file."
            );

            console.error(err);
        }
    };

    reader.readAsText(file);
}

/*
=========================================
AUTO SAVE
=========================================
*/

function startAutoSave() {

    setInterval(() => {

        saveGame();

    }, 15000);
}

/*
=========================================
SAVE STATUS
=========================================
*/

function showSaveStatus(text) {

    let el =
        document.querySelector(
            ".save-status"
        );

    if (!el) {

        el =
            document.createElement(
                "div"
            );

        el.className =
            "save-status";

        document.body.appendChild(
            el
        );
    }

    el.textContent = text;

    el.classList.remove(
        "saved",
        "error"
    );

    if (
        text.toLowerCase()
            .includes("fail")
    ) {

        el.classList.add(
            "error"
        );

    } else {

        el.classList.add(
            "saved"
        );
    }

    clearTimeout(
        el._timer
    );

    el._timer =
        setTimeout(() => {

            el.textContent = "";

        }, 2500);
}

/*
=========================================
STAT HELPERS
=========================================
*/

function addPlayTime(seconds) {

    saveData.stats.playTime +=
        seconds;
}

function addFoodEaten() {

    saveData.stats.foodEaten++;
}

function addDeath() {

    saveData.stats.deaths++;
}

function addScoreStat(amount) {

    saveData.stats.totalScore +=
        amount;
}

function setHighestLevel(level) {

    if (
        level >
        saveData.stats.highestLevel
    ) {

        saveData.stats.highestLevel =
            level;
    }
}

/*
=========================================
INIT
=========================================
*/

loadSave();
startAutoSave();