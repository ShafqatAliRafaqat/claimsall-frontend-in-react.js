import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from '../../components/Loader/Loading';

const Dashboard = Loadable({loader: () => import('./Dashboard'), loading: Loading, delay: 400, timeout: 5000});

const Organizations = Loadable({
    loader: () => import('../Organization/Organizations'),
    loading: Loading,
    delay: 400,
    timeout: 5000
});

const Users = Loadable({loader: () => import('../User/Users'), loading: Loading, delay: 400, timeout: 5000});

const ServiceProvider = Loadable({
    loader: () => import('../ServiceProvider/ServiceProvider'),
    loading: Loading,
    delay: 400,
    timeout: 5000
});

const ServiceProviders = Loadable({
    loader: () => import('../ServiceProviders/ServiceProviders'),
    loading: Loading,
    delay: 400,
    timeout: 5000
});

const Doctors = Loadable({loader: () => import('../Doctor/Doctors'), loading: Loading, delay: 400, timeout: 5000});

const CareServices = Loadable({
    loader: () => import('../CareService/CareService'),
    loading: Loading,
    delay: 400,
    timeout: 5000
});


const HealthMonitorType = Loadable({
    loader: () => import('../HealthMonitor/HealthMonitor'),
    loading: Loading,
    delay: 400,
    timeout: 5000
});

class SuperAdmin extends React.Component {


    insuranceCompanies = () => {
        return <ServiceProvider module='insurance-companies' name='Insurance Companies' singularName='Insurance Company'
                                providerCode='InsComp' disableLocationInfo={true}/>
    };

    pharmacy = () => {
        return <ServiceProvider module='pharmacies' name='Pharmacies' singularName='Pharmacy' providerCode='pharmacy'/>
    };

    laboratory = () => {
        return <ServiceProvider module='laboratories' name='Laboratories' singularName='Laboratory' providerCode='lab'/>
    };

    clinic = () => {
        return <ServiceProvider module='clinics' name='Clinics' singularName='Clinic' providerCode='clinic'/>
    };

    hospital = () => {
        return <ServiceProvider module='hospitals' name='Hospitals' singularName='Hospital' providerCode='hospital'/>
    };

    doctors = () => {
        return <Doctors module='doctors' name='Doctors' singularName='Doctor' providerCode='doctor'/>
    };

    dentist = () => {
        return <Doctors module='dentists' name='Dentists' singularName='Dentist' providerCode='dentist'/>
    };

    careServices = () => <CareServices/>;

    healthMonitorTypes = () => <HealthMonitorType/>;

    render() {
        return (
            <Switch>
                <Route path="/" exact component={Dashboard}/>
                <Route path="/users" component={Users}/>
                <Route path="/organizations" component={Organizations}/>
                <Route path="/insurance-companies" component={this.insuranceCompanies}/>
                <Route path="/pharmacies" component={this.pharmacy}/>
                <Route path="/laboratories" component={this.laboratory}/>
                <Route path="/clinics" component={this.clinic}/>
                <Route path="/service-providers" component={ServiceProviders}/>
                <Route path="/doctors" component={this.doctors}/>
                <Route path="/dentists" component={this.dentist}/>
                <Route path="/hospitals" component={this.hospital}/>
                <Route path="/care-services" component={this.careServices}/>
                <Route path="/health-monitor-fields" component={this.healthMonitorTypes}/>
            </Switch>
        );
    }
}

export default SuperAdmin;
