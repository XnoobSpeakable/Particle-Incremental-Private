// made this because i give up trying to find the start in main.ts
// if you know this please tell me in the discord

import { getElement, tabNames } from "./util";

const needsToHide = [
    "Dev"
]
tabNames.forEach((v) => {
    const to = getElement("tabopeners");
    const el = getElement("tabopentemplate");
    el.onclick = () => eval('openTab(v)');
    el.id = 'tabopen' + v.toLowerCase();
    if (!(v in needsToHide)) el.classList.remove('hidden')
    to.append(el)
})