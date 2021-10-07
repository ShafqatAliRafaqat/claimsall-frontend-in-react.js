import React from 'react';
import {withRouter} from 'react-router-dom';
import {Row, Col} from 'antd';
import MenuItem from '../../components/Nav/MenuItem/MenuItem';
import {withGetScreen} from 'react-getscreen';

const iconStyle = {
    height: '56px', width: '28px', color: 'white'
};

class MenuBar extends React.Component {

    isSmallScreen = () => {
        return this.props.isMobile() || this.props.isTablet();
    };

    headerItem = () => {
        if (this.props.menuExpanded) {
            return (
                <Row type="flex" justify="space-around" align="middle" style={{height: '56px'}}>
                    <Col span={15}>
                        <h2 className='menu-bar-h2'>HospitALL</h2>
                    </Col>
                    <Col span={4} offset={4}>
                        <img style={iconStyle} src={'/assets/icons/Drawer_opened.svg'} alt='Drawer Opened'/>
                    </Col>
                    <Col span={1}/>
                </Row>
            );
        } else {
            return (
                <div className='shadow'>
                    <img style={iconStyle} src={'/assets/icons/Drawer_closed.svg'} alt='Drawer Closed'/>
                </div>
            );
        }
    };

    getMenuItems = () => {
        if (this.props.menuItems && this.props.menuItems.length && (this.props.menuExpanded || !this.isSmallScreen())) {
            return this.props.menuItems.map(menuItem => {
                return (
                    <MenuItem key={menuItem.id} {...menuItem} expanded={this.props.menuExpanded}
                              activeId={this.props.activeId} iconStyle={iconStyle} onClick={this.onMenuClick}/>
                );
            });
        }
        return null;
    };


    render() {
        let menuItemStyle = {minHeight: '100vh'};
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <div className='background-black color-white hover' onClick={() => {
                            this.props.onExpanderClick()
                        }}>
                            {this.headerItem()}
                        </div>
                    </Col>
                    <Col span={24}>
                        <div className='background-grey' style={menuItemStyle}>
                            {this.getMenuItems()}
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }

}

const _withGetScreen = withGetScreen(MenuBar);
export default withRouter(_withGetScreen);

