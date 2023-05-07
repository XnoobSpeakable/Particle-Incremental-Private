import { D, getElement, formatb, formatbSpecific } from "./util";
import { player } from "./player";
import { type CurrencyName, currencyName } from "./upgrades";
import Decimal from "break_eternity.js";

const features = {
    GB: {
        displayName: "Generator boost",
        unlocksAt: D(5000),
        currency: "num",
        next: "Factory"
    },
    Factory: {
        displayName: "Factory",
        unlocksAt: D(1e5),
        currency: "num",
        next: "NP"
    },
    NP: {
        displayName: "Nuclear Particles",
        unlocksAt: D(1e8),
        currency: "num",
        next: "Bang"
    },
    Bang: {
        displayName: "Bang",
        unlocksAt: D(1e9),
        currency: "num",
        next: "BA"
    },
    BA: {
        displayName: "Bang Autobuyer (in Omega tab)",
        unlocksAt: D(1e10),
        currency: "num", next: "PCA"
    },
    PCA: {
        displayName: "Particle Chunk Autobuyer",
        unlocksAt: D(20),
        currency: "alphaNum",
        next: "BS"
    },
    BS: {
        displayName: "Boost Sacrifice",
        unlocksAt: D(1e5),
        currency: "boosterParticles",
        next: "NAP"
    },
    NAP: {
        displayName: "Nuclear Alpha Particles",
        unlocksAt: D(1e6),
        currency: "alphaNum",
        next: "Merge"
    },
    Merge: {
        displayName: "Merge",
        unlocksAt: D(1e9),
        currency: "alphaNum", 
        next: "Reactor"
    },
    Reactor: {
        displayName: "Reactor",
        unlocksAt: D(300),
        currency: "betaNum"
    }
} as const satisfies Record<FeatureKey, Feature>;

type FeatureKey =
    | "GB"
    | "Factory"
    | "NP"
    | "Bang"
    | "BA"
    | "PCA"
    | "BS"
    | "NAP"
    | "Merge"
    | "Reactor";

interface Feature {
    displayName: string,
    unlocksAt: Decimal,
    currency: CurrencyName,
    next?: FeatureKey
}

let goal: FeatureKey | undefined = "GB";

export function nextFeatureHandler(): void {
    if (goal === undefined) return;

    let feature = features[goal]
    const featureCurrency = feature.currency;
    const nextGoal = "next" in feature ? feature.next : undefined;

    if (nextGoal === undefined) {
        getElement("nextfeature").textContent = "You have unlocked all the features.";
        goal = undefined;
    }

    else if (player[featureCurrency].gte(feature.unlocksAt)) {
        goal = nextGoal;
        feature = features[goal];
    }

    else {
        const percentage = Decimal.times(
            100,
            player[featureCurrency].max(Decimal.dOne).log10()
                .div(feature.unlocksAt.max(Decimal.dOne).log10())
        ).max(Decimal.dZero);

        getElement('nextfeature').textContent =
            `Reach
            ${formatb(feature.unlocksAt)}
            ${currencyName[feature.currency]}
            particles to unlock ${feature.displayName}
            (${formatbSpecific(percentage)}%)`;
    }
}
