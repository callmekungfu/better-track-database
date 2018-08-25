import React from 'react';
import PropTypes from 'prop-types';

const Meet = ({
        name, date, location, link,
    }) => (
    <tr>
        <td className="meet-name">{name}</td>
        <td className="meet-date">{date}</td>
        <td className="meet-location">{location}</td>
    </tr>
);

Meet.propTypes = {
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
};

export default Meet;
