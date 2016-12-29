import React from 'react'
import classNames from 'classnames';
import Hero from '../hero/Hero';
import Mosaic from '../mosaic/Mosaic';
import CompareTable from '../compare/CompareTable';
import LegacyFeature from '../legacy/legacyFeature';
import LegacyKSP from '../legacy/legacyKsp';
import LegacyCenteredBackdrop from '../legacy/legacycenteredbackdrop';
import propsAreValid from '../../util';
import dataPropTypes, {verticalPropTypes} from '../../../data/dataProps';

class Vertical extends React.Component {
    render() {
        if(propsAreValid(this.props.data)) {
            let verticalClass = classNames('scene-vertical', this.props.data.groupIdentifier, this.props.data.sectionIdentifier.toLowerCase());
            let {layout, ordinal} = this.props.data;
            return (
                <section className={verticalClass} id={ordinal}>
                    {layout === 'hero' || layout === 'immersive-hero' || layout === 'fullscreen' ?
                        <Hero data={this.props.data}/> : null
                    }
                    {layout === 'parallax' ?
                        <Parallax data={this.props.data}/> : null
                    }
                    {/*{layout === 'fullscreen' ?*/}
                    {/*<FullScreen data={this.props.data}/> : null*/}
                    {/*}*/}
                    {layout === 'apps' ?
                        <Apps data={this.props.data}/> : null
                    }
                    {layout === 'config' ?
                        <Config data={this.props.data}/> : null
                    }
                    {layout === 'mosaic' ?
                        <Mosaic data={this.props.data}/> : null
                    }
                    {layout === 'compare' ?
                        <CompareTable data={this.props.data}/> : null
                    }
                    {layout === 'feature' ?
                        <LegacyFeature data={this.props.data}/> : null
                    }
                    {layout === 'featureCta' ?
                        <LegacyFeature data={this.props.data}/> : null
                    }
                    {layout === 'ksp' ?
                        <LegacyKSP data={this.props.data}/> : null
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
                        <LegacyCenteredBackdrop data={this.props.data}/> : null
                    }
                </section>
            )
        } return null
    }
}

Vertical.propTypes = dataPropTypes(verticalPropTypes);

export default Vertical
