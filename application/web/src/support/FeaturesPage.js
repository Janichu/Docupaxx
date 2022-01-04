/**
 * Features Page
 *
 * Page showing detailed features of Docupaxx
 */
import { Container, Divider, Header, Segment } from "semantic-ui-react";
import { DocupaxxPage } from "../common/DocupaxxPage";
import { InfoIntro } from "./InfoIntro";


/**
 * FEATURES
 */
export const FEATURES = [
  { 
      title: `Store Application Files for Future Use`,
      description: `Some papers like Forms or Certifications are very important to keep
          safe. You need these important documents whenever you apply to a
          particular organization, and you might need it for another occasion.
          Docupaxx offers safe, easy, and convenient storage of application
          documents to keep those files safe.`
  },
  { 
      title: `Apply to Organizations Conveniently and Easily`,
      description: `Along with application file storage, Docupaxx offers the capability of
          quickly finding the Organization you want to apply to, showing a quick
          list of the required documents for an application, and allowing you to
          upload the files needed for that application. If you already have
          those files stored in Docupaxx, the process is even quicker!`
  }
]


 
/**
 * FeaturesPage
 */
export const FeaturesPage = () => {
  const featureList = FEATURES
  return (
    <DocupaxxPage>
      <InfoIntro 
       title={"Docupaxx Main Features"} 
       description={"Docupaxx has very useful features to help one with organizations."} 
      />
      <FeatureSet featureList={featureList} />
    </DocupaxxPage>
  );
}



/**
 * FeatureSet
 */
export const FeatureSet = ({ featureList }) => {
  return (
    <Segment style={{ padding: "8em 0em" }} vertical>
      <Container text>
        {featureList.map((feature, index) => (
          <FeatureBox 
            title={feature.title} 
            description={feature.description} 
            first={index == 0} 
          />
        ))}
      </Container>
    </Segment>
  )
} 



/**
 * FeatureBox
 */
const FeatureBox = ({ title, description, first }) => {
  return (
    <>
      {!first && (
        <Divider
          as="h4"
          className="header"
          horizontal
          style={{ margin: "3em 0em", textTransform: "uppercase" }}
        ></Divider>
      )}
      <Header as="h3" style={{ fontSize: "2em" }}>
        {title}
      </Header>
      <p style={{ fontSize: "1.33em" }}>{description}</p>
    </>
  );
}


