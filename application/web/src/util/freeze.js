/**
 * freeze
 * 
 * Makes an object and its components readonly
 */
export const freeze = (object, freezeComponents=true) => {
    if (freezeComponents && object instanceof Object) {
        const keys = Object.keys(object)
        for (let i = 0; i < keys.length; i++) {
            freeze(object[keys[i]])
        }
    }
    Object.freeze(object)
    return object
}
