import React from "react";
import {Home} from 'src/pages/home/Home.jsx';
import {DemoCount} from 'src/pages/demoCount/demoCount.jsx';
import {Colors} from 'src/pages/colors/Colors.jsx';
import {ShowColor} from 'src/pages/showColor/ShowColor.jsx';
import {Twitter} from 'src/pages/twitter/Twitter.jsx';
import {BrowserRouter as Router, Route, NavLink} from "react-router-dom";

import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faIgloo} from '@fortawesome/free-solid-svg-icons'
import {faPalette} from '@fortawesome/free-solid-svg-icons'
import {faTwitter} from '@fortawesome/free-brands-svg-icons'

import classes from "./Router.css";

library.add(faIgloo);
library.add(faPalette);
library.add(faTwitter);

export function AppRouter() {
    return (
        <Router>
            <div>
                <nav className={classes.nav}>
                    <ul>
                        <li>
                            <NavLink activeClassName={classes.active} exact={true} to="/"><FontAwesomeIcon
                                icon="igloo"/> Home</NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName={classes.active} exact={true} to="/demoCount/">DemoCount</NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName={classes.active} exact={true} to="/colors/"><FontAwesomeIcon
                                icon="palette"/> Colors</NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName={classes.active} exact={true} to="/twitter/"><FontAwesomeIcon
                                icon={['fab', 'twitter']}/> Twitter</NavLink>
                        </li>
                    </ul>
                </nav>

                <Route path="/" exact={true} component={Home}/>
                <Route path="/demoCount/" exact={true} component={DemoCount}/>
                <Route path="/colors/" exact={true} component={Colors}/>
                <Route path="/ShowColor/:hex" exact={true} component={ShowColor}/>
                <Route path="/twitter/" exact={true} component={Twitter}/>
            </div>
        </Router>
    );
}