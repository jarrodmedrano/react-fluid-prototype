import React from 'react'
import {findDOMNode} from 'react-dom'
import dataPropTypes, {MainPropTypes} from '../../../data/dataProps';
import propsAreValid, {impressionEvent, navigateEvent} from '../../lib/util';
import Vertical from '../vertical/Vertical';
import StickyFooter from '../stickynav/StickyFooter';
import DownArrow from '../downarrow/DownArrow';
import _ from 'lodash';
import keydown from 'react-keydown';
import Element from '../scrollElement/Element';
import Scroll from 'react-scroll';
const scroll = Scroll.animateScroll;
const scrollSpy = Scroll.scrollSpy;

class Main extends React.Component {
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
        if (this.props.location.pathname === '/') {
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
            activeSections: [],
            currentSection: 0,
            currentSectionClass: currentSectionClass,
            currentTitle: title,
            events: ['scroll', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll', 'resize', 'touchmove', 'touchend'],
            winHeight: 0,
            winWidth: 0,
            winTop: 0,
            scrollTop: 0,
        };

        this._getCurrentPage = this._getCurrentPage.bind(this);
        // this._updateDimensions = _.debounce(this._updateDimensions, 1000);
        this._updateScrollPosition = _.throttle(this._updateScrollPosition, 200, {leading: true});
    }

    componentDidMount() {
        this._updateDimensions();

        this.state.events.forEach((type) => {
            this.mainRef.addEventListener(type, this._updateScrollPosition.bind(this), false)
        });
        window.addEventListener('resize', _.debounce(this._updateDimensions.bind(this), 1000, {trailing: true}));
        scrollSpy.update();
    }

    componentWillUnmount() {
        this.state.events.forEach((type) => {
            this.mainRef.removeEventListener(type, this._updateScrollPosition.bind(this), false)
        });
        window.removeEventListener('resize', this._updateDimensions.bind(this));
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
                this._scrollInto(ref);
            }
        }, this);
    }

    _scrollInto(ref) {
        this.mainRef.scrollTop = ref.offsetTop;
    }

    _getCurrentPage() {
        let {groups} = this.props.data;
        let title = this.props.route.title;
        //if the title of the route matches the title of the group, that is the current page.
        return _.find(groups, function (result) {
            return result.groupIdentifier === title
        });
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
            this._scrollInto(ref);
            navigateEvent(this.state.currentPage.groupIdentifier, this.state.currentSections[currentSection].sectionIdentifier, source);
        };

        this.setState({currentSection: this.state.currentSection += 1},
            callBack(this.state.currentSection)
        );
    }

    _goPrevSection(source) {
        let callBack = (currentSection) => {
            let ref = findDOMNode(this.refs[`${this.props.route.title}-section-${currentSection}`]);
            navigateEvent(this.state.currentPage.groupIdentifier, this.state.currentSections[currentSection].sectionIdentifier, source);
            this._scrollInto(ref)
        };

        this.setState({currentSection: this.state.currentSection -= 1},
            callBack(this.state.currentSection)
        );
    }

    _goTop(source) {
        let callBack = (currentSection) => {
            let ref = findDOMNode(this.refs[`${this.props.route.title}-section-${currentSection}`]);
            navigateEvent(this.state.currentPage.groupIdentifier, this.state.currentSections[currentSection].sectionIdentifier, source);
            this._scrollInto(ref);
        };

        this.setState({currentSection: 0}, callBack(0));
    }

    _updateDimensions() {
        //Get rectangle of the main window.
        if (this.mainRef) {
            let rect = this.mainRef.getBoundingClientRect(),
                mainHeight = rect.top + rect.height,
                mainTop = rect.top;

            this.setState({
                winHeight: mainHeight,
                winTop: mainTop
            });
        }
    };

    _updateScrollPosition() {
        this.setState({
            scrollTop: this.mainRef.scrollTop
        });
    }

    render() {
        if (propsAreValid(this.props.data, this)) {
            return (
                <main id="main" ref={(main) => {
                    this.mainRef = main;
                }}>
                    {this.state.currentPage.sections ?
                        this.state.currentPage.sections.map(function (result, id) {
                            return (
                                <Element name={this.state.currentSectionClass + id} key={id}
                                         ref={`${this.props.route.title}-section-${id}`} itemRef={id}>
                                    <Vertical data={result} brandColor={this.state.currentBrandColor}
                                              activeSections={this.state.activeSections} myId={id}
                                              winHeight={this.state.winHeight} winTop={this.state.winTop}
                                              scrollTop={this.state.scrollTop}/>
                                </Element>
                            )
                        }, this)
                        : null
                    }

                    {/*
                     display sticky footer if there are no legacy layouts
                     */}
                    {this.state.currentPage.sections && this.props.legacyLayouts !== true ?
                        <StickyFooter data={this.state.currentPage}/>
                        :
                        <DownArrow data={this.state.currentPage} onClick={(event) => this._handleDownArrow(event)}/>
                    }
                </main>
            )
        }
    }
}

Main.propTypes = dataPropTypes(MainPropTypes);

export default Main
