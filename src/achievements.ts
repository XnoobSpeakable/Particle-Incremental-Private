import { getElement } from "./util";

const achievementContainer = getElement("achievementContainer");

// not implemented yet, we will make achievements later
export function createAchievementHTML(): void {
    const newDiv = document.createElement("div");
    newDiv.textContent = "stuff";
    achievementContainer.appendChild(newDiv);
}
