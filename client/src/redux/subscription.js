import { createSlice } from '@reduxjs/toolkit'

let userSlice = createSlice({
    name: 'subscription',
    initialState: { status: 'trial', planType: 'pro', isTrialExpired: false },
    reducers: {
        setCurrentPlan: (state, action) => {
            return action.payload
        }
    }
})

export const { setCurrentPlan } = userSlice.actions

export default userSlice.reducer