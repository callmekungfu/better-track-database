import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';

export const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger();
function configureStore(preloadedState) {
    return createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware,
            sagaMiddleware
        )
    );
}

export const store = configureStore();