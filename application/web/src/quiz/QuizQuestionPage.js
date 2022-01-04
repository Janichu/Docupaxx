import { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Button, Form, Search, Segment } from "semantic-ui-react";
import { DocupaxxPage } from "../common/DocupaxxPage";
import { MultilineBreak } from "../common/MultilineBreak";
import { request } from "../util/request";
import { useQuery } from "../util/useQuery";
import { QuizGrid } from "./QuizGrid";



/**
 * QUIZ_QUESTION_MODELS
 */
const QUIZ_QUESTION_MODELS = {
    "country": {
        question: "What country is your Organization from?",
        answerType: "Country",
        table: "countries",
        parentKey: null,
        childKey: "city"
    },
    "city": {
        question: "What city is your Organization from?",
        answerType: "City",
        table: "cities",
        parentKey: "country",
        childKey: "organization"
    },
    "organization": {
        question: "Which organization do you wish to find?",
        answerType: "Organization",
        table: "organizations",
        parentKey: "city",
        childKey: null,
        makeEndUrl: (answerId) => `/organizations/${answerId}/requirement-packages-page`
    },
}



/**
 * QuizQuestionPage
 */
export const QuizQuestionPage = () => {
    const [ question, setQuestion ] = useState({})
    const { currentUrlKey } = useParams()
    const query = useQuery()
    const history = useHistory()
    useEffect(() => loadQuestion(currentUrlKey, setQuestion), [])
    return (
        <DocupaxxPage> 
            <QuizQuestionGrid 
                question={question} parentAnswer={query.get('parent')} history={history}
            />
        </DocupaxxPage>
    )
}

const QuizQuestionGrid = ({ question, parentAnswer, history }) => {
    const [answer, setAnswer] = useState("");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState({});
    const onNext = getOnNext(question, history)
    const moveOn = () => onNext(answer);
    const onSearchChange = useCallback((e, data) => setQuery(data.value), []);
    useEffect(() => loadAnswers(question, parentAnswer, setResults), [question]);
    return (
      <QuizGrid>
        <Form size="large">
          <Segment stacked>
            <QuizQuestionText question={question}/>
            <QuizQuestionFieldLabel question={question}/>
            <QuizSearchBar 
                onSearchChange={onSearchChange} 
                results={results} 
                query={query}
                setAnswer={setAnswer}
                setQuery={setQuery}
                setResults={setResults}
            />
            <MultilineBreak lines={5} />
            <Button color="blue" onClick={moveOn} size="small">Next</Button>
          </Segment>
        </Form>
      </QuizGrid>
    );
};


/**
 * QuizSearchBar
 */
 const QuizSearchBar = ({ onSearchChange, results, query, setQuery, setAnswer }) => {
    return (
        <Search
            size="big"
            fluid
            onSearchChange={onSearchChange}
            selectFirstResult
            onResultSelect={(e, { result }) => {
                console.log(result);
                setQuery(result.title);
                setAnswer(result.title.replaceAll(" ", "_"));
            }}
            results={results}
            value={query}
        />
    )
}

/**
 * QuizQuestionText
 */
 const QuizQuestionText = ({ question }) => {
    return (
        <div>
            <p textAlign="left" style={{ fontSize: "20px" }}>
                {question.question}
            </p>
            <MultilineBreak lines={1} />
        </div>
    )
}



/**
 * QuizQuestionFieldLabel
 */
const QuizQuestionFieldLabel = ({ question }) => {
    return (
        <p>{question.answerType}</p>
    )
}


const loadQuestion = (currentUrlKey, setQuestion) => {
    // Gets a question by the current url key
    request(`/quiz/question/getbycurrenturlkey?key=${currentUrlKey}`).then((question) => {
        //alert("Qu: " + JSON.stringify(question))
        setQuestion(question)
    })
}

const loadAnswers = ( question, parentAnswer, setResults ) => {
    if (!question) {
        return 
    }
    // Load the possible answers of a quiz question
    request(`/quiz/question/${question.id}/getAnswers?parentAnswer=${parentAnswer}`).then((records) => {
        if (!records.length || records.length == 0) {
          records = []
        }
        const distinctRecords = []
        for (let i = 0; i < records.length; i++) {
            if (!distinctRecords.includes(records[i])) {
                distinctRecords.push(records[i])
            }
        }
        setResults(
          // This steps are required for search component to show search results beatifully
          distinctRecords.map((record, index) => {
            return {
              id: index,
              title: record,
            };
          })
        );
    });
}

const getOnNext = (question, history) => {
    const onNext = (answer) => {
        // Gets the answer url of the next question
        request(`/quiz/${question.id}/getanswerurl?answer=${answer}`)
            .then((urlField) => {
                history.push(urlField.url)
                window.location.reload(true)
            })
    }
    return onNext;
}