import React from 'react';
import {Link} from 'react-router';
import propsAreValid from '../../lib/util';
import dataPropTypes, {footerPropTypes} from '../../../data/dataProps';
import ButtonLink from '../link/ButtonLink';

class Footer extends React.Component {
    render() {
        if (propsAreValid(this.props.data.sections)) {
            let sections = this.props.data.sections;
            return (
                <div className="sticky-banner sticky-footer">
                    {sections.map(function (result, id) {
                        //If There is an anchor link and there are more than 3 sections
                        if (result.anchorLink && sections.length >= 3) {
                            let anchorTarget = result.ordinal;
                            let anchorIconFont = result.anchorIconFont;
                            let anchorIcon = result.anchorIcon;
                            let footerIcon;
                            //If there's no icon glyph, or if there are both icon and icon glyph, use the icon image. Else just use the icon glyph
                            !anchorIconFont || anchorIconFont && anchorIcon ? footerIcon = anchorIcon : footerIcon = anchorIconFont;

                            //If there are are less than 7 footer links render the links
                            if (id <= 7) {
                                return (
                                    <ButtonLink to={anchorTarget} role="button" key={id} icon={footerIcon ? footerIcon : null}>{result.anchorTitle}</ButtonLink>
                                )
                            }
                        }
                        else {
                            //Don't render footer links if there is a legacy template, because the titles are too long
                            if(result.layout === 'feature' || result.layout === 'featureCta' || result.layout === 'ksp' || result.layout === 'centeredBackdropTemplate') {
                                return null
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
