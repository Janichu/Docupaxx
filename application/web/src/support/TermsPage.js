/**
 * Terms Page
 * 
 * Page for the Terms and Conditions of the Website
 */
import { Container } from "semantic-ui-react";
import { DocupaxxPage } from "../common/DocupaxxPage";


/**
 * TermsPage
 */
export const TermsPage = () => {
  return (
    <DocupaxxPage>
      <Container textAlign='center'>
        <h1> Docupaxx's Terms and Conditions </h1>
        
        <h3> AGREEMENT TO TERMS </h3>
        <p> 
          These Terms and Conditions is a legal binding agreement between you and Docupaxx. 
          Docupaxx understands your concern and can assure that your privacy is safe with us. 
        </p>
        <p>You agree that by accessing and using Docupaxx, you have read, undertood, and agreed to comply to these Terms and Conditions. If you do not agree with these Terms and conditions, then you must discontinue using Docupaxx immediately.</p>

        <h3> INTELLECTUAL PROPERTY RIGHTS </h3>
        <p>When using Docupaxx, you must not print or download anything you have not been given permission to. You may not use the content of Docupaxx for commercial-use.</p>
    
        <h3> USER REPRESENTATIONS </h3>
        <p> By using Docupaxx, you are asked that: </p>
        <p> (1) All information provided is yours, accurate, and complete.</p>
        <p> (2) You will not use Docupaxx for any illegal or unathorized purpose. </p>
        <p> If you provide any false information or violate these rules, we have the right to suspend or terminate your account and refuse use of Docupaxx. </p>

        <h3> PROHIBITED ACTIVTIES </h3>
        <p>You may not access or use Docupaxx for any purpose other than for what Doxupaxx is made avilable. Docupaxx may not be used with any commercial-use except those that are approved by us.</p>

        <h3> SECURITY </h3>
        <p>Your information is Docupaxx's sole priority. We ensure your confidential information, documents, and password is protected and secure. Docupaxx will verify Organizations before approval of use to ensure security.</p>
      </Container>
    </DocupaxxPage>
  );
};
