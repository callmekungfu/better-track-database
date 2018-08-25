// Use the cross-fetch library for http calls
import fetch from 'cross-fetch';
// Action definitions, used for reducers to determine which action was fired in order to change the state of the object
export const REQUEST_POSTS = 'REQEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT';
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT';
/**
 * This action returns the name of the selected subreddit in String format
 * @param {*} subreddit The name of the subreddit used to get posts
 */
export const selectSubreddit = subreddit => ({
    type: SELECT_SUBREDDIT,
    subreddit
});
/**
 * This method
 * @param {*} subreddit The name of the subreddit that will be neglected
 */
export const invalidateSubreddit = subreddit => ({
    type: INVALIDATE_SUBREDDIT,
    subreddit
});

const requestPosts = subreddit => ({
    type: REQUEST_POSTS,
    subreddit
});

const receivePosts = (subreddit, json) => ({
    type: RECEIVE_POSTS,
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
});
/**
 * First alert the reducers that a request has been made to get posts,
 * then using cross-fetch method, a request is made to get data from Reddit,
 * then convert the response to json form and fire the action to receive posts
 */
const fetchPosts = subreddit => (dispatch) => {
    dispatch(requestPosts(subreddit));
    return fetch(`https://www.reddit.com/r/${subreddit}.json`)
        .then(response => response.json())
        .then(json => dispatch(receivePosts(subreddit, json)));
};
/**
 * Decide if request should be made to server to fetch new data
 * @param {*} state The current state of the component
 * @param {*} subreddit The subreddit that the user requested
 */
const shouldFetchPosts = (state, subreddit) => {
    // Store the posts of the requested subreddit currently in the component state in to variable called posts
    const posts = state.postsBySubreddit[subreddit];
    // If there are posts currently stored, return false, otherwise return true
    if (!posts) {
        return true;
    } else if (posts.isFetching) {
        return false;
    } else {
        return posts.didInvalidate;
    }
};
/**
 * Interface used to fetch posts, integrated the evaluation into the process of making the fetch request.
 * @param {*} subreddit The requested subreddit
 */
export function fetchPostsIfNeeded(subreddit) {
    // Return the method of fetch
    return (dispatch, getState) => {
        if (shouldFetchPosts(getState(), subreddit)) {
            return dispatch(fetchPosts(subreddit));
        }
    };
}
