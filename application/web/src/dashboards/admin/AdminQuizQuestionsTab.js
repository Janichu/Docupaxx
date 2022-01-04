import { useParams } from "react-router-dom";
import { DataItemModel } from "../../common/dashboard/dataitem/DataItemModel";
import { AddQuestionTab, EditQuestionTab, QuestionsTab, QUESTION_MODEL } from "../../common/dashboard/dataitem/question/QuestionsTab";
import { USER_MODEL, UsersTab } from "../../common/dashboard/dataitem/user/UsersTab";

/**
 * ADMIN_QUIZ_QUESTION_MODEL
 */
const ADMIN_QUIZ_QUESTION_MODEL = DataItemModel({
    ...QUESTION_MODEL,
    title: "Quiz Questions",
    dashboardToken: "admins",
    remove: true,
    removalText: "Remove Question",
    edit: true,
    editText: "Edit Question",
    add: true,
    addText: "Add Question",
    section: "quizQuestions"
})



/**
 * AdminQuizQuestionsTab
 */
export const AdminQuizQuestionsTab = () => {
    const { id } = useParams()
    return (
        <QuestionsTab
            viewerId={id}
            dataModel={ADMIN_QUIZ_QUESTION_MODEL}
        />
    )
}

/**
 * AdminAddQuestionTab
 */
 export const AdminAddQuestionTab = () => {
    const { id } = useParams();
    return (
        <AddQuestionTab
            viewerId={id}
            dataModel={ADMIN_QUIZ_QUESTION_MODEL}
        />
    )
}



/**
 * AdminEditQuestionTab
 */
export const AdminEditQuestionTab = () => {
    alert("anything")

    const { id, questionId } = useParams()
    return (
        <EditQuestionTab
            viewerId={id}
            questionId={questionId}
            dataModel={ADMIN_QUIZ_QUESTION_MODEL}
        />
    )
}