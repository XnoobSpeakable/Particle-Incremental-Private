import { player } from './player'
import Decimal from 'break_eternity.js';
// eslint-disable-next-line @typescript-eslint/ban-types
export type jsnumber = number;
export function format(n : jsnumber): string {
    return Math.log10(n) >= player.eSetting ? n.toExponential(2).replace('e+','e') : n.toFixed(2).replace('.00','');
}
export function formatb(n : Decimal): string {
    return n.absLog10().toNumber() >= player.eSetting ? n.toExponential(2).replace('e+','e') : n.toFixed(2).replace('.00','');
}
export function getEl(id: string): HTMLElement {
    return document.getElementById(id)!;
}
export function D(n: jsnumber): Decimal { return new Decimal(n) }

export function onD<T = string>(   lookup: (key: T) => Decimal) {
    return function (
   lKey: T | Decimal,
   op: keyof Decimal,
   rKey: T | Decimal
) {
   const l = lKey instanceof Decimal ? lKey : lookup(lKey);
   const r = rKey instanceof Decimal ? rKey : lookup(rKey);
   const fn = l[op] as (d: Decimal) => Decimal;
   return fn(r);
}
}