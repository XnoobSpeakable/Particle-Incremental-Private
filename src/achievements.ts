import { getEl } from "./util"

//type Achievement = { text: string }

/*const achievements: Achievement[] = [
    { text: 'ach 1' },
    { text: 'ach 2' },
]*/

export function createAchievementHTML() {
    const newDiv = document.createElement("div")
    newDiv.innerText = "stuff"
    getEl('achievementContainer').appendChild(newDiv)
}