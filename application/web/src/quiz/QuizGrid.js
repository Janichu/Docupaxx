import { Grid } from "semantic-ui-react";
import { QuizFooter } from "./QuizFooter";
import { QuizMessage } from "./QuizMessage";

/**
 * QuizGrid
 */
export const QuizGrid = ({ children }) => {
    return (
        <Grid
            textAlign="center"
            style={{ height: "90vh" }}
            verticalAlign="middle"
        >
            <Grid.Column style={{ maxWidth: 800, maxHeight: 600 }}>
                <QuizMessage />
                    {children}
                <QuizFooter />
            </Grid.Column>
            
        </Grid>
    )
}