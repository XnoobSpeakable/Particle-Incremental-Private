import { getElement } from "./util";

declare global {
    interface Window {
        musicSwitch: () => Promise<void>
    }
}

const music = getElement("audio", "audio");
const musicState = getElement("musicState");
let musicPlaying = false;

window.musicSwitch = async function (): Promise<void> {
    musicPlaying = !musicPlaying;
    musicPlaying ? await music.play() : music.pause();
    musicState.textContent = musicPlaying ? "On" : "Off";
}

