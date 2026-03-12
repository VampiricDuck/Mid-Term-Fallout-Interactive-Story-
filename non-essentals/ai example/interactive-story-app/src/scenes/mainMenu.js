const mainMenu = {
    render: function() {
        const menuContainer = document.getElementById("menu-container");
        menuContainer.innerHTML = `
            <h1>Welcome to the Interactive Story</h1>
            <button id="start-button">Start Game</button>
            <button id="load-button">Load Game</button>
            <button id="exit-button">Exit</button>
        `;

        document.getElementById("start-button").addEventListener("click", this.startGame);
        document.getElementById("load-button").addEventListener("click", this.loadGame);
        document.getElementById("exit-button").addEventListener("click", this.exitGame);
    },

    startGame: function() {
        // Navigate to the introduction scene
        window.location.hash = "#introduction";
    },

    loadGame: function() {
        // Logic to load a saved game
        alert("Load game functionality is not implemented yet.");
    },

    exitGame: function() {
        // Logic to exit the game
        alert("Exiting the game...");
        window.close();
    }
};

// Export the mainMenu object for use in other modules
export default mainMenu;