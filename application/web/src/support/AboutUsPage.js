import { Link, useParams } from "react-router-dom";
import { Card, Container, Grid, Header, Icon, Image } from "semantic-ui-react";
import { DocupaxxPage } from "../common/DocupaxxPage";
import { MultilineBreak } from "../common/MultilineBreak";
import kylePhoto from "../common/resources/images/kyle.jpg"
import canPhoto from "../common/resources/images/can.jpg"
import amronPhoto from "../common/resources/images/amron.jpg"
import viPhoto from "../common/resources/images/vi.jpg"
import annaPhoto from "../common/resources/images/anna.jpg"
import rodrigoPhoto from "../common/resources/images/rodrigo.jpg"
import jansonPhoto from "../common/resources/images/janson.jpg"

/**
 * PEOPLE
 */
const PEOPLE = {
  kyle: {
    name: "Kyle Humphrey",
    role: "Team Lead",
    profileImage: kylePhoto,
    description: "Hi my name's Kyle Humphrey!  Ever since I was a little boy I always loved video games and Math.  And then eventually I grew a liking to computer science as well.  I like creating my own programs and solving difficult problems.  I enjoy coding, video games, anime, novels, working out, math, movies, hanging out, music, etc.  I hope to learn a lot about Software Engineering before I get into the industry!",
    github: "kyleuniversities",
  },
  can: {
    name: "Can Sirin",
    role: "Front End Lead",
    profileImage: canPhoto,
    description: "I am very passionate about computer programming since I was a child. I like being on the computer and coding all night long. I want to learn new features and concepts before graduate.",
    github: "cansirin",
  },
  amron: {
    name: "Amron Berhanu",
    role: "Back End Lead",
    profileImage: amronPhoto,
    description: "Hi, I'm Amron, and I enjoy solving problems. Besides pursuing a career in Backend Engineering, I spend much of my free time watching and playing soccer, video games, as well as trading cryptocurrencies.",
    github: "amron98",
  },
  janson: {
    name: "Janson Leong",
    role: "Back End Member",
    profileImage: jansonPhoto,
    description: "Since young and still now, I've been an avid gamer who enjoys thrilling new adventures. This has led me to going to university to major in CS because I wanted to learn more about the inner workings of a game. My hobbies consist of reading manga and novels, playing games, and watching anime.",
    github: "Janichu",
  },
  rodrigo: {
  name: "Rodrigo Gallardo",
    role: "Front End Member",
    profileImage: rodrigoPhoto,
    description:"From an early age I’ve always been interested in technology and how apps were built leading me to explore the field of computer science as I entered college. I have always remembered the feeling of wanting to know how computers worked and what else they could do. On my free time I like to ride my quad and watch movies.",
    github: "rgallardo02",
  },
  anna: {
    name: "Anna Pham",
    role: "Front End Member",
    profileImage: annaPhoto,
    description: "Photography and videography enthusiast. When not studying, you'll find me at the park, at the beach, on a hike, or just somewhere in a nature setting. I could also tell you some cool things about the moon and the stars.",
    github: "annaclouds",
  },
  vi: {
    name: "Vi Dao",
    role: "Back End Member",
    profileImage: viPhoto,
    description: "Hi, my name is Vi Dao. I'm studying Computer Science at SFSU. Beside school, I also like to go the gym and drink some boba",
    github: "vdao182",
  }
}



/**
 * AboutUsPage
 */
export const AboutUsPage = () => {
  return (
    <DocupaxxPage>
      <MultilineBreak lines={1} />
      <Container text textAlign="center">
        <Header as="h1">People behind TEAM7</Header>
        <p> Meet the creators of Docupaxx! Composed of the Front End Team, the Back End Team, and the Team Leader, each 7 of these resilient and passionate Software Engineers hold a mission to help people apply to various Organizations without the hassle of sifting through hard-to-find documents. </p>
        <AboutUsGrid />
      </Container>
    </DocupaxxPage>
  );
};



/**
 * AboutUsSinglePersonPage
 */
export const AboutUsSinglePersonPage = () => {
  const { name } = useParams();
  const person = PEOPLE[name]
  return (
    <DocupaxxPage>
      <Container text style={{ marginTop: 25 }}>
        <Grid divided="vertically">
          <Grid.Row>
            <AboutUsSinglePersonPhotoBox person={person} />
            <AboutUsSinglePersonInfoBox person={person} />
          </Grid.Row>
        </Grid>
      </Container>
    </DocupaxxPage>
  );
}



/**
 * AboutUsGrid
 */
const AboutUsGrid = () => {
  return (
    <Grid padded>
      <Grid.Row columns={3}>
        {Object.entries(PEOPLE).map(([nickname, person]) => {
          return (
            <Grid.Column key={nickname}>
              <Link to={`/team/${nickname}`}>
                <AboutUsProfileCard
                  name={person.name}
                  role={person.role}
                  profileImage={person.profileImage}
                />
              </Link>
            </Grid.Column>
          );
        })}
      </Grid.Row>
    </Grid>
  )
}



/**
 * AboutUsProfileCard
 */
const AboutUsProfileCard = ({ name, role, profileImage }) => {
  const cardStyle = { marginTop: 10, height: 480 }
  const divStyle = { overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }
  const imgStyle = { width: "100%", height: 382 };
  return (
    <Card style={cardStyle} link>
      <div style={divStyle}>
        <Image src={profileImage} alt="Profile" style={imgStyle} />
      </div>
      <Card.Content>
        <Card.Header>{name}</Card.Header>
        <Card.Description>
          <span>{role}</span>
        </Card.Description>
      </Card.Content>
    </Card>
  )
}



/**
 * AboutUsSinglePersonPhotoBox
 */
const AboutUsSinglePersonPhotoBox = ({ person }) => {
  return (
    <Grid.Column width={5}>
      <Image src={person.profileImage} />
    </Grid.Column>
  )
}



/**
 * AboutUsSinglePersonInfoBox
 */
const AboutUsSinglePersonInfoBox = ({ person }) => {
  return (
    <Grid.Column width={10}>
      <Header as="h1" dividing>
        <Header.Content>
          {person.name}
          <Header.Subheader>{person.role}</Header.Subheader>
        </Header.Content>
      </Header>
      <p>{person.description}</p>
      <AboutUsSinglePersonGithubLink person={person}/>
    </Grid.Column>
  )
}



/**
 * AboutUsSinglePersonGithubLink
 */
const AboutUsSinglePersonGithubLink = ({ person }) => {
  return (
    <Link
      to={{ pathname: `https://github.com/${person.github}` }}
      target="_blank"
    >
      <Icon name="github" size="large" />
    </Link>
  )
}