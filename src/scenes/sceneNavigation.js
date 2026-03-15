export function goToScene(api, sceneName) {
  api.patchStory({ location: sceneName });
  api.setScene(sceneName);
}

export function maybeTravelWithCombat(api, destinationScene, encounterChance = 0.75) {
  if (Math.random() < encounterChance) {
    api.patchStory({ pendingScene: destinationScene });
    api.setScene("combat");
    return;
  }

  goToScene(api, destinationScene);
}

export function forceCombatAndReturn(api, returnScene) {
  api.patchStory({ pendingScene: returnScene });
  api.setScene("combat");
}
