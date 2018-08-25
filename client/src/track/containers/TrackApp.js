import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Container,
    Divider,
    Button,
    Icon
} from 'semantic-ui-react';
import {
    selectYear,
    fetchMeetsIfNeeded,
    invalidateYear
} from '../actions';
import Picker from '../components/Picker';
import Meets from '../components/Meets';

class TrackApp extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleRefreshClick = this.handleRefreshClick.bind(this);
    }

    componentDidMount() {
        const { dispatch, selectedYear } = this.props;
        dispatch(fetchMeetsIfNeeded(selectedYear));
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedYear !== prevProps.selectedYear) {
            const { dispatch, selectedYear } = this.props;
            dispatch(fetchMeetsIfNeeded(selectedYear));
        }
    }

    handleChange(nextYear) {
        console.log(nextYear);
        this.props.dispatch(selectYear(nextYear));
        this.props.dispatch(selectYear(nextYear));
    }

    handleRefreshClick(e) {
        e.preventDefault();
        const { dispatch, selectedYear } = this.props;
        dispatch(invalidateYear(selectedYear));
        dispatch(fetchMeetsIfNeeded(selectedYear));
    }

    render() {
        const {
            selectedYear,
            meets,
            isFetching,
            lastUpdated
        } = this.props;
        return (
            <Container>
                <Divider hidden />
                <Picker
                    value={selectedYear}
                    onChange={this.handleChange}
                    options={[{key: '2018', value: '2018', text: '2018'}, {key: '2017', value: '2017', text: '2017'}, {key: '2016', value: '2016', text: '2016'}]}
                />
                <Divider hidden />
                <p>
                    {lastUpdated && (
                        <span>
                            Last Updated at {new Date(lastUpdated).toLocaleTimeString()}.
                            {' '}
                        </span>
                    )}
                </p>
                {!isFetching && (
                    <Button animated="fade" onClick={this.handleRefreshClick} fluid className="mb-30">
                        <Button.Content visible><Icon name="refresh" /></Button.Content>
                        <Button.Content hidden>Refresh</Button.Content>
                    </Button>
                )}
                <Divider hidden />
                {isFetching && meets.length === 0 && <h2>Loading...</h2>}
                {!isFetching && meets.length === 0 && <h2>No Meets Available</h2>}
                {meets.length > 0 && (
                    <div style={{ opacity: isFetching ? 0.5 : 1 }}>
                        <Meets meets={meets} />
                    </div>
                )}
            </Container>

        );
    }
}

TrackApp.propTypes = {
    selectedYear: PropTypes.string.isRequired,
    meets: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    lastUpdated: PropTypes.number
};

function mapStateToProps(state) {
    const { selectedYear, meetsByYear } = state;
    const {
        isFetching,
        lastUpdated,
        items: meets,
    } = meetsByYear[selectedYear] || {
        isFetching: true,
        items: []
    };

    return {
        selectedYear,
        meets,
        isFetching,
        lastUpdated
    };
}

export default connect(mapStateToProps)(TrackApp);
