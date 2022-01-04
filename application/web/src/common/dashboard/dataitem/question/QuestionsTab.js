import { DataTab } from "../../DataTab"
import { DataItemAbsentContent } from "../DataItemAbsentContent"
import { DataItemButtonContent } from "../DataItemButtonContent"
import { DataItemIconContent } from "../DataItemIconContent"
import { DataItemModel } from "../DataItemModel"
import { AddModifyQuestionTab, loadExistingQuestion, loadNewQuestion, saveExistingQuestion, saveNewQuestion } from "./AddModifyQuestionTab"

/**
 * QUESTION_MODEL
 */
 export const QUESTION_MODEL = DataItemModel({
    dataToken: "questions",
    iconName: "building outline",
    absentMessage: "No questions exist yet",
    getTitle: (question) => question.question,
    getDescription: (question) => question.answerType
})

/**
 * QuestionsTab
 */
 export const QuestionsTab = ({ dashboardToken, viewerId, dataModel }) => {
    return (
        <DataTab
            dashboardToken={dashboardToken}
            dataModel={dataModel}
            title={dataModel.title}
            iconName={dataModel.iconName}
            addDataItemText={dataModel.addText}
            viewerId={viewerId}
            getTitle={dataModel.getTitle}
            getDescription={dataModel.getDescription}
            filterDataItem={dataModel.filterDataItem}
            makeButtonContent={(item, setDataItems) => (
                <QuestionButtonContent item={item} viewerId={viewerId} dataModel={dataModel} setDataItems={setDataItems} />
            )}
            absentContent={(
                <QuestionAbsentContent viewerId={viewerId} dataModel={dataModel} />
            )}
        />
    )
}



/**
 * QuestionButtonContent
 */
const QuestionButtonContent = ({ item, viewerId, dataModel, setDataItems }) => {
    return (
        <DataItemButtonContent
            item={item}
            viewerId={viewerId}
            dataModel={dataModel}
            setDataItems={setDataItems}
        />
    )
}



/**
 * QuestionAbsentContent
 */
const QuestionAbsentContent = ({ viewerId, dataModel }) => {
    return (
        <DataItemAbsentContent
            dashboardToken
            viewerId={viewerId}
            dataModel={dataModel}
        />
    )
}

/**
 * AddQuestionTab
 */
 export const AddQuestionTab = ({ viewerId, dataModel }) => {
    const questionId = -1
    return (
        <AddModifyQuestionTab
            viewerId={viewerId}
            questionId={questionId}
            titleText={dataModel.addText}
            dataModel={dataModel}
            iconContent={<DataItemIconContent dataModel={dataModel} existing={false}/>}
            loadQuestion={loadNewQuestion}
            saveQuestion={saveNewQuestion}
        />
  )
}



/**
 * EditQuestionTab
 */
export const EditQuestionTab = ({ viewerId, questionId, dataModel }) => {
    return (
      <AddModifyQuestionTab
        viewerId={viewerId}
        questionId={questionId}
        titleText={dataModel.editText}
        dataModel={dataModel}
        iconContent={<DataItemIconContent dataModel={dataModel} existing={true}/>}
        loadQuestion={loadExistingQuestion}
        saveQuestion={saveExistingQuestion}
      />
    )
  }