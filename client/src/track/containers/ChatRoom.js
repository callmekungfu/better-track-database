import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Grid,
    Header,
    Input,
    List,
    Image,
    Icon,
    Segment,
    Button,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { addMessage, validateLogin } from '../actions';
import { store, sagaMiddleware } from '../configureStore';
import Message from '../components/Message';
import ChatUser from '../components/ChatUser';
import setUpSocket from '../websocketConfig';
import handleNewMessages from '../sagas';

let connected = false;

class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.handleSendMessage = this.handleSendMessage.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(validateLogin());
    }

    handleSendMessage(e) {
        const { dispatch } = this.props;
        if (e.key === 'Enter') {
            const { typing } = this.state;
            dispatch(addMessage(typing, 'Me'));
            e.target.value = '';
        }
    }

    handleInput(e, { value }) {
        this.setState({
            typing: value
        });
    }

    render() {
        if (this.props.tokenValidation.failed) {
            return <Redirect to="/login" />;
        }

        if (this.props.tokenValidation.validated && !connected) {
            const socket = setUpSocket(store.dispatch, this.props.tokenValidation.decoded.username);
            sagaMiddleware.run(handleNewMessages, { socket, username: this.props.tokenValidation.decoded.username });
            connected = true;
        }
        return (
            <Grid celled="internally" style={{ height: '100vh' }}>
                <Grid.Column width={4} style={{ height: '100%' }}>
                    <Segment vertical>
                        <Header as="h3" textAlign="center">Conversations</Header>
                        <Input icon="users" iconPosition="left" placeholder="Search users" fluid />
                    </Segment>
                    <List selection verticalAlign="middle" relaxed size="large">
                        {this.props.users.map(user => (
                            <ChatUser key={user.id} name={user.name} />
                        ))}
                    </List>
                </Grid.Column>
                <Grid.Column width={12} style={{ height: '100%' }}>
                    <Segment clearing vertical style={{ display: 'flex', alignItems: 'center', height: '10vh' }}>
                    <Header as="h2" floated="left">
                        <Image circular src="https://memegenerator.net/img/instances/81642434.jpg" />
                        <Header.Content>
                            Devs Chat Room
                            <Header.Subheader>Only for the coolest kids.</Header.Subheader>
                        </Header.Content>
                    </Header>
                    <Button floated="right" negative>Leave Chat</Button>
                    </Segment>
                    <Segment vertical className="chat-content">
                        {this.props.messages.map(message => (
                            <Message key={message.id} body={message.message} author={message.author} />
                        ))}
                    </Segment>
                    <Segment vertical className="chat-input">
                        <List horizontal className="chat-info" style={{ marginBottom: '14px' }} size="mini">
                            <List.Item>
                                <Image avatar src="https://react.semantic-ui.com/images/avatar/small/daniel.jpg" />
                                <List.Content>
                                    <List.Header>Daniel</List.Header>
                                </List.Content>
                            </List.Item>
                        </List>
                        <Input onKeyPress={this.handleSendMessage} onChange={this.handleInput} icon={<Icon name="send" circular link />} placeholder="Type a message..." fluid size="large" />
                    </Segment>
                </Grid.Column>
            </Grid>
        );
    }
}

ChatRoom.propTypes = {
    dispatch: PropTypes.func.isRequired,
    tokenValidation: PropTypes.shape({
        failed: PropTypes.bool.isRequired,
        validated: PropTypes.bool.isRequired,
        decoded: PropTypes.object
    }).isRequired,
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    messages: PropTypes.arrayOf(PropTypes.object).isRequired
};

const mapStateToProps = (state) => {
    const { messages, users, tokenValidation } = state || { messages: [], users: [] };
    return {
        messages,
        users,
        tokenValidation
    };
};

export default connect(mapStateToProps)(ChatRoom);
