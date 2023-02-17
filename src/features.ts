import { D, getEl, formatb, formatbSpecific } from './util';
import { player } from './player';
import { CurrencyName, currencyName } from './upgrades';
import Decimal from 'break_eternity.js';

function Feature(x: Feature) { return x; }

const features = { 
    GB: Feature({displayName: "Generator boost", unlocksAt: D(5000), currency: "num", next: 'Factory'}),
    Factory: Feature({displayName: "Factory", unlocksAt: D(1e5), currency: "num", next: 'NP'}),
    NP: Feature({displayName: "Nuclear Particles", unlocksAt: D(1e8), currency: "num", next: 'Bang'}),
    Bang: Feature({displayName: "Bang", unlocksAt: D(1e9), currency: "num", next: 'BA'}),
    BA: Feature({displayName: "Bang Autobuyer (in Omega tab)", unlocksAt: D(1e10), currency: "num", next: 'PCA'}),
    PCA: Feature({displayName: "Particle Chunk Autobuyer", unlocksAt: D(20), currency: "alphaNum", next: 'BS'}),
    BS: Feature({displayName: "Boost Sacrifice", unlocksAt: D(1e5), currency: "boosterParticles", next: 'NAP'}),
    NAP: Feature({displayName: "Nuclear Alpha Particles", unlocksAt: D(1e6), currency: "alphaNum", next: 'Merge'}),
    Merge: Feature({displayName: "Merge", unlocksAt: D(1e9), currency: "alphaNum", next: 'Reactor'}),
    Reactor: Feature({displayName: "Reactor", unlocksAt: D(300), currency: "betaNum", next: 'DUMMY'}),
    DUMMY: Feature({displayName: "End", unlocksAt: D(1e99), currency: "betaNum", next: undefined}),
} as const;

type FeatureKey = 'GB'|'Factory'|'NP'|'Bang'|'BA'|'PCA'|'BS'|'NAP'|'Merge'|'Reactor'|'DUMMY'
        
type Feature = {
    displayName: string,
    unlocksAt: Decimal,
    currency: CurrencyName,
    next: FeatureKey | undefined
}

let goal : FeatureKey | undefined = 'GB'

export function nextFeatureHandler(): void {
    if (typeof goal === 'undefined') { return; }

    let feature = features[goal]
    const featureCurrency = feature.currency
    const nextGoal  = feature.next

    if(!nextGoal) {
        getEl('nextfeature').textContent = 'You have unlocked all the features.'
        goal = undefined;
    }

    else if(player[featureCurrency].gte(feature.unlocksAt)){
        goal = nextGoal
        feature = features[goal]
    }

    else {
        let percentage = D(100).times((player[featureCurrency].log10()).div(feature.unlocksAt.log10()))
        if(percentage.lt(0)) {
            percentage = D(0)
        }
        getEl('nextfeature').textContent =
            `Reach ${formatb(feature.unlocksAt)}${currencyName[feature.currency]} particles to unlock ${feature.displayName} (${formatbSpecific(percentage)}%)`.replace('(e^NaN)NaN', '0')

    }
}
