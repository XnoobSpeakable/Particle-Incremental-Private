import {
   getUpgradeTimesBought,
   isUpgradeName,
   playerSettings,
   UpgradeName,
} from './player';
import Decimal from 'break_eternity.js';
// eslint-disable-next-line @typescript-eslint/ban-types
export type jsnumber = number;
export function format(n: jsnumber): string {
   return Math.log10(n) >= playerSettings.eSetting
      ? n.toExponential(2).replace('e+', 'e')
      : n.toFixed(2).replace('.00', '');
}
export function formatb(n: Decimal): string {
   return n.absLog10().toNumber() >= playerSettings.eSetting
      ? n.toExponential(2).replace('e+', 'e')
      : n.toFixed(2).replace('.00', '');
}
export function getEl(id: string): HTMLElement {
   return document.getElementById(id)!;
}
export function D(n: jsnumber): Decimal {
   return new Decimal(n);
}


type D2Arg<T> = T | Decimal | Op | D2Arg<T>[];

type Op = '+' | '*' | '/' | '^';
const opMap = {
   '+': 'plus',
   '*': 'times',
   '/': 'div',
   '^': 'pow',
} as const;

function isOp(x: unknown): x is Op {
   return typeof x === 'string' && Object.keys(opMap).includes(x);
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
               throw new Error('to operations in a row');
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
                     throw new Error('cannot have two operations in a row');
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
         throw new Error('first token cannot be an operator');
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
