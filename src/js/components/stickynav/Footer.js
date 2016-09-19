import React from 'react'

class Footer extends React.Component {




    _handleClick(anchorTarget, event) {

        event.preventDefault();

        let args = {
            contentX: anchorTarget.offsetLeft + anchorTarget.offsetWidth/2,
            contentY: anchorTarget.offsetTop + anchorTarget.offsetHeight/2,
            scaleFactor: 2.0
        };

        anchorTarget.msZoomTo(args);
    }

    render() {

        return (
            <div className="sticky-banner sticky-footer">
                {this.props.footer ?
                    this.props.footer.map(function(result, id)  {
                        if(result.anchorLink) {
                            let anchorTarget = '#' + result.title.split(' ').join('-').toLowerCase();

                            return (
                                <a href={anchorTarget} className="c-action-trigger" role="button" key={id} onClick={this._handleClick.bind(this)} onTouchEnd={this._handleClick.bind(this)}>{result.title}</a>
                            )
                        }
                    }, this)
                    : null
                }
            </div>
        )
    }
}

export default Footer