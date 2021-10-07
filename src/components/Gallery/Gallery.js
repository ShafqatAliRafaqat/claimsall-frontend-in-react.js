import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {css, StyleSheet} from 'aphrodite/no-important';
import Lightbox from 'react-images';
import {Row, Col} from 'antd';

class Gallery extends Component {

    constructor() {
        super();

        this.state = {
            lightboxIsOpen: false,
            currentImage: 0,
        };

        this.closeLightbox = this.closeLightbox.bind(this);
        this.gotoNext = this.gotoNext.bind(this);
        this.gotoPrevious = this.gotoPrevious.bind(this);
        this.gotoImage = this.gotoImage.bind(this);
        this.handleClickImage = this.handleClickImage.bind(this);
        this.openLightbox = this.openLightbox.bind(this);
    }

    openLightbox(index, event) {
        event.preventDefault();
        this.setState({
            currentImage: index,
            lightboxIsOpen: true,
        });
    }

    closeLightbox() {
        this.setState({
            currentImage: 0,
            lightboxIsOpen: false,
        });
    }

    gotoPrevious() {
        this.setState({
            currentImage: this.state.currentImage - 1,
        });
    }

    gotoNext() {
        this.setState({
            currentImage: this.state.currentImage + 1,
        });
    }

    gotoImage(index) {
        this.setState({
            currentImage: index,
        });
    }

    handleClickImage() {
        if (this.state.currentImage === this.props.images.length - 1) return;

        this.gotoNext();
    }

    renderGallery() {
        const {images} = this.props;
        if (!images) return;

        const gallery = images.map((obj, i) => {
            return (
                <a href={obj.src} className={css(classes.thumbnail, classes[obj.orientation])} key={i}
                   onClick={(e) => this.openLightbox(i, e)}>
                    {(i < 5) ? <img src={obj.thumbnail} className={css(classes.source)} alt=""/> : null}
                </a>
            );
        });

        return (
            <div className={css(classes.gallery)}>
                {gallery}
                {this.getArrowSign()}
            </div>
        );
    }

    getArrowSign = () => {
        if (this.props.images && this.props.images.length > 5) {
            //return <div className="container"><i className="fa fa-caret-right fa-5x"/></div>
            return <small className={css(classes.bottomAlign)}>
                <a className="hover" onClick={(e) => this.openLightbox(5, e)}>See All</a>
            </small>
        }
        return null;
    };

    render() {
        if (this.props.images && this.props.images.length > 0) {
            return (
                <div style={{padding: 12}}>
                    <Row type="flex" justify="space-around" align="middle"
                         style={{marginBottom: 12}}>
                        <Col span={21} offset={3} className='text-left'>
                    <span
                        style={{fontSize: '24px', fontWeight: 'bold', borderBottom: '1px solid #777'}}>{this.props.heading}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20} offset={4}>
                            {this.renderGallery()}
                            <Lightbox
                                currentImage={this.state.currentImage}
                                images={this.props.images}
                                isOpen={this.state.lightboxIsOpen}
                                onClickImage={this.handleClickImage}
                                onClickNext={this.gotoNext}
                                onClickPrev={this.gotoPrevious}
                                onClickThumbnail={this.gotoImage}
                                onClose={this.closeLightbox}
                                showThumbnails={this.props.showThumbnails}
                                spinner={this.props.spinner}
                                spinnerColor={this.props.spinnerColor}
                                spinnerSize={this.props.spinnerSize}
                                theme={this.props.theme}
                            />
                        </Col>
                    </Row>
                </div>
            );
        } else {
            return null;
        }
    }
}

Gallery.displayName = 'Gallery';
Gallery.propTypes = {
    heading: PropTypes.string,
    images: PropTypes.array,
    showThumbnails: PropTypes.bool,
    subheading: PropTypes.string,
};

const gutter = {
    small: 2,
    large: 4,
};
const classes = StyleSheet.create({
    gallery: {
        marginRight: -gutter.small,
        overflow: 'hidden',

        '@media (min-width: 500px)': {
            marginRight: -gutter.large,
        },
    },

    // anchor
    thumbnail: {
        boxSizing: 'border-box',
        display: 'block',
        float: 'left',
        lineHeight: 0,
        paddingRight: gutter.small,
        paddingBottom: gutter.small,
        overflow: 'hidden',

        '@media (min-width: 500px)': {
            paddingRight: gutter.large,
            paddingBottom: gutter.large,
        },
    },

    // orientation
    landscape: {
        width: '30%',
    },
    square: {
        paddingBottom: 0,
        width: '40%',

        '@media (min-width: 500px)': {
            paddingBottom: 0,
        },
    },

    // actual <img />
    source: {
        border: 0,
        display: 'block',
        height: '36px',
        maxWidth: '100%',
        width: 'auto',
    },

    bottomAlign: {
        display: "table-cell",
        verticalAlign: "bottom",
        height: "36px",
        width: "auto",
        maxWidth: '100%'
    }
});

export default Gallery;
