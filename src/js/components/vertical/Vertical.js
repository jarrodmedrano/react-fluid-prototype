import React from 'react'
import classNames from 'classnames';
import './vertical.scss!'
import Hero from '../hero/Hero';
import Mosaic from '../mosaic/Mosaic';
import CompareTable from '../compare/CompareTable';
import LegacyFeature from '../legacy/legacyFeature';
import LegacyKSP from '../legacy/legacyksp';
import LegacyCenteredBackdrop from '../legacy/legacycenteredbackdrop';
import propsAreValid, {logError} from '../../lib/util';
import dataPropTypes, {verticalPropTypes} from '../../../data/dataProps';
import _ from 'lodash';

class Vertical extends React.Component {
    
    constructor(props){
        super(props);

        this.state = {
            active: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        //if vertical is scrolled to, set active to true
        nextProps.activeId === this.props.myId ? this.setState({active: true}) : this.setState({active: false});
    }

    render() {
        if(propsAreValid(this.props.data, this)) {
            let active = this.state.active ? 'active' : 'inactive';

            let {layout, sectionIdentifier, readingDirection} = this.props.data;
            let myLayout = typeof layout === 'object' ? layout.type : layout;
            let acceptedLayouts = ['hero', 'immersiveHero', 'fullscreen', 'card', 'mosaic', 'compare', 'feature', 'featureCta', 'ksp', 'ksp_rs', 'ksp_reversed', 'centeredBackdropTemplate'];
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
                                                    active={this.state.active} myId={this.props.myId} /> : null
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
