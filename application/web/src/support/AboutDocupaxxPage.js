/**
 * About Docupaxx
 * 
 * Info page for Docupaxx as a website
 */
import { Container, Header } from "semantic-ui-react";
import { DocupaxxPage } from "../common/DocupaxxPage";
import { MultilineBreak } from "../common/MultilineBreak";
 
 /**
  * ASPECTS
  */
 const ASPECTS = [
   {
     title: "What Docupaxx Offers: ",
     description: "Docupaxx offers the ability of storing documents, finding organizations of where you're trying to apply to, and the provision of an application's feedback service."
   },
   {
     title: "Why Use Docupaxx? ",
     description: "It is user friendly, helps organize documents, and makes gathering the required documents for applications much easier!"
   },
   {
     title: "Partnered Organizations: ",
     description: "With Organizations partnering with Docupaxx, the process of applying to organizations is more effecient for the user as it succors the anticipation of rejected submitted documents."
   },
 ]
 
 
 
 /**
  * AboutDocupaxxPage
  */
 export const AboutDocupaxxPage = () => {
   return (
     <DocupaxxPage>
       <Container style={{ margin: "20px"}}>
         <Header as="h1"> About Docupaxx </Header>
         <MultilineBreak lines={2} />
         {ASPECTS.map((aspect) => (
           <>
             <h3>{aspect.title}</h3>
             <p>{aspect.description}</p>
             <br></br>
           </>
         ))}
         <MultilineBreak lines={1} />
       </Container>
     </DocupaxxPage>
   );
 };