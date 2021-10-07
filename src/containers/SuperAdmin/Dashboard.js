import React from 'react';
import StatsCard from '../../components/StatsCard/StatsCard';
import ReqsCard from '../../components/ReqsCard/ReqsCard';

import {Row, Col} from 'antd';

const countsData = [
    {
        id: 1,
        text: 'Pending',
        color: 'orange',
        count: 912,
        href: '/care-services/pending'
    },
    {
        id: 2,
        text: 'Approved',
        color: 'green',
        count: 4,
        href: '/care-services/history',
        state : {filter : 'Approved'}
    },
    {
        id: 3,
        text: 'Declined',
        color: 'red',
        count: 38,
        href: '/care-services/history',
        state : {filter : 'Declined'}
    }
];

class Dashboard extends React.Component {

    state = {
        row1Stats: [
            {
                id: 1,
                iconColor: '46, 172, 30',
                text: 'Users',
                api: 'user-stats'
            },
            {
                id: 2,
                iconColor: '224,9,151',
                text: 'Organizations',
                api: 'orgs-stats'
            },
            {
                id: 3,
                iconColor: '0,0,128',
                text: 'Service Providers',
                chart: 'pie',
                api: 'serviceproviders-stats',
                hideDatePicker: true
            },
        ],
        row2Stats: [
            {
                id: 3,
                iconColor: '47, 108, 224',
                text: 'Doctors',
                api: 'role-stats'
            },
            {
                id: 2,
                iconColor: '0,0,128',
                text: 'Care Services',
                chart: 'pie',
                api: 'request-stats',
            }
        ]
    };

    mapReqs = (newState, resp) => {
        newState.countsData[0].count = resp.data.data['Pending'] || 0;
        newState.countsData[1].count = resp.data.data['Approved'] || 0;
        newState.countsData[2].count = resp.data.data['Declined'] || 0;
    };

    getStatsCards = (stats) => {
        return stats.map((statsCard) => {
            return (
                <Col key={statsCard.id} sm={{span: 24}} md={{span: Math.floor(24 / stats.length)}}>
                    <StatsCard {...statsCard} />
                </Col>
            );
        });
    };

    render() {
        return (
            <div>
                <Row type="flex" justify="space-around" align="middle" gutter={32}>
                    <Col sm={{span: 24}}>
                        <Row gutter={16} type="flex" justify="space-around" align="middle">
                            {this.getStatsCards(this.state.row1Stats)}
                        </Row>
                    </Col>
                </Row>

                <Row type="flex" justify="space-around" align="middle" gutter={32}>
                    <Col sm={{span: 24}} xl={{span: 13}}>
                        <Row gutter={16} type="flex" justify="space-around" align="middle">
                            {this.getStatsCards(this.state.row2Stats)}
                        </Row>
                    </Col>
                    <Col sm={{span: 24}} xl={{span: 11}}>
                        <ReqsCard mapReqs={this.mapReqs}
                                  countsData={countsData}
                                  api={'careservice-stats'}
                                  headerText={'Orders'}
                                  iconColor='255,255,255'
                                  icon='headphones'/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Dashboard;