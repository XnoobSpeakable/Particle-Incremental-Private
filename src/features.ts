import { D, getEl, formatb, formatbSpecific } from './util'
import { player } from './player'

const features = { 
    GB: {displayName: "Generator boost", unlocksAt: D(5000), currency: "", next: 'Factory'} ,
    Factory: {displayName: "Factory", unlocksAt: D(1e5), currency: "", next: 'NP'} ,
    NP: {displayName: "Nuclear Particles", unlocksAt: D(1e6), currency: "", next: 'Bang'} ,
    Bang: {displayName: "Bang", unlocksAt: D(1e9), currency: "", next: 'BA'} ,
    BA: {displayName: "Bang Autobuyer (in Omega tab)", unlocksAt: D(1e10), currency: "", next: 'PCA'} ,
    PCA: {displayName: "Particle Chunk Autobuyer", unlocksAt: D(20), currency: " Alpha", next: 'NAP'} ,
    NAP: {displayName: "Nuclear Alpha Particles", unlocksAt: D(1e6), currency: " Alpha", next: undefined} ,
} as const
type FeatureKey = keyof typeof features;
let goal : FeatureKey = 'GB'
export function nextFeatureHandler(): void {
    let feature = features[goal]
    const nextGoal : FeatureKey = feature.next as FeatureKey
    const percentage = D(100).times((player.num.log10()).div(feature.unlocksAt.log10()))
    getEl('nextfeature').textContent =
       // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
       `Reach ${formatb(feature.unlocksAt)}${feature.currency} particles to unlock ${feature.displayName} (${formatbSpecific(percentage)}%)`
    if(player.num.gte(feature.unlocksAt)) {
        goal = nextGoal
        feature = features[goal]
    }
}