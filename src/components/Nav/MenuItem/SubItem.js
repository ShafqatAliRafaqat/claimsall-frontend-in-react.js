import React from 'react';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import * as actions from '../../../store/menu/menu-actions';

class SubItem extends React.Component {

    isActive = () => {
        let { activeParent, activeSubMenuId, activeSubMenuText, id, text } = this.props;
        return activeParent && activeSubMenuId === id && activeSubMenuText === text;
    };

    onSubItemClick = () => {
        if (this.props.activeParent) {
            this.props.setActive(this.props.id, this.props.text);
        }

        if (this.props.href) {
            this.props.doRoute(this.props.href);
        }
    }

    render() {
        const rowStyle = { height: '38px', color: '#ccc' };
        let cssClasses = this.isActive() ? 'menu-bar-item-active' : 'menu-bar-item-hover';
        return (
            <Row className={cssClasses} style={rowStyle} type="flex" justify="space-around" align="middle" onClick={() => {this.onSubItemClick()}}>
                <Col span={5} className='text-right'> - </Col>
                <Col span={1} className='text-right'></Col>
                <Col span={18} className='text-left'>{this.props.text}</Col>
            </Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        activeSubMenuId: state.menu.activeSubMenuId,
        activeSubMenuText: state.menu.activeSubMenuText
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setActive: (id, text) => { dispatch(actions.activateSubMenu(id, text)); }
    };
}

const _connect = connect(mapStateToProps, mapDispathToProps)(SubItem);
export default withRouter(_connect);