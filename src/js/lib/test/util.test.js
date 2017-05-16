import {impressionEvent, externalNavigate, internalNavigate, logError, navigateEvent} from '../util';
import expect, { createSpy, spyOn, isSpy } from 'expect'

describe('Utility functions', () => {
    it('should run external navigate if window.RDX exists', () => {
        window.RDX = {
            externalNavigate: () => {return true}
        };

        let spy = expect.spyOn(window.RDX, 'externalNavigate');

        externalNavigate('http://www.google.com');

        expect(spy).toHaveBeenCalled()
    });

    // it('should run internal navigate if link starts with slash', () => {
    //     window = {
    //         internalNavigate: () => {return true}
    //     };
    //
    //     let spy = expect.spyOn(window, 'internalNavigate');
    //
    //     internalNavigate('/windows', browserHistory);
    //
    //     expect(spy).toHaveBeenCalled()
    // });

    it('should run navigate Event if window.RDX exists', () => {
        window.RDX = {
            navigateEvent: () => {return true}
        };

        let spy = expect.spyOn(window.RDX, 'navigateEvent');

        navigateEvent('oem', 'section1', 'tab click');

        expect(spy).toHaveBeenCalled()
    });

    it('should run log error if window.RDX exists', () => {
        window.RDX = {
            logError: () => {return true}
        };

        let spy = expect.spyOn(window.RDX, 'logError');

        logError('There was an error');

        expect(spy).toHaveBeenCalled()
    });

    it('should run impression event if window.RDX exists', () => {
        window.RDX = {
            impressionEvent: () => {return true}
        };

        let spy = expect.spyOn(window.RDX, 'impressionEvent');

        impressionEvent(true, 'oem', 'section1');

        expect(spy).toHaveBeenCalled()
    });
});