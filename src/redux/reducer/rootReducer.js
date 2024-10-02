import {combineReducers} from 'redux'
import {appReducer , musicReducer} from './reducers'

// import appReducer from './appReducer'
// import musicReducer from'./musicReducer'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'

const persistConfig = {
    storage,
    stateReconciler: autoMergeLevel2,
  }

const musicConfig= {
    ...persistConfig,
    key:'music',
    // 
}

const rootReducer =combineReducers({
    app : appReducer,
    music : persistReducer(musicConfig,musicReducer),
})
export default rootReducer;