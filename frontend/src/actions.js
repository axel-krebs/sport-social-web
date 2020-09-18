/* Defining actions separately as proposed by coding standards. */
export function registerUser(user) {
    return {
        type: 'REGISTER_USER',
        user
    };
};

export function logoutUser() {
    return {
        type: 'LOG_OUT'
    };
};

export function logError(error){
    return {
        type: 'LOG_ERROR',
        error
    };
}