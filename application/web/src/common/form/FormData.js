import { capitalizeFirstLetter } from "../../util/stringUtils"

/**
 * makeFormData
 */
export const makeFormData = (keys, initialFields={}) => {
    const formData = {}
    for (let i = 0; i < keys.length; i++) {
        const currentKey = keys[i]
        formData[currentKey] = { value: "", success: false, messageList: [] }
        if (currentKey in initialFields) {
            formData[currentKey] = initialFields[currentKey]
        }
        formData[convertToAccessorText(currentKey)] = () => formData[currentKey].value 
    }
    return formData;
}



/**
 * cloneFormData
 */
export const cloneFormData = (formData) => {
    const newFormData = {
        ...formData
    }
    return newFormData
}



/**
 * cloneFormDataWithNewValue
 */
export const cloneFormDataWithNewValue = (formData, formKey, newValue) => {
    console.log(`cloneFormDataWithNewValue(${JSON.stringify(formData)}, ${formKey}, ${newValue})`)
    const newFormData = cloneFormData(formData)
    newFormData[formKey].value = newValue
    return newFormData
}



/**
 * isValidatedFormData
 */
export const isValidatedFormData = (formData) => {
    const keys = Object.keys(formData)
    for (let i = 0; i < keys.length; i++) {
        const currentKey = keys[i]
        if (currentKey.includes("get")) {
            continue
        }
        const success = formData[currentKey].success
        console.log(currentKey + " " + success)
        if (!success) {
            return false
        }
    }
    return true
}



/**
 * getValueMap
 */
export const getValueMap = (formData) => {
    const valueMap = {}
    const keys = Object.keys(formData)
    for (let i = 0; i < keys.length; i++) {
        const currentKey = keys[i]
        if (currentKey.length >= 3 && currentKey.substring(0, 3) == "get") {
            continue
        }
        valueMap[currentKey] = formData[currentKey].value
    }
    return valueMap
}



/**
 * convertToAccessorText
 */
const convertToAccessorText = (text) => {
    return "get" + capitalizeFirstLetter(text)
}

