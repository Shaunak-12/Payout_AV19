import {Action} from '@ngrx/store';
import * as AuthActions from './actions';

const initialState = {
    isLoggedIn: !!localStorage.getItem('token'),
    token: localStorage.getItem('token'),
    currentUser: {
        email: 'mail@example.com',
        picture: null
    }
};

export function authReducer(
    state = initialState,
    action: AuthActions.LoginUser
) {
    switch (action.type) {
        case AuthActions.LOGIN_USER:
            localStorage.setItem('token', action.payload);
            return {
                ...state,
                isLoggedIn: true,
                token: action.payload
            };
            break;
        case AuthActions.LOGOUT_USER:
            localStorage.removeItem('token');
            return {
                ...state,
                isLoggedIn: false,
                token: null
            };
        case AuthActions.LOAD_USER:
            return {
                ...state,
                currentUser: action.payload
            };
        default:
            return state;
    }
}
