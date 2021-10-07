import axios from '../utils/axios';
import serverConfig from '../config/config.json';
import {store} from '../index';

import moment from 'moment';
import {getPolicyLimits} from '../store/claim/claim-actions';

export const fetchOrganizationTypes = (code) => {
    let organizationTypes = [];

    return new Promise((resolve, reject) => {
        if (organizationTypes && organizationTypes.length) {
            resolve(organizationTypes);
        } else {
            let url = `${serverConfig.serverUrl}/get-organization-types`;
            if (code) {
                url += `?code=${code}`;
            }

            axios.get(url, {headers: {'Authorization': `Bearer ${store.getState().auth.token}`}})
                .then((resp) => {
                    let {data} = resp;
                    if (data && data.data && data.data.length) {
                        organizationTypes = data.data;
                    }
                    resolve(organizationTypes);
                })
                .catch(err => {
                    console.log(err, err.response);
                    reject(err.response);
                });
        }
    });
};

export const fetchOrganizationRoles = (organization_id) => {
    let organizationRoles = [];

    return new Promise((resolve, reject) => {
        let orgId = store.getState().auth.organization_id || organization_id;
        let url = `${serverConfig.serverUrl}/get-administrative-roles?organization_id=${orgId}`;

        axios.get(url, {headers: {'Authorization': `Bearer ${store.getState().auth.token}`}})
            .then((resp) => {
                let {data} = resp;
                if (data && data.data && data.data.length) {
                    organizationRoles = data.data;
                }
                resolve(organizationRoles);
            })
            .catch(err => {
                console.log(err, err.response);
                reject(err.response);
            });
    });
};

export const fetchOrganizationGrades = (organization_id) => {
    let organizationGrades = [];

    return new Promise((resolve, reject) => {
        let url = `${serverConfig.serverUrl}/grade`;
        if (organization_id) {
            url += `?organization_id=${organization_id}`;
        }

        axios.get(url, {headers: {'Authorization': `Bearer ${store.getState().auth.token}`}})
            .then((resp) => {
                let {data} = resp;
                if (data && data.data && data.data.length) {
                    organizationGrades = data.data;
                    if (organizationGrades && organizationGrades.length) {
                        organizationGrades = organizationGrades.map(grade => {
                            return {id: grade.id, name: grade.title}
                        });
                    }
                }
                resolve(organizationGrades);
            })
            .catch(err => {
                console.log(err, err.response);
                reject(err.response);
            });
    });
};


export const registerDoctor = (user_id, code) => {
    return new Promise((resolve, reject) => {
        axios.post(`${serverConfig.serverUrl}/register-doctor`, {
            user_id,
            code
        }, {headers: {'Authorization': `Bearer ${store.getState().auth.token}`}})
            .then(resp => {
                console.log(resp);
                resolve(resp.data);
            })
            .catch(err => {
                console.log(err.response);
                reject(err.response);
            });
    });
};

export const fetchCareTypes = () => {
    let careTypes = [];

    return new Promise((resolve, reject) => {
        if (careTypes && careTypes.length) {
            resolve(careTypes);
        } else {
            let url = `${serverConfig.serverUrl}/lookup-careservicestype`;

            axios.get(url, {headers: {'Authorization': `Bearer ${store.getState().auth.token}`}})
                .then((resp) => {
                    let {data} = resp;
                    if (data && data.data && data.data.length) {
                        careTypes = data.data;
                    }
                    resolve(careTypes);
                })
                .catch(err => {
                    console.log(err, err.response);
                    reject(err.response);
                });
        }
    });
};

export const fetchOrgModules = (organization_id) => {
    let modules = [];

    return new Promise((resolve, reject) => {
        let url = `${serverConfig.serverUrl}/lookup-modules`;
        if (organization_id) {
            url += `?organization_id=${organization_id}`;
        }

        axios.get(url, {headers: {'Authorization': `Bearer ${store.getState().auth.token}`}})
            .then((resp) => {
                let {data} = resp;
                if (data && data.data && data.data.length) {
                    modules = data.data;
                }
                resolve(modules);
            })
            .catch(err => {
                console.log(err, err.response);
                reject(err.response);
            });
    });
};

export const fetchCoveredTypes = (organization_id) => {
    let coveredTypes = [];

    return new Promise((resolve, reject) => {
        let url = `${serverConfig.serverUrl}/lookup-relationship-types`;
        if (organization_id) {
            url += `?organization_id=${organization_id}`;
        }

        axios.get(url, {headers: {'Authorization': `Bearer ${store.getState().auth.token}`}})
            .then((resp) => {
                let {data} = resp;
                if (data && data.data && data.data.length) {
                    coveredTypes = data.data;
                }
                resolve(coveredTypes);
            })
            .catch(err => {
                console.log(err, err.response);
                reject(err.response);
            });
    });
};

export const fetchMedicalConsumptions = () => {
    return new Promise((resolve, reject) => {
        const {orgClaim} = store.getState().claim.claim;
        const employeeCode = orgClaim['claimed_by_employee_code'];
        const year = moment(orgClaim['medical_claim_created_at']).format('YYYY');
        const url = `${serverConfig.serverUrl}/calculate-medical-consumptions?employee_code=${employeeCode}&year=${year}`;

        axios.get(url, {headers: {'Authorization': `Bearer ${store.getState().auth.token}`}})
            .then((resp) => {
                let {data} = resp;
                if (data && data.data) {
                    const response = data.data;
                    let sums = {
                        'IPD': 0,
                        'OPD': 0,
                        'Maternity': 0,
                        'Special': 0,
                    };

                    for (let key in response) {
                        if (response.hasOwnProperty(key)) {
                            let consumedLimits = response[key];
                            let totalConsumed = 0;

                            for (let cnic in consumedLimits) {
                                if (consumedLimits.hasOwnProperty(cnic)) {
                                    totalConsumed += +consumedLimits[cnic];
                                }
                            }
                            sums[key] = totalConsumed;
                        }
                    }

                    let limits = {
                        'indoor_limit': orgClaim['indoor_limit'],
                        'ipd_consumed_amount': sums['IPD'],

                        'outdoor_amount': orgClaim['outdoor_amount'],
                        'opd_consumed_amount': sums['OPD'],

                        'maternity_normal_case_limit': orgClaim['maternity_normal_case_limit'],
                        'maternity_consumed_amount': sums['Maternity'],
                        'maternity_csection_case_limit': orgClaim['maternity_csection_case_limit'],

                        'special_consumed_amount': sums['Special']
                    };

                    let policyLimits = getPolicyLimits(limits);
                    resolve(policyLimits);
                }
            })
            .catch(err => {
                console.log(err, err.response);
                reject(err.response);
            });
    });
};