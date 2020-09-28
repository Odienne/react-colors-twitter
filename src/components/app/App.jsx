import React from 'react';
import { AppRouter } from 'src/components/router/Router.jsx';
import "./App.css";

export class App extends React.Component {

    render() {
        return (
            <div>
                <AppRouter/>
            </div>
        );
    }
}