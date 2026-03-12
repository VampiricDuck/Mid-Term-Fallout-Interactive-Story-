const combat = {
    attack: function(attacker, defender) {
        const attackRoll = Math.floor(Math.random() * 20) + 1; // Roll a d20
        const hitChance = attacker.attackBonus + attackRoll;

        if (hitChance >= defender.armorClass) {
            const damage = this.calculateDamage(attacker);
            defender.hp -= damage;
            return {
                hit: true,
                damage: damage,
                defenderHp: defender.hp
            };
        } else {
            return {
                hit: false,
                damage: 0,
                defenderHp: defender.hp
            };
        }
    },

    calculateDamage: function(character) {
        const baseDamage = Math.floor(Math.random() * character.weapon.damage.dice) + 1; // Roll weapon damage
        const damageBonus = character.strengthModifier; // Add strength modifier for melee
        return baseDamage + damageBonus;
    },

    isCombatOver: function(character) {
        return character.hp <= 0;
    },

    combatOutcome: function(attacker, defender) {
        if (this.isCombatOver(defender)) {
            return `${defender.name} has been defeated!`;
        } else {
            return `${defender.name} has ${defender.hp} HP remaining.`;
        }
    }
};

export default combat;