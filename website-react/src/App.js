import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import ReactGA from 'react-ga';

import Home from './Home';
import TopMenu from './TopMenu';

function App() {
    ReactGA.initialize('UA-116051168-1');
    return (
        <BrowserRouter>
            <div className="App">
                <TopMenu />
                <Switch>
                    <Route exact path="/" component={Home} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
