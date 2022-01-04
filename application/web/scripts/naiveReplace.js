const fs = require('fs')
require.extensions['.js'] = (module, filename) => {
    module.exports = fs.readFileSync(filename, 'utf8')
}

const sourceDirectoryPath = "./src"
const aUpperCode = "A".charCodeAt(0)

const subEquals = (text, target) => (text.length >= target.length && text.substring(0, target.length) == target)

const capitalizeFirstLetter = (text) => {
    const first = text.substring(0, 1).toUpperCase()
    return first + text.substring(1)
}

const isJavascriptFile = (fileName) => fileName.substring(fileName.length - 3, fileName.length) == ".js"

const getFileName = (path) => {
    const parts = path.split("/")
    return parts[parts.length - 1]
}

const trimJavascriptExtension = (path) => {
    if (path.includes('.js')) {
        return path.substring(0, path.length - 3)
    }
    return path
}

const getDataTokens = (text) => {
    const dataTokens = []
    const dottedTokens = text.split(/[ (){}\[\]\,\n\=\+\*\!\<\>\/\;\:\?]+/)
    for (let i = 0; i < dottedTokens.length; i++) {
        const token = dottedTokens[i]
        if (token == ".") {
            continue
        }
        let dataToken = token
        if (token.includes(".") && token.substring(0, 1) != ".") {
            dataToken = token.split(".")[0]
        }
        dataTokens.push(dataToken)
    }
    return dataTokens
}

const fileTextIncludes = (fileText, name) => {
    const fileTokens = getDataTokens(fileText)
    return fileTokens.includes(name)
}

const filePathIncludes = (filePath, exportedName) => {
    if (filePath.includes(exportedName)) {
        return true
    }
    const wordParts = exportedName.toLowerCase().split("_")
    for (let i = 0; i < wordParts.length; i++) {
        wordParts[i] = capitalizeFirstLetter(wordParts[i])
    } 
    const upperCamelCase = wordParts.join("")
    if (filePath.includes(upperCamelCase)) {
        return true
    }
    return false
}

const exportsIncludes = (exportedFieldMap, filePath, exportedName) => {
    const field = exportedFieldMap[exportedName]
    return field.path == filePath
}








// BUILT IN EXPORTS
const BUILT_IN_EXPORTS = [
    {
        path: "semantic-ui-react",
        objects: "Button, Container, Dropdown, Grid, Form, Header, Icon, Label, List, Popup, Segment, Search, Menu, Message, Modal, Image"
    },
    {
        path: "react-router-dom",
        objects: "Link, Route, Switch, useParams"
    },
    {
        path: "react",
        objects: "useCallback, useEffect, useState"
    },
    {
        path: "react-router",
        objects: "useHistory"
    },
    {
        path: "joi",
        objects: "Joi\'"
    }

]












// EXPORTED
const getExportedObjects = () => {
    const unsortedExportedObjects = []
    const ignoreList = ["index.js", "MobileContainer.js", "reportWebVitals.js", "setupTests.js"]
    const includesIgnoreListItem = (path) => {
        for (let j = 0; j < ignoreList.length; j++) {
            if (path.includes[ignoreList[j]]) {
                return true
            }
        }
        return false
    }
    const appendExportedObjects = (path) => {
        if (includesIgnoreListItem(path)) {
            return
        }
        if (path.includes("App.js")) {
            const name = "App"
            const hash = name.toUpperCase().charCodeAt(0) - aUpperCode
            unsortedExportedObjects.push({ name: name, path: path.substring(2), hash: hash })
            return
        }
        const fileText = require("." + path)
        const lines = fileText.split('\n')
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim()
            if (subEquals(line, "export const ")) {
                const name = line.substring(12).split(" ")[1]
                const hash = name.toUpperCase().charCodeAt(0) - aUpperCode
                unsortedExportedObjects.push({ name: name, path: path.substring(2), hash: hash })
            }
        }
    }
    const appendBuiltInExportedObjects = () => {
        for (let i = 0; i < BUILT_IN_EXPORTS.length; i++) {
            const builtInField = BUILT_IN_EXPORTS[i]
            const path = builtInField.path
            const objects = builtInField.objects.split(/[ ,]+/)
            for (let j = 0; j < objects.length; j++) {
                let object = objects[j]
                let isDefault = false
                if (object.includes("\'")) {
                    object = object.substring(0, object.length-1)
                    isDefault = true
                }
                const hash = object.toUpperCase().charCodeAt(0) - aUpperCode
                unsortedExportedObjects.push({ name: object, path: path, hash: hash, isDefault: isDefault })
            }
        }
    }
    const collectedExportedObjects = (directoryPath) => {
        const fileNames = fs.readdirSync(directoryPath)
        for (let i = 0; i < fileNames.length; i++) {
            const currentFileName = fileNames[i]
            console.log(`currentFileName: ` + currentFileName)
            if (isJavascriptFile(currentFileName)) {
                const path = directoryPath + "/" + currentFileName
                appendExportedObjects(path)
                continue
            }
            if (currentFileName.includes(".") || currentFileName.includes("alias")) {
                continue
            }
            const newDirectoryPath = directoryPath + "/" + currentFileName
            collectedExportedObjects(newDirectoryPath)
        }
    }
    collectedExportedObjects(sourceDirectoryPath)
    appendBuiltInExportedObjects()
    const exportedObjects = unsortedExportedObjects.sort((fieldA, fieldB) => {
        const capFieldA = fieldA.name.toUpperCase()
        const capFieldB = fieldB.name.toUpperCase()
        return capFieldA.localeCompare(capFieldB)
    })
    //console.log(exportedObjects.map((obj) => JSON.stringify(obj)).join("\n"))
    return exportedObjects
}







// IMPORTED
const getImportedObjects = (filePath, exportedFieldMap, lines) => {
    const importedObjects = []
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        const importPresent = subEquals(line, "import")
        if (importPresent) {
            let importLine = line
            let j = i
            // Case where the import is multiline
            if (!line.includes("from")) {
                for (j = i + 1; j < lines.length; j++) {
                    const partialImportLine = lines[j]
                    importLine = importLine + partialImportLine
                    if (partialImportLine.includes("from")) {
                        break
                    }
                }
                i = j
            }
            const endLine = lines[j]
            const path = endLine.split(/[\"'`]+/)[1]
            const collectImportNamesText = (importLine) => {
                if (importLine.includes("{")) {
                    return importLine.split(/[{}]+/)[1]
                }
                return importLine.split(/[ ]+/)[1]
            }
            const importNamesText = collectImportNamesText(importLine)
            const importNames = importNamesText.trim().split(/[ ,]+/)
            for (let k = 0; k < importNames.length; k++) {
                const importedName  = importNames[k]
                let isDefault = false
                if (importedName in exportedFieldMap) {
                    const exportedField = exportedFieldMap[importedName]
                    if (exportedField.isDefault) {
                        isDefault = true
                    }
                }
                importedObjects.push({ name: importedName, start: i, end: j, path: path, filePath: filePath, isDefault: isDefault })
            }
        }
    }
    return importedObjects
}






// CLEAR IMPORT LINES
const clearImportLines = (fileLines, importedObjects) => {
    const getStartLineMap = (importedObjects) => {
        const startLineMap = {}
        for (let i = 0; i < importedObjects.length; i++) {
            const importedField = importedObjects[i]
            if ("start" in importedField) {
                startLineMap["start" + importedField.start] = importedField
            }
        }
        return startLineMap
    }
    const startLineMap = getStartLineMap(importedObjects)
    const clearedLines = []
    for (let i = 0; i < fileLines.length; i++) {
        const line = fileLines[i]
        const startKey = "start" + i
        if (!(startKey in startLineMap)) {
            clearedLines.push(line)
            continue
        }
        const importedField = startLineMap[startKey]
        i = importedField.end
    }
    return clearedLines
}






// PATH LIST
const getPathList = (exportedObjects) => {
    const pathList = []
    for (let i = 0; i < exportedObjects.length; i++) {
        const path = exportedObjects[i].path
        if (!pathList.includes(path)) {
            pathList.push(path)
        }
    }
    return pathList
}








// FIELD MAP
const getFieldMap = (objectFields) => {
    const fieldMap = {}
    for (let i = 0; i < objectFields.length; i++) {
        fieldMap[objectFields[i].name] = objectFields[i]
    }
    return fieldMap
}






// IMPORT PATH
const getImportPath = (destinationPath, sourcePath) => {
    if (!sourcePath.includes("/")) {
        return sourcePath
    }
    const destinationList = destinationPath.split("/")
    const sourceList = sourcePath.split("/")
    let common = 0
    for (let i = 0; i < destinationList.length && i < sourceList.length; i++) {
        const compA = destinationList[i]
        const compB = sourceList[i]
        if (compA == compB) {
            common++
        } else {
            break
        }
    }
    const destinationListLength = destinationList.length - 1
    const destinationDifference = destinationListLength - common
    let backText = "./"
    if (destinationDifference > 0) {
        backText = "../".repeat(destinationDifference)
    }
    let frontText = sourceList.slice(common, sourceList.length).join("/")
    return backText + frontText
}







// UPDATE IMPORTED OBJECTS
const updateImportedObjects = (importedObjects, exportedObjects, exportedFieldMap, filePath, fileText, clearedText) => {
    let dirty = false
    const updateExistingImportedObjects = (importedObjects, exportedFieldMap, filePath) => {
        let dirty = false
        for (let i = 0; i < importedObjects.length; i++) {
            const importedField = importedObjects[i]
            const importedName = importedField.name
            if (!(importedName in exportedFieldMap) || !fileTextIncludes(clearedText, importedName)) {
                dirty = true
                importedField.toBeDeleted = true
                continue
            }
            const exportedField = exportedFieldMap[importedName]
            const trueImportPath = getImportPath(filePath, exportedField.path)
            const existingImportPath = importedField.path + ".js"
            if (existingImportPath != trueImportPath) {
                dirty = true
                    console.log(existingImportPath + " != " +  trueImportPath)
                    console.log(`  Dest: ${filePath}`)
                    console.log(`  Src: ${exportedField.path}`)
                    console.log(`  TIP: ${trueImportPath}`)
                importedField.path = trimJavascriptExtension(trueImportPath)
            }
        }
        return dirty
    }
    const updateNewImportedObjects = (importedObjects, exportedObjects, exportedFieldMap, filePath, fileText) => {
        let dirty = false
        const getImportedNameList = (importedObjects) => {
            const nameList = []
            for (let i = 0; i < importedObjects.length; i++) {
                const importedNames = [importedObjects[i].name]
                for (let j = 0; j < importedNames.length; j++) {
                    nameList.push(importedNames[j])
                }
            }
            return nameList
        }
        const getMissingImportNameList = (importNameList, exportedObjects, exportedFieldMap, filePath, fileText) => {
            const nameList = []
            for (let i = 0; i < exportedObjects.length; i++) {
                const exportedName = exportedObjects[i].name
                if (!importNameList.includes(exportedName) && fileTextIncludes(clearedText, exportedName) && !exportsIncludes(exportedFieldMap, filePath, exportedName)) {
                    nameList.push(exportedName)
                }
            }
            return nameList
        }
        const insertMissingImportObjects = (importedObjects, missingNameList, exportedFieldMap, filePath) => {
            const getImportedPathMap = (importedObjects) => {
                const pathMap = {}
                for (let i = 0; i < importedObjects.length; i++) {
                    pathMap[importedObjects[i].path] = importedObjects[i]
                }
                return pathMap
            }
            const importedPathMap = getImportedPathMap(importedObjects)
            for (let i = 0; i < missingNameList.length; i++) {
                const missingName = missingNameList[i]
                const missingField = exportedFieldMap[missingName]
                const missingPath = missingField.path
                const longTrueImportPath = getImportPath(filePath, missingPath)
                const trueImportPath = trimJavascriptExtension(longTrueImportPath)
                const newImportedField = { name: missingName, new: true, path: trueImportPath }
                importedObjects.push(newImportedField)
                importedPathMap[trueImportPath] = newImportedField
            }    
        }
        const importNameList = getImportedNameList(importedObjects)
        const missingNameList = getMissingImportNameList(importNameList, exportedObjects, exportedFieldMap, filePath, fileText)
        insertMissingImportObjects(importedObjects, missingNameList, exportedFieldMap, filePath)
        dirty = missingNameList.length > 0
        if (dirty) console.log("MNL: " + missingNameList);
        return dirty
    }
    const checkForUnavailableImportedObjects = (importedObjects) => {
        let unavailableImportCount = 0
        for (let i = 0; i < importedObjects.length; i++) {
            if (importedObjects[i].toBeDeleted) {
                unavailableImportCount++
            }
        }
        return unavailableImportCount > 0
    }
    const existingDirty = updateExistingImportedObjects(importedObjects, exportedFieldMap, filePath)
    const newDirty = updateNewImportedObjects(importedObjects, exportedObjects, exportedFieldMap, filePath, fileText)
    const unavailableDirty = checkForUnavailableImportedObjects(importedObjects)
    dirty = existingDirty || newDirty || unavailableDirty
    if (dirty) console.log(existingDirty + " __ " + newDirty);
    return dirty
}









// REWRITE IMPORTED OBJECTS OLD
const rewriteImportedObjectsOld = (importedObjects, filePath, fileLines) => {
    const newLines = []
    const getLastImportLine = (fileLines) => {
        let lastLine = 0
        for (let i = 0; i < fileLines.length; i++) {
            if (subEquals(fileLines[i], "import")) {
                lastLine = i
            }
        }
        return lastLine
    }
    const getStartLineMap = (importedObjects) => {
        const startLineMap = {}
        for (let i = 0; i < importedObjects.length; i++) {
            const importedField = importedObjects[i]
            if ("start" in importedField) {
                startLineMap["start" + importedField.start] = importedField
            }
        }
        return startLineMap
    }
    const getImportLine = (importField) => {
        return `import { ${importField.names.join(", ") } } from \"${importField.path}\"`
    }
    const pushNewImportLines = (lastImportLine, importedObjects, newLines) => {
        if (lastImportLine) {
            for (let i = 0; i < importedObjects.length; i++) {
                const importedField = importedObjects[i]
                if (importedField.new) {
                    newLines.push(getImportLine(importedField))
                }
            }
        }
    }
    const lastImportLine = getLastImportLine(fileLines)
    const startLineMap = getStartLineMap(importedObjects)
    for (let i = 0; i < fileLines.length; i++) {
        const line = fileLines[i]
        const startKey = "start" + i
        if (!(startKey in startLineMap)) {
            newLines.push(line)
            pushNewImportLines(i == lastImportLine, importedObjects, newLines)
            continue
        }
        const importedField = startLineMap[startKey]
        newLines.push(getImportLine(importedField))
        pushNewImportLines(i == lastImportLine, importedObjects, newLines)
        i = importedField.end
    }
    fileLines.splice(0, 0, "// PATH: " + filePath)
    fs.writeFile("./scripts/backups/" + JSON.stringify(Date.now()) + ".js", fileLines.join("\n"), (err) => {
        if (err) {
            throw err
        }
    })
    fs.writeFile("./" + filePath, newLines.join("\n"), (err) => {
        if (err) {
            throw err
        }
    })
}






// REWRITE IMPORTED OBJECTS
const rewriteImportedObjects = (importedObjects, exportedFieldMap, filePath, fileLines) => {
    const updateImportedObjectsForIsDefault = (importedObjects, exportedFieldMap) => {
        for (let i = 0; i < importedObjects.length; i++) {
            const field = importedObjects[i]
            const name = field.name
            if (!(name in exportedFieldMap)) {
                continue
            }
            const exportedField = exportedFieldMap[name]
            field.isDefault = exportedField.isDefault
        }
    }
    const makeImportedFieldPathMap = (importedObjects) => {
        const importedFieldPathMap = {}
        for (let i = 0; i < importedObjects.length; i++) {
            const importedField = importedObjects[i]
            if (importedField.toBeDeleted) {
                continue
            }
            const path = importedField.path
            if (!(path in importedFieldPathMap)) {
                importedFieldPathMap[path] = []
            }
            importedFieldPathMap[path].push(importedField)
        }
        return importedFieldPathMap
    }
    const findFirstFreeLineIndex = (clearedLines) => {
        const firstLine = clearedLines[0]
        if (!firstLine.trim().includes("/*")) {
            return 0
        }
        for (let i = 0; i < clearedLines.length; i++) {
            const line = clearedLines[i]
            if (line.includes("*/")) {
                return i + 1
            }
        }
        return 0
    }
    const getImportLine = (pathBucket) => {
        const importLine = ["import "]
        const path = pathBucket.path
        const fields = pathBucket.fields
        const sortedFields = fields.sort((fieldA, fieldB) => {
            const isDefaultA = (fieldA.isDefault ? -1: 1)
            const isDefaultB = (fieldB.isDefault ? -1: 1)
            const difference = isDefaultA - isDefaultB
            if (difference != 0) {
                return difference
            }
            return fieldA.name.localeCompare(fieldB.name)
        })
        console.log("SortedFields: " + (sortedFields.map((f) => JSON.stringify(f))).join("\n"))
        if (sortedFields[0].isDefault) {
            importLine.push(`${sortedFields[0].name} from \"${path}\";`)
            return importLine.join("")
        }
        importLine.push("{ ")
        const names = sortedFields.map((field) => field.name)
        importLine.push(names.join(", "))
        importLine.push(` } from \"${path}\";`)
        return importLine.join("")
    }
    const makeImportLineList = (importedFieldPathMap) => {
        const importLines = []
        const keys = Object.keys(importedFieldPathMap) 
        const importFieldList = []
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            importFieldList.push({ path: key, fields: importedFieldPathMap[key] })
        }
        const sortedImportedFieldList = importFieldList.sort((pathBucketA, pathBucketB) => {
            const hasSlashA = (!pathBucketA.path.includes("/") ? -1: 1)
            const hasSlashB = (!pathBucketB.path.includes("/") ? -1: 1)
            const difference = hasSlashA - hasSlashB
            if (difference != 0) {
                return difference
            }
            return pathBucketA.path.localeCompare(pathBucketB.path)
        })
        for (let i = 0; i < sortedImportedFieldList.length; i++) {
            importLines.push(getImportLine(sortedImportedFieldList[i]))
        }
        return importLines
    }
    const makeNewFileLines = (clearedLines, importedFieldPathMap) => {
        const newFileLines = []
        const firstFreeLineIndex = findFirstFreeLineIndex(clearedLines)
        for (let i = 0; i < clearedLines.length; i++) {
            const line = clearedLines[i]
            if (i == firstFreeLineIndex) {
                const importLines = makeImportLineList(importedFieldPathMap)
                for (let j = 0; j < importLines.length; j++) {
                    newFileLines.push(importLines[j])
                }
            }
            newFileLines.push(line)
        }
        return newFileLines
    }
    updateImportedObjectsForIsDefault(importedObjects, exportedFieldMap)
    const clearedLines = clearImportLines(fileLines, importedObjects)
    const importFieldPathMap = makeImportedFieldPathMap(importedObjects)
    const newLines = makeNewFileLines(clearedLines, importFieldPathMap)
    fileLines.splice(0, 0, "// PATH: " + filePath)
    fs.writeFile("./scripts/backups/" + JSON.stringify(Date.now()) + ".js", fileLines.join("\n"), (err) => {
        if (err) {
            throw err
        }
    })
    const newFileText = newLines.join("\n")
    console.log("START: newFileText")
    console.log(newFileText)
    console.log("FINISH: newFileText")
    return
    fs.writeFile("./" + filePath, newLines.join("\n"), (err) => {
        if (err) {
            throw err
        }
    })
}









// NAIVE REPLACE
const naiveReplace = (target, replacement) => {
    /*
        1) Iterate through every path
        2) For every file, get the Imported Objects
        3) See if any names matches the Exported Objects
        4) If yes, check the paths of the Imported Objects
        5) If no corrections, do nothing
        6) If yes corrections, change the Import Statements & rewrite those imports
    */
    const exportedObjects = getExportedObjects(sourceDirectoryPath)
    const exportedFieldMap = getFieldMap(exportedObjects)
    const pathList = getPathList(exportedObjects)
    for (let i = 0; i < pathList.length; i++) {
        const path = pathList[i]
        console.log("WORK: " + path)
        if (!path.includes("/")) {
            continue
        }
        const adjustedPath = "../" + path
        const fileText = require(adjustedPath)
        const lines = fileText.split("\n")
        const dirty = fileText.includes(target)
        if (dirty) {
            const replacedText = fileText.replaceAll(target, replacement)
            /*fs.writeFile("./scripts/backups/" + JSON.stringify(Date.now()) + ".js", ` PATH: ${path}\n${fileText}`, (err) => {
                if (err) {
                    throw err
                }
            })*/
            fs.writeFile("./" + path, replacedText, (err) => {
                if (err) {
                    throw err
                }
            })
        }
    }
    const efmKeys = Object.keys(exportedFieldMap)
    for (let i = 0; i < efmKeys.length; i++) {
        //console.log(`${efmKeys[i]}: ${JSON.stringify(exportedFieldMap[efmKeys[i]])}`)
    }
}
naiveReplace(process.argv[2], process.argv[3])