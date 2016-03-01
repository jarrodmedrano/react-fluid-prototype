import React from 'react'

var CarouselSlide = React.createClass({
    render() {

      return(
        <li id="hero-slide-one" data-f-theme="dark" className={this.props.myKey === this.props.isActive ? 'f-active': ''}>
          <article className="c-hero f-medium f-x-left f-y-center theme-dark">
            <div>
              <div className="context-accessory">
                <h1 className="c-heading">{this.props.slideTitle}</h1>
                <p className="c-subheading">{this.props.slideSubTitle}</p>


                <div className="hero-link-container">
                  <a href="#" className="c-call-to-action c-glyph"><span>{this.props.slideButton}</span></a>
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
});

export default CarouselSlide