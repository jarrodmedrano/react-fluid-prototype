import React from 'react'
import classNames from 'classnames';
import { findDOMNode } from 'react-dom'
import './vertical.scss!'
import Hero from '../hero/Hero';
import Mosaic from '../mosaic/Mosaic';
import CompareTable from '../compare/CompareTable';
import LegacyFeature from '../legacy/legacyFeature';
import LegacyKSP from '../legacy/legacyksp';
import LegacyCenteredBackdrop from '../legacy/legacycenteredbackdrop';
import LegacySpecs from '../legacy/legacySpecs';
import propsAreValid, {logError, impressionEvent, requestFrameThrottle} from '../../lib/util';
import dataPropTypes, {verticalPropTypes} from '../../../data/dataProps';
import _ from 'lodash';

class Vertical extends React.Component {
    
    constructor(props){
        super(props);

        //initialize state
        this.state = {
            active: false,
            winHeight: 0,
            winTop: 0,
            scrollTop: 0
        };

        this._checkSceneVisible = requestFrameThrottle(this._checkSceneVisible.bind(this));
    }

    componentDidMount() {
        //when component mounts check if it is in the viewport
        this._checkSceneVisible();
    }

    componentWillUpdate(nextProps, nextState) {
        if(nextState.active === true && this.state.active === false) {
            this._logImpression(true)
        }

        if(nextState.active === false && this.state.active === true) {
            this._logImpression(false)
        }
    }

    componentWillReceiveProps(nextProps, nextState) {

        //get new dimensions from the parent component VerticalPage
        if(this.state.winHeight !== nextProps.winHeight) {
            this._updateDimensions(nextProps);
        }

        if(this.state.scrollTop !== nextProps.scrollTop || nextProps.scrollTop === 0) {
            this._checkSceneVisible();
        }
    }

    _onEnterViewport() {
        //Our vertical has entered the viewport
        this.setState({active: true})
    }

    _onLeaveViewport() {
        //Our vertical has left the viewport.
        this.setState({active: false})
    }

    _updateDimensions(nextProps) {
        //get the new window height, top of the window, and scroll position from VerticalPage and update this state
        this.setState({
            winHeight: nextProps.winHeight,
            winTop: nextProps.winTop,
            scrollTop: nextProps.scrollTop
        }, this._checkSceneVisible());
    };

    _checkSceneVisible() {
        //get rectangle of the vertical and test if it's in the viewport or not
        this._visibleY(this);
    }

    _visibleY(el) {
        if(el) {
            //Check the rectangle of the dom node and fire a function if it's visible
            let rect = findDOMNode(el).getBoundingClientRect(),
                rectHeight = rect.bottom,
                rectHeightBuffer = rectHeight / 2,
                rectTopBuffer = rect.top + rectHeightBuffer;

            if(rectTopBuffer + rectHeightBuffer >= this.state.winTop && rectHeightBuffer <= this.state.winHeight) {
                this._onEnterViewport(el);
            } else {
                this._onLeaveViewport(el);
            }
        }
    }

    _logImpression(visible) {
        impressionEvent(visible, this.props.data.groupIdentifier, this.props.data.sectionIdentifier);
    }

    render() {
        if(propsAreValid(this.props.data, this)) {
            let active = this.state.active ? 'active' : 'inactive';

            let {layout, sectionIdentifier, readingDirection} = this.props.data;
            let myLayout = typeof layout === 'object' ? layout.type : layout;
            let acceptedLayouts = ['hero', 'immersiveHero', 'fullscreen', 'card', 'mosaic', 'compare', 'feature', 'featureCta', 'ksp', 'ksp_rs', 'ksp_reversed', 'centeredBackdropTemplate', 'threeColSpecs'];
            let verticalClass = classNames('scene-vertical', this.props.data.groupIdentifier, this.props.data.sectionIdentifier, myLayout, active);
            if(myLayout && _.includes(acceptedLayouts, myLayout)) {
                return (
                    <section id={sectionIdentifier} className={verticalClass} name={sectionIdentifier}
                             dir={readingDirection ? readingDirection : null}>
                        {myLayout == 'hero' || myLayout == 'immersiveHero' || myLayout == 'fullscreen' || myLayout == 'card' ?
                            <Hero data={this.props.data.layout}
                                  brandColor={this.props.brandColor ? this.props.brandColor : null}
                                  active={this.state.active} myId={this.props.myId} /> : null
                        }
                        {myLayout == 'mosaic' ?
                            <Mosaic data={this.props.data.layout}
                                    brandColor={this.props.brandColor ? this.props.brandColor : null}
                                    active={this.state.active} myId={this.props.myId} /> : null
                        }
                        {myLayout == 'compare' ?
                            <CompareTable data={this.props.data.layout}
                                          brandColor={this.props.brandColor ? this.props.brandColor : null}
                                          active={this.state.active} myId={this.props.myId} /> : null
                        }
                        {myLayout == 'feature' ?
                            <LegacyFeature data={this.props.data}
                                           brandColor={this.props.brandColor ? this.props.brandColor : null}
                                           active={this.state.active} myId={this.props.myId} /> : null
                        }
                        {myLayout == 'featureCta' ?
                            <LegacyFeature data={this.props.data}
                                           brandColor={this.props.brandColor ? this.props.brandColor : null}
                                           active={this.state.active} myId={this.props.myId} /> : null
                        }
                        {myLayout == 'ksp' || myLayout == 'ksp_rs' || myLayout == 'ksp_reversed' ?
                            <LegacyKSP data={this.props.data}
                                       brandColor={this.props.brandColor ? this.props.brandColor : null}
                                       active={this.state.active} myId={this.props.myId} /> : null
                        }
                        {myLayout == 'centeredBackdropTemplate' ?
                            <LegacyCenteredBackdrop data={this.props.data}
                                                    brandColor={this.props.brandColor ? this.props.brandColor : null}
                                                    active={this.state.active} myId={this.props.myId}/> : null
                        }
                        {myLayout == 'threeColSpecs' ?
                            <LegacySpecs data={this.props.data}
                                         brandColor={this.props.brandColor ? this.props.brandColor : null}
                                         active={this.state.active} myId={this.props.myId} deviceInfo={this.props.deviceInfo} /> : null
                        }
                    </section>
                )
            }
            logError('Error: invalid layout of type', myLayout, 'supplied to', this, 'Layout must be one of type: ', acceptedLayouts);
        }
        return null
    }
}

Vertical.propTypes = dataPropTypes(verticalPropTypes);

export default Vertical
