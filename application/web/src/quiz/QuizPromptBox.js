import { Link } from "react-router-dom";
import { Button, Segment } from "semantic-ui-react";
import { MultilineBreak } from "../common/MultilineBreak";
import { useParams } from "react-router";

/**
 * QuizPromptBox
 */
export const QuizPromptBox = ({ lineSpacing = 6 }) => {
  const { id } = useParams();

  return (
    <Segment>
      <p style={{ fontSize: "20px" }}>
        This is where we describe how the quiz can help the user find an
        organization to get application requirements.
      </p>
      <MultilineBreak lines={lineSpacing} />
      <Button as={Link} to="/quiz" color="blue" size="small">
        Start Quiz
      </Button>
    </Segment>
  );
};
