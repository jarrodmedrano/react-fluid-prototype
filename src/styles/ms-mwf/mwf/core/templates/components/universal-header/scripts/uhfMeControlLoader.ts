/// <amd-module name="uhfMeControlLoader"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.
/// <reference path='MeControlOptions.d.ts' />
/// <reference path='uhfOptions.d.ts' />

import * as $ from 'jquery';
import {selectFirstElement} from 'htmlExtensions';
import { NavigationMenus } from 'navigationMenus';
import { UniversalHeader } from 'universalHeader';
import { Viewports } from 'utility';
import { addThrottledEvent, eventTypes } from 'htmlExtensions';

export module Loader {
    var meControlGlobalOptions: any = null;
    // time in milliseconds before reverting to the MeControl fall-back
    var fallbackTimeout = 5000;
    var events: IMeControlEvents = null;
    let wasMobile: boolean = false;

    function showMeControlFallback() {
        var _options = meControlGlobalOptions;
        if (!_options) {
            return;
        }

        _options.events.onEventLog('loadMeControl', {
            type: 'qos',
            success: '0',
            errorCode: 'LoadFailed: Reverted to fallback',
            duration: fallbackTimeout
        });
    }

    function loadMeControlOptions(customMeControlOptions: IMeControlOptions) {
        if (customMeControlOptions) {
            if (customMeControlOptions.extensibleLinks && meControlGlobalOptions.extensibleLinks) {
                customMeControlOptions.extensibleLinks.push.apply
                    (customMeControlOptions.extensibleLinks, meControlGlobalOptions.extensibleLinks);
                meControlGlobalOptions.extensibleLinks = null;
            }

            meControlGlobalOptions = $.extend(true, {}, meControlGlobalOptions, customMeControlOptions);
        }
        if (meControlGlobalOptions.enabled) {

            if (window.MSA && window.MSA.MeControl) {
                window.MSA.MeControl.Loader.load(meControlGlobalOptions);
            } else {
                var timerId = setTimeout(function() {
                    showMeControlFallback();
                },
                    fallbackTimeout);

                (window as any).onMeControlReadyToLoad = function() {
                    meControlGlobalOptions.events.onEventLog('loadMeControl', { type: 'qos', success: '1' });

                    // Clear fallback timer
                    clearTimeout(timerId);

                    // Clear ready callback
                    (window as any).onMeControlReadyToLoad = null;

                    // Load MeControl
                    window.MSA.MeControl.Loader.load(meControlGlobalOptions);
                };
            }
        }
    }

    /*TODO: [joelk] check perf impact and apply this consistently or
    simply create the string with location.protocol + '//' + location.host */
    export function absolutifyUrl(url: any) {
        var a = document.createElement('a');
        a.href = url;
        return a.href;
    }

    function initializeMeControlOptions(meControlOptions: IMeControlOptions) {
        if (meControlOptions != null) {
            if (meControlOptions.rpData.aadInfo && meControlOptions.rpData.aadInfo.siteUrl) {
                meControlOptions.rpData.aadInfo.siteUrl = absolutifyUrl(meControlOptions.rpData.aadInfo.siteUrl);
            }
            if (meControlOptions.rpData.msaInfo && meControlOptions.rpData.msaInfo.meUrl) {
                meControlOptions.rpData.msaInfo.meUrl = meControlOptions.rpData.msaInfo.meUrl + '&wreply='
                    + encodeURIComponent(window.location.protocol + '//' + window.location.host);
            }
            meControlOptions.events = {
                onEventLog: function (eventId: string, dataPoints: any) {
                    if (events && events.onEventLog) {
                        events.onEventLog('MeControl_' + eventId, dataPoints);
                    }
                }
            };
            meControlGlobalOptions = $.extend(true, {}, meControlOptions, meControlGlobalOptions || {});
        }
    }

    function updateDynamicSettings(headerOptions: UHFOptions) {
        if (headerOptions != null && headerOptions.events != null) {
            events = headerOptions.events;
        }

        // navHighlight using load for example: window.msCommonShell.load(shellOptions);
        // partners can pass in an element id of an html element they wish to have bold text
        // load is used to maintain backwards compatibility since our existing partners use this.
        if (!!headerOptions.currentGlobalItemId) {
            NavigationMenus.setCurrentMenuItemId(headerOptions.currentGlobalItemId);
        }

        // navhighlight via update for example: msCommonShell.update({currentMenuItemId: 'software'})
        if (!!headerOptions.currentMenuItemId) {
            NavigationMenus.setCurrentMenuItemId(headerOptions.currentMenuItemId);
        }

        // allows service partners to set theme in one of two ways via javascript:
        // msCommonShell.update({theme: 'dark'})
        // msCommonShell.load(shellOptions);
        if (headerOptions && headerOptions.theme) {
            UniversalHeader.setTheme(headerOptions.theme);
        }
    }

    function initializeHeaderModules(partnerMeOptions: UHFOptions) {
        // Set up Autosuggest
        if (window.msCommonShell && partnerMeOptions.as) {
            window.msCommonShell.as = partnerMeOptions.as;

        } else if (window.msCommonShell && partnerMeOptions.searchSuggestCallback) {
            window.msCommonShell.as = {
                legacyCallback: partnerMeOptions.searchSuggestCallback
            };
        }

        // Set up Events
        if (window.msCommonShell && partnerMeOptions.events) {
            window.msCommonShell.events = partnerMeOptions.events;
        }

        // Set up MeControl
        var meControlElement = document.getElementById('meControl');
        if (!meControlElement) {
            return;
        }
        var meSettings = meControlElement.getAttribute('data-signinsettings');
        if (meSettings !== null) {
            var meControlInitOptions = JSON.parse(meSettings);
            if (meControlInitOptions) {
                initializeMeControlOptions(meControlInitOptions);
            }

            if (partnerMeOptions != null) {
                updateDynamicSettings(partnerMeOptions);
                loadMeControlOptions(partnerMeOptions.meControlOptions);
            } else {
                loadMeControlOptions(null);
            }

            if (isMobile()) {
                // the default (desktop) does not need to call setMobilestate explicitly
                wasMobile = true;
                if (window.MSA && window.MSA.MeControl) {
                    window.MSA.MeControl.API.setMobileState(1);
                }
            }
        }
    }

    // returns true if the viewport is in VP4 or less.
    export function isMobile() {
        return Viewports.getViewport() < Viewports.Names.vp5;
    }

    export function onWindowResize() {
        setMeControlMobileState();
    }

    // only change the MeControl display if moved from Mobile to Desktop or vice versa
    export function setMeControlMobileState() {
        if (window.MSA && window.MSA.MeControl) {
            // changed from desktop to mobile so we want to set MeControl to only an icon
            if (isMobile() && !wasMobile) {
                wasMobile = true;
                window.MSA.MeControl.API.setMobileState(1);

                // changed from mobile to desktop so we want to set MeControl to have username and an icon
            } else if (!isMobile() && wasMobile) {
                wasMobile = false;
                window.MSA.MeControl.API.setMobileState(0);
            }
            return wasMobile;
        }
    }

    export function init() {
        window.msCommonShell = {
            AuthState: {
                // Active account
                SignedIn: 1,
                // Signed in on IDP but not the active account
                SignedInIdp: 2,
                // Remembered, not signed in
                NotSignedIn: 3
            },

            SupportedAuthIdp: {
                MSA: 'msa',
                AAD: 'aad'
            },
            meControlOptions: function () { return meControlGlobalOptions; },
            load: function (headerOptions: UHFOptions) { initializeHeaderModules(headerOptions); },
            update: function (headerOptions: UHFOptions) { updateDynamicSettings(headerOptions); }
        };

        // callback partners can use to see if load is ready
        // otherwise they can call load directly
        if (window.onShellReadyToLoad) {
            window.onShellReadyToLoad();
        }
    }
    addThrottledEvent(window, eventTypes.resize, onWindowResize, 66);
};
