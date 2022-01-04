const fs = require('fs')
require.extensions['.js'] = (module, filename) => {
    module.exports = fs.readFileSync(filename, 'utf8')
}

// I apologize, this code needs organizing as well

const sourceDirectoryPath = "./src"

const getFilePathWithinDirectory = (directoryPath, targetFileName) => {
    const fileNames = fs.readdirSync(directoryPath)
    if (fileNames.includes(targetFileName)) {
        return directoryPath + "/" + targetFileName
    }
    for (let i = 0; i < fileNames.length; i++) {
        const currentFileName = fileNames[i]
        if (currentFileName.includes(".")) {
            continue
        }
        const newDirectoryPath = directoryPath + "/" + currentFileName
        const filePath = getFilePathWithinDirectory(newDirectoryPath, targetFileName)
        if (filePath != null) {
            return filePath
        }
    }
    return null
}

const fileFields = []
const aUpperCode = "A".charCodeAt(0)
const makeFileGuide = (directoryPath) => {
    const fileNames = fs.readdirSync(directoryPath)
    for (let i = 0; i < fileNames.length; i++) {
        const currentFileName = fileNames[i]
        if (currentFileName.substring(currentFileName.length - 3, currentFileName.length) == ".js") {
            const path = directoryPath + "/" + currentFileName
            const hash = currentFileName.toUpperCase().charCodeAt(0) - aUpperCode
            fileFields.push({ name: currentFileName, path: path.substring(2, path.length), hash: hash })
            continue
        }
        if (currentFileName.includes(".")) {
            continue
        }
        const newDirectoryPath = directoryPath + "/" + currentFileName
        makeFileGuide(newDirectoryPath)
    }
}

makeFileGuide(sourceDirectoryPath)

const sortedFields = fileFields.sort((fieldA, fieldB) => {
    const capFieldA = fieldA.name.toUpperCase()
    const capFieldB = fieldB.name.toUpperCase()
    return capFieldA.localeCompare(capFieldB)
})


const fieldMap = {}
for (let i = 0; i < sortedFields.length; i++) {
    fieldMap[sortedFields[i].name] = sortedFields[i]
}

console.log(fieldMap[process.argv[2] + ".js"].path)

console.log("")