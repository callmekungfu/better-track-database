import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { List } from 'semantic-ui-react';

class Meet extends Component {
    render() {
        return (
            <List.Item>
                <List.Icon name="github" size="large" verticalAlign="middle" />
                <List.Content>
                    <List.Header>
                        <Link to={{
                                pathname: '/details',
                                state: {
                                    meet: this.props.meet
                                }
                            }}
                        >
                            {this.props.meet.name}
                        </Link>
                    </List.Header>
                    <List.Description as="a">Updated {Math.round(1 + Math.random() * (100 - 1))} mins ago</List.Description>
                </List.Content>
            </List.Item>
        );
    }
}

Meet.propTypes = {
    meet: PropTypes.shape({
        posted: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired
};

export default Meet;
