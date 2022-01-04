/**
 * Quiz Prompt Page
 *
 * Shows the prompt to the Quiz Pages
 */
import { Link } from "react-router-dom";
import { Button, Segment } from "semantic-ui-react";
import { DocupaxxPage } from "../common/DocupaxxPage";
import { MultilineBreak } from "../common/MultilineBreak";
import { QuizFooter } from "./QuizFooter";
import { QuizGrid } from "./QuizGrid";
import { QuizPromptBox } from "./QuizPromptBox";

/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

/**
 * QuizPromptPage
 */
export const QuizPromptPage = () => {
  return (
    <DocupaxxPage>
      <QuizGrid>
        <QuizPromptBox />
        <QuizFooter />
      </QuizGrid>
    </DocupaxxPage>
  );
};
