/**
 * Registers a foldable card.
 *
 * @param card - The card element to register as foldable.
 * @return This function does not return a value.
 */
export function registerFoldable(card: HTMLDivElement) {
    if (!card.classList.contains('foldable')) {
        console.warn("Error while trying to register foldable: this card isnt foldable");
        return;
    }

    const firstChild = card.firstElementChild;
    if (firstChild === null) {
        console.warn("Error while trying to register foldable: first child doesn't exist");
        return;
    }

    let isFolded = false;

    firstChild.addEventListener("click", () => {
        const cardChildren = Array.from(card.children);
        const firstChildChildren = firstChild.children as HTMLCollectionOf<HTMLElement>;

        if (isFolded) {
            cardChildren.forEach(child => {
                (child as HTMLElement).style.display = "";
            });
            isFolded = false;
            firstChildChildren[1]!.style.rotate = "0deg";
            (firstChild as HTMLElement).style.borderBottomWidth = "2px";

        } else {
            cardChildren.slice(1).forEach((child) => {
                (child as HTMLElement).style.display = "none";
            });
            isFolded = true;
            firstChildChildren[1]!.style.rotate = "-90deg";
            (firstChild as HTMLElement).style.borderBottomWidth = "0px";
        }
    });
}
