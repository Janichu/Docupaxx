import { Container } from "semantic-ui-react";
import { DashboardTab } from "../../common/dashboard/DashboardTab";
import { QuizPromptBox } from "../../quiz/QuizPromptBox";

/**
 * UserQuizTab
 */
export const UserQuizTab = () => {
    return (
        <DashboardTab title={"Take a Quiz!"} iconName={"search"}>
            <Container fluid textAlign="center">
                <QuizPromptBox lineSpacing={1}/>
            </Container>
        </DashboardTab>
    )
}