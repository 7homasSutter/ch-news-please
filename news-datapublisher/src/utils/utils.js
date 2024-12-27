export const TABLE_ALIAS_KEYWORDS = 'k'
export const TABLE_ALIAS_ARTICLES = 'a'
export const TABLE_ALIAS_LOCATION = 'l'


export function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    });
}
