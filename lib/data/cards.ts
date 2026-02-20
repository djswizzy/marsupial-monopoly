import type { Commodity, ProductionCard, RailroadCard, TownCard, BuildingTile } from '../types.js';

function prod(p: Partial<Record<Commodity, number>>, price: Commodity[]): ProductionCard {
  return { id: `p-${Math.random().toString(36).slice(2, 9)}`, production: p, priceIncrease: price };
}

export function createProductionDeck(): ProductionCard[] {
  const templates: [Partial<Record<Commodity, number>>, Commodity[]][] = [
    [{ wheat: 2, wood: 1 }, ['wheat', 'wood']],
    [{ wheat: 1, coal: 2 }, ['coal']],
    [{ wood: 2, iron: 1 }, ['wood', 'iron']],
    [{ iron: 2, coal: 1 }, ['iron']],
    [{ goods: 2, luxury: 1 }, ['goods', 'luxury']],
    [{ wheat: 1, goods: 1, luxury: 1 }, ['luxury']],
    [{ wood: 1, iron: 1, coal: 1 }, ['iron', 'coal']],
    [{ wheat: 1, wood: 1, goods: 1 }, ['wheat', 'goods']],
    [{ coal: 2, goods: 1 }, ['coal', 'goods']],
    [{ wheat: 2, iron: 1 }, ['wheat']],
    [{ wood: 1, coal: 1, luxury: 1 }, ['wood', 'luxury']],
    [{ iron: 1, goods: 2 }, ['iron', 'goods']],
    [{ wheat: 1, coal: 2 }, ['wheat', 'coal']],
    [{ wood: 2, luxury: 1 }, ['wood']],
    [{ iron: 1, coal: 1, goods: 1 }, ['coal']],
    [{ wheat: 1, wood: 1, iron: 1 }, ['wheat', 'wood']],
    [{ coal: 1, goods: 1, luxury: 1 }, ['luxury']],
    [{ wheat: 2, coal: 1 }, ['wheat', 'coal']],
    [{ wood: 1, iron: 2 }, ['wood', 'iron']],
    [{ goods: 1, luxury: 2 }, ['goods', 'luxury']],
    [{ wheat: 1, wood: 1, coal: 1 }, ['wood']],
    [{ iron: 1, coal: 1, luxury: 1 }, ['iron', 'luxury']],
    [{ wheat: 1, goods: 2 }, ['wheat', 'goods']],
    [{ wood: 2, goods: 1 }, ['wood', 'goods']],
    [{ iron: 2, luxury: 1 }, ['iron', 'luxury']],
    // 4–5 commodity cards (choose 3)
    [{ wood: 3, iron: 1, wheat: 1 }, ['wood', 'iron']],
    [{ wheat: 2, coal: 2, goods: 1 }, ['wheat', 'coal']],
    [{ iron: 2, coal: 1, luxury: 1 }, ['iron', 'luxury']],
    [{ goods: 2, luxury: 2, wheat: 1 }, ['goods', 'luxury']],
    [{ coal: 2, wood: 2, iron: 1 }, ['coal', 'wood']],
    [{ wheat: 2, wood: 1, goods: 1, luxury: 1 }, ['wheat', 'goods']],
    [{ iron: 1, coal: 1, goods: 1, luxury: 1 }, ['iron', 'coal']],
    [{ wood: 2, iron: 2, coal: 1 }, ['wood', 'iron']],
    [{ wheat: 3, wood: 1, coal: 1 }, ['wheat']],
    [{ luxury: 2, goods: 2, coal: 1 }, ['luxury', 'goods']],
  ];
  const deck: ProductionCard[] = [];
  let id = 0;
  for (const [p, price] of templates) {
    for (let i = 0; i < 2; i++) {
      deck.push({ ...prod(p, price), id: `prod-${id++}` });
    }
  }
  return shuffle(deck);
}

const RAILROAD_TYPES: { typeId: string; name: string; minBid: number; vpSchedule: number[] }[] = [
  { typeId: 'top-dog', name: 'Top Dog', minBid: 6, vpSchedule: [4, 5, 6, 8] },           // 4 / 9 / 15 / 23
  { typeId: 'tycoon-railroad', name: 'Tycoon Railroad', minBid: 7, vpSchedule: [4, 5, 7, 9] }, // 4 / 9 / 16 / 25
  { typeId: 'big-bear', name: 'Big Bear', minBid: 5, vpSchedule: [3, 4, 6, 8] },         // 3 / 7 / 13 / 21
  { typeId: 'fat-cat', name: 'Fat Cat', minBid: 4, vpSchedule: [3, 4, 5, 7] },           // 3 / 7 / 12 / 19
  { typeId: 'sly-fox', name: 'Sly Fox', minBid: 3, vpSchedule: [2, 3, 5, 7] },            // 2 / 5 / 10 / 17
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

export const TOWNS: TownCard[] = [
  { id: 't-1', name: 'Millbrook', vp: 2, costSpecific: { wheat: 2, wood: 1 }, costAny: 0 },
  { id: 't-2', name: 'Ironvale', vp: 2, costSpecific: { iron: 2, coal: 1 }, costAny: 0 },
  { id: 't-3', name: 'Coalton', vp: 2, costSpecific: { coal: 2, iron: 1 }, costAny: 0 },
  { id: 't-4', name: 'Goodhaven', vp: 2, costSpecific: { goods: 2, luxury: 1 }, costAny: 0 },
  { id: 't-5', name: 'Wheatfield', vp: 3, costSpecific: { wheat: 3 }, costAny: 4 },
  { id: 't-6', name: 'Lumberton', vp: 3, costSpecific: { wood: 3 }, costAny: 4 },
  { id: 't-7', name: 'Steelburg', vp: 3, costSpecific: { iron: 3 }, costAny: 4 },
  { id: 't-8', name: 'Blackmoor', vp: 3, costSpecific: { coal: 3 }, costAny: 4 },
  { id: 't-9', name: 'Port Mercado', vp: 3, costSpecific: { goods: 3 }, costAny: 4 },
  { id: 't-10', name: 'Grand Luxe', vp: 3, costSpecific: { luxury: 3 }, costAny: 4 },
  { id: 't-11', name: 'Crossroads', vp: 4, costSpecific: {}, costAny: 5 },
  { id: 't-12', name: 'Harbor Town', vp: 4, costSpecific: { goods: 2, luxury: 2 }, costAny: 0 },
  { id: 't-13', name: 'Forge City', vp: 4, costSpecific: { iron: 2, coal: 2 }, costAny: 0 },
  { id: 't-14', name: 'Valley View', vp: 4, costSpecific: { wheat: 2, wood: 2 }, costAny: 0 },
  { id: 't-15', name: 'Capital City', vp: 5, costSpecific: {}, costAny: 6 },
  { id: 't-16', name: 'Astoria Central', vp: 5, costSpecific: { luxury: 2, goods: 2 }, costAny: 0 },
];

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

export function createBuildingTiles(): BuildingTile[] {
  const basic: BuildingTile[] = [
    { id: 'wheat1', name: 'Wheat Field', cost: 4, description: '+1 Wheat when producing', commodityBonus: 'wheat', bonusValue: 1, upgradeCost: 3 },
    { id: 'wood1', name: 'Sawmill', cost: 4, description: '+1 Wood when producing', commodityBonus: 'wood', bonusValue: 1, upgradeCost: 3 },
    { id: 'iron1', name: 'Ironworks', cost: 4, description: '+1 Iron when producing', commodityBonus: 'iron', bonusValue: 1, upgradeCost: 3 },
    { id: 'coal1', name: 'Coal Deposit', cost: 4, description: '+1 Coal when producing', commodityBonus: 'coal', bonusValue: 1, upgradeCost: 3 },
    { id: 'goods1', name: 'Workshop', cost: 4, description: '+1 Goods when producing', commodityBonus: 'goods', bonusValue: 1, upgradeCost: 3 },
    { id: 'luxury1', name: 'Boutique', cost: 4, description: '+1 Luxury when producing', commodityBonus: 'luxury', bonusValue: 1, upgradeCost: 3 },
  ];
  const advanced: BuildingTile[] = [
    { id: 'cottage', name: 'Cottage Industry', cost: 6, description: 'Produce up to 4 commodities', productionLimit: 4 },
    { id: 'factory', name: 'Factory', cost: 8, description: 'Produce up to 5 commodities', productionLimit: 5 },
    { id: 'smuggler', name: 'Smuggler', cost: 5, description: 'Hand size 4', handSize: 4 },
    { id: 'blackmarket', name: 'Black Market', cost: 7, description: 'Hand size 5', handSize: 5 },
    { id: 'warehouse', name: 'Warehouse', cost: 6, description: '+4 storage', storageBonus: 4 },
    { id: 'machineshop', name: 'Machine Shop', cost: 5, description: '+1 any commodity when producing', upgradeCost: 4 },
  ];
  return shuffle([...basic, ...advanced]);
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
