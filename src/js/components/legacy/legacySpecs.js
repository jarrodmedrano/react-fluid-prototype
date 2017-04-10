import React from 'react';
import sanitizeHtml from 'sanitize-html';
import propsAreValid from '../../lib/util';
import classNames from 'classnames';
import _ from 'lodash';

class LegacySpecs extends React.Component {
    constructor(props) {
        super(props);

        //TODO: this is a roundabout way of getting this
        let retailInfo = _.reduce(props.data, (result, specsValue, specsKey) => {
            if(_.startsWith(specsValue, 'RetailInfo.')) {
                let specsString =  specsValue.substring(11, specsValue.length);
                _.each(props.deviceInfo, (deviceValue, deviceKey) => {
                    if (deviceKey === specsString) {
                        result[specsKey] = deviceValue;
                    }
                })
            } else {
                result[specsKey] = specsValue
            }
            return result;
        }, {});

        let dataMap = _.values([
                [props.data["1-1-lead"], retailInfo["1-1-text"]],
                [props.data["1-2-lead"], retailInfo["1-2-text"]],
                [props.data["2-1-lead"], retailInfo["2-1-text"]],
                [props.data["2-2-lead"], retailInfo["2-2-text"]],
                [props.data["3-1-lead"], retailInfo["3-1-text"]],
                [props.data["3-2-lead"], retailInfo["3-2-text"]]
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
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'span', 'br', 'sup'],
            allowedAttributes: {
                'a': ['href', 'style'],
                'span': ['style'],
                'b': ['style'],
                'p': ['style']
            }
        });
    }

    _getResult(result, id) {
        let myClass;
        //add a different class for odd numbered ones
        if(id % 2) {
            myClass = classNames('text-title spec');
        } else {
            myClass = classNames('text-base label');
        }
        if(result) {
            return <span key={id} className={myClass} dangerouslySetInnerHTML={{__html: this._cleanHtml(result)}} />
        }
    }

    render() {
        if (propsAreValid(this.props.data, this)) {
            let {logo, legalText} = this.props.data;

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
                                            <li key={id}>
                                                {result.map(function (result, id) {
                                                    return (
                                                        this._getResult(result, id)
                                                    )
                                                }, this)}
                                            </li>
                                        )
                                    }, this)}
                                </ul>
                            </div>
                            <div className="text-legal">{legalText}</div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default LegacySpecs;