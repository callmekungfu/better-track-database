import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import rootReducer from './reducers';
import App from './components/App';
import Test from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

const store = createStore(rootReducer);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
//render(<Test />, document.getElementById('root'));
registerServiceWorker();