import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJson, sendJson} from './backend.js';
import * as actions from './actions.js';

/* Separating this functionality into custom hook for better usability. */
export function useLogin(nickName, passWord, counter) {

    console.log('nickName: ' + nickName + ', passWord: ' + passWord + ', cnt: ' + counter);

    const [result, setResult] = React.useState(null);

    const userState = useSelector(state => state.userState);

    const dispatch = useDispatch();

    console.log('LOGIN:dispatch: ' + JSON.stringify(dispatch));

    React.useEffect(

        async () => {

            try {

                const userData = await sendJson("POST", "/user", {'nickName': nickName, 'passWord': passWord});

                if(userData['invalid']){

                    let errMsg = 'Message: ' + messages['login.error.username'];

                    dispatch(actions.logError(errMsg));

                    setResult(errMsg);
                }
                else {

                    dispatch(actions.registerUser(userData));

                    setResult(userData);

                }
            }
            catch(err){

                dispatch(actions.logError(err));

                setResult(err.message);

            }

        },

        // only trigger this load when nickName or passWord have changed in any way..
        [nickName, passWord, counter]
    );

    return result;
}