import React from 'react';
import classNames from 'classnames';
import './legacy.scss!';
import Button from '../button/Button';
import sanitizeHtml from 'sanitize-html';
import propsAreValid from '../../lib/util';

class LegacyFeature extends React.Component {

    componentWillReceiveProps(nextProps) {
        this._handleVideo(nextProps.active);
        nextProps.updated === true ? this._resetVideo() : null;
    }

    _cleanHtml(dirty) {
        return sanitizeHtml(dirty, {
            allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'span' ],
            allowedAttributes: {
                'a': [ 'href', 'style' ],
                'span': [ 'style' ],
                'b': [ 'style' ],
                'p': [ 'style' ]
            }
        });
    }
    //TODO: stub out video component
    componentDidMount() {
        this._resetVideo();
    }

    componentWillUnmount() {
        this._resetVideo();
    }

    _handleVideo(play) {
        if(this.refs.vidRef) {
            if(play === true && this.refs.vidRef.paused) {
                this.refs.vidRef.play();
            } else if(play === false && !this.refs.vidRef.paused) {
                this.refs.vidRef.pause();
            }
        }
    }

    _resetVideo() {
        if(this.refs.vidRef) {
            this.refs.vidRef.currentTime = 0;
        }
    }

    render() {
        {/* 
            This component renders both feature and featureCTA
        */ }
        if(propsAreValid(this.props.data, this)) {
            let {style, textSide, header, logo, text1, text2, text3, media, button, legalText, cardButtonBackground} = this.props.data;

            let templateClass = classNames(`f-x-${textSide}`, `f-y-center`, `f-align-${textSide}`, `c-feature`);

            let buttonBG = cardButtonBackground || this.props.brandColor;

            let btnStyle = {
                background: buttonBG,
                color: '#FFF',
                marginLeft: '0',
                marginRight: '0'
            };

            return (
                <div className="m-feature legacy-feature" data-grid="col-12">
                    <div className={templateClass}>
                        {media.blockType === 'gif' ? <picture className="feature-image">
                                <source srcSet={media.src}/>
                                <img srcSet={media.src} src={media.src}/>
                            </picture> : null }
                        {media.blockType === 'img' ? <picture className="feature-image">
                                <source srcSet={media.src}/>
                                <img srcSet={media.src} src={media.src}/>
                            </picture> : null }
                        {media.blockType === 'video' ?
                            <div id="videoPlayer1" className="c-video">
                                <video className="f-video-player" preload="metadata" loop muted
                                       aria-labelledby="videoPlayer1Name" aria-describedby="videoPlayer1Description"
                                       ref="vidRef">
                                    <source src={media.src} type="video/mp4"/>
                                </video>
                                <div className="f-video-cc-overlay" aria-hidden="true"></div>
                            </div>
                            : null}
                        <div>
                            <div>
			                    {logo ? <img className="logo" alt={header} src={logo} /> : null}
                                {header ? <h1 className="c-heading" dangerouslySetInnerHTML={{__html: this._cleanHtml(header)}}/> : null }
                                {text1 ? <p className="c-paragraph-1" dangerouslySetInnerHTML={{__html: this._cleanHtml(text1)}}/> : null }
                                {text2 ? <p className="c-paragraph" dangerouslySetInnerHTML={{__html: this._cleanHtml(text2)}}/> : null }
                                {text3 ? <p className="c-paragraph"
                                            dangerouslySetInnerHTML={{__html: this._cleanHtml(text3)}}/> : null }
                            </div>
                            {button ? <Button data={this.props.data} style={btnStyle}/> : null }
                            {legalText ? <p className="c-paragraph-4"
                                            dangerouslySetInnerHTML={{__html: this._cleanHtml(legalText)}}/> : null }
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default LegacyFeature