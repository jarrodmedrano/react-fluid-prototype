//! Copyright (C) Microsoft Corporation. All rights reserved.

import React from 'react'
import './scene-config.scss'

class Config extends React.Component {

    render() {
        return (
            <div>
                <div className="config-title">
                    <h2 className="c-heading-3 header-offset">Compare Models</h2>
                    <div className="title-border"></div>
                    <h6 className="c-paragraph-1">&nbsp;</h6>
                </div>
                <div className="configs">
                    <div className="config-card text-center">
                        <div className="config-top">
                            <ul className="c-list">
                                <li className="glyph-cpu mdl-glyph">Intel Core i5</li>
                                <li className="glyph-drive mdl-glyph">Storage: 128 GB</li>
                                <li className="glyph-ram mdl-glyph">Memory: 8 GB</li>
                            </ul>
                        </div>
                        <div className="config-wrapper">
                            <div className="content-section">
                                <div className="content">
                                    <h5 className="price c-heading-3">$1,499</h5>
                                </div>
                            </div>
                            <div className="content-section">
                                <div className="content">
                                    <p className="c-paragraph-4">The light and casual browsing<br/> laptop which is also
                                        student<br/>
                                        friendly.</p>
                                </div>
                            </div>
                            <div className="content-section" >
                                <div className="content">
                                    <ul className="c-list">
                                        <li>Light online browsing</li>
                                        <li>Send emails</li>
                                        <li>Check mail</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="config-card text-center">

                        <div className="config-top">
                            <ul className="c-list">
                                <li className="glyph-cpu mdl-glyph">Intel Core i5</li>
                                <li className="glyph-drive mdl-glyph">Storage: 256 GB</li>
                                <li className="glyph-ram mdl-glyph">Memory: 8 GB</li>
                            </ul>
                        </div>
                        <div className="config-wrapper">
                            <div className="content-section">
                                <div className="content">
                                    <h5 className="price c-heading-3">$1,699</h5>
                                </div>
                            </div>
                            <div className="content-section">
                                <div className="content">
                                    <p className="c-paragraph-4">The ideal laptop for general<br/> browsing and emails.
                                    </p>
                                </div>
                            </div>
                            <div className="content-section">
                                <div className="content">
                                    <ul className="c-list">
                                        <li>General online browsing</li>
                                        <li>Send emails</li>
                                        <li>View photos</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="config-card text-center selected">
                        <div className="device-spec">
                            <span className="c-paragraph-4">This device</span>
                        </div>
                        <div className="config-top">
                            <ul className="c-list">
                                <li className="glyph-cpu mdl-glyph">Intel Core i5</li>
                                <li className="glyph-drive mdl-glyph">Storage: 256 GB</li>
                                <li className="glyph-ram mdl-glyph">Memory: 8 GB + dGPU</li>
                            </ul>
                        </div>
                        <div className="config-wrapper">
                            <div className="content-section">
                                <div className="content">
                                    <h5 className="price c-heading-3">$1,899</h5>
                                    <h5 className="c-heading-5">If
                                        you're looking
                                        for</h5>
                                </div>
                            </div>
                            <div className="content-section">
                                <div className="content">
                                    <p className="c-paragraph-4">The perfect laptop for editing<br/> photos and gaming.
                                    </p>
                                    <h5 className="c-heading-5">If you're looking
                                        to:</h5>
                                </div>
                            </div>
                            <div className="content-section" >
                                <div className="content">
                                    <ul className="c-list">
                                        <li>Medium online browsing</li>
                                        <li>Stream photos and music</li>
                                        <li>Edit photos</li>
                                        <li>Do some gaming</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="config-card text-center">

                        <div className="config-top">
                            <ul className="c-list">
                                <li className="glyph-cpu mdl-glyph">Intel Core i7</li>
                                <li className="glyph-drive mdl-glyph">Storage: 256 GB</li>
                                <li className="glyph-ram mdl-glyph">Memory: 8 GB + dGPU</li>
                            </ul>
                        </div>
                        <div className="config-wrapper">
                            <div className="content-section">
                                <div className="content">
                                    <h5 className="price c-heading-3">$2,099</h5>
                                </div>
                            </div>
                            <div className="content-section">
                                <div className="content">
                                    <p className="c-paragraph-4">The laptop for larger photos,<br/> larger apps and
                                        bigger gaming.</p>
                                </div>
                            </div>
                            <div className="content-section">
                                <div className="content">
                                    <ul className="c-list">
                                        <li>Heavy online browsing</li>
                                        <li>Send large emails and<br/> attachments</li>
                                        <li>Edit photos and videos</li>
                                        <li>Do some gaming</li>
                                        <li>Use creative programs</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="config-card text-center">
                        <div className="config-top">
                            <ul className="c-list">
                                <li className="glyph-cpu mdl-glyph">Intel Core i7</li>
                                <li className="glyph-drive mdl-glyph">Storage: 512 GB</li>
                                <li className="glyph-ram mdl-glyph">Memory: 16 GB + dGPU</li>
                            </ul>
                        </div>
                        <div className="config-wrapper">
                            <div className="content-section">
                                <div className="content">
                                    <h5 className="price c-heading-3">$2,699</h5>
                                </div>
                            </div>
                            <div className="content-section">
                                <div className="content">
                                    <p className="c-paragraph-4">The ultimate in performance and versatility for
                                        professionals, creators, and more.</p>
                                </div>
                            </div>
                            <div className="content-section">
                                <div className="content">
                                    <ul className="c-list">
                                        <li>Stream photos and music</li>
                                        <li>Edit photos and videos</li>
                                        <li>Do some gaming</li>
                                        <li>Use creative programs</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="config-card text-center">
                        <div className="config-top">
                            <ul className="c-list">
                                <li className="glyph-cpu mdl-glyph">Intel Core i7</li>
                                <li className="glyph-drive mdl-glyph">Storage: 1 TB</li>
                                <li className="glyph-ram mdl-glyph">Memory: 16 GB + dGPU</li>
                            </ul>
                        </div>
                        <div className="config-wrapper">
                            <div className="content-section">
                                <div className="content">
                                    <h5 className="price c-heading-3">$3,199</h5>
                                </div>
                            </div>
                            <div className="content-section">
                                <div className="content">
                                    <p className="c-paragraph-4">The most powerful laptop - the work and play PC.</p>
                                </div>
                            </div>
                            <div className="content-section">
                                <div className="content">
                                    <ul className="c-list">
                                        <li>Stream large photos and music</li>
                                        <li>Play games</li>
                                        <li>Use multiple programs at one time</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Config
