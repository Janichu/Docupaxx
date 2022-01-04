export const pushAll = (destinationArray, newArray) => {
    for (let i = 0; i < newArray.length; i++) {
        destinationArray.push(newArray[i])
    }
}