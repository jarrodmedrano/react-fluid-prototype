//Common Scrolling Functions
import Scroll  from 'react-scroll';
export const Link       = Scroll.Link;
export const Element    = Scroll.Element;
export const Events     = Scroll.Events;
export const scroll     = Scroll.animateScroll;
export const scrollSpy  = Scroll.scrollSpy;

export function _scrollToTop() {
    scroll.scrollToTop();
}

export function _scrollToBottom() {
    scroll.scrollToBottom();
}

export function _scrollTo() {
    scroll.scrollTo(100);
}

export function _scrollMore() {
    scroll.scrollMore(100);
}