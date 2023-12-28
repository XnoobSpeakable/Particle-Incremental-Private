import {
    getUpgradeTimesBought,
    isUpgradeName,
    player,
    playerSettings
} from "./player";
import Decimal from "break_eternity.js";

declare global {
    interface Window {
        changeCheatMode?: VoidFunction;
        cheat?: VoidFunction;
        clearls: VoidFunction;
    }
}

export const tabNames = [
    "Base",
    "Factory",
    "Alpha",
    "Beta",
    "Reactor",
    "Gamma",
    "Delta",
    "Omega",
    "OmegaOmega",
    "Achievements",
    "Stats",
    "Settings",
    "Tutorial",
    "Dev"
]

function decimalPlaces(
    value: number,
    places: number,
    trunc = (x: number) => x
): number {
    const length = places + 1;
    const digitsCount = Math.ceil(Math.log10(Math.abs(value)));
    const rounded =
        Math.round(value * 10 ** (length - digitsCount)) *
        10 ** (digitsCount - length);
    return trunc(Number(rounded.toFixed(Math.max(length - digitsCount, 0))));
}

export function formatDecimal(d: Decimal, places = 3, ePlaces = 99): string {
    if (d.layer === 0) {
        if ((d.mag < 1e4 && d.mag > 1e-7) || d.mag === 0) {
            return (d.sign * d.mag).toFixed(places);
        }
        return `${decimalPlaces(d.m, places)}e${decimalPlaces(
            d.e,
            ePlaces,
            Math.round
        )}`;
    } else if (d.layer === 1) {
        return `${decimalPlaces(d.m, places)}e${decimalPlaces(
            d.e,
            ePlaces,
            Math.round
        )}`;
    } else {
        if (d.layer <= 5) {
            return `${d.sign === -1 ? "-" : ""}${"e".repeat(d.layer)}
        ${decimalPlaces(d.mag, ePlaces, Math.round)}`;
        } else {
            return `${d.sign === -1 ? "-" : ""}(e^${d.layer})${decimalPlaces(
                d.mag,
                ePlaces,
                Math.round
            )}`;
        }
    }
}

export function format(n: number): string {
    return Math.log10(n) >= 6
        ? n.toExponential(2).replace("e+", "e").replace(".00", "")
        : n.toFixed(0);
}

export function formatBig(n: Decimal): string {
    return n.absLog10().toNumber() >= 6
        ? formatDecimal(n, 2).replace("e+", "e").replace(".00", "")
        : n.toFixed(0);
}

export function formatSpecific(n: number): string {
    return Math.log10(n) >= 6
        ? n.toExponential(2).replace("e+", "e").replace(".00", "")
        : n.toFixed(3).replace(".000", "");
}

export function formatBigSpecific(n: Decimal): string {
    return n.absLog10().toNumber() >= 6
        ? formatDecimal(n, 2).replace("e+", "e").replace(".00", "")
        : n.toFixed(3).replace(".000", "");
}

function assertElementType<T extends keyof HTMLElementTagNameMap>(
    element: HTMLElement,
    type: T
): asserts element is HTMLElementTagNameMap[T] {
    if (element.tagName !== type.toUpperCase()) {
        throw new TypeError(`element isn't a <${type}> HTML element`);
    }
}

/**
 * @param id Id of the element to get.
 * @returns The HTML element with the given id.
 */
export function getElement(id: string): HTMLElement;
/**
 * @param id Id of the element to get.
 * @param type The expected tag name of the element.
 * @returns The HTML element with the given id.
 */
export function getElement<T extends keyof HTMLElementTagNameMap>(
    id: string,
    type: T
): HTMLElementTagNameMap[T];
export function getElement<T extends keyof HTMLElementTagNameMap>(
    id: string,
    type?: T
): HTMLElement | HTMLElementTagNameMap[T] {
    const element = document.getElementById(id);
    if (element === null) {
        throw new Error(`Element with id ${id} dosen't exist`);
    }

    if (type !== undefined) {
        assertElementType(element, type);
    }
    return element;
}

type D2Arg<T> = T | Decimal | Operator | D2Arg<T>[];

const operatorMap = {
    "+": "plus",
    "*": "times",
    "/": "div",
    "^": "pow"
} as const;

type Operator = keyof typeof operatorMap;

function isOperator(x: unknown): x is Operator {
    return typeof x === "string" && x in operatorMap;
}

export function onDecimal<T = string>(
    is: (x: unknown) => x is T,
    lookup: (key: T) => Decimal
) {
    function fn(
        start: T | Decimal | D2Arg<T>[],
        ...terms: D2Arg<T>[]
    ): Decimal {
        let result: Decimal | ((x: D2Arg<T>) => Decimal);
        if (Array.isArray(start)) {
            const [first, rest] = splitArgs(start);
            result = fn(first, ...rest);
        } else {
            result = start instanceof Decimal ? start : lookup(start);
        }

        terms.forEach(token => {
            if (typeof result === "function") {
                if (isOperator(token)) {
                    throw new Error("two operations in a row");
                }
                if (Array.isArray(token)) {
                    const [first, rest] = splitArgs(token);
                    result = result(fn(first, ...rest));
                } else {
                    const operand = is(token) ? lookup(token) : token;
                    result = result(operand);
                }
            } else {
                if (token instanceof Decimal) {
                    result = result.times(token);
                } else if (is(token)) {
                    result = result.times(lookup(token));
                } else if (Array.isArray(token)) {
                    const [first, args] = splitArgs(token);
                    result = result.times(fn(first, ...args));
                } else {
                    const left = result;
                    const method = (d: Decimal) =>
                        Decimal[operatorMap[token]](left, d);
                    result = x => {
                        if (x instanceof Decimal) {
                            return method(x);
                        }
                        if (Decimal[x as never]) {
                            throw new Error(
                                "cannot have two operations in a row"
                            );
                        }

                        return method(lookup(x as T));
                    };
                }
            }
        });
        return result;
    }

    function splitArgs(args: D2Arg<T>[]): [T | Decimal, D2Arg<T>[]] {
        const arr = [...args];
        const head = arr.shift();
        if (head === undefined) {
            throw new Error("arr is empty");
        }
        if (isOperator(head)) {
            throw new Error("first token cannot be an operator");
        }
        if (Array.isArray(head)) {
            const [first, rest] = splitArgs(head);
            return [fn(first, ...rest), arr];
        }
        return [head, arr];
    }
    return fn;
}

export const onBought = onDecimal(isUpgradeName, key =>
    getUpgradeTimesBought(key)
);

export const onBoughtInc = onDecimal(isUpgradeName, key =>
    getUpgradeTimesBought(key).plus(Decimal.dOne)
);

// dev only
if (import.meta.env.DEV) {
    window.cheat = function (): void {
        switch (playerSettings.cheatMode) {
            case 0:
                player.num = player.num.times(Decimal.dTwo);
                break;
            case 1:
                player.alphaNum = player.alphaNum.times(Decimal.dTwo);
                break;
            case 2:
                player.num = player.num.times(Decimal.dTwo);
                player.alphaNum = player.alphaNum.times(Decimal.dTwo);
                break;
            case 3:
                player.alphaNum = player.alphaNum
                    .plus(Decimal.dOne)
                    .times(Decimal.dTwo);
                break;
            case 4:
                player.num = player.num.times(Decimal.dTwo);
                player.alphaNum = player.alphaNum
                    .plus(Decimal.dOne)
                    .times(Decimal.dTwo);
                break;
            case 5:
                player.betaNum = player.betaNum
                    .plus(Decimal.dOne)
                    .times(Decimal.dTwo);
                break;
        }
    };

    window.changeCheatMode = function (): void {
        playerSettings.cheatMode = (playerSettings.cheatMode + 1) % 6;
        getElement("cheatmodediv").textContent =
            playerSettings.cheatMode.toString();
    };
}  
else {
    getElement("cheat").style.display = "none";
    getElement("devtoggle").style.display = "none";
}

/**
 * Clears localStorage.
 */
window.clearls = function (): void {
    localStorage.clear();
    location.reload();
};
