import axios from 'axios';
import {logout} from '../store/auth/auth-actions';
import {store} from '../index';

let logoutInProcess = false;

const _logout = () => {
    store.dispatch(logout("Access Denied"));
};

const connectPromise = (inputPromise) => {
    return inputPromise
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            console.log(error.response);
            if (error && error.response && (error.response.status === 401 || error.response.status === 498)) {
                if (!logoutInProcess) {
                    logoutInProcess = true;
                    _logout();
                    setTimeout(() => {
                        logoutInProcess = false;
                    }, 1000);
                }
                return Promise.resolve({});
            }
            else {
                return Promise.reject(error);
            }
        })
};

const _axios = {
    get: (...params) => connectPromise(axios.get(...params)),
    post: (...params) => connectPromise(axios.post(...params)),
    put: (...params) => connectPromise(axios.put(...params)),
    patch: (...params) => connectPromise(axios.patch(...params)),
    delete: (...params) => connectPromise(axios.delete(...params))
};

export default _axios;