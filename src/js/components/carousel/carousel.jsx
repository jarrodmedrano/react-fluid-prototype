import React from 'react';
import CarouselSlide from 'src/js/components/carousel/CarouselSlide.jsx!';
import SequenceIndicator from 'src/js/components/carousel/SequenceIndicator.jsx!';
var Carousel = React.createClass({
  getInitialState () {
    return {

      activeSlide: 0,

      slideDirection: 'next',

      slides: [
        {
          id: 0,
          type: "item",
          title: "Tom Clancy's The Division",
          subTitle: "Take back New York in Tom Clancy's The Division open beta. Early access available only on Xbox One, February 18th.",
          buttonText: "Pre-order today",
          vp5: "http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp5.jpg",
          vp4: "http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp4.jpg",
          vp3: "http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp3.jpg",
          vp2: "http://c2278.paas2.tx.modxcloud.com/images/components/division-hero-background-vp2.jpg"
        },
        {
          id: 1,
          type: "item",
          title: "Excepteur sint occaecat cupidatat",
          subTitle: "Sunt in culpa qui officia deserunt mollit anim id est laborum",
          buttonText: "Pre-order today",
          vp5: "http://www.getmwf.com/images/components/uber-vp5.jpg",
          vp4: "http://www.getmwf.com/images/components/uber-vp4.jpg",
          vp3: "http://www.getmwf.com/images/components/uber-vp3.jpg",
          vp2: "http://www.getmwf.com/images/components/uber-vp3.jpg"
        },
        {
          id: 2,
          type: "item",
          title: "Excepteur sint occaecat cupidatat",
          subTitle: "Sunt in culpa qui officia deserunt mollit anim id est laborum",
          buttonText: "Pre-order today",
          vp5: "http://www.getmwf.com/images/components/martian-hero-background-vp5.jpg",
          vp4: "http://www.getmwf.com/images/components/martian-hero-background-vp4.jpg",
          vp3: "http://www.getmwf.com/images/components/martian-hero-background-vp3.jpg",
          vp2: "http://www.getmwf.com/images/components/martian-hero-background-vp2.jpg"
        }
      ]
    }
  },
  updateSlide(index) {
    this.setState({ activeSlide: index });
  },

  nextSlide(index, dir) {
    console.log(this.state.slides.length);

    if(this.state.activeSlide < this.state.slides.length-1 && dir === 'next') {
      this.setState({ activeSlide: index + 1 });
    } else if(this.state.activeSlide === this.state.slides.length-1 && dir === 'next') {
      this.setState({ activeSlide: 0 });
    }

    if(this.state.activeSlide > 0 && dir === 'previous') {
      this.setState({ activeSlide: index - 1 });
    } else if(this.state.activeSlide === 0 && dir === 'previous') {
      this.setState({ activeSlide: this.state.slides.length-1 });
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
          <button onClick={() => this.nextSlide(this.state.activeSlide, 'previous')} className="c-flipper f-left" aria-label="View previous" title="View previous"></button>
          <button onClick={() => this.nextSlide(this.state.activeSlide, 'next')} className="c-flipper f-right" aria-label="View next" title="View next"></button>
          <div>
            <ul>
              {this.state.slides.map(function(result, id) {
                return (
                  <CarouselSlide
                      key={result.id}
                      slideTitle={result.title}
                      slideSubTitle={result.subTitle}
                      vp4={result.vp4}
                      vp3={result.vp3}
                      vp2={result.vp2}
                      slideButton={result.buttonText}
                      activeSlide={this.state.activeSlide}
                      myKey={id}
                      slideDirection={this.state.slideDirection}
                  />
                    )
              }, this)}
            </ul>
          </div>

          <div className="c-sequence-indicator" role="radiogroup">

            {this.state.slides.map(function(result, id) {
                return (
                <SequenceIndicator
                    key={result.id}
                    slideTitle={result.title}
                    activeSlide={this.state.activeSlide}
                    myKey={id}
                    updateSlide={this.updateSlide}
                />
                    )
            }, this)}

          </div>
      </div>
    )
  }
});

export default Carousel