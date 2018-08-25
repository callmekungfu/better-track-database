import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Button,
    Form,
    Input,
    Message
} from 'semantic-ui-react';

import { attemptLogin } from '../actions';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e, { name, value }) {
        this.setState({
            [name]: value
        });
    }

    handleLoginSubmit(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        const { username, password } = this.state;
        dispatch(attemptLogin({ username, password }));
    }

    render() {
        return (
            <div>
                <Message
                        error
                        header={this.props.result.status}
                        content="You can only sign up for an account once with a given e-mail address."
                        hidden={!this.props.failed}
                />
                <Form onSubmit={this.handleLoginSubmit} loading={this.props.loggingIn}>
                    <Form.Field required control={Input} onChange={this.handleChange} label="Username" type="text" placeholder="Username" name="username" />
                    <Form.Field required control={Input} onChange={this.handleChange} label="Password" type="password" placeholder="Password" name="password" />
                    <Button type="submit" fluid>Login</Button>
                </Form>
            </div>
        );
    }
}

LoginForm.propTypes = {
    loggingIn: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    failed: PropTypes.bool.isRequired,
    result: PropTypes.shape({
        status: PropTypes.string
    }).isRequired
};

function mapStateToProps(state) {
    const { loggingIn, loggedIn } = state;
    const {
        result,
        failed
    } = loggedIn || {
        result: {},
        failed: false
    };

    return {
        loggingIn,
        result,
        failed
    };
}

export default connect(mapStateToProps)(LoginForm);
