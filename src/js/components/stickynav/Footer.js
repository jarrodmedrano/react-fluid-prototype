import React from 'react';
import {Link} from 'react-router';
import propsAreValid from '../../util';

class Footer extends React.Component {
    _handleClick(anchorTarget, event) {
    }
    render() {
      if(propsAreValid(this.props.data)) {
        return (
            <div className="sticky-banner sticky-footer">
                {this.props.footer.map(function(result, id)  {
                        if(result.anchorLink) {
                            let anchorTarget = '#' + result.title.split(' ').join('-').toLowerCase();

                            return (
                                <a href={anchorTarget} className="c-action-trigger" role="button" key={id} onClick={this._handleClick.bind(this)} onTouchEnd={this._handleClick.bind(this)}>{result.title}</a>
                            )
                        }
                }, this)}
            </div>
        )
      } return null
    }
}

export default Footer
