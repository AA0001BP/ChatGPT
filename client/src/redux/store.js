import { configureStore } from "@reduxjs/toolkit";
import user from "./user";
import loading from "./loading";
import history from "./history";
import messages from "./messages";
import subscription from "./subscription";

export const store = configureStore({
    reducer: {
        subscription,
        user,
        loading,
        history,
        messages
    }
})