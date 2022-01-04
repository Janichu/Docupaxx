import { useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import { request } from "../../../../util/request";
import { cloneFormDataWithNewValue, makeFormData } from "../../../form/FormData";
import { ValidatingFormTextAreaInput } from "../../../form/input/ValidatingFormTextAreaInput";
import { ValidatingFormTextFieldInput } from "../../../form/input/ValidatingFormTextFieldInput";
import { DataAddModifyTab } from "../../DataTab";

const INITIAL_FIELDS = {
  "questionForeignReferencedKey": { value: "-", success: true, messageList: [] },
  "questionForeignReferencingKey": { value: "-", success: true, messageList: [] }
}

/**
 * AddModifyQuestionTab
 */
export const AddModifyQuestionTab = ({ viewerId, questionId, titleText, dataModel, iconContent, loadQuestion, saveQuestion }) => {
  const [formData, setFormData] = useState(makeFormData(["questionQuestion", "questionAnswerType", "questionParentUrlKey", "questionParentTable", "questionParentField", "questionCurrentUrlKey", "questionCurrentTable", "questionCurrentField", "questionForeignReferencedKey", "questionForeignReferencingKey"], INITIAL_FIELDS))
  const [question, setQuestion] = useState(null)
  useEffect(() => loadQuestion({viewerId, questionId, question, setQuestion, dataModel }), [viewerId, questionId])
  useEffect(() => loadQuestionFields(question, formData, setFormData), [question])
  return (
    <DataAddModifyTab
      titleText={titleText}
      iconContent={iconContent}
      onSave={() => saveQuestion({viewerId, questionId, dataModel, question, formData})}
    >
      <AddModifyQuestionQuestionInput formData={formData} setFormData={setFormData}/>
      <AddModifyQuestionAnswerTypeInput formData={formData} setFormData={setFormData}/>
      <AddModifyQuestionParentUrlKeyInput formData={formData} setFormData={setFormData}/>
      <AddModifyQuestionParentTableInput formData={formData} setFormData={setFormData}/>
      <AddModifyQuestionParentFieldInput formData={formData} setFormData={setFormData}/>
      <AddModifyQuestionCurrentUrlKeyInput formData={formData} setFormData={setFormData}/>
      <AddModifyQuestionCurrentTableInput formData={formData} setFormData={setFormData}/>
      <AddModifyQuestionCurrentFieldInput formData={formData} setFormData={setFormData}/>
      <AddModifyQuestionForeignReferencedKeyInput formData={formData} setFormData={setFormData}/>
      <AddModifyQuestionForeignReferencingKeyInput formData={formData} setFormData={setFormData}/>
      
      <Button type="submit" color="blue">Save</Button>
    </DataAddModifyTab>
  )
}



/**
 * loadExistingQuestion
 */
export const loadExistingQuestion = ({ viewerId, questionId, setQuestion, dataModel }) => {
  request(`/${dataModel.dashboardToken}/${viewerId}/${dataModel.dataToken}/${questionId}`).then(
      (pkg) => {
          setQuestion(pkg);
      }
  ).catch((error) => alert("Error: " + JSON.stringify(error)));
}



/**
 * loadNewQuestion
 */
export const loadNewQuestion = ({ question, setQuestion }) => {
  if (question == null) {
      setQuestion({
          name: "",
          description: ""
      })
  }
}



/**
 * saveExistingQuestion
 */
export const saveExistingQuestion = (saveQuestionParams) => {
  const dataModel = saveQuestionParams.dataModel
  saveQuestion({ 
      ...saveQuestionParams,
      fetchUrl: `/${dataModel.dashboardToken}/${saveQuestionParams.viewerId}/${dataModel.dataToken}/${saveQuestionParams.questionId}`,
      fetchMethod: "PATCH",
      dataModel
  })
}



/**
 * saveNewQuestion
 */
export const saveNewQuestion = (saveQuestionParams) => {
  const dataModel = saveQuestionParams.dataModel
  saveQuestion({ 
      ...saveQuestionParams,
      fetchUrl: `/${dataModel.dashboardToken}/${saveQuestionParams.viewerId}/${dataModel.dataToken}`,
      fetchMethod: "POST",
      dataModel
  })
}



/**
 * AddModifyQuestionQuestionInput
 */
const AddModifyQuestionQuestionInput = ({ formData, setFormData }) => {
  return (
      <ValidatingFormTextFieldInput
          formKey="questionQuestion"
          validating={false}
          formData={formData}
          setFormData={setFormData}
          required={false}
      />
  )
}

/**
 * AddModifyQuestionAnswerTypeInput
 */
 const AddModifyQuestionAnswerTypeInput = ({ formData, setFormData }) => {
    return (
        <ValidatingFormTextFieldInput
            formKey="questionAnswerType"
            validating={false}
            formData={formData}
            setFormData={setFormData}
            required={false}
        />
    )
  }

/**
 * AddModifyQuestionParentUrlKeyInput
 */
 const AddModifyQuestionParentUrlKeyInput = ({ formData, setFormData }) => {
    return (
        <ValidatingFormTextFieldInput
            formKey="questionParentUrlKey"
            validating={false}
            formData={formData}
            setFormData={setFormData}
            required={false}
        />
    )
  }

/**
 * AddModifyQuestionParentTableInput
 */
 const AddModifyQuestionParentTableInput = ({ formData, setFormData }) => {
    return (
        <ValidatingFormTextFieldInput
            formKey="questionParentTable"
            validating={false}
            formData={formData}
            setFormData={setFormData}
            required={false}
        />
    )
  }

/**
 * AddModifyQuestionParentTableInput
 */
 const AddModifyQuestionParentFieldInput = ({ formData, setFormData }) => {
  return (
      <ValidatingFormTextFieldInput
          formKey="questionParentField"
          validating={false}
          formData={formData}
          setFormData={setFormData}
          required={false}
      />
  )
}

/**
 * AddModifyQuestionCurrentTableInput
 */
 const AddModifyQuestionCurrentTableInput = ({ formData, setFormData }) => {
    return (
        <ValidatingFormTextFieldInput
            formKey="questionCurrentTable"
            validating={false}
            formData={formData}
            setFormData={setFormData}
            required={false}
        />
    )
  }

/**
 * AddModifyQuestionCurrentFieldInput
 */
 const AddModifyQuestionCurrentFieldInput = ({ formData, setFormData }) => {
    return (
        <ValidatingFormTextFieldInput
            formKey="questionCurrentField"
            validating={false}
            formData={formData}
            setFormData={setFormData}
            required={false}
        />
    )
  }

/**
 * AddModifyQuestionCurrentUrlKeyInput
 */
 const AddModifyQuestionCurrentUrlKeyInput = ({ formData, setFormData }) => {
    return (
        <ValidatingFormTextFieldInput
            formKey="questionCurrentUrlKey"
            validating={false}
            formData={formData}
            setFormData={setFormData}
            required={false}
        />
    )
  }

  const AddModifyQuestionForeignReferencedKeyInput = ({ formData, setFormData }) => {
    return (
        <ValidatingFormTextFieldInput
            formKey="questionForeignReferencedKey"
            validating={false}
            formData={formData}
            setFormData={setFormData}
            required={false}
        />
    )
  }

  const AddModifyQuestionForeignReferencingKeyInput = ({ formData, setFormData }) => {
    return (
        <ValidatingFormTextFieldInput
            formKey="questionForeignReferencingKey"
            validating={false}
            formData={formData}
            setFormData={setFormData}
            required={false}
        />
    )
  }



/**
 * loadQuestionFields
 */
const loadQuestionFields = (question, formData, setFormData) => {
  //alert(JSON.stringify(question))
  if (question) {
      let newFormData = formData
      newFormData = cloneFormDataWithNewValue(newFormData, "questionQuestion", question.question)
      newFormData = cloneFormDataWithNewValue(newFormData, "questionAnswerType", question.answerType)
      newFormData = cloneFormDataWithNewValue(newFormData, "questionParentUrlKey", question.parentUrlKey)
      newFormData = cloneFormDataWithNewValue(newFormData, "questionParentTable", question.parentTable)
      newFormData = cloneFormDataWithNewValue(newFormData, "questionParentField", question.parentField)
      newFormData = cloneFormDataWithNewValue(newFormData, "questionCurrentTable", question.currentTable)
      newFormData = cloneFormDataWithNewValue(newFormData, "questionCurrentField", question.currentField)
      newFormData = cloneFormDataWithNewValue(newFormData, "questionCurrentUrlKey", question.currentUrlKey)
      newFormData = cloneFormDataWithNewValue(newFormData, "questionForeignReferencedKey", question.foreignReferencedKey)
      newFormData = cloneFormDataWithNewValue(newFormData, "questionForeignReferencingKey", question.foreignReferencingKey)
      setFormData(newFormData)

  }
}


/**
 * saveQuestion
 */
const saveQuestion = ({ viewerId, formData, fetchUrl, fetchMethod, dataModel }) => {
  const questionQuestion = formData["questionQuestion"].value
  const questionAnswerType = formData["questionAnswerType"].value
  const questionParentUrlKey = formData["questionParentUrlKey"].value
  const questionParentTable = formData["questionParentTable"].value
  const questionParentField = formData["questionParentField"].value
  const questionCurrentTable = formData["questionCurrentTable"].value
  const questionCurrentField = formData["questionCurrentField"].value
  const questionCurrentUrlKey = formData["questionCurrentUrlKey"].value
  const questionForeignReferencedKey = formData["questionForeignReferencedKey"].value
  const questionForeignReferencingKey = formData["questionForeignReferencingKey"].value

  requestSaveQuestion(fetchUrl, fetchMethod, questionQuestion, questionAnswerType, questionParentUrlKey, questionParentTable, questionParentField, questionCurrentTable, questionCurrentField, questionCurrentUrlKey, questionForeignReferencedKey, questionForeignReferencingKey)
    .then(() => window.location.replace(`/${dataModel.dashboardToken}/${viewerId}/dashboard/${dataModel.section}`));
};


const requestSaveQuestion = (fetchUrl, fetchMethod, questionQuestion, questionAnswerType, questionParentUrlKey, questionParentTable, questionParentField, questionCurrentTable, questionCurrentField, questionCurrentUrlKey,  questionForeignReferencedKey, questionForeignReferencingKey) => {
  return request(fetchUrl, {
    method: fetchMethod,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: questionQuestion,
      answerType: questionAnswerType,
      parentUrlKey: questionParentUrlKey,
      parentTable: questionParentTable,
      parentField: questionParentField,
      currentTable: questionCurrentTable,
      currentField: questionCurrentField,
      currentUrlKey: questionCurrentUrlKey,
      foreignReferencedKey: questionForeignReferencedKey,
      foreignReferencingKey: questionForeignReferencingKey
    }),
  })
}
