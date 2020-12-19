import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middleware = [thunk];

let tempStore;

console.log('ENV');
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  tempStore = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
      /* eslint-disable no-underscore-dangle */
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  );
} else {
  tempStore = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware))
  );
}

const store = tempStore;

export default store;
