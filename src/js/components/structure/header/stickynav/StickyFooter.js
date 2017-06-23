import React from 'react';
import propsAreValid from '../../../../lib/util';
import {footerPropTypes} from '../../../../../data/dataProps';
import FooterLink from '../../../generic/link/FooterLink';
import OverflowButton from './overflowButton/OverflowButton';

const ThisFooterLink = (props) => {
        return (
            <FooterLink to={props.result.sectionIdentifier} role="button" key={props.id}
                        icon={props.result.anchorIcon ? props.result.anchorIcon : null}
                        iconFont={props.result.anchorGlyph ? props.result.anchorGlyph : null}
                        groupIdentifier={props.result.groupIdentifier ? props.result.groupIdentifier : null}
                        containerId="main">{props.result.anchorTitle}</FooterLink>
        )
};

class StickyFooter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorLinks: [],
            overflowLinks: []
        };

        let sections = props.data.sections;
        let anchorLinks = [];
        let overflowLinks = [];

        sections.map(function (result, id) {
            if (id <= 6) {
                anchorLinks.push(result);
            } else {
                if(result.anchorLink) {
                    overflowLinks.push(result);
                }
            }
        }, this);

        this.state = {
            anchorLinks: anchorLinks,
            overflowLinks: overflowLinks
        }
    }

    shouldComponentUpdate(nextProps) {
        if(this.props.orientation !== nextProps.orientation) {
            return true
        }
        return false
    }

    componentWillUpdate(nextProps) {
        if(nextProps.orientation === 'portrait') {
            this.setState({
                collapseLinks: true
            })
        } else {
            this.setState({
                collapseLinks: false
            })
        }
    }

    _renderAnchorLinks() {
        return this.state.anchorLinks.map(function (result, id) {
            //If There is an anchor link and there are more than or equal to 3 sections
            if (result.anchorLink && this.props.data.sections.length >= 3) {
                //If there are are less than or equal to 7 footer links render the links
                if (id <= 6) {
                    return (
                        <ThisFooterLink result={result} key={id} />
                    )
                }
            }
        }, this)
    }

    _renderOverFlowLinks() {
        return this.state.overflowLinks.length ?
            <OverflowButton>
                {this.state.overflowLinks.map(function (result, id) {
                    return (
                        <ThisFooterLink result={result} key={id}/>
                    )
                }, this)}
            </OverflowButton>
            : null
    }

    render() {
        if (propsAreValid(this.props.data.sections, this)) {
            return (
                <footer className="sticky-banner sticky-footer">
                    {this._renderAnchorLinks()}
                    {this._renderOverFlowLinks()}
                </footer>
            )
        }
        return null
    }
}

StickyFooter.propTypes = footerPropTypes;

export default StickyFooter
