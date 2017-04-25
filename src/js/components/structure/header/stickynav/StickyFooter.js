import React from 'react';
import propsAreValid from '../../../../lib/util';
import {footerPropTypes} from '../../../../../data/dataProps';
import FooterLink from '../../../generic/link/FooterLink';

class StickyFooter extends React.Component {
    render() {
        if (propsAreValid(this.props.data.sections, this)) {
            let groupIdentifier = this.props.data.groupIdentifier;
            let sections = this.props.data.sections;

            return (
                <footer className="sticky-banner sticky-footer">
                    {sections.map(function (result, id) {
                        //If There is an anchor link and there are more than or equal to 3 sections

                        if (result.anchorLink && sections.length >= 3) {
                            let anchorTarget = result.sectionIdentifier;
                            let anchorGlyph = result.anchorGlyph;
                            let anchorIcon = result.anchorIcon;
;
                            //If there are are less than or equal to 7 footer links render the links
                            if (id <= 7) {
                                return (
                                    <FooterLink to={anchorTarget} role="button" key={id} icon={anchorIcon ? anchorIcon : null} iconFont={anchorGlyph ? anchorGlyph : null} groupIdentifier={groupIdentifier ? groupIdentifier : null} containerId="main">{result.anchorTitle}</FooterLink>
                                )
                            }
                        }
                        return null
                    }, this)
                    }
                </footer>
            )
        }
        return null
    }
}

StickyFooter.propTypes = footerPropTypes;

export default StickyFooter
