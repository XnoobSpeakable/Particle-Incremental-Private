import {
  getUpgradeTimesBought,
  isUpgradeName,
  player,
  playerSettings,
  UpgradeName,
} from "./player";
import Decimal from "break_eternity.js";

// eslint-disable-next-line @typescript-eslint/ban-types
export type jsnumber = number;

const MAX_ES_IN_A_ROW = 5;

const decimalPlaces = function decimalPlaces(
  value: jsnumber,
  places: jsnumber,
  // eslint-disable-next-line @typescript-eslint/ban-types
  trunc = (x: number) => x
): jsnumber {
  const len = places + 1;
  const numDigits = Math.ceil(Math.log10(Math.abs(value)));
  const rounded =
    Math.round(value * Math.pow(10, len - numDigits)) *
    Math.pow(10, numDigits - len);
  const ret = parseFloat(rounded.toFixed(Math.max(len - numDigits, 0)));
  return trunc(ret);
};

function formatD(d: Decimal, places = 3, ePlaces = 99): string {
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
    //layer 2+
    if (d.layer <= MAX_ES_IN_A_ROW) {
      return (
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        (d.sign === -1 ? "-" : "") +
        "e".repeat(d.layer) +
        decimalPlaces(d.mag, ePlaces, Math.round)
      );
    } else {
      return `${d.sign === -1 ? "-" : ""}(e^${d.layer})${decimalPlaces(
        d.mag,
        ePlaces,
        Math.round
      )}`;
    }
  }
}

export function format(n: jsnumber): string {
  return Math.log10(n) >= playerSettings.eSetting
    ? n.toExponential(2).replace("e+", "e").replace(".00", "")
    : n.toFixed(0);
}

export function formatb(n: Decimal): string {
  return n.absLog10().toNumber() >= /*playerSettings.eSetting TODO: fix all this*/ 4
    ? formatD(n, 2).replace("e+", "e").replace(".00", "")
    : n.toFixed(0);
}

export function formatSpecific(n: jsnumber): string {
  return Math.log10(n) >= 4 //playersettings.esettin!!
    ? n.toExponential(2).replace("e+", "e").replace(".00", "")
    : n.toFixed(3).replace(".000", "");
}

export function formatbSpecific(n: Decimal): string {
  return n.absLog10().toNumber() >= 4 //playersettings.esettin!!
    ? formatD(n, 2).replace("e+", "e").replace(".00", "")
    : n.toFixed(3).replace(".000", "");
}

export function getEl(id: string): HTMLElement {
  return document.getElementById(id)!;
}

export function D(n: jsnumber): Decimal {
  return new Decimal(n);
}

type D2Arg<T> = T | Decimal | Op | D2Arg<T>[];

type Op = "+" | "*" | "/" | "^";
const opMap = {
  "+": "plus",
  "*": "times",
  "/": "div",
  "^": "pow",
} as const;

function isOp(x: unknown): x is Op {
  return typeof x === "string" && Object.keys(opMap).includes(x);
}

export function onD<T = string>(
  is: (x: unknown) => x is T,
  lookup: (key: T) => Decimal
) {
  const fn = function (
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

    terms.forEach((token) => {
      if (result instanceof Function) {
        if (isOp(token)) {
          throw new Error("to operations in a row");
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
          const method = (d: Decimal) => Decimal[opMap[token]](left, d);
          result = (x) => {
            if (x instanceof Decimal) {
              return method(x);
            }
            if (Decimal[x as never]) {
              throw new Error("cannot have two operations in a row");
            }

            return method(lookup(x as T));
          };
        }
      }
    });
    return result;
  };

  function splitArgs(args: D2Arg<T>[]): [T | Decimal, D2Arg<T>[]] {
    const arr = [...args];
    const head = arr.shift()!;
    if (isOp(head)) {
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

export const onBought = onD<UpgradeName>(isUpgradeName, (key) =>
  getUpgradeTimesBought(key)
);

export const onBoughtInc = onD<UpgradeName>(isUpgradeName, (key) =>
  getUpgradeTimesBought(key).plus(1)
);

// eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
declare var window: Window & Record<string, unknown>;
window.cheat = function (): void {
  player.num = player.num.times(2)
  //player.alphaNum = player.alphaNum.plus(1).times(2)
};
