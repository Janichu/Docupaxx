import { request } from "./request";
import { isVisibleString } from "./stringUtils";

const IMAGE_FILE_TYPE = "image"
const APPLICATION_FILE_TYPE = "application"
const EXTENSION_FILE_TYPE_MAP = {
    "jpg": IMAGE_FILE_TYPE,
    "jpeg": IMAGE_FILE_TYPE,
    "pdf": APPLICATION_FILE_TYPE,
    "png": IMAGE_FILE_TYPE,
}

export const encode = (key, dataArray) => {
    // Encodes a file's data
    const keyParts = key.split(/[.]/)
    const extension = keyParts[keyParts.length - 1].toLowerCase()
    if (extension != "jpg" && extension != "jpeg" && extension != "png" && extension != "pdf") {
        //alert(key + " __ " + extension)
        return "(Encoding Failed)"
    }
    const fileType = EXTENSION_FILE_TYPE_MAP[extension]
    const mappedExtension = (extension == "jpg" ? "jpeg": extension)
    const encoding = dataArray.reduce((a, b) => (a + String.fromCharCode(b)),'');
    // Later be optimized to become a blob
    const url = `data:${fileType}/${mappedExtension};base64,${btoa(encoding).replace(/.{76}(?=.)/g,'$&\n')}`;
    //alert(url)
    return url;
}

export const encodeBase64 = (key, dataArray) => {
    // Encodes a file's data
    const keyParts = key.split(/[.]/)
    const extension = keyParts[keyParts.length - 1].toLowerCase()
    if (extension != "jpg" && extension != "jpeg" && extension != "png" && extension != "pdf") {
        return "(Encoding Failed)"
    }
    const fileType = EXTENSION_FILE_TYPE_MAP[extension]
    const mappedExtension = (extension == "jpg" ? "jpeg": extension)
    const encoding = dataArray.reduce((a, b) => (a + String.fromCharCode(b)),'');
    // Later be optimized to become a blob
    const url = `${btoa(encoding).replace(/.{76}(?=.)/g,'$&\n')}`;
    return url;
}

export const requestEncodedUrl = (privateFileUrl) => {
    //alert("Req: " + privateFileUrl)
    return new Promise((resolve, reject) => {
        if (!isVisibleString(privateFileUrl)) {
            resolve("(Encoding Failed)")
        }
        const privateFileUrlParts = privateFileUrl.split(/[/]/)
        const key = privateFileUrlParts[privateFileUrlParts.length - 1]
        request(`/files?key=${key}`)
            .then((fileField) => {
                //alert("Success(" + privateFileUrl + ")")
                const encodedUrl = encode(key, fileField.value.Body.data)
                resolve(encodedUrl)
            })
            .catch((error) => {
                //alert("Error(" + privateFileUrl + "): " + JSON.stringify(error))
                resolve("(Encoding failed)")
            });
    })
}

export const requestFile = (privateFileUrl) => {
    // Combine with above
    //alert("Req: " + privateFileUrl)
    return new Promise((resolve, reject) => {
        if (!isVisibleString(privateFileUrl)) {
            resolve("(Encoding Failed)")
        }
        const privateFileUrlParts = privateFileUrl.split(/[/]/)
        const key = privateFileUrlParts[privateFileUrlParts.length - 1]
        request(`/files?key=${key}`)
            .then((fileField) => {
                //alert("Success(" + privateFileUrl + ")")
                resolve(fileField.value)
            })
            .catch((error) => {
                //alert("Error(" + privateFileUrl + "): " + JSON.stringify(error))
                resolve("(Encoding failed)")
            });
    })
}

export const requestFileBase64 = (privateFileUrl) => {
    // Combine with above
    //alert("Req: " + privateFileUrl)
    return new Promise((resolve, reject) => {
        if (!isVisibleString(privateFileUrl)) {
            resolve("(Encoding Failed)")
        }
        const privateFileUrlParts = privateFileUrl.split(/[/]/)
        const key = privateFileUrlParts[privateFileUrlParts.length - 1]
        request(`/files?key=${key}`)
            .then((fileField) => {
                //alert("Success(" + privateFileUrl + ")")
                const encodedUrl = encodeBase64(key, fileField.value.Body.data)
                resolve(encodedUrl)
            })
            .catch((error) => {
                //alert("Error(" + privateFileUrl + "): " + JSON.stringify(error))
                resolve("(Encoding failed)")
            });
    })
}