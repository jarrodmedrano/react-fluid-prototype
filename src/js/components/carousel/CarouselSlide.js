import React from 'react'
import classNames from 'classnames'

class CarouselSlide extends React.Component {

    _getActiveSlide() {
      return this.props.myKey === this.props.activeSlide ? 'f-active': ''
    }

    _getSlideDirection() {
      return this.props.slideDirection === 'next' ? 'f-animate-next': 'f-animate-previous'
    }

    render() {

      let slideClass = classNames(this._getActiveSlide(), this._getSlideDirection());

      return(
        <li id="hero-slide-one" data-f-theme="dark" className={slideClass}>
          <article className="c-hero f-x-left f-y-center theme-dark">
            <div>
              <div className="context-accessory">
                <span className="c-heading"><cite>{this.props.slideTitle}</cite></span>
                <p className="c-subheading">{this.props.slideSubTitle}</p>


                <div className="hero-link-container">
                  <a href={this.props.ctaUrl ? this.props.ctaUrl : 'http://www.microsoftstore.com/'} target="_blank" className="c-call-to-action c-glyph"><span>{this.props.slideButton}</span></a>
                </div>
              </div>

            </div>
            <picture>
              <source srcSet={this.props.vp5}
                      media="(min-width:1084px)" />
              <source srcSet={this.props.vp4}
                      media="(min-width:768px)" />
              <source srcSet={this.props.vp3}
                      media="(min-width:540px)" />
              <source
                srcSet={this.props.vp2}
                media="(min-width:0)" />
              <img srcSet={this.props.vp4}
                   src={this.props.vp4}
                   alt={this.props.slideTitle} />
            </picture>
          </article>
        </li>
      )
    }
}

export default CarouselSlide