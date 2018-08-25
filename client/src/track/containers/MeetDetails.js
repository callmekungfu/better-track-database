import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Header } from 'semantic-ui-react';

import { fetchMeetDetails } from '../actions';

class MeetDetails extends Component {
    componentDidMount() {
        const { meet } = this.props.location.state;
        const { dispatch } = this.props;
        dispatch(fetchMeetDetails(meet));
    }

    render() {
        const {
            name,
            date,
            location,
            posted,
            status,
            link
        } = this.props.location.state.meet;
        const {
            details,
            lastUpdated,
            isFetching
        } = this.props;
        return (
            <Container>
                <div className="meet-details-title">
                    <Header as="h1">{name}</Header>
                    <p>{date} | {location}</p>
                </div>
                <div className="meet-details-overview">
                    <h2>Overview</h2>
                    <p>Name: {name}</p>
                    <p>Date: {date}</p>
                    <p>Location: {location}</p>
                    <p>Posted Date: {posted}</p>
                    <p>Track Database Link: <a href={link}>{link}</a></p>
                    <p>Data last updated from Track Database at {new Date(lastUpdated).toLocaleTimeString()}. {status === 'team info' && 'Currently only registration entries are available.'}</p>
                </div>
                <div className="meet-details-information">
                    {status === 'team info' && <h2>Entry Information</h2>}
                    {status === 'results avaliable' && <h2>Results</h2>}
                    {isFetching && !details && <h2>Loading...</h2>}
                    {!isFetching && details && <h2>Info Loaded</h2>}
                </div>
            </Container>
        );
    }
}

MeetDetails.propTypes = {
    location: PropTypes.shape({
        state: PropTypes.shape({
            meet: PropTypes.shape({
                name: PropTypes.string,
                id: PropTypes.string,
                date: PropTypes.string,
                location: PropTypes.string,
                posted: PropTypes.string,
                status: PropTypes.string,
                link: PropTypes.string,
            }).isRequired
        }).isRequired
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    const { meetDetails } = state;
    const {
        isFetching,
        lastUpdated,
        data: details,
    } = meetDetails || {
        isFetching: true,
        data: {}
    };

    return {
        details,
        lastUpdated,
        isFetching,
    };
}

export default connect(mapStateToProps)(MeetDetails);
