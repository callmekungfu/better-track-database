import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    selectSubreddit,
    fetchPostsIfNeeded,
    invalidateSubreddit
} from '../actions';
import Picker from '../components/Picker';
import Posts from '../components/Posts';
/**
 * Main App structure and behavior defined in this class.
 */
class AsyncApp extends Component {
    // The constructor defines the two custom events that handles change in user input and refresh clicks
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleRefreshClick = this.handleRefreshClick.bind(this);
    }

    // Dispatch the action to fetch posts from default subreddit
    componentDidMount() {
        const { dispatch, selectedSubreddit } = this.props;
        dispatch(fetchPostsIfNeeded(selectedSubreddit));
    }

    // Whenever the component is updated evaluate whether the selected subreddit is the same as before, if not then fetch again.
    componentDidUpdate(prevProps) {
        if (this.props.selectedSubreddit !== prevProps.selectedSubreddit) {
            const { dispatch, selectedSubreddit } = this.props;
            dispatch(fetchPostsIfNeeded(selectedSubreddit));
        }
    }

    // Handles when users changes the subreddit selection
    handleChange(nextSubreddit) {
        this.props.dispatch(selectSubreddit(nextSubreddit));
        this.props.dispatch(selectSubreddit(nextSubreddit));
    }

    // When user clicks refresh, the component prefents the input from being reevaluated, then fetches the posts again.
    handleRefreshClick(e) {
        e.preventDefault();
        const { dispatch, selectedSubreddit } = this.props;
        dispatch(invalidateSubreddit(selectedSubreddit));
        dispatch(fetchPostsIfNeeded(selectedSubreddit));
    }

    render() {
        const { selectedSubreddit, posts, isFetching, lastUpdated } = this.props;
        return (
            <div>
                <Picker
                    value={selectedSubreddit}
                    onChange={this.handleChange}
                    options={['reactjs', 'frontend', 'nba']}
                />
                <p>
                    {lastUpdated && (
                        <span>
                            Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
                            {' '}
                        </span>
                    )}
                    {!isFetching && (
                        <button type="button" onClick={this.handleRefreshClick}>
                            Refresh
                        </button>
                    )}
                </p>
                {isFetching && posts.length === 0 && <h2>Loading...</h2>}
                {!isFetching && posts.length === 0 && <h2>No Posts Available...</h2>}
                {posts.length > 0 && (
                    <div style={{ opacity: isFetching ? 0.5 : 1 }}>
                        <Posts posts={posts} />
                    </div>
                )}
            </div>
        );
    }
}

AsyncApp.propTypes = {
    selectedSubreddit: PropTypes.string.isRequired,
    posts: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    const { selectedSubreddit, postsBySubreddit } = state;
    const {
        isFetching,
        lastUpdated,
        items: posts,
    } = postsBySubreddit[selectedSubreddit] || {
        isFetching: true,
        items: []
    };

    return {
        selectedSubreddit,
        posts,
        isFetching,
        lastUpdated
    };
}

export default connect(mapStateToProps)(AsyncApp);
