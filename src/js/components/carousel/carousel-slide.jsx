import React from 'react'

var CarouselSlide = React.createClass({
    render() {

      return(
        <li id="hero-slide-one" data-f-theme="dark" className={this.props.isActive}>
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
              <source srcset="http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp5.jpg"
                      media="(min-width:1084px)" />
              <source srcset="http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp4.jpg"
                      media="(min-width:768px)" />
              <source srcset="http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp3.jpg"
                      media="(min-width:540px)" />
              <source
                srcset="http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp2.jpg"
                media="(min-width:0)" />
              <img srcset="http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp4.jpg"
                   src="http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp4.jpg"
                   alt="Tom Clancy's The Division" />
            </picture>
          </article>
        </li>
      )
    }
});

export default CarouselSlide