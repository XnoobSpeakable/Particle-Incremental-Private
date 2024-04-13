import { getElement, formatBig, formatBigSpecific } from "./util";
import { player } from "./player";
import { type CurrencyName, currencyName } from "./upgrades";
import Decimal from "break_eternity.js";

/**
 * The list of features the play can unlock, and their properties.
 */
const features: Record<FeatureKey, Feature> = {
    GB: {
        displayName: "Generator boost",
        unlocksAt: new Decimal(5000),
        currency: "num",
        next: "Factory"
    },
    Factory: {
        displayName: "Factory",
        unlocksAt: new Decimal(1e5),
        currency: "num",
        next: "NP"
    },
    NP: {
        displayName: "Nuclear Particles",
        unlocksAt: new Decimal(1e8),
        currency: "num",
        next: "Bang"
    },
    Bang: {
        displayName: "Bang",
        unlocksAt: new Decimal(1e9),
        currency: "num",
        next: "BA"
    },
    BA: {
        displayName: "Bang Autobuyer (in Omega tab)",
        unlocksAt: new Decimal(1e10),
        currency: "num",
        next: "PCA"
    },
    PCA: {
        displayName: "Particle Chunk Autobuyer",
        unlocksAt: new Decimal(20),
        currency: "alphaNum",
        next: "BS"
    },
    BS: {
        displayName: "Boost Sacrifice",
        unlocksAt: new Decimal(1e5),
        currency: "boosterParticles",
        next: "NAP"
    },
    NAP: {
        displayName: "Nuclear Alpha Particles",
        unlocksAt: new Decimal(1e6),
        currency: "alphaNum",
        next: "Merge"
    },
    Merge: {
        displayName: "Merge",
        unlocksAt: new Decimal(1e9),
        currency: "alphaNum",
        next: "Reactor"
    },
    Reactor: {
        displayName: "Reactor",
        unlocksAt: new Decimal(300),
        currency: "betaNum",
        next: "Return"
    },
    Return: {
        displayName: "Return",
        unlocksAt: new Decimal(1e5),
        currency: "betaNum"
    }
};

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
    | "Reactor"
    | "Return";

interface Feature {
    displayName: string;
    unlocksAt: Decimal;
    currency: CurrencyName;
    next?: FeatureKey;
}

let goal: FeatureKey | undefined = "GB";

/**
 * The code for the text at the top of the screen, displaying what the next feature the player will unlock is, along with the progress to unlocking it.
 */
export function nextFeatureHandler(): void {
    if (goal === undefined) {
        getElement("nextfeature").textContent =
            "You have unlocked all the features.";
        return;
    }

    let feature = features[goal];
    const featureCurrency = feature.currency;
    const nextGoal = "next" in feature ? feature.next : undefined;

    if (player[featureCurrency].gte(feature.unlocksAt)) {
        goal = nextGoal;
        if (goal === undefined) return;
        feature = features[goal];
    } else {
        const percentage = player[featureCurrency]
            .max(Decimal.dOne)
            .log10()
            .div(feature.unlocksAt.max(Decimal.dOne).log10())
            .times(100)
            .max(Decimal.dZero);

        getElement("nextfeature").textContent = `Reach
            ${formatBig(feature.unlocksAt)}
            ${currencyName[feature.currency]}
            particles to unlock ${feature.displayName}
            (${formatBigSpecific(percentage)}%)`;
    }
}
