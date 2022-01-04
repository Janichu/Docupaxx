import { useParams } from "react-router-dom";
import { DashboardTab } from "../../common/dashboard/DashboardTab";
import { DataItemModel } from "../../common/dashboard/dataitem/DataItemModel";
import { AddQuestionTab, EditQuestionTab, QuestionsTab, QUESTION_MODEL } from "../../common/dashboard/dataitem/question/QuestionsTab";
import { USER_MODEL, UsersTab } from "../../common/dashboard/dataitem/user/UsersTab";



/**
 * AdminQuizQuestionsTab
 */
export const AdminQuizNotesTab = () => {
    const { id } = useParams()
    return (
        <DashboardTab iconName="search" title="Quiz Notes">
            <p>The admin has the ability to add/modify/delete quiz questions.</p>
            <p>Each quiz question allows to take from the Address and Organization tables and provide answers based on their fields.</p>
            <br></br>
            <br></br>
            <h2><u>Use Caution as an Admin when Making Quiz Questions as it may Impact the Quiz</u></h2>
            <p>If one is stuck, the best course of action is to revert back to default settings</p>
            <br></br>
            <br></br>
            <p><b>How to Refer Back to Default Settings</b></p>
            <p>1) Delete all Quiz Questions</p>
            <br></br>
            <br></br>
            <p>2) Add Quiz Question: </p>
            <p>&nbsp;&nbsp;<b>Question:</b> What country is your organization?</p>
            <p>&nbsp;&nbsp;<b>AnswerType:</b> Country</p>
            <p>&nbsp;&nbsp;<b>ParentUrlKey:</b> -</p>
            <p>&nbsp;&nbsp;<b>ParentTable:</b> -</p>
            <p>&nbsp;&nbsp;<b>ParentField:</b> -</p>
            <p>&nbsp;&nbsp;<b>CurrentUrlKey:</b> country</p>
            <p>&nbsp;&nbsp;<b>CurrentTable:</b> address</p>
            <p>&nbsp;&nbsp;<b>CurrentField:</b> country</p>
            <p>&nbsp;&nbsp;<b>ForeignReferencedKey:</b> -</p>
            <p>&nbsp;&nbsp;<b>ForeignReferencingKey:</b> -</p>
            <br></br>
            <br></br>
            <p>3) Add Quiz Question: </p>
            <p>&nbsp;&nbsp;<b>Question:</b> What city is your organization?</p>
            <p>&nbsp;&nbsp;<b>AnswerType:</b> City</p>
            <p>&nbsp;&nbsp;<b>ParentUrlKey:</b> country</p>
            <p>&nbsp;&nbsp;<b>ParentTable:</b> address</p>
            <p>&nbsp;&nbsp;<b>ParentField:</b> country</p>
            <p>&nbsp;&nbsp;<b>CurrentUrlKey:</b> city</p>
            <p>&nbsp;&nbsp;<b>CurrentTable:</b> address</p>
            <p>&nbsp;&nbsp;<b>CurrentField:</b> city</p>
            <p>&nbsp;&nbsp;<b>ForeignReferencedKey:</b> -</p>
            <p>&nbsp;&nbsp;<b>ForeignReferencingKey:</b> -</p>
            <br></br>
            <br></br>
            <p>4) Add Quiz Question: </p>
            <p>&nbsp;&nbsp;<b>Question:</b> What is your organization?</p>
            <p>&nbsp;&nbsp;<b>AnswerType:</b> Organization</p>
            <p>&nbsp;&nbsp;<b>ParentUrlKey:</b> city</p>
            <p>&nbsp;&nbsp;<b>ParentTable:</b> address</p>
            <p>&nbsp;&nbsp;<b>ParentField:</b> city</p>
            <p>&nbsp;&nbsp;<b>CurrentUrlKey:</b> organization</p>
            <p>&nbsp;&nbsp;<b>CurrentTable:</b> organization</p>
            <p>&nbsp;&nbsp;<b>CurrentField:</b> name</p>
            <p>&nbsp;&nbsp;<b>ForeignReferencedKey:</b> id</p>
            <p>&nbsp;&nbsp;<b>ForeignReferencingKey:</b> address_id</p>
            <br></br>
            <br></br>

        </DashboardTab>
    )
}
