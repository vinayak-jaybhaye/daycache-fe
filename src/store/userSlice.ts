import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type User = {
    id: string;
    username: string;
    email: string;
    profile_image?: string;
    created_at: string;
}

type UserState = {
    user: User | null;
}

const initialState: UserState = {
    user: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
    }
})

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
