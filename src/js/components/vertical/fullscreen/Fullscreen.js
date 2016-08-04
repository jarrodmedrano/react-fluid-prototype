import React from 'react'

class Fullscreen extends React.Component {

    render() {
        return (
            <div>
                <div className="animation-queue-underlay intro-reverse">
                    <section className="module intro-outro-svg ready" data-index="2.0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940 660.1001"
                             id="surface-book-screen-illustration">
                            <defs>
                                <rect id="surface-book-screen-illustration-text-clip-rect" x="40.375" y="524.151" width="859"
                                      height="92.5"></rect>
                            </defs>
                            <clipPath id="surface-book-screen-illustration-text-clip">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                     xlink:href="#surface-book-screen-illustration-text-clip-rect" overflow="visible"></use>
                            </clipPath>
                            <g className="main">
                                <polyline className="draw-in" points="577.527 401.717 899.375 616.336 899.375 43.701 40.875 43.701"
                                          style="stroke-dasharray: 1817.98; stroke-dashoffset: -1817.98;"></polyline>
                                <polyline className="draw-in" points="362.223 258.502 40.375 43.701 40.375 616.701 898.875 616.701"
                                          style="stroke-dasharray: 1817.98; stroke-dashoffset: -1817.98;"></polyline>
                                <rect className="fade-in" x="5.641" y="4.8991" width="929.1426" height="648.8144" rx="17.8135"
                                      ry="17.8135"></rect>
                                <rect className="fade-in" x="0.5" y="0.5" width="939" height="659.1001" rx="21.3762"
                                      ry="21.3762"></rect>
                                <g className="with-slide">
                                    <text className="segoe-ui-light" transform="translate(415.1327 316.543)" font-size="62"
                                          fill="#fff" font-family="Segoe UI">13.5″
                                    </text>
                                    <text transform="translate(388.283 357.8188)" opacity="0.8" font-size="20" fill="#fff"
                                          font-family="Segoe UI">Pi
                                        <tspan x="16.0449" y="0">x</tspan>
                                        <tspan x="25.0684" y="0">elSense™ display</tspan>
                                    </text>
                                </g>
                                <g clip-path="url(#surface-book-screen-illustration-text-clip)">
                                    <g className="pop-in" style="animation-delay: .1s" transform="matrix(1,0,0,1,0,100)">
                                        <text className="segoe-ui-light" transform="translate(132.7556 566.8755)" font-size="34"
                                              fill="#fff" font-family="Segoe UI">3:2
                                            <tspan x="51.8965" y="0" font-size="24">aspect ratio</tspan>
                                        </text>
                                    </g>
                                    <g className="pop-in" style="animation-delay: .2s" transform="matrix(1,0,0,1,0,100)">
                                        <text className="segoe-ui-light" transform="translate(428.9475 566.8755)" font-size="34"
                                              fill="#fff" font-family="Segoe UI">267
                                            <tspan x="61.3096" y="0" font-size="24">PPI</tspan>
                                        </text>
                                    </g>
                                    <g className="pop-in" style="animation-delay: .3s" transform="matrix(1,0,0,1,0,100)">
                                        <text className="segoe-ui-light" transform="translate(663.6355 566.875)" font-size="34"
                                              fill="#fff" font-family="Segoe UI">6
                                            <tspan x="26.8281" y="0" font-size="24">million pixels</tspan>
                                        </text>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </section>
                </div>
                <div className="overlay"></div>
            </div>
        )
    }
}

export default Fullscreen
