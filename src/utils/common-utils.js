import {store} from '../index';
import {message} from 'antd';

import axios from '../utils/axios';
import serverConfig from '../config/config.json';

export const aclAllowed = (href) => {
    const {acl, role} = store.getState().auth;
    return role === 'superAdmin' || role === 'orgAdmin' || acl.includes(href);
};


export const validImportFile = (file) => {
    let fileExtension = file.name.split('.').pop();
    if (['xls', 'xlsx'].indexOf(fileExtension) < 0) {
        message.error('File format not supported, supported formats [.xls, .xlsx]');
        return false;
    }
    return true;
};


export const uploadImportFile = (file, api) => {
    return new Promise((resolve) => {
        let url = `${serverConfig.serverUrl}/${api || 'import'}`;

        let formData = new FormData();
        formData.append('file', file, file.name);

        axios.post(url, formData, {
            headers: {'Authorization': `Bearer ${store.getState().auth.token}`},
            responseType: 'blob'
        })
            .then(response => {
                console.log(response);
                const url = window.URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${new Date().getTime()}-response-${file.name}`);
                document.body.appendChild(link);
                link.click();
                resolve(true);
            })
            .catch((err) => {
                message.error('Error occurred while processing file');
                console.log(err, err.response);
                resolve(false);
            })

    });
};


export const validValues = () => {
    for (let arg in arguments) {
        if (arguments.hasOwnProperty(arg)) {
            if (!arg || arg.length <= 0) {
                return false;
            }
        }
    }

    return true;
};

export const toDisplayPolicyLevel = (policyLevel) => {
    let displayPolicyLevel = null;
    if (policyLevel === 'organization') {
        displayPolicyLevel = 'Organization';
    }
    else if (policyLevel === 'grade') {
        displayPolicyLevel = 'Grade';
    }
    else if (policyLevel === 'user') {
        displayPolicyLevel = 'User';
    }

    return displayPolicyLevel;
};

export const toDataPolicyLevel = (policyLevel) => {
    let dataPolicyLevel = null;

    if (policyLevel === 'Organization') {
        dataPolicyLevel = 'organization';
    }
    else if (policyLevel === 'Grade') {
        dataPolicyLevel = 'grade';
    }
    else if (policyLevel === 'User') {
        dataPolicyLevel = 'user';
    }

    return dataPolicyLevel;
};


export const toDisplayPolicyType = (policyLevel) => {
    let displayPolicyLevel = null;

    if (policyLevel && policyLevel.toLowerCase() === 'in_patient') {
        displayPolicyLevel = 'In-Patient';
    }
    else if (policyLevel && policyLevel.toLowerCase() === 'out_patient') {
        displayPolicyLevel = 'Out-Patient';
    }
    else if (policyLevel && policyLevel.toLowerCase() === 'maternity') {
        displayPolicyLevel = 'Maternity';
    }
    else {
        displayPolicyLevel = policyLevel;
    }

    return displayPolicyLevel;
};

export const idToName = (_id) => {
    let id = _id && _id.toString();
    if ('1' === id) {
        return 'In-Patient';
    }
    else if ('2' === id) {
        return 'Out-Patient';
    }
    else if ('3' === id) {
        return 'Maternity';
    }
};

export const toDataPolicyType = (policyLevel) => {
    let dataPolicyLevel = null;

    if (policyLevel === 'In-Patient') {
        dataPolicyLevel = 'in_patient';
    }
    else if (policyLevel === 'Out-Patient') {
        dataPolicyLevel = 'out_patient';
    }
    else if (policyLevel === 'Maternity') {
        dataPolicyLevel = 'maternity';
    }
    else {
        dataPolicyLevel = policyLevel;
    }

    return dataPolicyLevel;
};

export const formatAmount = (amount) => {
    if (isNaN(amount)) {
        return amount;
    }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 2
    });

    return formatter.format(amount);
};