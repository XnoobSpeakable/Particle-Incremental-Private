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
export function getEl(id: string) {
    return document.getElementById(id)!;
}
export function D(n: jsnumber) { return new Decimal(n) }