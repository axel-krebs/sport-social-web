import { combineReducers } from 'redux';

const initialStateOfTheApp = {
    'user': null,
    'errors': []
};

/* Allow global access to user object. */
function userReducer(state = initialStateOfTheApp, action) {

    switch(action.type) {

        case 'LOG_ERROR':

            return Object.assign({}, state, {
                errors: [
                      ...state.errors,
                      action.error
                    ]
                });

        case 'REGISTER_USER':

            return {...state, 'user': action.user};

        case 'LOG_OUT':

            return {...state, 'user': null};

        default:

            return initialStateOfTheApp;
    }
}

export const appReducers = combineReducers({

    userState: userReducer
});
