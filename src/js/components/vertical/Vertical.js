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
const Link       = Scroll.Link;
const Element    = Scroll.Element;
const Events     = Scroll.Events;
const scroll     = Scroll.animateScroll;
const scrollSpy  = Scroll.scrollSpy;
let myWinHeight = window.innerHeight + 200;

class Vertical extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: false,
            events: ['scroll', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll', 'resize', 'touchmove', 'touchend'],
            winHeight: myWinHeight
        }
    }

    componentDidMount() {
        this._initScene();
        window.addEventListener('resize', this._updateDimensions.bind(this));
    }

    componentWillUnmount () {
        this.state.events.forEach((type) => {
           findDOMNode(this.refs.sceneRef).removeEventListener(type, this._checkSceneVisible.bind(this), false)
        });
        window.removeEventListener('resize', this._updateDimensions.bind(this));
    }

    _updateDimensions() {
        this.setState({winHeight: myWinHeight, winWidth: window.innerWidth})
    }

    _initScene() {
        this._checkSceneVisible();
        this.state.events.forEach((type) => {
           findDOMNode(this.refs.sceneRef).addEventListener(type, this._checkSceneVisible.bind(this), false)
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
        this._visibleY(scene) ? this._onEnterViewport() : this._onLeaveViewport()
    }

    _visibleY(el) {
        let rect = el.rect;

        return (
            rect.top >= 0 &&
            rect.bottom <= this.state.winHeight
        );
    }

    render() {

        if(propsAreValid(this.props.data)) {
            let verticalClass = classNames('scene-vertical', this.props.data.groupIdentifier, this.props.data.sectionIdentifier.toLowerCase());
            let {layout, sectionIdentifier} = this.props.data;
            return (
                <section id={sectionIdentifier} className={verticalClass} name={sectionIdentifier} style={{position: 'relative'}} ref="sceneRef">
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
