import { createCard } from './create-card'

export async function renderCards(items) {
    if (!items) {
        return
    }
    const markup = await items
      .map(createCard)
        .join("");
    return markup;    
}