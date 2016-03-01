import React from 'react';

var Carousel = React.createClass({



  render(){

    let carousel_style = {
      "touch-action": "pan-y",
      "-webkit-user-select": "none",
      "-webkit-user-drag": "none",
      "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)"
    };

    return(
          <div className="c-carousel f-multi-slide theme-dark f-scrollable-previous f-scrollable-next" role="region"
             aria-label="New Products"
             style={carousel_style}>
          <button className="c-flipper f-left" aria-label="View previous" title="View previous"></button>
          <button className="c-flipper f-right" aria-label="View next" title="View next"></button>
          <div>
            <ul>
              <li id="hero-slide-one" data-f-theme="dark" className="f-active">
                <article className="c-hero f-medium f-x-left f-y-center theme-dark">
                  <div>
                    <div className="context-accessory">
                      <h1 className="c-heading">Tom Clancy's The Division</h1>
                      <p className="c-subheading">Take back New York in Tom Clancy's The Division open beta. Early access
                        available only on Xbox One, February 18th.</p>


                      <div className="hero-link-container">
                        <a href="#" className="c-call-to-action c-glyph"><span>Pre-order today</span></a>
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
              <li id="hero-slide-two" data-f-theme="dark">
                <article className="c-hero f-medium f-x-left f-y-center theme-dark">
                  <div>
                    <div className="context-accessory">
                      <h1 className="c-heading">Excepteur sint occaecat cupidatat</h1>
                      <p className="c-subheading">Sunt in culpa qui officia deserunt mollit anim id est laborum</p>

                      <div>
                        <div className="c-price" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer">
                          <meta itemprop="priceCurrency" content="GMD" />$
                            <span itemprop="price">69,018</span>
                            <link itemprop="availability" href="http://schema.org/InStock" />
                        </div>
                      </div>

                      <div className="hero-link-container">
                        <a href="#" className="c-call-to-action c-glyph"><span>Lorem ipsum dolor sit amet</span></a>
                      </div>
                    </div>

                  </div>
                  <picture>
                    <source srcset="http://www.getmwf.com/images/components/uber-vp5.jpg" media="(min-width:1084px)" />
                      <source srcset="http://www.getmwf.com/images/components/uber-vp4.jpg" media="(min-width:768px)" />
                        <source srcset="http://www.getmwf.com/images/components/uber-vp3.jpg" media="(min-width:540px)" />
                          <source srcset="http://www.getmwf.com/images/components/uber-vp3.jpg" media="(min-width:0)" />
                            <img srcset="http://www.getmwf.com/images/components/uber-vp4.jpg"
                                 src="http://www.getmwf.com/images/components/uber-vp4.jpg" alt="Placeholder" />
                  </picture>
                </article>
              </li>
              <li id="hero-slide-three" data-f-theme="dark">
                <article className="c-hero f-medium f-x-left f-y-center theme-dark">
                  <div>
                    <div className="context-accessory">
                      <h1 className="c-heading">Sed ut perspiciatis unde omnis</h1>
                      <p className="c-subheading">Nemo enim ipsam voluptatem quia voluptas sit aspernatur</p>

                      <div>
                        <div className="c-price" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer">
                          <meta itemprop="priceCurrency" content="AFN" />kr
                            <span itemprop="price">61,628</span>
                            <link itemprop="availability" href="http://schema.org/InStock" />
                        </div>
                      </div>

                      <div className="hero-link-container">
                        <a href="#" className="c-call-to-action c-glyph"><span>Lorem ipsum dolor sit amet</span></a>
                      </div>
                    </div>

                  </div>
                  <picture>
                    <source srcset="http://www.getmwf.com/images/components/martian-hero-background-vp5.jpg"
                            media="(min-width:1084px)" />
                      <source srcset="http://www.getmwf.com/images/components/martian-hero-background-vp4.jpg"
                              media="(min-width:768px)" />
                        <source srcset="http://www.getmwf.com/images/components/martian-hero-background-vp3.jpg"
                                media="(min-width:540px)" />
                          <source srcset="http://www.getmwf.com/images/components/martian-hero-background-vp2.jpg"
                                  media="(min-width:0)" />
                            <img srcset="http://www.getmwf.com/images/components/martian-hero-background-vp4.jpg"
                                 src="http://www.getmwf.com/images/components/martian-hero-background-vp4.jpg"
                                 alt="Martian poster" />
                  </picture>
                </article>
              </li>
            </ul>


          </div>

          <div className="c-sequence-indicator" role="radiogroup">
            <button role="radio" aria-checked="true" aria-label="View slide one" aria-controls="hero-slide-one"
                    title="Slide one"></button>
            <button role="radio" aria-checked="false" aria-label="View slide two" aria-controls="hero-slide-two"
                    title="Slide two"></button>
            <button role="radio" aria-checked="false" aria-label="View slide three" aria-controls="hero-slide-three"
                    title="Slide three"></button>
          </div>
      </div>
    )
  }
});

export default Carousel