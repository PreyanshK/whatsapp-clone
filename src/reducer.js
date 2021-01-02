//InitialState is how the data layer looks at the very beginning
//i.e. before the app starts and before we added anything
export const initialState = {
    user: null,
};

//Action Types will Push/Dispatch info into the data layer
//e.g. when we sign in, push this user into the data layer
export const actionTypes = {
    SET_USER: "SET_USER",
};

const reducer = (state, action) => {
    console.log(action);
    switch(action.type) {
        // if you dispatched a SET_USER action, then
        // ...state will keep everything in the data layer
        // but change the user to what ever we dispatched
        case actionTypes.SET_USER:
        return {
            ...state,
            user: action.user,
        };
        
        // if there is any other state, fall back to the default state
        // i.e. leave it as if, don't do anything with those states
        default: 
            return state;
    }
};

export default reducer;