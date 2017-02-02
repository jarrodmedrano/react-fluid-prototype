import React from 'react';
import {Link} from 'react-router';
import propsAreValid from '../../lib/util';
import dataPropTypes, {footerPropTypes} from '../../../data/dataProps';
import ButtonLink from '../link/ButtonLink';

class Footer extends React.Component {

    render() {
        if (propsAreValid(this.props.data)) {
            let sections = this.props.data;
            return (
                <div className="sticky-banner sticky-footer">
                    {sections.map(function (result, id) {
                        if (result.anchorLink && sections.length >= 3) {
                            let anchorTarget = result.ordinal;
                            if (id <= 7) {
                                return (
                                    <ButtonLink to={anchorTarget} role="button"
                                                key={id}>{result.anchorTitle}</ButtonLink>
                                )
                            }
                        }
                        else {
                            if(result.layout === 'feature' || result.layout === 'featureCta' || result.layout === 'ksp' || result.layout === 'centeredBackdropTemplate') {
                                let anchorTarget = result.ordinal;
                                return (
                                    <ButtonLink to={anchorTarget} role="button"
                                                key={id}>{result.header}</ButtonLink>
                                )
                            }
                        }
                    }, this)}
                </div>
            )
        }
        return null
    }
}

Footer.propTypes = footerPropTypes;

export default Footer
