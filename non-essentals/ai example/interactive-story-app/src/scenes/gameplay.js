// src/scenes/gameplay.js
const gameplay = {
    currentNode: null,
    playerChoices: [],

    init: function(startNode) {
        this.currentNode = startNode;
        this.renderCurrentNode();
    },

    renderCurrentNode: function() {
        const nodeContent = this.currentNode.content;
        const choices = this.currentNode.choices;

        document.getElementById("story-text").textContent = nodeContent;
        this.renderChoices(choices);
    },

    renderChoices: function(choices) {
        const choicesContainer = document.getElementById("choices");
        choicesContainer.innerHTML = ""; // Clear previous choices

        choices.forEach((choice, index) => {
            const button = document.createElement("button");
            button.textContent = choice.text;
            button.addEventListener("click", () => this.handleChoice(choice));
            choicesContainer.appendChild(button);
        });
    },

    handleChoice: function(choice) {
        this.playerChoices.push(choice);
        this.currentNode = choice.nextNode;
        this.renderCurrentNode();
    }
};

// Export the gameplay module for use in other parts of the application
export default gameplay;