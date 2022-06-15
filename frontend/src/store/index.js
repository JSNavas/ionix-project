import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth";
import users from "./users";

export default configureStore({
    reducer: {
        auth: auth,
				users: users,
    }
})
