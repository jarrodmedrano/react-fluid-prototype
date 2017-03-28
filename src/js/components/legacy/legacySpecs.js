import React from 'react';
import './legacy.scss!';
import sanitizeHtml from 'sanitize-html';
import propsAreValid from '../../lib/util';
import _ from 'lodash';

class LegacySpecs extends React.Component {
    constructor(props) {
        super(props);

        let dataMap = _.values([
                [props.data["1-1-lead"], props.data["1-1-text"]],
                [props.data["1-2-lead"], props.data["1-2-text"]],
                [props.data["2-1-lead"], props.data["2-1-text"]],
                [props.data["2-2-lead"], props.data["2-2-text"]],
                [props.data["3-1-lead"], props.data["3-1-text"]],
                [props.data["3-2-lead"], props.data["3-2-text"]]
            ]
        );

        let headerStyle = {
            color: props.brandColor
        };

        this.state = {
            dataMap: dataMap,
            headerStyle: headerStyle
        }
    }

    _cleanHtml(dirty) {
        return sanitizeHtml(dirty, {
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'span', 'br'],
            allowedAttributes: {
                'a': ['href', 'style'],
                'span': ['style'],
                'b': ['style'],
                'p': ['style']
            }
        });
    }

    render() {
        if (propsAreValid(this.props.data, this)) {
            let {logo, textSide} = this.props.data;

            return (
                <div className="template-contentCard m-feature legacy-feature layout-specifications" data-grid="col-12">
                    <div className="f-y-center f-align-left c-feature">
                        <div className="content legacy-specs">
                            {logo ? <img className="logo c-image" alt="Incredibly smart" src={logo}/> : null}

                            <h1 className="c-heading c-logo" style={this.state.headerStyle}>
                                Specifications</h1>
                            <br />
                            <div className="card-content">
                                <ul>
                                    {this.state.dataMap.map(function (result, id) {
                                        return (
                                            result ?
                                            <li key={id}>
                                                {result.map(function (result, id) {
                                                    return (
                                                        //add a different class for odd numbered ones
                                                        !id % 2 && result ?
                                                            <span key={id}
                                                                  className="text-base label" dangerouslySetInnerHTML={{__html: this._cleanHtml(result)}} />
                                                            : result ?
                                                            <span key={id}
                                                                  className="text-title spec" dangerouslySetInnerHTML={{__html: this._cleanHtml(result)}} />
                                                            : null
                                                    )
                                                }, this)}
                                            </li> : null
                                        )
                                    }, this)}
                                </ul>
                            </div>
                            <div className="text-legal">{textSide}</div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default LegacySpecs;