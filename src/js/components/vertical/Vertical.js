import React from 'react'
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

    }

    componentDidMount() {
        // let keydown = false;
        //
        // window.addEventListener('keydown', function(e) {
        //     if (e.repeat) { return }
        //     if(e.code === 'PageDown') {
        //         console.log(e);
        //     }
        // });

    }

    componentWillUnmount() {
        // window.removeEventListener('keydown', function(e) {
        //     if (e.repeat) { return }
        // });
    }

    render() {
        if(propsAreValid(this.props.data)) {
            let verticalClass = classNames('scene-vertical', this.props.data.groupIdentifier, this.props.data.sectionIdentifier.toLowerCase());
            let {layout, sectionIdentifier} = this.props.data;
            return (
                <section className={verticalClass} id={sectionIdentifier} name={sectionIdentifier}>
                    {layout === 'hero' || layout === 'immersive-hero' || layout === 'fullscreen' || layout === 'card' ?
                        <Hero data={this.props.data} brandColor={this.props.brandColor ? this.props.brandColor : null} /> : null
                    }
                    {layout === 'mosaic' ?
                        <Mosaic data={this.props.data} brandColor={this.props.brandColor ? this.props.brandColor : null} /> : null
                    }
                    {layout === 'compare' ?
                        <CompareTable data={this.props.data} brandColor={this.props.brandColor ? this.props.brandColor : null} /> : null
                    }
                    {layout === 'feature' ?
                        <LegacyFeature data={this.props.data} brandColor={this.props.brandColor ? this.props.brandColor : null} /> : null
                    }
                    {layout === 'featureCta' ?
                        <LegacyFeature data={this.props.data} brandColor={this.props.brandColor ? this.props.brandColor : null}  /> : null
                    }
                    {layout === 'ksp' ?
                        <LegacyKSP data={this.props.data}  brandColor={this.props.brandColor ? this.props.brandColor : null} /> : null
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
                        <LegacyCenteredBackdrop data={this.props.data} brandColor={this.props.brandColor} /> : null
                    }
                </section>
            )
        } return null
    }
}

Vertical.propTypes = dataPropTypes(verticalPropTypes);

export default Vertical
