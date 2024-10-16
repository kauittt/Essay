import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import {
    sidebarReducer,
    themeReducer,
    rtlReducer,
    bookReducer,
    userReducer,
} from "@/redux/reducers/index";

// Combine all reducers, including the new one
const reducer = combineReducers({
    theme: themeReducer,
    sidebar: sidebarReducer,
    rtl: rtlReducer,
    book: bookReducer,
    user: userReducer,
});

// Create the store with the combined reducers
const store = createStore(reducer, applyMiddleware(thunk));

export default store;
