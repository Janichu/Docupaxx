import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { SinglePersonPage } from "./SinglePersonPage";
import { GroupPage } from "./GroupPage";
import { Redirect } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact from="/" to="/team" />
        <Route exact path="/team" component={GroupPage} />
        <Route exact path="/team/:name" component={SinglePersonPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
