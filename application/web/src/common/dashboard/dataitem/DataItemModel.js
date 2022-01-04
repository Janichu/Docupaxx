import { freeze } from "../../../util/freeze";

/**
 * undefinedTypeText
 */
const undefinedTypeText = 'undefined'



/**
 * isDefined
 */
const isDefined = (property) => (typeof property.section != undefinedTypeText)



/**
 * DataItemModel
 */
export const DataItemModel = (props) => {
    const model = {
        ...props
    }/*
    if (!isDefined(model.section)) {
        model.section = convertTitleToDataSectionText(model.title)
    }
    if (!isDefined(model.dataToken)) {
        model.dataToken = model.section
    }
    if (!isDefined(model.edit)) {
        model.edit = false
    }
    if (!isDefined(model.download)) {
        model.download = false
    }
    if (!isDefined(model.remove)) {
        model.remove = false
    }*/
    return freeze(model)
}