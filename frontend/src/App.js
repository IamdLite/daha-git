import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainFrontend from './MainFrontend';
import Admin from './Admin';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/" component={MainFrontend} />
      </Switch>
    </Router>
  );
}

export default App;