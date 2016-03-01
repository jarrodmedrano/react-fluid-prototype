import React from 'react';
import CarouselSlide from 'src/js/components/carousel/carousel-slide.jsx!';

var Carousel = React.createClass({
  getInitialState () {
    return {

      isActive: 0,

      slides: [
        {
          type: "item",
          title: "Tom Clancy's The Division",
          subTitle: "Take back New York in Tom Clancy's The Division open beta. Early access available only on Xbox One, February 18th.",
          buttonText: "Pre-order today",
          vp5: "http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp5.jpg",
          vp4: "http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp4.jpg",
          vp3: "http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp3.jpg",
          vp2: "http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp2.jpg"
        }
      ]
  }
  },

  render(){



    let carousel_style = {
      "TouchAction": "pan-y",
      "WebkitUserSelect": "none",
      "WebkitUserDrag": "none",
      "WebkitTapHighlightColor": "rgba(0, 0, 0, 0)"
    };

    return(
          <div className="c-carousel f-multi-slide theme-dark f-scrollable-previous f-scrollable-next" role="region"
             aria-label="New Products"
             style={carousel_style}>
          <button className="c-flipper f-left" aria-label="View previous" title="View previous"></button>
          <button className="c-flipper f-right" aria-label="View next" title="View next"></button>
          <div>
            <ul>
              {this.state.slides.map(function(result, id) {
                return <CarouselSlide key={result.id} slideTitle={result.title} slideSubTitle={result.subTitle} vp4={result.vp4} vp3={result.vp3} vp2={result.vp2} slideButton={result.buttonText} isActive="f-active" />;
              })}
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