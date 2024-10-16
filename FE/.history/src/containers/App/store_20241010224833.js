import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import {
    sidebarReducer,
    themeReducer,
    rtlReducer,
    userReducer,
    productReducer,
} from "@/redux/reducers/index";

// Combine all reducers, including the new one
const reducer = combineReducers({
    theme: themeReducer,
    sidebar: sidebarReducer,
    rtl: rtlReducer,
    user: userReducer,
    product: productReducer,
});

// Create the store with the combined reducers
const store = createStore(reducer, applyMiddleware(thunk));

export default store;
