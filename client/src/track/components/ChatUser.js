import React, { Component } from 'react';
import { List, Image } from 'semantic-ui-react';

class ChatUser extends Component {
    render() {
        return (
            <List.Item>
                <Image avatar src="https://react.semantic-ui.com/images/avatar/small/helen.jpg" />
                <List.Content>
                    <List.Header>{this.props.name}</List.Header>
                </List.Content>
            </List.Item>
        );
    }
}

export default ChatUser;
