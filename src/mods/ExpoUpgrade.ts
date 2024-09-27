import Decimal from "break_eternity.js";
import type PILoader from "./PILoader";

export function onStart(pi: PILoader) {
    console.log("Starting Exponent Upgrade Mod");
    pi.player.num = new Decimal(6969420);
}
export function onStop(_: PILoader) {
    console.log("Stopping Exponent Upgrade Mod");
}