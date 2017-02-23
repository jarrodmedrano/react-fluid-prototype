import React from 'react';
import {Link} from 'react-router';
import propsAreValid from '../../lib/util';
import dataPropTypes, {footerPropTypes} from '../../../data/dataProps';
import FooterLink from '../link/FooterLink';

class Footer extends React.Component {
    render() {
        if (propsAreValid(this.props.data.sections)) {
            let sections = this.props.data.sections;
            return (
                <div className="sticky-banner sticky-footer">
                    {sections.map(function (result, id) {
                        //If There is an anchor link and there are more than or equal to 3 sections
                        if (result.anchorLink && sections.length >= 3) {
                            let anchorTarget = result.sectionIdentifier;
                            let anchorGlyph = result.anchorGlyph;
                            let anchorIcon = result.anchorIcon;

                            //If there are are less than or equal to 7 footer links render the links
                            if (id <= 7) {
                                return (
                                    <FooterLink to={anchorTarget} role="button" key={id} icon={anchorIcon ? anchorIcon : null} iconFont={anchorGlyph ? anchorGlyph : null}>{result.anchorTitle}</FooterLink>
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
