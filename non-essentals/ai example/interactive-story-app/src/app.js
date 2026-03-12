// Entry point of the interactive story application

import { initializeGame } from './scenes/mainMenu.js';
import { setupNavigation } from './ui/navigation.js';
import { loadState } from './utils/stateManager.js';

// Initialize the game state
const gameState = loadState();

// Setup navigation and start the game
setupNavigation(gameState);
initializeGame(gameState);