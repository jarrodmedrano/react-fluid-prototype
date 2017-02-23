import React from 'react'
import { findDOMNode } from 'react-dom'
import classNames from 'classnames';
import './vertical.scss!'
import Hero from '../hero/Hero';
import Mosaic from '../mosaic/Mosaic';
import CompareTable from '../compare/CompareTable';
import LegacyFeature from '../legacy/legacyFeature';
import LegacyKSP from '../legacy/legacyKsp';
import LegacyCenteredBackdrop from '../legacy/legacycenteredbackdrop';
import propsAreValid from '../../lib/util';
import dataPropTypes, {verticalPropTypes} from '../../../data/dataProps';
import Scroll  from 'react-scroll';
export const Link       = Scroll.Link;
export const Element    = Scroll.Element;
export const Events     = Scroll.Events;
export const scroll     = Scroll.animateScroll;
export const scrollSpy  = Scroll.scrollSpy;

class Vertical extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: false,
            events: ['scroll', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll', 'resize', 'touchmove', 'touchend']
        }
    }

    componentDidMount() {
        this._initScene();
    }

    componentWillUnmount () {
        // unRegister events listeners with the listview div
        this.state.events.forEach((type) => {
            if (window.addEventListener) {
                findDOMNode(this.refs.sceneRef).removeEventListener(type, this._checkSceneVisible.bind(this), false)
            } else {
                findDOMNode(this.refs.sceneRef).removeEvent('on' + type, this._checkSceneVisible.bind(this), false)
            }
        })
    }

    _initScene() {
        this._checkSceneVisible();

        this.state.events.forEach((type) => {
            if (window.addEventListener) {
                findDOMNode(this.refs.sceneRef).addEventListener(type, this._checkSceneVisible.bind(this), false)
            } else {
                findDOMNode(this.refs.sceneRef).attachEvent('on' + type, this._checkSceneVisible.bind(this), false)
            }
        })
    }

    _onEnterViewport() {
        this.setState({active: true});
    }

    _onLeaveViewport() {
        this.setState({active: false});
    }

    _checkSceneVisible() {
        let scene = this.refs.sceneRef;
        scene.rect = findDOMNode(scene).getBoundingClientRect();
            // findDOMNode(scene).addEventListener('scroll', this.onScroll.bind(this), false);

        this._visibleY(scene) ? this._onEnterViewport(scene) : this._onLeaveViewport(scene)
    }

    _visibleY(el) {
        let windowHeight = window.innerHeight;

        let rect = el.rect, top = rect.top, height = rect.height;

        if (top < (windowHeight) === false) return false;
        // Check if the element is out of view due to a container scrolling
        if ((top + height) < (windowHeight)) return false;

        else return true;
    }

    render() {

        if(propsAreValid(this.props.data)) {
            let verticalClass = classNames('scene-vertical', this.props.data.groupIdentifier, this.props.data.sectionIdentifier.toLowerCase());
            let {layout, sectionIdentifier} = this.props.data;
            return (
                <section className={verticalClass} id={sectionIdentifier} name={sectionIdentifier} style={{position: 'relative'}} ref="sceneRef">
                    {layout === 'hero' || layout === 'immersive-hero' || layout === 'fullscreen' || layout === 'card' ?
                        <Hero data={this.props.data} brandColor={this.props.brandColor ? this.props.brandColor : null} active={this.state.active} /> : null
                    }
                    {layout === 'mosaic' ?
                        <Mosaic data={this.props.data} brandColor={this.props.brandColor ? this.props.brandColor : null} active={this.state.active} /> : null
                    }
                    {layout === 'compare' ?
                        <CompareTable data={this.props.data} brandColor={this.props.brandColor ? this.props.brandColor : null} active={this.state.active}   /> : null
                    }
                    {layout === 'feature' ?
                        <LegacyFeature data={this.props.data} brandColor={this.props.brandColor ? this.props.brandColor : null} active={this.state.active}  /> : null
                    }
                    {layout === 'featureCta' ?
                        <LegacyFeature data={this.props.data} brandColor={this.props.brandColor ? this.props.brandColor : null} active={this.state.active}  /> : null
                    }
                    {layout === 'ksp' ?
                        <LegacyKSP data={this.props.data}  brandColor={this.props.brandColor ? this.props.brandColor : null} active={this.state.active}  />  : null
                    }
                    {/*  Implement as variants of 'ksp'?
                     {layout === 'ksp_reversed' ?
                     <LegacyKSP data={this.props.data}/> : null
                     }
                     {layout === 'ksp_rs' ?
                     <LegacyKSP data={this.props.data}/> : null
                     }
                     */}
                    {layout === 'centeredBackdropTemplate' ?
                        <LegacyCenteredBackdrop data={this.props.data} brandColor={this.props.brandColor ? this.props.brandColor : null} active={this.state.active}  /> : null
                    }
                </section>
            )
        } return null
    }
}

Vertical.propTypes = dataPropTypes(verticalPropTypes);

export default Vertical
