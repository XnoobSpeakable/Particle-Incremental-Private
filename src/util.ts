import { player } from './player'
export function format(n) {
    if(n >= player.eSetting) {
        const e = Math.floor(Math.log10(n));
        const m = n / Math.pow(10, e);
        return `${m.toFixed(2)}e${e}`;
    }
    else {
        if(n % 1 != 0) {
            return n.toFixed(2) 
        }
        else {
            return n
        }
    }
} 
//tysm Diamboy for the complicated part of this function.