import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Button,
    Form,
    Input,
    Message
} from 'semantic-ui-react';
import { attemptSignUp } from '../track/actions';

class SignUpForm extends Component {

    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
    }

    handleChange(e, { name, value }) {
        this.setState({
            [name]: value
        });
    }

    handleSignUp(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        const { username, password } = this.state;
        dispatch(attemptSignUp({ username, password }));
    }

    render() {
        return (
            <div>
                <Form onSubmit={this.handleSignUp}>
                    <Form.Field required control={Input} onChange={this.handleChange} label="Username" type="text" placeholder="Username" name="username" />
                    <Form.Field required control={Input} onChange={this.handleChange} label="Password" type="password" placeholder="Password" name="password" />
                    <Button type="submit" fluid>Sign Up</Button>
                </Form>
            </div>
        );
    }
}

function connectStateToProps(state){
    const { signUp } = state;
    const {
        signup
    } = signUp || {
        signup: {}
    };
    return signup;
}

export default connect(connectStateToProps)(SignUpForm);