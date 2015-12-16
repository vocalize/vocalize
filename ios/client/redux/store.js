import {compose, createStore, applyMiddleware } from 'redux';

import vocalizeReducer form './reducer';
import thunkMiddleware from 'redux-thunk';

import { routerStateReducer, reduxReactRouter } from 'redux-react-router';


const createAppStore = compose(applyMiddleware(thunkMiddleware))(createStore);

export default function configureStore(initialState){
  const store = createAppStore(rootReducer, initialState);

  return store;
};

