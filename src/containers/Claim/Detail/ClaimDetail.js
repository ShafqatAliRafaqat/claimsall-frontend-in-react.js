import React from 'react';
import {Tabs} from 'antd';

import OverviewTab from '../Components/Overview';
import EmployeeTab from '../Components/EmployeeDetails';
import StatusTab from '../Components/ClaimStatus';

const TabPane = Tabs.TabPane;

const claimDetails = (props) => {
    console.log('props', props);
    return (
        <div>
            <Tabs defaultActiveKey="1"
                  tabBarStyle={{textAlign: 'left'}}>
                <TabPane tab="Overview" key="1">
                    <OverviewTab data={props.claim['overview']}/>
                    <hr/>
                </TabPane>
                <TabPane tab="Employee Details" key="2">
                    <EmployeeTab data={props.claim['employeeDetails']}/>
                </TabPane>
                <TabPane tab="Policy" key="3">
                    <EmployeeTab data={props.claim['policyDetails']}/>
                </TabPane>
                <TabPane tab="Action" key="4">
                    <StatusTab {...props} />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default claimDetails;