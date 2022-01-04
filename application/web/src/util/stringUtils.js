/**
 * capitalizeFirstLetter
 * 
 * Capitalizes the first letter of a string
 */
export const capitalizeFirstLetter = (text) => {
    const firstLetter = text.substring(0, 1)
    const rest = text.substring(1, text.length)
    return firstLetter.toUpperCase() + rest
}



/**
 * convertCamelCaseToHyphenatedText
 */
export const convertCamelCaseToHyphenText = (camelCaseText) => {
    return splitFromCamelCaseText(camelCaseText).join("-").toLowerCase()
}



/**
 * convertCamelCaseToTitleText
 */
export const convertCamelCaseToTitleText = (camelCaseText) => {
    return capitalizeFirstLetter(splitFromCamelCaseText(camelCaseText).join(" "))
}



/**
 * isCapitalLetter
 */
export const isCapitalLetter = (characterText) => {
    const aUpperCaseCode = "A".charCodeAt(0)
    const zUpperCaseCode = "Z".charCodeAt(0)
    const characterCode = characterText.charCodeAt(0)
    if (characterCode >= aUpperCaseCode && characterCode <= zUpperCaseCode) {
        return true
    }
    return false
}



/**
 * isVisibleString
 * 
 * Returns true if a string is nonnull, nonempty, and is not purely whitespacde
 */
export const isVisibleString = (text) => {
    return text && text.length > 0 && text.trim().length > 0
}



/**
 * joinCamelCaseText
 */
export const joinToCamelCase = (textList, uppercase) => {
    const wordList = []
    for (let i = 0; i < textList.length; i++) {
        wordList.push(capitalizeFirstLetter(textList[i].toLowerCase()))
    }
    if (!uppercase) {
        wordList[0] = wordList[0].toLowerCase()
    }
    return wordList.join("")
}



/**
 * splitCamelCaseText
 */
export const splitFromCamelCaseText = (text) => {
    const wordList = []
    let charList = [text.substring(0, 1)]
    for (let i = 1; i < text.length; i++) {
        const charText = text.substring(i, i+1)
        if (isCapitalLetter(charText)) {
            wordList.push(charList.join(""))
            charList = []
        }
        charList.push(charText)
    }
    if (charList.length > 0) {
        wordList.push(charList.join(""))
    }
    return wordList
}