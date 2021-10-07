import React from 'react';
import {withRouter} from 'react-router-dom';
import {Row, Col} from 'antd';
import SubItem from './SubItem';

import {connect} from 'react-redux';

import * as actions from '../../../store/menu/menu-actions';

class MenuItem extends React.Component {

    state = {
        showChildren: false
    };


    haveChildren = () => {
        return this.props.children && this.props.children.length;
    };

    showChildren = (show) => {
        this.setState({showChildren: show});
    };

    onMenuClick = () => {
        let menuActive = this.isMenuActive();
        if (!menuActive) {
            this.props.setActive(this.props.id, this.props.text);
        }

        if (this.haveChildren()) {
            if (!menuActive) {
                this.showChildren(true);
            } else {
                this.showChildren(!this.state.showChildren);
            }
        } else if (this.props.href) {
            // Do routing
            this.doRoute(this.props.href);
        }
    };

    doRoute = (href) => {
        this.props.history.push(href);
    };

    getChildren = () => {
        let jsx = null;

        if (this.isMenuActive() && this.state.showChildren) {
            jsx = this.props.children.map(child => {
                return <SubItem key={child.id} {...child} activeParent={this.isMenuActive()} doRoute={this.doRoute}/>;
            });
        }

        return jsx;
    };

    isMenuActive = () => {
        let {activeMenuId, activeMenuText, id, text} = this.props;
        return activeMenuId === id && activeMenuText === text;
    };

    render() {
        const rowStyle = {height: '36', color: '#ccc'};
        let {expanded, id, text, iconStyle, icon} = this.props;

        if (!text) {
            return <Row style={rowStyle} type="flex" justify="space-around" align="middle"/>;
        }
        else {
            const cssClasses = this.isMenuActive() ? 'menu-bar-item-active' : 'menu-bar-item-hover';

            if (expanded) {
                return (
                    <div>
                        <Row className={cssClasses} style={rowStyle} type="flex" justify="space-around" align="middle"
                             onClick={() => this.onMenuClick()}>
                            <Col span={1}/>
                            <Col span={3}>
                                <img style={iconStyle} src={icon} alt={text}/>
                            </Col>
                            <Col span={2}/>
                            <Col span={17}>
                                <h2 className='menu-bar-item'>{text}</h2>
                            </Col>
                            <Col span={1}/>
                        </Row>
                        {this.getChildren()}
                    </div>
                );
            } else {
                return (
                    <Row key={id} className={cssClasses} style={rowStyle}
                         type="flex" justify="space-around" align="middle"
                         onClick={() => this.onMenuClick()}>
                        <Col span={24}>
                            <img style={iconStyle} src={icon} alt={text}/>
                        </Col>
                    </Row>
                );
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        activeMenuId: state.menu.activeMenuId,
        activeMenuText: state.menu.activeMenuText
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setActive: (id, text) => {
            dispatch(actions.activateMenu(id, text));
        }
    };
};

const _connect = connect(mapStateToProps, mapDispatchToProps)(MenuItem);
export default withRouter(_connect);