import { playerSettings } from "./player";
import { getElement } from "./util";

declare global {
	interface Window {
		musicSwitch: () => Promise<void>
	}
}

const music = getElement("audio", "audio");
const musicState = getElement("musicState");

async function startMusic(): Promise<void> {
	musicState.textContent = playerSettings.playMusic ? "On" : "Off";
	if (!playerSettings.playMusic) return;
	try {
		await music.play();
	}
	catch {
		setTimeout(startMusic, 100);
	}
}

await startMusic();

window.musicSwitch = async function (): Promise<void> {
	playerSettings.playMusic = !playerSettings.playMusic;
	playerSettings.playMusic ? await music.play() : music.pause();
	musicState.textContent = playerSettings.playMusic ? "On" : "Off";
}