// Key used by localStorage for save/load.
const STORAGE_KEY = "fallout_story_save_v1";

// Default game state used when starting fresh.
const initialState = {
  scene: "mainMenu", // First scene shown on startup.
  player: {
    name: "", // Filled during character creation.
    stats: { str: 5, per: 5, end: 5 } // Example starter stats.
  },
  story: {
    introSeen: false, // Becomes true after intro.
    location: "vault_entrance" // Current world location.
  },
  combat: null // Null when not in combat.
};

// Live mutable copy of state.
let state = structuredClone(initialState);

// Set of subscriber callbacks (render functions).
const listeners = new Set();

// Internal function: call all subscribers when state changes.
function notify() {
  for (const listener of listeners) {
    listener(state);
  }
}

// Read current state.
export function getState() {
  return state;
}

// Change only the active scene, then notify.
export function setScene(sceneName) {
  state = { ...state, scene: sceneName };
  notify();
}

// Merge top-level state updates, then notify.
export function patchState(partialState) {
  state = { ...state, ...partialState };
  notify();
}

// Replace player sub-object safely, then notify.
export function patchPlayer(partialPlayer) {
  state = { ...state, player: { ...state.player, ...partialPlayer } };
  notify();
}

// Replace story sub-object safely, then notify.
export function patchStory(partialStory) {
  state = { ...state, story: { ...state.story, ...partialStory } };
  notify();
}

// Subscribe a callback to state updates.
export function subscribe(listener) {
  listeners.add(listener); // Add callback.
  return () => listeners.delete(listener); // Return unsubscribe function.
}

// Reset game to defaults, then notify.
export function resetState() {
  state = structuredClone(initialState);
  notify();
}

// Save full state to browser localStorage.
export function saveGame() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Load state from localStorage; return true/false success.
export function loadGame() {
  const raw = localStorage.getItem(STORAGE_KEY); // Read raw string.
  if (!raw) return false; // No save exists.
  state = JSON.parse(raw); // Convert text back into object.
  notify(); // Redraw current scene from loaded state.
  return true; // Indicate load success.
}

// Delete save data from browser localStorage.
export function deleteSave() {
  localStorage.removeItem(STORAGE_KEY);
}