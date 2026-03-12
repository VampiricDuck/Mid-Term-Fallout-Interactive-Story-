// This file manages the introduction scene, setting up the initial narrative context and transitioning to the character creation scene.

const introductionScene = {
    title: "Welcome to the Interactive Story",
    content: "In a world ravaged by chaos and uncertainty, you are about to embark on an epic journey. Your choices will shape the fate of your character and the world around you. Prepare yourself for adventure, danger, and discovery.",
    start: function() {
        this.render();
        this.setupEventListeners();
    },
    render: function() {
        const titleElement = document.getElementById("scene-title");
        const contentElement = document.getElementById("scene-content");
        titleElement.textContent = this.title;
        contentElement.textContent = this.content;
    },
    setupEventListeners: function() {
        const nextButton = document.getElementById("next-button");
        nextButton.addEventListener("click", () => {
            this.transitionToCharacterCreation();
        });
    },
    transitionToCharacterCreation: function() {
        // Logic to navigate to the character creation scene
        window.location.hash = "#character-creation";
    }
};

// Initialize the introduction scene
introductionScene.start();