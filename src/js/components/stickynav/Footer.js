import React from 'react';
import {Link} from 'react-router';
import propsAreValid from '../../util';
import dataPropTypes, {footerPropTypes} from '../../../data/dataProps';

class Footer extends React.Component {
    _handleClick(anchorTarget, event) {
    }
    render() {
      if(propsAreValid(this.props.data)) {
        let footer = this.props.data;
        return (
            <div className="sticky-banner sticky-footer">
                {footer.map(function(result, id)  {
                        if(result.anchorLink) {
                            let anchorTarget = result.ordinal;
                            return (
                                <Link to={anchorTarget} className="c-action-trigger" activeClassName="active" role="button" key={id} onClick={this._handleClick.bind(this)} onTouchEnd={this._handleClick.bind(this)}>{result.anchorTitle}</Link>
                            )
                        }
                }, this)}
            </div>
        )
      } return null
    }
}

Footer.propTypes = footerPropTypes;

export default Footer
