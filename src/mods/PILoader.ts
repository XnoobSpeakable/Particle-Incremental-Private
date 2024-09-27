import type { player as Player } from "../player";

export default class PILoader {
    constructor(public player: typeof Player) {
        console.log("PILoader loaded");
    }
}
export interface Mod {
    onStart(pi: PILoader): void;
    onStop(pi: PILoader): void;
}