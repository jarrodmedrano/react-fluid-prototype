import React from 'react'
import classNames from 'classnames';
import Hero from '../hero/Hero';
import Mosaic from '../mosaic/Mosaic';
import CompareTable from '../compare/CompareTable';
import LegacyFeature from '../legacy/legacyFeature';
import LegacyKSP from '../legacy/legacyKsp';
import LegacyCenteredBackdrop from '../legacy/legacycenteredbackdrop';
import propsAreValid from '../../lib/util';
import dataPropTypes, {verticalPropTypes} from '../../../data/dataProps';
import {Link, Element, Events, scroll, scrollSpy} from '../../lib/scroll';

class Vertical extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            active: false
        }
    }

    componentDidMount() {
        Events.scrollEvent.register('begin', function(to, element) {
            // console.log("begin", to, arguments);
            Vertical._deactivateScroll();
        });
        Events.scrollEvent.register('end', function(to, element) {
            // console.log("end", to, this);
            Vertical._handleScroll();
        });
        scrollSpy.update();
    }

    componentWillUnmount() {
        Events.scrollEvent.remove('begin');
        Events.scrollEvent.remove('end');
    }

    static _deactivateScroll() {
        Vertical.state = {
            active: false
        };
    }

    static _handleScroll() {
        Vertical.state = {
            active: true
        };
    }

    render() {
        if(propsAreValid(this.props.data)) {
            let verticalClass = classNames('scene-vertical', this.props.data.groupIdentifier, this.props.data.sectionIdentifier.toLowerCase());
            let {layout, ordinal} = this.props.data;
            return (
                <section className={verticalClass} id={ordinal} name={ordinal} ref="vertical">
                    {layout === 'hero' || layout === 'immersive-hero' || layout === 'fullscreen' ?
                        <Hero data={this.props.data} active={this.state.active} /> : null
                    }
                    {layout === 'parallax' ?
                        <Parallax data={this.props.data} active={this.state.active} /> : null
                    }
                    {layout === 'apps' ?
                        <Apps data={this.props.data} active={this.state.active} /> : null
                    }
                    {layout === 'mosaic' ?
                        <Mosaic data={this.props.data} active={this.state.active} /> : null
                    }
                    {layout === 'compare' ?
                        <CompareTable data={this.props.data} active={this.state.active} /> : null
                    }
                    {layout === 'feature' ?
                        <LegacyFeature data={this.props.data}  active={this.state.active} /> : null
                    }
                    {layout === 'featureCta' ?
                        <LegacyFeature data={this.props.data}  active={this.state.active} /> : null
                    }
                    {layout === 'ksp' ?
                        <LegacyKSP data={this.props.data}  active={this.state.active} /> : null
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
                        <LegacyCenteredBackdrop data={this.props.data} active={this.state.active}/> : null
                    }
                </section>
            )
        } return null
    }
}

Vertical.propTypes = dataPropTypes(verticalPropTypes);

export default Vertical
