import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'

import Entry from './pages/entry'
import Battle from './pages/battle'
import Result from './pages/result'
import Login from './pages/login'
import Register from './pages/register'
import Learnmore from './pages/learnmore'
import Record from './pages/record'

import './App.css'

function App() {
  return (
      <HashRouter>
          <Switch>
              <Route path="/entry" component={Entry}></Route>
              <Route path="/battle" component={Battle}></Route>
              <Route path="/result" component={Result}></Route>
              <Route path="/login" component={Login}></Route>
              <Route path="/register" component={Register}></Route>
              <Route path="/learnmore" component={Learnmore}></Route>
              <Route path="/record" component={Record}></Route>
              <Redirect from="/" to="/login"></Redirect>
          </Switch>
      </HashRouter>
  );
}

export default App;
