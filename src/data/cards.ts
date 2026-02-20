import type { Commodity, ProductionCard, RailroadCard, TownCard, BuildingTile } from '../types';

/** 54 price & production cards (price = commodities that go +1 when played; production = commodities you take). Hardcoded to match price_and_production.csv. */
const PRICE_AND_PRODUCTION_CARDS: { production: Partial<Record<Commodity, number>>; priceIncrease: Commodity[] }[] = [
  { priceIncrease: ['wheat', 'wheat', 'coal', 'goods'], production: { wheat: 1, wood: 1, luxury: 1 } },
  { priceIncrease: ['wood', 'iron', 'luxury'], production: { wheat: 1, wood: 1, coal: 1, goods: 1 } },
  { priceIncrease: ['wood', 'goods', 'luxury'], production: { iron: 2, luxury: 2 } },
  { priceIncrease: ['wood', 'iron', 'iron', 'iron'], production: { coal: 2, luxury: 1 } },
  { priceIncrease: ['wheat', 'wood'], production: { wheat: 1, wood: 2, luxury: 1, iron: 1 } },
  { priceIncrease: ['wheat', 'iron', 'goods', 'luxury'], production: { wheat: 1, coal: 1, luxury: 1 } },
  { priceIncrease: ['wood', 'wood'], production: { coal: 1, iron: 1, goods: 1, luxury: 1 } },
  { priceIncrease: ['coal', 'goods', 'goods'], production: { wheat: 1, iron: 1, coal: 1 } },
  { priceIncrease: ['goods', 'goods', 'luxury'], production: { wheat: 1, wood: 1, coal: 1 } },
  { priceIncrease: ['wheat', 'wood'], production: { iron: 2, coal: 1, goods: 1 } },
  { priceIncrease: ['coal', 'goods', 'luxury'], production: { wheat: 2, wood: 1, goods: 1 } },
  { priceIncrease: ['coal', 'luxury'], production: { wheat: 1, wood: 2, luxury: 1, goods: 1 } },
  { priceIncrease: ['iron', 'iron'], production: { iron: 1, coal: 1, luxury: 2 } },
  { priceIncrease: ['wheat', 'iron'], production: { wheat: 3, wood: 1, iron: 1 } },
  { priceIncrease: ['wheat', 'iron', 'coal'], production: { wheat: 1, coal: 1, iron: 1, goods: 1 } },
  { priceIncrease: ['iron', 'coal'], production: { wheat: 1, wood: 2, coal: 1 } },
  { priceIncrease: ['wheat', 'wood', 'goods'], production: { iron: 3, coal: 1 } },
  { priceIncrease: ['wheat', 'coal', 'goods', 'goods'], production: { wood: 1, goods: 1, luxury: 1 } },
  { priceIncrease: ['coal', 'coal', 'goods'], production: { wheat: 1, wood: 1, coal: 1 } },
  { priceIncrease: ['wood', 'luxury'], production: { wheat: 2, goods: 1, luxury: 1 } },
  { priceIncrease: ['wood', 'goods'], production: { wheat: 1, coal: 1, luxury: 1, wood: 2 } },
  { priceIncrease: ['luxury', 'luxury', 'luxury'], production: { wood: 1, iron: 2 } },
  { priceIncrease: ['wood', 'goods'], production: { wheat: 1, wood: 1, iron: 1, luxury: 1 } },
  { priceIncrease: ['coal', 'coal', 'luxury'], production: { wheat: 1, wood: 1, coal: 1 } },
  { priceIncrease: ['goods', 'luxury', 'luxury'], production: { wheat: 1, wood: 1, iron: 1 } },
  { priceIncrease: ['coal', 'goods'], production: { wheat: 1, coal: 1, goods: 2, iron: 1 } },
  { priceIncrease: ['wood', 'wood', 'luxury'], production: { wood: 1, goods: 1, iron: 1, luxury: 1 } },
  { priceIncrease: ['wood', 'coal', 'iron', 'luxury'], production: { wood: 2, iron: 1 } },
  { priceIncrease: ['wheat', 'luxury'], production: { coal: 3, luxury: 1, iron: 1 } },
  { priceIncrease: ['coal', 'luxury'], production: { wheat: 2, goods: 1, luxury: 1 } },
  { priceIncrease: ['coal', 'coal'], production: { wheat: 1, coal: 1, wood: 1, luxury: 1 } },
  { priceIncrease: ['wood', 'goods', 'goods', 'coal'], production: { wheat: 1, wood: 1, goods: 1 } },
  { priceIncrease: ['iron', 'goods'], production: { wheat: 1, goods: 1, iron: 1, luxury: 1 } },
  { priceIncrease: ['wheat', 'iron', 'wood', 'luxury'], production: { wheat: 1, wood: 1, goods: 1 } },
  { priceIncrease: ['wheat', 'goods', 'goods', 'luxury'], production: { coal: 1, goods: 1, luxury: 1 } },
  { priceIncrease: ['iron', 'iron', 'iron', 'luxury'], production: { wood: 1, coal: 2 } },
  { priceIncrease: ['wood', 'wood', 'iron', 'coal'], production: { coal: 2, luxury: 2 } },
  { priceIncrease: ['wheat', 'wheat', 'goods', 'luxury'], production: { wheat: 1, coal: 1, luxury: 1 } },
  { priceIncrease: ['wood', 'goods'], production: { iron: 2, goods: 3 } },
  { priceIncrease: ['coal', 'luxury', 'luxury'], production: { wheat: 3, wood: 1 } },
  { priceIncrease: ['wheat', 'goods'], production: { coal: 3, luxury: 1, wood: 1 } },
  { priceIncrease: ['goods', 'luxury'], production: { wood: 2, iron: 1, coal: 1, goods: 1 } },
  { priceIncrease: ['wheat', 'iron', 'iron', 'goods'], production: { wood: 1, iron: 1, goods: 1 } },
  { priceIncrease: ['wood', 'iron'], production: { wheat: 2, goods: 1, luxury: 1 } },
  { priceIncrease: ['wood', 'iron', 'goods'], production: { wheat: 2, wood: 1, luxury: 1 } },
  { priceIncrease: ['coal', 'coal', 'luxury'], production: { iron: 2, coal: 1, goods: 1 } },
  { priceIncrease: ['wheat', 'coal', 'goods'], production: { wood: 1, goods: 2, coal: 1 } },
  { priceIncrease: ['iron', 'goods'], production: { iron: 1, coal: 3, luxury: 1 } },
  { priceIncrease: ['iron', 'iron'], production: { wheat: 3, goods: 1, luxury: 1 } },
  { priceIncrease: ['iron', 'coal', 'luxury'], production: { wheat: 2, goods: 2 } },
  { priceIncrease: ['coal', 'iron', 'goods'], production: { wood: 2, iron: 1, goods: 1 } },
  { priceIncrease: ['iron', 'luxury'], production: { wood: 1, coal: 1, iron: 1, goods: 1 } },
  { priceIncrease: ['wood', 'goods'], production: { wheat: 1, goods: 1, coal: 1, luxury: 1 } },
  { priceIncrease: ['wood', 'luxury'], production: { wood: 1, goods: 2, luxury: 2 } },
];

export function createProductionDeck(): ProductionCard[] {
  const deck: ProductionCard[] = PRICE_AND_PRODUCTION_CARDS.map((row, i) => ({
    id: `prod-${i}`,
    production: row.production,
    priceIncrease: row.priceIncrease,
  }));
  return shuffle(deck);
}

/** Railroad type template: 4 copies of each. vpSchedule = VP for 1st, 2nd, 3rd, 4th copy (totals: 4/9/15/23 etc). Exported for dev panel. */
export const RAILROAD_TYPES: { typeId: string; name: string; minBid: number; vpSchedule: number[] }[] = [
  { typeId: 'top-dog', name: 'Top Dog', minBid: 6, vpSchedule: [4, 5, 6, 8] },           // 4 / 9 / 15 / 23
  { typeId: 'tycoon-railroad', name: 'Tycoon Railroad', minBid: 7, vpSchedule: [4, 5, 7, 9] }, // 4 / 9 / 16 / 25
  { typeId: 'big-bear', name: 'Big Bear', minBid: 5, vpSchedule: [3, 4, 6, 8] },         // 3 / 7 / 13 / 21
  { typeId: 'fat-cat', name: 'Fat Cat', minBid: 4, vpSchedule: [3, 4, 5, 7] },           // 3 / 7 / 12 / 19
  { typeId: 'sly-fox', name: 'Sly Fox', minBid: 3, vpSchedule: [2, 3, 5, 7] },           // 2 / 5 / 10 / 17
  { typeId: 'skunk-works', name: 'Skunk Works', minBid: 2, vpSchedule: [2, 3, 4, 6] },    // 2 / 5 / 9 / 15
];

/** 2p: remove Sly Fox, Skunk Works, Tycoon. 3p: remove Skunk Works, Tycoon. 4p: remove Skunk Works. 5p: all. */
export function createRailroadDeck(numPlayers: number): RailroadCard[] {
  let types = [...RAILROAD_TYPES];
  if (numPlayers <= 4) types = types.filter(t => t.typeId !== 'skunk-works');
  if (numPlayers <= 3) types = types.filter(t => t.typeId !== 'tycoon-railroad');
  if (numPlayers <= 2) types = types.filter(t => t.typeId !== 'sly-fox');
  const deck: RailroadCard[] = [];
  let id = 0;
  for (const t of types) {
    for (let copy = 0; copy < 4; copy++) {
      deck.push({
        id: `rr-${id++}`,
        typeId: t.typeId,
        name: t.name,
        minBid: t.minBid,
        vpSchedule: t.vpSchedule,
      });
    }
  }
  return shuffle(deck);
}

/** Town cards from towns.csv: name, points, specific resource cost, wild (any) cost. */
export const TOWNS: TownCard[] = [
  { id: 't-1', name: 'Beaver Ford', vp: 2, costSpecific: { wood: 2 }, costAny: 4 },
  { id: 't-2', name: 'Bridgewater', vp: 2, costSpecific: { wheat: 2 }, costAny: 4 },
  { id: 't-3', name: 'Molehill', vp: 2, costSpecific: { iron: 2 }, costAny: 4 },
  { id: 't-4', name: 'Black Friar', vp: 2, costSpecific: { coal: 2 }, costAny: 4 },
  { id: 't-5', name: 'Foxwoods', vp: 3, costSpecific: { wood: 3 }, costAny: 5 },
  { id: 't-6', name: 'Trinity', vp: 3, costSpecific: { goods: 3 }, costAny: 5 },
  { id: 't-7', name: 'Newgate', vp: 3, costSpecific: { wheat: 3 }, costAny: 4 },
  { id: 't-8', name: 'Marketshire', vp: 3, costSpecific: { luxury: 3 }, costAny: 5 },
  { id: 't-9', name: 'Badger Downs', vp: 4, costSpecific: { wheat: 4 }, costAny: 6 },
  { id: 't-10', name: 'Wild Grove', vp: 4, costSpecific: { wood: 4 }, costAny: 6 },
  { id: 't-11', name: 'Dunmoor', vp: 4, costSpecific: { coal: 4 }, costAny: 6 },
  { id: 't-12', name: "Bishop's Glen", vp: 4, costSpecific: { iron: 4 }, costAny: 6 },
  { id: 't-13', name: "Land's End", vp: 5, costSpecific: { luxury: 5 }, costAny: 8 },
  { id: 't-14', name: 'Drover Crossing', vp: 5, costSpecific: { goods: 5 }, costAny: 8 },
  { id: 't-15', name: 'Canterbury Woods', vp: 5, costSpecific: { wood: 5 }, costAny: 8 },
  { id: 't-16', name: 'River Ridge', vp: 5, costSpecific: { wheat: 5 }, costAny: 8 },
];

/** Town deck: stacked by increasing VP (2, 3, 4, 5), order within each VP level randomized. For 2p, every other card is removed. */
export function createTownDeck(numPlayers: number): TownCard[] {
  const byVp = new Map<number, TownCard[]>();
  for (const t of TOWNS) {
    if (!byVp.has(t.vp)) byVp.set(t.vp, []);
    byVp.get(t.vp)!.push(t);
  }
  const deck: TownCard[] = [];
  for (const vp of [2, 3, 4, 5]) {
    const group = byVp.get(vp) ?? [];
    deck.push(...shuffle(group));
  }
  if (numPlayers === 2) {
    return deck.filter((_, i) => i % 2 === 0);
  }
  return deck;
}

const COMMODITY_NAMES: Record<Commodity, string> = {
  wheat: 'Wheat', wood: 'Wood', iron: 'Iron', coal: 'Coal', goods: 'Goods', luxury: 'Luxury',
};

export const COMMODITY_EMOJI: Record<Commodity, string> = {
  wheat: '🌾',
  wood: '🪵',
  iron: '⚙️',
  coal: '🪨',
  goods: '📦',
  luxury: '💎',
};

/** Building tiles from Raccoon Tycoon. B/P = only one B/P effect at a time. B cards are double-sided: front +1, back +2; only the front is in the deck; player can pay to upgrade. */
const BUILDING_TILES: BuildingTile[] = [
  // B cards: 6 (or 7) physical cards, two sides each. Front (+1) in deck; back (+2) obtained by upgrade.
  { id: 'wheat-field-b', name: 'Wheat Field (B)', cost: 4, description: '+1 Wheat', commodityBonus: 'wheat', bonusValue: 1, bpTag: true, bpLevel: 1, upgradeCost: 5, bpUpgradeToId: 'grain-farm-b' },
  { id: 'grain-farm-b', name: 'Grain Farm (B)', cost: 9, description: '+2 Wheat', commodityBonus: 'wheat', bonusValue: 2, bpTag: true, bpLevel: 2, bpUpgradeFromId: 'wheat-field-b' },
  { id: 'lumber-yard-b', name: 'Lumber Yard (B)', cost: 4, description: '+1 Wood', commodityBonus: 'wood', bonusValue: 1, bpTag: true, bpLevel: 1, upgradeCost: 5, bpUpgradeToId: 'saw-mill-b' },
  { id: 'saw-mill-b', name: 'Saw Mill (B)', cost: 9, description: '+2 Wood', commodityBonus: 'wood', bonusValue: 2, bpTag: true, bpLevel: 2, bpUpgradeFromId: 'lumber-yard-b' },
  { id: 'coal-deposit-b', name: 'Coal Deposit (B)', cost: 5, description: '+1 Coal', commodityBonus: 'coal', bonusValue: 1, bpTag: true, bpLevel: 1, upgradeCost: 7, bpUpgradeToId: 'coal-mine-b' },
  { id: 'coal-mine-b', name: 'Coal Mine (B)', cost: 12, description: '+2 Coal', commodityBonus: 'coal', bonusValue: 2, bpTag: true, bpLevel: 2, bpUpgradeFromId: 'coal-deposit-b' },
  { id: 'iron-deposit-b', name: 'Iron Deposit (B)', cost: 5, description: '+1 Iron', commodityBonus: 'iron', bonusValue: 1, bpTag: true, bpLevel: 1, upgradeCost: 7, bpUpgradeToId: 'iron-mine-b' },
  { id: 'iron-mine-b', name: 'Iron Mine (B)', cost: 12, description: '+2 Iron', commodityBonus: 'iron', bonusValue: 2, bpTag: true, bpLevel: 2, bpUpgradeFromId: 'iron-deposit-b' },
  { id: 'tool-die-b', name: 'Tool & Die (B)', cost: 6, description: '+1 Goods', commodityBonus: 'goods', bonusValue: 1, bpTag: true, bpLevel: 1, upgradeCost: 9, bpUpgradeToId: 'loom-b' },
  { id: 'loom-b', name: 'Loom (B)', cost: 15, description: '+2 Goods', commodityBonus: 'goods', bonusValue: 2, bpTag: true, bpLevel: 2, bpUpgradeFromId: 'tool-die-b' },
  { id: 'vineyard-b', name: 'Vineyard (B)', cost: 6, description: '+1 Luxury', commodityBonus: 'luxury', bonusValue: 1, bpTag: true, bpLevel: 1, upgradeCost: 9, bpUpgradeToId: 'glass-works-b' },
  { id: 'glass-works-b', name: 'Glass Works (B)', cost: 15, description: '+2 Luxury', commodityBonus: 'luxury', bonusValue: 2, bpTag: true, bpLevel: 2, bpUpgradeFromId: 'vineyard-b' },
  { id: 'machine-shop-b', name: 'Machine Shop (B)', cost: 30, description: '+1 Commodity of your choice', anyCommodityBonus: 1, bpTag: true, bpLevel: 1, upgradeCost: 30, bpUpgradeToId: 'water-mill-b' },
  { id: 'water-mill-b', name: 'Water Mill (B)', cost: 60, description: '+2 Commodities of your choice', anyCommodityBonus: 2, bpTag: true, bpLevel: 2, bpUpgradeFromId: 'machine-shop-b' },
  { id: 'lumber-wheat-trading-firm', name: 'Lumber/ Wheat Trading Firm', cost: 10, description: 'You get $1/ unit of Wood or Wheat that is sold by any player.', tradingFirmCommodities: ['wood', 'wheat'] },
  { id: 'goods-luxury-trading-firm', name: 'Goods Luxury Trading Firm', cost: 10, description: 'You get $1/ unit of Goods or Luxury that is sold by any player.', tradingFirmCommodities: ['goods', 'luxury'] },
  { id: 'coal-iron-trading-firm', name: 'Coal / Iron Trading Firm', cost: 10, description: 'You get $1/ unit of Coal or Iron that is sold by any player.', tradingFirmCommodities: ['coal', 'iron'] },
  { id: 'warehouse-x2', name: 'Warehouse', cost: 10, description: 'You may store an extra 3 Commodity Tokens.', storageBonus: 3 },
  { id: 'construction-company', name: 'Construction Company', cost: 20, description: 'You may perform two Purchase Building actions in one turn.', extraBuildingPurchase: true },
  { id: 'freight-company', name: 'Freight Company', cost: 25, description: 'You may sell 2 Commodities in one turn.', extraSellAction: true },
  { id: 'governors-mansion', name: "Governor's Mansion", cost: 30, description: 'Each Town Card you own is worth +1 VP at the end of the game.', vpPerTown: 1 },
  { id: 'rail-baron', name: 'Rail Baron', cost: 30, description: 'Each of your Railroad Cards is worth +1 VP at the end of the game.', vpPerRailroad: 1 },
  { id: 'bank', name: 'Bank', cost: 30, description: 'Each $20 that you have at the end of the game is worth +1 VP.', vpPer20Money: 1 },
  { id: 'auction-house', name: 'Auction House', cost: 15, description: 'You get $5 commission for each auction that is held. This is paid from the bank, not the player.', auctionCommission: 5 },
  { id: 'smuggler', name: 'Smuggler', cost: 20, description: 'Your hand limit of Price & Production cards is increased to 4.', handSize: 4 },
  { id: 'black-market', name: 'Black Market', cost: 30, description: 'Your hand limit of Price & Production cards is increased to 5.', handSize: 5 },
  { id: 'brick-works', name: 'Brick Works', cost: 25, description: 'You may build Towns with one fewer Commodity.', townCostReduce: 1 },
  { id: 'mayors-office', name: "Mayor's Office", cost: 30, description: 'Each Building you own is worth +1 VP at the end of the game.', vpPerBuilding: 1 },
  { id: 'trading-floor', name: 'Trading Floor', cost: 15, description: "When using the 'Produce' action, you may also buy any number of one Commodity currently owned by one other player at the current market price (before the price is affected by the Price & Production card). They may not refuse.", tradingFloor: true },
  { id: 'export-company', name: 'Export Company', cost: 30, description: "When selling a Commodity, you may increase the price of that Commodity by $3 before selling. Maximum Price is limited to the value shown on the board for that Commodity.", sellPriceBonus: 3 },
  { id: 'cottage-industry-p', name: 'Cottage Industry (P)', cost: 30, description: 'You may produce up to four (4) of the Commodity Tokens shown in the Production area of a Price/ Production Card.', productionLimit: 4, bpTag: true },
  { id: 'factory-x2-p', name: 'Factory (P)', cost: 40, description: 'You may produce up to five (5) of the Commodity Tokens shown in the Production area of a Price/ Production Card.', productionLimit: 5, bpTag: true },
];

/** Level-1 B card tiles (7 types); only 4 are used per game. */
const B_LEVEL1_TILES = BUILDING_TILES.filter(t => t.bpLevel === 1 && t.bpUpgradeToId);

/** Non-B buildings (shuffled into the stack; refill offer from this). */
const NON_B_TILES = BUILDING_TILES.filter(t => !t.bpTag);

/** Building ids that appear twice in the pool (e.g. Warehouse). */
const DOUBLE_POOL_IDS = ['warehouse-x2'];

/**
 * Per game: pick a random 4 of the 7 B card types for the initial offer; the rest of the deck is non-B buildings only.
 * Some buildings (e.g. Warehouse) appear twice in the pool.
 */
export function createBuildingDeckForGame(): { initialOffer: BuildingTile[]; buildingStack: BuildingTile[] } {
  const bPool = shuffle([...B_LEVEL1_TILES]);
  const initialOffer = bPool.slice(0, 4);
  const stack: BuildingTile[] = [];
  for (const t of NON_B_TILES) {
    stack.push(t);
    if (DOUBLE_POOL_IDS.includes(t.id)) stack.push(t);
  }
  const factoryTile = getBuildingTileById('factory-x2-p');
  if (factoryTile) {
    stack.push(factoryTile);
    stack.push(factoryTile);
  }
  const buildingStack = shuffle(stack);
  return { initialOffer, buildingStack };
}

/** Only front sides of B cards (+1) go in the deck; back sides (+2) are obtained by upgrade. (Legacy: single shuffled deck.) */
export function createBuildingTiles(): BuildingTile[] {
  const forDeck = BUILDING_TILES.filter(t => !t.bpUpgradeFromId);
  return shuffle([...forDeck]);
}

/** Look up any building tile by id (including level-2 B sides, for upgrades). */
export function getBuildingTileById(id: string): BuildingTile | undefined {
  return BUILDING_TILES.find(t => t.id === id);
}

/** All building tiles (for dev panel dropdown). Remove when stripping dev mode. */
export function getAllBuildingTiles(): BuildingTile[] {
  return [...BUILDING_TILES];
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export { COMMODITY_NAMES };
