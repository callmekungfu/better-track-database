import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import TrackApp from './TrackApp';
import MeetDetails from './MeetDetails';
import Login from './Login';
import ChatRoom from './ChatRoom';
import { store } from '../configureStore';


export default class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Switch>
                        <Route exact path="/" component={TrackApp} />
                        <Route path="/details" component={MeetDetails} />
                        <Route path="/login" component={Login} />
                        <Route path="/chatroom" component={ChatRoom} />
                    </Switch>
                </Router>
            </Provider>
        );
    }
}
