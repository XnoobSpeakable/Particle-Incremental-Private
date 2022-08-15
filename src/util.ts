import { player } from './player'
import Decimal from 'break_eternity.js';
export function format(n : number) {
    return Math.log10(n) >= player.eSetting ? n.toExponential(2).replace('e+','e') : n.toFixed(2).replace('.00','');
}
export function formatb(n : Decimal) {
    return n.absLog10().toNumber() >= player.eSetting ? n.toExponential(2).replace('e+','e') : n.toFixed(2).replace('.00','');
}

export function getEl(id: string) {
    return document.getElementById(id)!;
}