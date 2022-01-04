const fs = require('fs')
const { route } = require('../web-router')
require.extensions['.js'] = (module, filename) => {
    module.exports = fs.readFileSync(filename, 'utf8')
}

const importFileText = (serverPath) => require("." + serverPath)
const importFileLines= (serverPath) => require("." + serverPath).split("\n")
const importFileNamesFromDirectory = (directoryPath) => fs.readdirSync(directoryPath)
const exportFileText = (fileText, serverPath) => {
    fs.writeFile(serverPath, fileText, (err) => {
        if (err) {
            throw err
        }
    })
}

/**
 * Use importFileText to read files acting like are you in the "server" folder
 */

/**
 * When you straight read files you act like you are in the "scripts" folder
 * 
 * ACTION: Add "." to the beginning of the path
 */

/**
 * When you write files you act like you are in the "server" folder
 * 
 * ACTION: Nothing
 */

/**
 * When you read file names from a directory you act like you are in the "server" folder
 * 
 * ACTION: Nothing
 */

const endSub = (text, num) => text.substring(0, text.length - num)
const subEquals = (text, target) => (text.length >= target.length && text.substring(0, target.length) == target)
const stringifyList = (list) => (list.map((item) => JSON.stringify(item))).join("\n")


const modelFileNames = fs.readdirSync("./models")
const modelNames = modelFileNames.map((fileName) => endSub(fileName, 3))

const getDataTokens = (text) => {
    console.log("getDataTokens()")
    const dataTokens = []
    const dottedTokens = text.split(/[ (){}\[\]\,\n\=\+\*\!\<\>\/\;\:\?]+/)
    for (let i = 0; i < dottedTokens.length; i++) {
        const token = dottedTokens[i]
        if (token == ".") {
            continue
        }
        let dataToken = token
        if (token.includes(".") && (token.substring(0, 1) != "." || token.includes("..."))) {
            if (subEquals(token, "...")) {
                dataToken = token.substring(3)
            } else {
                dataToken = token.split(".")[0]
            }
        }
        if (dataToken == "\r") {
            continue
        }
        if (dataToken.includes("\r")) {
            dataToken = dataToken.split(/[\r]/).join("")
        }
        dataTokens.push(dataToken)
    }
    //console.log(dataTokens.map((i) => JSON.stringify(i)).join("\n"))
    //console.log("end() // getDataTokens()")
    return dataTokens
}




// GETS THE FULL IMPORT TEXT
const getImportFields = () => {
    const imports = modelFileNames
        .map((fileName) => endSub(fileName, 3))
        .map((name) => ({ name: name, line: `const ${name} = require("../../models/${name}");` }))
    return imports
}
const importFields = getImportFields()



const isMarkerLine = (line) => subEquals(line, "// Imports the database Model")

const clearModelImportLines = (fileLines) => {
    const clearedLines = []
    let clearing = false
    let doneClearing = false
    for (let i = 0; i < fileLines.length; i++) {
        const line = fileLines[i].trim()
        if (doneClearing || !clearing) {
            clearedLines.push(fileLines[i])
        }
        if (!doneClearing && !clearing && isMarkerLine(line)) {
            clearing = true
            continue
        }
        if (!doneClearing && clearing && subEquals(line, "//")) {
            doneClearing = true
            clearedLines.push(line)
            continue
        }
    }
    return clearedLines
}



const getRouterFields = () => {
    const fields = []
    const routerFolders = importFileNamesFromDirectory("./routers")
    for (let i = 0; i < routerFolders.length; i++) {
        const routerFolderName = routerFolders[i]
        const routerFileNames = importFileNamesFromDirectory("./routers/" + routerFolderName)
        for (let j = 0; j < routerFileNames.length; j++) {
            const routerFileName = routerFileNames[j]
            const routerFilePath = "./routers/" + routerFolderName + "/" + routerFileName
            const routerFileLines = importFileLines(routerFilePath)
            const routerClearedLines = clearModelImportLines(routerFileLines)
            fields.push({ 
                name: endSub(routerFileName, 3), 
                path: routerFilePath,
                fileLines: routerFileLines,
                clearedLines: routerClearedLines,
                clearedText: routerClearedLines.join("\n")
            })
        }
    }
    return fields
}
const routerFields = getRouterFields()



const appendNewLines = () => {
    const getNewLines = (clearedLines, clearedText) => {
        const importedFields = []
        const dataTokens = getDataTokens(clearedText)
        // Get Used Fields
        for (let i = 0; i < importFields.length; i++) {
            const name = importFields[i].name
            if (dataTokens.includes(name)) {
                importedFields.push(importFields[i])
            }
        }
        // Look
        const newLines = []
        let isLooking = true
        for (let i = 0; i < clearedLines.length; i++) {
            const line = clearedLines[i].trim()
            newLines.push(clearedLines[i])
            if (isLooking && isMarkerLine(line)) {
                for (let j = 0; j < importedFields.length; j++) {
                    newLines.push(importedFields[j].line)
                }
                isLooking = false
            }
        }
        return newLines
    }
    for (let i = 0; i < routerFields.length; i++) {
        const field = routerFields[i]
        field.newLines = getNewLines(field.clearedLines, field.clearedText)
    }
}
appendNewLines()



const rewriteFiles = () => {
    for (let i = 0; i < routerFields.length; i++) {
        const routerField = routerFields[i]
        exportFileText(routerField.fileLines
            .join("\n")
            .split(new RegExp(`${process.argv[2]}`))
            .join(process.argv[3]),
            routerField.path)
        //console.log(JSON.stringify(routerField))
    }
}
rewriteFiles()



/*
console.log(stringifyList(getRouterFields()))

*/