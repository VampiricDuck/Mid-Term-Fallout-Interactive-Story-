const stateManager = (() => {
    let gameState = {
        characterData: {},
        storyProgress: 0,
        inventory: [],
        combatHistory: [],
    };

    const saveState = () => {
        localStorage.setItem('gameState', JSON.stringify(gameState));
    };

    const loadState = () => {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            gameState = JSON.parse(savedState);
        }
    };

    const resetState = () => {
        gameState = {
            characterData: {},
            storyProgress: 0,
            inventory: [],
            combatHistory: [],
        };
        saveState();
    };

    const updateCharacterData = (data) => {
        gameState.characterData = { ...gameState.characterData, ...data };
        saveState();
    };

    const updateStoryProgress = (progress) => {
        gameState.storyProgress = progress;
        saveState();
    };

    const addToInventory = (item) => {
        gameState.inventory.push(item);
        saveState();
    };

    const recordCombat = (combatResult) => {
        gameState.combatHistory.push(combatResult);
        saveState();
    };

    return {
        saveState,
        loadState,
        resetState,
        updateCharacterData,
        updateStoryProgress,
        addToInventory,
        recordCombat,
        getState: () => gameState,
    };
})();

export default stateManager;