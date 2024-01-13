const cardMap = new Map<String, Boolean>()
export function registerFoldable(card: HTMLDivElement) {
    if (!card.classList.contains('foldable')) {
        console.warn(`${card.id} isn't a foldable...`);
        return;
    }
    (<HTMLDivElement>card.children[0]).onclick = () => {
        for (const el of card.children) {
            if (el.classList.contains('foldable-header')) continue;
            if (cardMap.get(el.id)) {
                (<HTMLElement>el).style.display = "none";
                cardMap.set(el.id, false);
            } else {
                (<HTMLElement>el).style.display = "initial";
                cardMap.set(el.id, true)
            }
        }
    }
}