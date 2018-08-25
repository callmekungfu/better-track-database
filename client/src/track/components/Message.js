import React, { Component } from 'react';
import { Comment, Icon } from 'semantic-ui-react';

class Message extends Component {
    render() {
        return (
            <Comment.Group>
                <Comment>
                <Comment.Avatar as="a" src="https://react.semantic-ui.com/images/avatar/small/daniel.jpg" />
                <Comment.Content>
                    <Comment.Author>{this.props.author}</Comment.Author>
                    <Comment.Text>
                        {this.props.body}
                    </Comment.Text>
                    <Comment.Actions>
                    <Comment.Action>Reply</Comment.Action>
                    <Comment.Action>Save</Comment.Action>
                    <Comment.Action>Hide</Comment.Action>
                    <Comment.Action>
                        <Icon name="expand" />
                        Full-screen
                    </Comment.Action>
                    </Comment.Actions>
                </Comment.Content>
                </Comment>
            </Comment.Group>
        );
    }
}

export default Message;
