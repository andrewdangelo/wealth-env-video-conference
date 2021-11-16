import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './reducers';


const reduxMiddlewares = [thunk];

const store = createStore(reducers, composeWithDevTools(applyMiddleware(...reduxMiddlewares)));

export { store };