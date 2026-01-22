import { createSlice } from "@reduxjs/toolkit"

interface Profile {
    activeMenuItem: string
}

const initialState: Profile = {
    activeMenuItem: 'My Profile'
}

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setActiveItem(state, action) {
            state.activeMenuItem = action.payload;
        }
    }
})

export const { setActiveItem } = profileSlice.actions;
export default profileSlice.reducer;