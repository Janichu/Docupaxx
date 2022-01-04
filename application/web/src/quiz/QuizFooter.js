import { Link } from "react-router-dom";
import { Button, Message } from "semantic-ui-react";

/**
 * QuizFooter
 */
export const QuizFooter = () => {
    return (
        <Message attached="bottom" warning>
            Change your mind?
        <Link to="/home">
              <Button
                class="mini"
                style={{ marginTop: "-10px" }}
                floated="right"
              >
                Exit
              </Button>
            </Link>
        </Message>
    )
}