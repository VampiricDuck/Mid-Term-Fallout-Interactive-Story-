const navigation = {
    currentScene: null,

    navigateTo(scene) {
        if (this.currentScene) {
            this.currentScene.exit();
        }
        this.currentScene = scene;
        this.currentScene.enter();
    },

    goToMainMenu() {
        const mainMenu = require('../scenes/mainMenu');
        this.navigateTo(mainMenu);
    },

    goToIntroduction() {
        const introduction = require('../scenes/introduction');
        this.navigateTo(introduction);
    },

    goToCharacterCreation() {
        const characterCreation = require('../scenes/characterCreation');
        this.navigateTo(characterCreation);
    },

    goToGameplay() {
        const gameplay = require('../scenes/gameplay');
        this.navigateTo(gameplay);
    },

    goToCombatScenario() {
        const combatScenario = require('../scenes/combatScenario');
        this.navigateTo(combatScenario);
    }
};

module.exports = navigation;