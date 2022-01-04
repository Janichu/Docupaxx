/**
 * About Us
 *
 * Page showing the links to the profiles of each Docupaxx creator
 */
import { Divider, Grid, Header } from "semantic-ui-react";
import { DocupaxxPage } from "../common/DocupaxxPage";
import { InfoIntro } from "./InfoIntro";

/**
 * TESTIMONIALS
 */
export const TESTIMONIALS = [
  [
    {
      title: `Thank God I used Docupaxx!`,
      description: `With Docupaxx's organization and application process, I skipped
              the trouble of digging through my files to apply for something. It
              was so easy! -Rodney`,
    },
    {
      title: `A Better Experience for Me`,
      description: `Docupaxx's translation feauture and convenience helped me so much
              when trying to apply for schools as an International Student. -
              Mert`,
    },
    {
      title: `Very Convenient!`,
      description: `When I was applying to SF State, I was able to use Docupaxx to
              chat with an Organization Member and help me with my application.
              It was so easy I couldn't believe it! - Harper`,
    },
  ],
];

/**
 * TestimonialsPage
 */
export const TestimonialsPage = () => {
  const testimonialTable = TESTIMONIALS;
  return (
    <>
      <DocupaxxPage>
        <InfoIntro
          title={"Docupaxx Testimonials"}
          description={
            "Docupaxx has very useful features to help one with organizations.  But if you won't take our word for it.  Take it from our users!"
          }
        />
        <TestimonialSet testimonialTable={testimonialTable} />
      </DocupaxxPage>
    </>
  );
};

/**
 * TestimonialSet
 */
export const TestimonialSet = ({ testimonialTable }) => {
  return (
    <Grid celled="internally" columns="equal" stackable>
      {testimonialTable.map((testimonialRow) => (
        <Grid.Row textAlign="center">
          {testimonialRow.map((testimonial) => (
            <TestimonialsBox
              title={testimonial.title}
              description={testimonial.description}
            />
          ))}
        </Grid.Row>
      ))}
    </Grid>
  );
};

/**
 * TestimonialsBox
 */
const TestimonialsBox = ({ title, description }) => {
  return (
    <Grid.Column style={{ padding: "5em" }}>
      <Header as="h3" style={{ fontSize: "2em" }}>
        {title}
      </Header>
      <p style={{ fontSize: "1.33em" }}>{description}</p>
    </Grid.Column>
  );
};
