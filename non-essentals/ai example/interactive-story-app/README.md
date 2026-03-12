# Interactive Story App

## Overview
The Interactive Story App is a web-based application that allows users to engage in an interactive storytelling experience. Players can create their characters, navigate through various story nodes, and participate in combat scenarios. The application is designed to provide a rich narrative experience with branching paths and player choices.

## Features
- **Character Creation**: Players can customize their characters by selecting attributes and traits.
- **Dynamic Storytelling**: The narrative adapts based on player choices, leading to different outcomes and experiences.
- **Combat Scenarios**: Engage in turn-based combat with mechanics for attack, defense, and damage calculation.
- **User Interface**: A clean and intuitive UI that facilitates navigation through the main menu, introduction, character creation, and gameplay.

## Project Structure
```
interactive-story-app
├── src
│   ├── data
│   │   ├── characters.js        # Character data and management functions
│   │   ├── combat.js            # Combat mechanics and outcomes
│   │   └── storyNodes.js        # Story nodes and branching paths
│   ├── scenes
│   │   ├── mainMenu.js          # Main menu scene
│   │   ├── introduction.js       # Introduction scene
│   │   ├── characterCreation.js  # Character creation logic
│   │   ├── gameplay.js           # Gameplay loop and rendering
│   │   └── combatScenario.js     # Combat scenario management
│   ├── ui
│   │   ├── renderer.js           # UI rendering functions
│   │   └── navigation.js         # Scene navigation management
│   ├── utils
│   │   └── stateManager.js       # Game state management
│   ├── styles
│   │   └── main.css              # Application styles
│   └── app.js                    # Entry point of the application
├── index.html                    # Main HTML file
├── package.json                  # npm configuration file
└── README.md                     # Project documentation
```

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run `npm install` to install the necessary dependencies.
4. Open `index.html` in your web browser to start the application.

## Usage
- Start at the main menu to begin your adventure.
- Follow the prompts to create your character and navigate through the story.
- Make choices that affect the outcome of the narrative and engage in combat when necessary.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.