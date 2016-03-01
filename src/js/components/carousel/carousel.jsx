import React from 'react';
import CarouselSlide from 'src/js/components/carousel/carousel-slide.jsx!';

var Carousel = React.createClass({

  render(){

    var slides = [
      {
        type: "item",
        title: "Tom Clancy's The Division",
        subtitle: "Take back New York in Tom Clancy's The Division open beta. Early access available only on Xbox One, February 18th.",
        buttonText: "Pre-order today",
        bg: "url(img/slide-christmas.jpg)"
      },
      {
        type: "item",
        title: "Guided Stories",
        text: "Lorem ipsum dolor sit amet adipscing elit, lorem ipsum",
        buttonText: "Try it out",
        bg: "#7DA5AF",
        icon: "img/slide-logo.png"
      },
      {
        type: "item",
        title: "Start the school year right with up to $150 off select Surface Pro 4 models",
        buttonText: "Shop Now",
        bg: "url(img/slide-surface.jpg)"
      },
      {
        type: "item",
        title: "Learn how to draw in Windows 10 with Edge and OneNote",
        buttonText: "Reserve now",
        bg: "url(img/slide-store.jpg)"
      }
    ];
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
              <CarouselSlide isActive="f-active" />
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