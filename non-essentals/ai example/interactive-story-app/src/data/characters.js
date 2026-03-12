const characters = [
    {
        id: 1,
        name: "Wastelander",
        traits: [
            { id: "1", name: "Survivor", description: "You have learned to adapt and survive in the harsh wasteland." },
            { id: "2", name: "Scavenger", description: "You have a knack for finding useful items in the ruins." }
        ],
        attributes: {
            strength: 5,
            perception: 5,
            endurance: 5,
            charisma: 5,
            intelligence: 5,
            agility: 5,
            luck: 5
        }
    },
    {
        id: 2,
        name: "Raider",
        traits: [
            { id: "1", name: "Brutal", description: "You are feared by others and excel in combat." },
            { id: "2", name: "Intimidating", description: "Your presence alone can scare off potential threats." }
        ],
        attributes: {
            strength: 7,
            perception: 4,
            endurance: 6,
            charisma: 3,
            intelligence: 4,
            agility: 5,
            luck: 2
        }
    },
    {
        id: 3,
        name: "Scholar",
        traits: [
            { id: "1", name: "Knowledgeable", description: "You have extensive knowledge about the world and its history." },
            { id: "2", name: "Resourceful", description: "You can craft items and use resources efficiently." }
        ],
        attributes: {
            strength: 3,
            perception: 5,
            endurance: 4,
            charisma: 6,
            intelligence: 8,
            agility: 4,
            luck: 3
        }
    }
];

function getCharacterById(id) {
    return characters.find(character => character.id === id);
}

function getAllCharacters() {
    return characters;
}

export { getCharacterById, getAllCharacters };