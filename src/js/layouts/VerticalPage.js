import React from 'react'
import { findDOMNode } from 'react-dom'
// import '../../styles/ms-mwf/mwf/core/styles/_mwf_dependencies.scss!';
// import '../../styles/mwf-west-european-default.min.css!';
// import '../../styles/mwf-ie9-west-european-default.min.css!';
import '../../styles/main.scss!';
import dataPropTypes, {verticalPagePropTypes} from '../../data/dataProps';
import propsAreValid, {impressionEvent, navigateEvent} from '../lib/util';
import Vertical from '../components/vertical/Vertical';
import StickyBanner from '../components/stickynav/StickyBanner';
import Tabs from '../components/tabs/Tabs';
import StickyFooter from '../components/stickynav/StickyFooter';
import Price from '../components/price/Price';
import DownArrow from '../components/downarrow/DownArrow';
import Button from '../components/button/Button';
import _ from 'lodash';
import keydown from 'react-keydown';
import Element from '../components/scrollElement/Element';
//import Scroll  from 'react-scroll';
// let scroller = Scroll.scroller;
let myWinHeight = window.innerHeight + 200;

class VerticalPage extends React.Component {
    constructor(props) {
        super(props);

        let title = this.props.route.title;

        //Find the title of the group and if it's the same title as the route, that's the current page
        let currentPage = this._getCurrentPage();

        let currentBrandColor = currentPage.brand.color,
            currentPaths = _.map(this.props.routes[0].childRoutes, 'path'),
            currentId,
            currentSections = currentPage.sections,
            currentSectionClass = `${title}-section-`;

        //TODO: get array of paths from routes without mutations
        //tack index path onto the currentPaths array. kind of a hack.
        currentPaths.unshift('/');

        //if current page is homepage, set current id to 0, else find the index of the current title
        if(this.props.location.pathname === '/') {
            currentId = currentPaths.indexOf('/')
        } else {
            currentId = currentPaths.indexOf(title)
        }

        //set Current page in the state
        this.state = {
            currentPage: currentPage,
            currentBrandColor: currentBrandColor,
            currentSections: currentSections,
            currentPaths: currentPaths,
            currentId: currentId,
            currentPath: currentPaths[currentId],
            currentSection: 0,
            currentSectionClass: currentSectionClass,
            currentTitle: title,
            events: ['scroll', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll', 'resize', 'touchmove', 'touchend'],
            winHeight: myWinHeight
        };

        this._getCurrentPage = this._getCurrentPage.bind(this);
        this._updateDimensions = _.debounce(this._updateDimensions, 1000);
        this._checkSceneVisible = _.debounce(this._checkSceneVisible, 200);
    }

    componentDidMount() {
        this._checkSceneVisible();

        this.state.events.forEach((type) => {
            window.addEventListener(type, this._checkSceneVisible.bind(this), false)
        });
        window.addEventListener('resize', this._updateDimensions.bind(this));
    }

    componentWillUnmount() {
        this.state.events.forEach((type) => {
            window.removeEventListener(type, this._checkSceneVisible.bind(this), false)
        });
        window.removeEventListener('resize', this._updateDimensions.bind(this));
    }

    @keydown('cmd+right', 'ctrl+right')
    _handleNextGroup(e) {
        e.preventDefault();
        let currentId = this.state.currentId,
            paths = this.state.currentPaths,
            nextPath = paths[currentId + 1],
            firstPath = paths[0];
        //if we are not on the last id
        if (currentId < paths.length - 1) {
            this._goNextGroup('forward', nextPath, 'ctrl+right');
        } else {
            this._goNextGroup('first', firstPath, 'ctrl+right');
        }
    }

    @keydown('cmd+left', 'ctrl+left')
    _handlePrevGroup(e) {
        e.preventDefault();
        let currentId = this.state.currentId,
            paths = this.state.currentPaths,
            lastPath = paths[paths.length - 1],
            nextPath = paths[currentId - 1];

        if (currentId > 0 && currentId < paths.length) {
            this._goNextGroup('back', nextPath, 'ctrl+left');
        } else {
            this._goNextGroup('last', lastPath, 'ctrl+left');
        }
    }

    @keydown('cmd+down', 'ctrl+down')
    _handleNextSection(e) {
        e.preventDefault();
        if (this.state.currentSection + 1 < this.state.currentSections.length) {
            this._goNextSection('ctrl+down');
        } else {
            return false
        }
    }

    @keydown('cmd+up', 'ctrl+up')
    _handlePrevSection(e) {
        e.preventDefault();
        if (this.state.currentSection - 1 >= 0) {
            this._goPrevSection('ctrl+up');
        } else {
            return false
        }
    }

    @keydown('alt+0', 'alt+1', 'alt+2', 'alt+3', 'alt+4', 'alt+5', 'alt+6', 'alt+7', 'alt+8', 'alt+9')
    _teleportSection(e) {
        e.preventDefault();
        let sectionKeys = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];

        sectionKeys.map(function (result, id) {
            if (id < this.state.currentSections.length && e.which === result) {
                let ref = findDOMNode(this.refs[`${this.props.route.title}-section-${id}`]);
                window.scrollTo(0, ref.offsetTop);
                // return scroller.scrollTo(`${this.state.currentTitle}-section-${id}`);
            }
        }, this);
    }

    _getCurrentPage() {
        let {groups} = this.props.data;
        let title = this.props.route.title;
        //if the title of the route matches the title of the group, that is the current page.
        return _.find(groups, function (result) {
            return result.groupIdentifier === title
        });
    }

    _goNextGroup(dir, path, source) {
        let callBack = (currentId) => {
            this.props.history.push(path);
            navigateEvent(this.state.currentPaths[currentId], this.props.data.groups[currentId].sections[0].sectionIdentifier, source);
        };

        dir === 'forward' ? this.setState({currentId: this.state.currentId += 1},
            callBack(this.state.currentId)
        ) :
        dir === 'back' ? this.setState({currentId: this.state.currentId -= 1},
            callBack(this.state.currentId)
        ) :
        dir === 'first' ? this.setState({currentId: 0},
            callBack(0)
        ) :
        dir === 'last' ? this.setState({currentId: this.state.currentPaths.length - 1},
           callBack(this.state.currentPaths.length - 1)
        ) : null
    }

    _handleDownArrow(e) {
        e.preventDefault();
        //if current section plus one is less than the total sections, go down
        if (this.state.currentSection + 1 < this.state.currentSections.length) {
            this._goNextSection('down arrow');
            //if on the last section, go to the top.
        } else {
            this._goTop('down arrow');
        }
    }

    _goNextSection(source) {
        let callBack = (currentSection) => {
            let ref = findDOMNode(this.refs[`${this.props.route.title}-section-${currentSection}`]);
            window.scrollTo(0, ref.offsetTop);
            navigateEvent(this.state.currentPage.groupIdentifier, this.state.currentSections[currentSection].sectionIdentifier, source);
        };

        this.setState({currentSection: this.state.currentSection += 1},
            callBack(this.state.currentSection)
        // window.scrollTo(0, findDOMNode(this.refs[0]))
            // scroller.scrollTo(`${this.state.currentTitle}-section-${this.state.currentSection}`)
        );
    }

    _goPrevSection(source) {
        let callBack = (currentSection) => {
            let ref = findDOMNode(this.refs[`${this.props.route.title}-section-${currentSection}`]);
            navigateEvent(this.state.currentPage.groupIdentifier, this.state.currentSections[currentSection].sectionIdentifier, source);
            window.scrollTo(0, ref.offsetTop)
        };

        this.setState({currentSection: this.state.currentSection -= 1},
            callBack(this.state.currentSection)
            //window.scrollTo(0, findDOMNode(this.refs[0]))
            // scroller.scrollTo(`${this.state.currentTitle}-section-${this.state.currentSection}`)
        );
    }

    _goTop(source) {
        let callBack = (currentSection) => {
            let ref = findDOMNode(this.refs[`${this.props.route.title}-section-${currentSection}`]);
            navigateEvent(this.state.currentPage.groupIdentifier, this.state.currentSections[currentSection].sectionIdentifier, source);
            window.scrollTo(0, ref.offsetTop)
        };

        this.setState({currentSection: 0}, callBack(0));

        //scroller.scrollTo(`${this.state.currentTitle}-section-0`);
    }

    _updateDimensions() {
        this.setState({winHeight: window.innerHeight + 200, winWidth: window.innerWidth})
    };
    //TODO get section id data in a cleaner way
    _onEnterViewport(scene) {
        this.setState({currentSection: scene.props.itemRef},
        impressionEvent(true, this.props.data.groups[this.state.currentId].groupIdentifier, this.props.data.groups[this.state.currentId].sections[scene.props.itemRef].sectionIdentifier));
    }

    _onLeaveViewport(scene) {
        impressionEvent(false, this.props.data.groups[this.state.currentId].groupIdentifier, this.props.data.groups[this.state.currentId].sections[scene.props.itemRef].sectionIdentifier)
    }

    _checkSceneVisible() {
        //map through all refs and check if element is visible in the viewport
        let refs = _.map(this.refs);
        refs.map(function(result) {
            result.rect = findDOMNode(result).getBoundingClientRect();
            this._visibleY(result) ? this._onEnterViewport(result) : this._onLeaveViewport(result);
        }, this);
    }

    _visibleY(el) {
        let rect = el.rect;
        return (
            rect.top >= 0 &&
            rect.bottom <= this.state.winHeight &&
            (rect.height + rect.top) < this.state.winHeight
        );
    }

    render() {
        if (propsAreValid(this.props.data, this)) {
            let {groups} = this.props.data;

            let oemGroup = _.find(groups, function (result) {
                if (result.groupIdentifier === 'oem') {
                    return result
                }
            });

            let compareModels;

            if(oemGroup) {
                compareModels = _.find(oemGroup.sections, function (result) {
                    if (result.sectionIdentifier === 'Compare') {
                        return result
                    }
                });
            }

            let retailerGroup = _.find(groups, function (result) {
                if (result.groupIdentifier === 'retailer') {
                    return result
                }
            });

            //Find out if there are legacy layouts in this page (or not)
            let legacyLayouts = !!_.find(this.state.currentSections, function(result) {
                return _.includes(result.layout, 'feature', 'featureCta', 'ksp', 'centeredBackdropTemplate', 'threeColSpecs')
            });

            return (
                <div>
                    {groups.length > 1 ? <Tabs data={this.props.data} {...this.props} /> : null }
                    {oemGroup && compareModels ?
                        <StickyBanner data={oemGroup}>
                            {oemGroup.brand.price ?
                                <Price data={oemGroup.brand.price}/> 
                            : null }
                            
                            {retailerGroup && retailerGroup.brand && retailerGroup.brand.button ?
                                <Button data={retailerGroup.brand.button} />
                            : null }
                        </StickyBanner> 
                    : null }

                    <main id="main">
                        {this.state.currentPage.sections ?
                            this.state.currentPage.sections.map(function (result, id) {
                                return (
                                    <Element name={this.state.currentSectionClass + id} key={id} ref={`${this.props.route.title}-section-${id}`} itemRef={id}>
                                        <Vertical data={result} brandColor={this.state.currentBrandColor} activeId={this.state.currentSection} myId={id} />
                                    </Element>
                                )
                            }, this)
                            : null
                        }
                    </main>
                    {/*
                        if there aren't any legacy layouts, render the new footer style, else render the down arrow
                    */}
                    {this.state.currentPage.sections && !legacyLayouts ? <StickyFooter data={this.state.currentPage} /> : <DownArrow data={this.state.currentPage} onClick={(event)=> this._handleDownArrow(event)} />}
                </div>
            )
        }
    }
}

VerticalPage.propTypes = dataPropTypes(verticalPagePropTypes);

export default VerticalPage
