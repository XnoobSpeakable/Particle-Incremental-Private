import { getElement } from "./util"

//type Achievement = { text: string }

/*const achievements: Achievement[] = [
    { text: 'ach 1' },
    { text: 'ach 2' },
]*/

export function createAchievementHTML(): void {
    const newDiv = document.createElement("div")
    newDiv.innerText = "stuff"
    getElement('achievementContainer').appendChild(newDiv)
}