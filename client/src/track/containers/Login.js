import React, { Component } from 'react';
import {
    Grid,
    Container,
    Divider,
    Segment,
    Header,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import LoginForm from '../components/LoginForm';
import SignUpForm from '../../components/SignUpForm';
import { validateLogin } from '../actions';


class Login extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(validateLogin());
    }

    render() {
        if (this.props.validated) {
            return <Redirect to="/chatroom" />;
        }
        return (
            <div>
                <Container>
                    <Divider hidden />
                    <Grid>
                        <Grid.Row divided columns={2}>
                            <Grid.Column>
                                <Segment padded color="violet">
                                    <Header as="h2">Login</Header>
                                    <LoginForm />
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment padded color="blue">
                                    <Header as="h2">Sign Up Now</Header>
                                    <SignUpForm />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { tokenValidation } = state;
    return tokenValidation;
}

export default connect(mapStateToProps)(Login);
