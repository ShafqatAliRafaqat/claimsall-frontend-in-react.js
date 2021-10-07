import React from 'react';
import StatsCard from '../../components/StatsCard/StatsCard';
import ReqsCard from '../../components/ReqsCard/ReqsCard';
import {connect} from 'react-redux';
import {Row, Col} from 'antd';

const countsData = [
    {
        id: 1,
        text: 'Pending',
        color: 'orange',
        count: 912,
        href: '/claims/pending'
    },
    {
        id: 2,
        text: 'Approved',
        color: 'green',
        count: 4,
        href: 'claims/all',
        state: {filter: 'Approved'}
    },
    {
        id: 3,
        text: 'On-Hold',
        color: 'grey',
        count: 4,
        href: '/claims/all',
        state: {filter: 'On Hold'},
    },
    {
        id: 4,
        text: 'Declined',
        color: 'red',
        count: 38,
        href: '/claims/all',
        state: {filter: 'Decline'}
    }
];

class Dashboard extends React.Component {

    state = {
        row1Stats: [
            {
                id: 1,
                iconColor: '47, 108, 224',
                text: 'Employees',
                api: `org-user-stats?organization_id=${this.props.organization_id}`
            },
            {
                id: 2,
                iconColor: '46, 172, 30',
                text: 'Employees',
                chart: 'pie',
                api: `org-user-count?organization_id=${this.props.organization_id}`,
                hideDatePicker: true
            }
        ]
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

    mapReqs = (newState, resp) => {
        newState.countsData[0].count = resp.data.data['Pending'] || 0;
        newState.countsData[1].count = resp.data.data['Approved'] || 0;
        newState.countsData[2].count = resp.data.data['On Hold'] || 0;
        newState.countsData[3].count = resp.data.data['Decline'] || 0;
    };

    render() {
        return (
            <div>
                <Row type="flex" justify="space-around" align="middle" gutter={32}>
                    <Col sm={{span: 24}} md={{span: 13}}>
                        <Row gutter={16} type="flex" justify="space-around" align="middle">
                            {this.getStatsCards(this.state.row1Stats)}
                        </Row>
                    </Col>
                    <Col sm={{span: 24}} md={{span: 11}}>
                        <ReqsCard mapReqs={this.mapReqs} countsData={countsData}
                                  api={`claim-stats?organization_id=${this.props.organization_id}`}
                                  headerText={'Claims'} iconColor='255,255,255' icon='headphones'/>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        organization_id: state.auth.organization_id
    }
};
export default connect(mapStateToProps)(Dashboard);