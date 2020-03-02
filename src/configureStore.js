import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import rootReducer from './reducers';
import thunk from 'redux-thunk';
const configureStore = () => {
  const store = createStore(
    rootReducer,
    applyMiddleware(...[thunk, ...(process.env.NODE_ENV === 'production' ? [] : [logger])]),  );
  return store;
};

export default configureStore;