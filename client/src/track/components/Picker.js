import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Dropdown } from 'semantic-ui-react';

export default class Picker extends Component {
    render() {
        const { value, onChange, options } = this.props;
        return (
                <Container textAlign="center">
                    <h1>Track Meets Of{' '}<Dropdown onChange={(e, data) => onChange(data.value)} inline options={options} defaultValue={options[0].value} /></h1>
                </Container>
        );
    }
}

Picker.propTypes = {
    options: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};
