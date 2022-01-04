import { Container } from "semantic-ui-react";
import { DocupaxxPage } from "../common/DocupaxxPage";
import { MultilineBreak } from "../common/MultilineBreak";
import { request } from "../util/request";

/**
 * FAQ
 */
const FAQ = [
  {
    question: "What is an Application Requirement Package (ARP)?",
    answer:
      "ARP represents all of the requirements for an application that a given organization offers. It contains an application name that will be used to identify the application the package is for, and a answer that describes in further detail the requirements of the application.",
  },
  {
    question: "How do I aquire an ARP? ",
    answer:
      "You can add an ARP to your packages after taking a quiz that results you to your desired Application Requirement Package. You can also search for an Organization and their page will hold ARPs for you to add to your packages.",
  },
  {
    question: "What is a package?",
    answer:
      "A Package is a collection of many documents. Registered users are able to access their packages and send them to the organizations they are applying to.  They can also have personal packages where their data is stored in an organized way in which they can easily access the documents when needed.",
  },
  {
    question: "What is the quiz for?",
    answer:
      "Quiz is the set of questions for the registered user to retrieve package application requirements. The purpose of the quiz is to let the system know the intent of the user using the website, which will help determine what the next steps are for the user to get started.",
  },
  {
    question:
      "How do I recieve feedback about my Application Requirements from an Organization?",
    answer:
      "Once you have an Application Requirement Package (ARP) in your packages, you have the options to upload your document and send for a review. To send a review request, you will need to provide which Organization you are requesting for review, the subject of your document, and a question(s) of concerns so the Organization knows exactly how to assist you.",
  },
  {
    question:
      "How do I recieve feedback about my Application Requirements from an Organization?",
    answer:
      "Once you have an Application Requirement Package (ARP) in your packages, you have the options to upload your document and send for a review. To send a review request, you will need to provide which Organization you are requesting for review, the subject of your document, and a question(s) of concerns so the Organization knows exactly how to assist you.",
  },
];

/**
 * FAQPage
 */
export const FAQPage = () => {
  return (
    <DocupaxxPage>
      <Container text textAlign="center">
        <h1> Docupaxx's Frequently Asked Questions (FAQ) </h1>
        {FAQ.map((faq) => (
          <>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </>
        ))}
      </Container>
      <MultilineBreak lines={3} />
    </DocupaxxPage>
  );
};
