import { ITEMS } from "../data/items.js";
import { goToScene } from "./sceneNavigation.js";

const SHOP_ORDER = [
	"consumable",
	"armor",
	"melee weapon",
	"ranged weapon",
	"mechanical weapon",
	"unarmed weapon",
	"ammo",
	"crafting material"
];

const SHOP_FALLBACK_COSTS = {
	healing_powder: 30,
	stimpak: 90,
	stimpak_diluted: 60,
	super_stimpak: 160,
	ammo_9mm: 4,
	ammo_10mm: 5,
	ammo_357: 6,
	ammo_556: 7,
	ammo_5mm: 5,
	ammo_308: 8,
	ammo_12g: 8,
	fuel: 10,
	missile: 40,
	energy_cell: 7,
	microfusion_cell: 10,
	ammo_2mm_ec: 12,
	cryo_cell: 14,
	fusion_core: 75
};
const MAX_BARTER_FOR_PRICE_PARITY = 10;

function getBaseItemCost(itemOrId) {
	const item = typeof itemOrId === "string" ? ITEMS[itemOrId] : itemOrId;
	const itemId = typeof itemOrId === "string" ? itemOrId : itemOrId?.id;
	const directCost = Number(item?.cost ?? 0) || 0;
	if (directCost > 0) return directCost;
	return Number(SHOP_FALLBACK_COSTS[itemId] ?? 0) || 0;
}

function getBarterFactor(player) {
	const barter = Number(player?.barter ?? 0) || 0;
	return Math.max(0, Math.min(1, barter / MAX_BARTER_FOR_PRICE_PARITY));
}

function getBuyPrice(player, itemId) {
	const baseCost = getBaseItemCost(itemId);
	const t = getBarterFactor(player);
	const buyMultiplier = 1 - t / 6;
	return Math.max(0, Math.round(baseCost * buyMultiplier));
}

function titleCase(value) {
	return String(value)
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function listShopItems() {
	return Object.values(ITEMS)
		.filter((item) => item.id !== "caps" && getBaseItemCost(item) > 0)
		.sort((a, b) => String(a.name ?? "").localeCompare(String(b.name ?? "")));
}

function addItemToInventory(player, itemId) {
	const nextPlayer = structuredClone(player ?? {});
	if (!Array.isArray(nextPlayer.inventory)) nextPlayer.inventory = [];

	const template = ITEMS[itemId] ?? {};
	const stackable = !!template.stackable;
	const idx = nextPlayer.inventory.findIndex((it) => (it?.id ?? it?.itemId) === itemId);

	if (idx >= 0 && stackable) {
		const currentQty = Number(nextPlayer.inventory[idx]?.quantity ?? 0) || 0;
		nextPlayer.inventory[idx] = {
			...nextPlayer.inventory[idx],
			quantity: currentQty + 1
		};
		return nextPlayer;
	}

	nextPlayer.inventory.push({ id: itemId, quantity: 1 });
	return nextPlayer;
}

function getQuantity(entry) {
	return Number(entry?.quantity ?? entry?.qty ?? entry?.count ?? 0) || 0;
}

function setQuantity(entry, nextQty) {
	const q = Math.max(0, Number(nextQty) || 0);
	if (entry && "quantity" in entry) return { ...entry, quantity: q };
	if (entry && "qty" in entry) return { ...entry, qty: q };
	if (entry && "count" in entry) return { ...entry, count: q };
	return { ...entry, quantity: q };
}

function getItemDecay(player, itemId) {
	return Math.max(0, Math.min(10, Number(player?.itemDecay?.[itemId] ?? 0) || 0));
}

function hasFragileProperty(template) {
	const props = Array.isArray(template?.properties) ? template.properties : [];
	return props.some((p) => String(p ?? "").toLowerCase().includes("fragile"));
}

function isItemBrokenForSale(template, decay) {
	const isWeapon = String(template?.type ?? "").toLowerCase().includes("weapon");
	if (isWeapon && hasFragileProperty(template)) return decay >= 1;
	return decay >= 10;
}

function getSellPrice(player, itemId) {
	const template = ITEMS[itemId] ?? {};
	const baseCost = getBaseItemCost(itemId);
	const decay = getItemDecay(player, itemId);
	const t = getBarterFactor(player);

	if (isItemBrokenForSale(template, decay)) return 0;

	const sellMultiplier = 2 / 3 + t / 6;
	const value = Math.round(baseCost * sellMultiplier) - decay * 10;
	return Math.max(0, value);
}

function removeOneFromInventory(player, itemId) {
	const nextPlayer = structuredClone(player ?? {});
	if (!Array.isArray(nextPlayer.inventory)) nextPlayer.inventory = [];

	const idx = nextPlayer.inventory.findIndex((it) => (it?.id ?? it?.itemId) === itemId);
	if (idx < 0) return { player: nextPlayer, removed: false };

	const entry = nextPlayer.inventory[idx];
	const qty = getQuantity(entry);
	if (qty <= 0) return { player: nextPlayer, removed: false };

	if (qty === 1) {
		nextPlayer.inventory.splice(idx, 1);
	} else {
		nextPlayer.inventory[idx] = setQuantity(entry, qty - 1);
	}

	return { player: nextPlayer, removed: true };
}

function listSellableItems(player) {
	const inv = Array.isArray(player?.inventory) ? player.inventory : [];
	return inv
		.map((entry) => ({
			id: entry?.id ?? entry?.itemId,
			quantity: getQuantity(entry)
		}))
		.filter((entry) => entry.id && entry.id !== "caps" && entry.quantity > 0 && ITEMS[entry.id])
		.sort((a, b) => String(ITEMS[a.id]?.name ?? a.id).localeCompare(String(ITEMS[b.id]?.name ?? b.id)));
}

export function renderShop(root, api, statusMessage = ">> Looking to buy something?", mode = "buy") {
	const stock = listShopItems();
	const groups = new Map();

	for (const type of SHOP_ORDER) groups.set(type, []);

	for (const item of stock) {
		const type = item.type ?? "misc";
		if (!groups.has(type)) groups.set(type, []);
		groups.get(type).push(item);
	}

	const playerState = structuredClone(api.getState().player ?? {});
	const playerCaps = Number(playerState.caps ?? 0) || 0;

	const buySectionHtml = [...groups.entries()]
		.filter(([, items]) => items.length > 0)
		.map(([type, items]) => {
			const rows = items
				.map((item) => {
					const itemCost = getBuyPrice(playerState, item.id);
					return `
						<div class="shop-row">
							<span>${item.name} (${itemCost} caps)</span>
							<button data-buy="${item.id}">[ BUY ]</button>
						</div>
					`;
				})
				.join("");

			return `
				<h3>${titleCase(type)}</h3>
				<div class="shop-group">${rows}</div>
			`;
		})
		.join("<br />");

	const sellable = listSellableItems(playerState);
	const sellSectionHtml = sellable.length
		? sellable
				.map((entry) => {
					const item = ITEMS[entry.id];
					const decay = getItemDecay(playerState, entry.id);
					const price = getSellPrice(playerState, entry.id);
					const decayLabel = decay > 0 ? ` | Decay ${decay}/10` : "";
					return `
						<div class="shop-row">
							<span>${item.name} x${entry.quantity} (${price} caps each${decayLabel})</span>
							<button data-sell="${entry.id}">[ SELL 1 ]</button>
						</div>
					`;
				})
				.join("")
		: "<p>>> You have nothing to sell.</p>";

	const contentHtml = mode === "sell" ? sellSectionHtml : buySectionHtml;

	root.innerHTML = `
		<section class="scene scene-intro">
			<h1>DOGTOWN SHOP</h1><br />
			<img src="(0)Images/placeholder.png" alt="Shop Image" class="intro-image" width="100" height="100" /><br /><br />
			-------------------------------------------------------<br /><br />
			<p id="shopCaps">Caps: ${playerCaps}</p>
			<p id="shopStatus">${statusMessage}</p><br />
			<div class="actions">
				<button id="shopBuyModeBtn">[ BUY ]</button>
				<button id="shopSellModeBtn">[ SELL ]</button>
			</div><br />
			<div class="shop-sections">${contentHtml}</div><br />
			<div class="actions">
				<button id="leaveShopBtn">[ RETURN TO DOGTOWN ]</button>
			</div>
		</section>
	`;

	const statusEl = root.querySelector("#shopStatus");

	root.querySelectorAll("[data-buy]").forEach((btn) => {
		btn.addEventListener("click", () => {
			const itemId = btn.getAttribute("data-buy");
			const item = ITEMS[itemId];
			if (!item) return;

			const state = api.getState();
			const player = structuredClone(state.player ?? {});
			const caps = Number(player.caps ?? 0) || 0;
			const cost = getBuyPrice(player, itemId);

			if (caps < cost) {
				if (statusEl) statusEl.textContent = `>> Not enough caps for ${item.name}.`;
				return;
			}

			const withItem = addItemToInventory(player, itemId);
			withItem.caps = caps - cost;

			api.patchPlayer(withItem);
			renderShop(root, api, `>> Bought ${item.name} for ${cost} caps.`, "buy");
		});
	});

	root.querySelectorAll("[data-sell]").forEach((btn) => {
		btn.addEventListener("click", () => {
			const itemId = btn.getAttribute("data-sell");
			const item = ITEMS[itemId];
			if (!item) return;

			const state = api.getState();
			const player = structuredClone(state.player ?? {});
			const sellPrice = getSellPrice(player, itemId);

			const removed = removeOneFromInventory(player, itemId);
			if (!removed.removed) {
				renderShop(root, api, `>> Could not sell ${item.name}.`, "sell");
				return;
			}

			removed.player.caps = (Number(removed.player.caps ?? 0) || 0) + sellPrice;
			api.patchPlayer(removed.player);

			renderShop(root, api, `>> Sold ${item.name} for ${sellPrice} caps.`, "sell");
		});
	});

	root.querySelector("#shopBuyModeBtn")?.addEventListener("click", () => {
		renderShop(root, api, ">> Looking to buy something?", "buy");
	});

	root.querySelector("#shopSellModeBtn")?.addEventListener("click", () => {
		renderShop(root, api, ">> Looking to sell something?", "sell");
	});

	root.querySelector("#leaveShopBtn")?.addEventListener("click", () => {
		goToScene(api, "dogtown");
	});
}