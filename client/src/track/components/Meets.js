import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import Meet from './Meet';

export default class Meets extends Component {
    render() {
        return (
            <List divided relaxed>
                {this.props.meets.map((meet, i) => (
                    <Meet meet={meet} key={i.toString()} />
                ))}
            </List>
        );
    }
}

Meets.propTypes = {
    meets: PropTypes.array.isRequired
};
