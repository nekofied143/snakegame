/*
=========================================
ACHIEVEMENTS SYSTEM
Snake RPG
=========================================
*/

const ACHIEVEMENTS = [
    {
        id: "first_food",
        title: "First Bite",
        desc: "Eat your first food"
    },
    {
        id: "first_level",
        title: "Growing Strong",
        desc: "Reach Level 2"
    },
    {
        id: "score_100",
        title: "Beginner Hunter",
        desc: "Reach 100 score"
    },
    {
        id: "score_500",
        title: "Skilled Hunter",
        desc: "Reach 500 score"
    },
    {
        id: "score_1000",
        title: "Snake Master",
        desc: "Reach 1000 score"
    },
    {
        id: "death_1",
        title: "Learning Pain",
        desc: "Die once"
    }
];

const achievementData = saveData.achievements;

/*
=========================================
UNLOCK ACHIEVEMENT
=========================================
*/

function unlockAchievement(id) {

    if (achievementData.includes(id))
        return;

    achievementData.push(id);

    const a = ACHIEVEMENTS.find(x => x.id === id);

    if (a) {
        showAchievementPopup(a.title);
    }

    saveGame();
    renderAchievements();
}

/*
=========================================
CHECK CONDITIONS
=========================================
*/

function checkAchievements() {

    const p = saveData.player;

    if (p.score >= 100) unlockAchievement("score_100");
    if (p.score >= 500) unlockAchievement("score_500");
    if (p.score >= 1000) unlockAchievement("score_1000");

    if (saveData.stats.deaths >= 1)
        unlockAchievement("death_1");
}

/*
=========================================
RENDER LIST
=========================================
*/

function renderAchievements() {

    const container =
        document.getElementById("achievementList");

    if (!container) return;

    container.innerHTML = "";

    ACHIEVEMENTS.forEach(a => {

        const unlocked =
            achievementData.includes(a.id);

        const div =
            document.createElement("div");

        div.className =
            "achievement" +
            (unlocked ? " unlocked" : "");

        div.innerHTML = `
            <div class="achievement-info">
                <div class="achievement-title">${a.title}</div>
                <div class="achievement-desc">${a.desc}</div>
            </div>
            <div class="achievement-lock">
                ${unlocked ? "✔" : "🔒"}
            </div>
        `;

        container.appendChild(div);
    });

    document.getElementById("achievementCount").textContent =
        achievementData.length;
}

/*
=========================================
POPUP
=========================================
*/

function showAchievementPopup(title) {

    const popup =
        document.getElementById("achievementPopup");

    if (!popup) return;

    popup.textContent =
        `Achievement Unlocked: ${title}`;

    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 2000);
}

/*
=========================================
INIT
=========================================
*/

renderAchievements();