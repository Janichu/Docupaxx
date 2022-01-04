/**
 * DocupaxxPage
 *
 * General page for Docupaxx
 * Includes Header and Footer
 */
import { useContext } from "react";
import { Container, Header } from "semantic-ui-react";
import { DocupaxxFooter } from "./footer/DocupaxxFooter";
import { DocupaxxHeader } from "./header/DocupaxxHeader";
import { SessionContext } from "./session/SessionContextManager";

/**
 * DocupaxxPage
 */
export const DocupaxxPage = ({ children }) => {
  return (
    <>
      <DocupaxxHeader />
      <Container fluid style={{ minHeight: "80vh" }}>
        {children}
      </Container>
      <DocupaxxFooter />
    </>
  );
};
