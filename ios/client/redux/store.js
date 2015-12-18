import {compose, createStore, applyMiddleware } from 'redux';

import vocalizeReducer form './reducer';
import thunk from 'redux-thunk';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);


const store = createStoreWithMiddleware(vocalizeReducer, initialState);



