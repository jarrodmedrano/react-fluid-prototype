/// <amd-module name='video'/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {VideoControls, IVideoControls, IVideoPlayer, IVideoOption, IVideoOptionChangedNotification} from 'videoControls';
import {VideoClosedCaptions} from 'video-closed-captions';
import {getCookie, getDimensions, isNumber, parseJson, setCookie, Viewports} from 'utility';
import {addClass, addEvent, addEvents, addThrottledEvent, css, eventTypes, getClientRect, getText, getEvent, hasClass,
        preventDefault, removeClass, selectElementsT, selectFirstElement, selectFirstElementT, setText } from 'htmlExtensions';
import {startsWith} from 'stringExtensions';


/**
* @interface IVideoErrorMessageData
* @description - The data contract interface used for supplying content to an error message.
* @export
*/
export interface IVideoErrorMessageData {
    title?: string;
    message?: string;
}

/**
* @interface IVideoErrorMessage
* @description - The data contract interface used for storing references to error dialog elements.
*/
interface IVideoErrorMessage {
    container: HTMLElement;
    title: HTMLElement;
    message: HTMLElement;
}
/**
* The Video component
* @class
* @classdesc
*/
export class Video implements IVideoPlayer {
    /**
    * @name - selector
    * @description - selector to use to find Video components in the document.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.c-video';

    /**
    * @name - showControlsClass
    * @description - The class name to add to show the control panel.
    * @static
    * @private
    * @type {string}
    */
    private static showControlsClass = 'f-slidein';

    /**
    * @name - hideControlsClass
    * @description - The class name to add to hide the control panel.
    * @static
    * @private
    * @type {string}
    */
    private static hideControlsClass = 'f-slideout';

    /**
    * @name - fitControlsClass
    * @description - The class name to add to the cc overlay element to resize it to accommodate the control panel.
    * @static
    * @private
    * @type {string}
    */
    private static fitControlsClass = 'f-overlay-slidein';

    /**
    * @name - ariaHidden
    * @memberof - Video
    * @description - The aria-hidden attribute name.
    * @private
    * @static
    * @type {string}
    */
    private static readonly ariaHidden = 'aria-hidden';

    /**
    * @name - cookieVolume
    * @description - The default cookie name where the users volume preference is stored.
    *                This cookie name is shared with the msn-prime video player.
    * @static
    * @private
    * @type {string}
    */
    private static cookieVolume = 'vidvol';

    /**
    * @name - cookieCcPreference
    * @description - The default cookie name where the users closed caption preference is stored.
    *                This cookie name is shared with the msn-prime video player.
    * @static
    * @private
    * @type {string}
    */
    private static cookieCcPreference = 'vidccpref';

    /**
    * @name - positionUpdateThreshold
    * @description - The threshold (seconds) below which requested changes to the current play position will be ignored.
    *                This prevents round trip rounding via the VideoControls progress slider from causing minor changes.
    * @static
    * @private
    * @type {number}
    */
    private static positionUpdateThreshold = 0.1;

    /**
    * @name - controlPanelTimeout
    * @description - The time (milliseconds) to leave the control panel visible after the user moves the mouse off the video.
    * @static
    * @private
    * @type {number}
    */
    private static controlPanelTimeout = 3500;

    /**
    * @name - videoControls
    * @description - The video control panel.
    * @private
    * @type {VideoControls}
    */
    private videoControls: IVideoControls;

    /**
    * @name - videoPlayer
    * @description - The native <video> element.
    * @private
    * @type {HTMLVideoElement}
    */
    private videoPlayer: HTMLVideoElement;

    /**
    * @name - videoControlsContainer
    * @description - The video controls container element.
    * @private
    * @type {HTMLElement}
    */
    private videoControlsContainer: HTMLElement;

    /**
    * @name - ccOverlay
    * @description - The closed captions overlay element.
    * @private
    * @type {HTMLElement}
    */
    private ccOverlay: HTMLElement;

    /**
    * @name - closedCaptions
    * @description - The closed captions object.
    * @private
    * @type {VideoClosedCaptions}
    */
    private closedCaptions: VideoClosedCaptions;

    /**
    * @name - ccOptions
    * @description - The current set of supported closed caption options.
    * @private
    * @type {IVideoOption[]}
    */
    private ccOptions: IVideoOption[];

    /**
    * @name - canPlay
    * @description - Flag indicating whether or not the video is currently in a playable state.
    * @public
    * @type {boolean}
    */
    public canPlay: boolean = false;

    /**
    * @name - controlPanelTimer
    * @description - The control panel's timer used for hiding the control panel.
    * @private
    * @type {number}
    */
    private controlPanelTimer: number;

    /**
    * @name - triggerContainer
    * @description - The overlay element containing content and play trigger
    * @private
    * @type {HTMLElement}
    */
    private triggerContainer: HTMLElement;

    /**
    * @name - trigger
    * @description - The trigger element
    * @private
    * @type {HTMLElement}
    */
    private trigger: HTMLElement;

    /**
    * @name - triggerParagraph
    * @description - The trigger paragraph element. We hide this when the player is narrow.
    * @private
    * @type {HTMLElement}
    */
    private triggerParagraph: HTMLElement;

    /**
    * @name - errorMessageDisplayed
    * @description - Tracks whether an error message is displayed
    * @private
    * @type {number}
    */
    private errorMessageDisplayed: boolean = false;

    /**
    * @name - errorMessage
    * @description - Store references to error message dom nodes
    * @private
    * @type {object}
    */
    private errorMessage: IVideoErrorMessage;

    /**
    * @name - resizeListener
    * @description - The resize event listener.
    * @private
    * @type {object}
    */
    private resizeListener: EventListener;

    /**
    * @constructor
    * @description - Constructor for the Video component.
    * @public
    * @param {HTMLElement} videoComponent - the native element to attach the video behavior to.
    */
    constructor(private videoComponent: HTMLElement) {
        if (!videoComponent) {
            return;
        }

        this.videoPlayer = selectFirstElementT<HTMLVideoElement>('.f-video-player', this.videoComponent);
        this.videoControlsContainer = selectFirstElement('.f-video-controls', this.videoComponent);
        this.videoControls = new VideoControls(this.videoControlsContainer, this);

        if (!this.videoPlayer || !this.videoPlayer.canPlayType) {
            return null;
        }

        this.initializeClosedCaptions();

        this.triggerContainer = selectFirstElement('section', this.videoComponent);

        if (!!this.triggerContainer) {
            this.trigger = selectFirstElement('.c-action-trigger', this.triggerContainer);
            this.triggerParagraph = selectFirstElement('p', this.triggerContainer);

            if (this.triggerParagraph) {
                this.resizeListener = addThrottledEvent(window, eventTypes.resize, this.onResized);
                this.onResized();
            }
        }

        if (this.videoControlsContainer && this.videoControls) {

            this.videoControls.setMuted(this.videoPlayer.getAttribute('muted') !== null);
            this.videoControls.setVolume(parseInt(getCookie(Video.cookieVolume) || '1', 10));

            addEvents(this.videoComponent, 'mouseover mouseout', this.onMouseEvent);
            addEvents(this.videoPlayer, 'canplay canplaythrough waiting', this.onVideoPlayStateChanged);
            addEvent(this.videoPlayer, eventTypes.loadedmetadata, this.onVideoMetadataLoaded);
            addEvent(this.videoPlayer, eventTypes.timeupdate, this.onVideoTimeUpdate);
            addEvent(this.videoPlayer, eventTypes.ended, this.onVideoEnded);
            addEvent(this.videoPlayer, eventTypes.click, this.onVideoPlayerClicked);

            this.startControlPanelTimeout();
        }
    }

    /**
    * @name - startControlPanelTimeout
    * @description - Starts the countdown for hiding the control panel.
    * @private
    * @returns {void}
    */
    private startControlPanelTimeout(): void {
        // Comment out the next line to keep the control panel aways visible for easy debugging.
        this.controlPanelTimer = window.setTimeout(() => { this.hideControlPanel(); }, Video.controlPanelTimeout);
    }

    /**
    * @name - hideControlPanel
    * @description - Hides the control panel.
    * @private
    * @returns {void}
    */
    private hideControlPanel(): void {
        if (!!this.controlPanelTimer) {
            window.clearTimeout(this.controlPanelTimer);
        }

        if (!!this.videoControlsContainer) {
            if (hasClass(this.videoControlsContainer, Video.showControlsClass)) {
                removeClass(this.videoControlsContainer, Video.showControlsClass);
                addClass(this.videoControlsContainer, Video.hideControlsClass);

                if (!!this.ccOverlay) {
                    removeClass(this.ccOverlay, Video.fitControlsClass);

                    if (this.closedCaptions && this.videoPlayer) {
                        // Force a cc update as the ccOverlay size had changed and the captions
                        // likely need to be rescaled.
                        this.closedCaptions.updateCaptions(this.videoPlayer.currentTime);
                    }
                }
            }
        }

        if (!!this.videoControls) {
            this.videoControls.prepareToHide();
        }
    }

    /**
    * @name - showControlPanel
    * @description - Shows the control panel.
    * @private
    * @returns {void}
    */
    private showControlPanel(): void {
        if (!!this.videoControlsContainer && !this.errorMessageDisplayed) {
            if (hasClass(this.videoControlsContainer, Video.hideControlsClass)) {
                removeClass(this.videoControlsContainer, Video.hideControlsClass);
                addClass(this.videoControlsContainer, Video.showControlsClass);

                if (!!this.ccOverlay) {
                    addClass(this.ccOverlay, Video.fitControlsClass);

                    if (this.closedCaptions && this.videoPlayer) {
                        // Force a cc update as the ccOverlay size had changed and the captions
                        // likely need to be rescaled.
                        this.closedCaptions.updateCaptions(this.videoPlayer.currentTime);
                    }
                }
            }
        }
    }

    /**
    * @name - onMouseEvent
    * @description - The options dialog's click event listener.
    * @private
    * @param {MouseEvent} event - the click event.
    * @returns {void}
    */
    private onMouseEvent = (event: MouseEvent): void => {
        event = getEvent(event) as MouseEvent;

        if (event.type === 'mouseover') {
            if (!!this.controlPanelTimer) {
                window.clearTimeout(this.controlPanelTimer);
            }

            this.showControlPanel();
        } else if (event.type === 'mouseout') {
            let node = (event.toElement || event.relatedTarget) as Node;

            while (node && node.parentNode && (node.parentNode as any) !== window) {
                if (((node.parentNode as any) === this) || ((node as any) === this)) {
                    preventDefault(event);
                    return;
                }

                node = node.parentNode;
            }

            this.startControlPanelTimeout();
        }
    }

    /**
    * @name - onVideoMetadataLoaded
    * @description - The native players onloaded event listener.
    *                When this is called we can get the video's duration.
    * @private
    * @returns {void}
    */
    private onVideoMetadataLoaded = (): void => {
        if (!!this.videoControls && !!this.videoPlayer) {
            this.canPlay = false;
            this.videoControls.setDuration(this.videoPlayer.duration);

            if (this.videoPlayer.getAttribute('autoplay') !== null) {
                this.play();
            }
        }
    }

    /**
    * @name - onVideoTimeUpdate
    * @description - The native player's ontimeupdate event listener.
    * @private
    * @returns {void}
    */
    private onVideoTimeUpdate = (): void => {
        if (!!this.videoControls && !!this.videoPlayer) {
            this.videoControls.setPlayPosition(this.videoPlayer.currentTime);

            if (this.closedCaptions) {
                this.closedCaptions.updateCaptions(this.videoPlayer.currentTime);
            }
        }
    }

    /**
    * @name - onVideoPlayStateChanged
    * @description - The native player's canplay/canplaythrough/waiting event listener.
    * @private
    * @param {Event} event - the play state event.
    * @returns {void}
    */
    private onVideoPlayStateChanged = (event: Event): void => {
        this.canPlay = this.canPlay || (event.type === 'canplay') || (event.type === 'canplaythrough');

        if (!!this.videoControls) {
            this.videoControls.updatePlayPauseState();
        }
    }

    /**
    * @name - onVideoPlayerClicked
    * @description - The native player's click event listener.
    * @private
    * @param {MouseEvent} event - The click event.
    * @returns {void}
    */
    private onVideoPlayerClicked = (event: MouseEvent): void => {
        if (this.isPlayable) {
            if (this.isPaused()) {
                this.play();
            } else {
                this.pause();
            }
        }
    }

    /**
    * @name - onVideoEnded
    * @description - The native player's onended event listener.
    * @private
    * @returns {void}
    */
    private onVideoEnded = (): void => {
        if (!!this.videoControls) {
            this.videoControls.setPlayPosition(0);
            this.videoControls.updatePlayPauseState();
        }

        if (this.closedCaptions) {
            this.closedCaptions.updateCaptions(0);
        }
    }

    /**
    * @name - isPaused
    * @description - Determines the play/paused state of the player
    * @public
    * @returns {boolean} - Talse if the video is paused, otherwise false.
    */
    public isPaused(): boolean {
        return !!this.videoPlayer ? this.videoPlayer.paused : false;
    }

    /**
    * @name - isPlayable
    * @description - Determines the video is currently in a playable state.
    * @public
    * @returns {boolean} - true if the video is in a playable state, otherwise false.
    */
    public isPlayable(): boolean {
        return !!this.videoPlayer ? this.canPlay : false;
    }

    /**
    * @name - play
    * @description - Start/restart the video playing.
    * @public
    * @returns {void}
    */
    public play(): void {
        if (!!this.videoPlayer) {
            this.videoPlayer.play();
        }

        if (!!this.videoControls) {
            this.videoControls.updatePlayPauseState();
        }
    }

    /**
    * @name - pause
    * @description - Pause the video.
    * @public
    * @returns {void}
    */
    public pause(): void {
        if (!!this.videoPlayer) {
            this.videoPlayer.pause();
        }

        if (!!this.videoControls) {
            this.videoControls.updatePlayPauseState();
        }
    }

    /**
    * @name - setPlayPosition.
    * @description - Sets the current play position of the video.
    * @public
    * @param {number} position - The position (seconds) to set the current play position to.
    *                            This method intentionally does not update the VideoControls to avoid circular looping.
    *                            The VideoControls progress bar will indirectly be updated by the progress change.
    *                            It also will not update the position if the delta it not >= to the threshold.
    * @returns {void}
    */
    public setPlayPosition(position: number): void {
        if (isNumber(position) && !!this.videoPlayer) {
            position = Math.max(0, Math.min(position, isNumber(this.videoPlayer.duration) ? this.videoPlayer.duration : 0));

            if (Math.abs(position - this.videoPlayer.currentTime) >= Video.positionUpdateThreshold) {
                this.videoPlayer.currentTime = position;
            }
        }
    }

    /**
    * @name - getVolume
    * @description - Gets the volume level of the player.
    * @public
    * @returns {number} - The player's current volume setting.
    */
    public getVolume(): number {
        return (!!this.videoPlayer && isNumber(this.videoPlayer.volume)) ? this.videoPlayer.volume : 0;
    }

    /**
    * @name - setVolume
    * @description - Sets the volume level for the player.
    * @public
    * @param {number} volume - The desired volume.
    * @returns {void}
    */
    public setVolume(volume: number): void {
        if (isNumber(volume) && !!this.videoPlayer) {
            // Ensure it's in the allowable 0-1 range and limited to two decimal places of precision.
            volume = Math.round(Math.max(0, Math.min(volume, 1)) * 100) / 100;

            if (volume !== this.videoPlayer.volume) {
                this.videoPlayer.volume = volume;
                setCookie(Video.cookieVolume, volume.toString(), '/', 365);

                if (!!this.videoControls) {
                    this.videoControls.setVolume(volume);
                }
            }
        }
    }

    /**
    * @name - isMuted
    * @description - Gets the mute state of the player.
    * @public
    * @returns {boolean} - The player's current mute state.
    */
    public isMuted(): boolean {
        return !!this.videoPlayer ? this.videoPlayer.muted : true;
    }

    /**
    * @name - setMuted
    * @description - Sets the mute state for the player.
    * @public
    * @param {boolean} muted - The desired mute state, true if the video should be muted, otherwise false.
    * @returns {void}
    */
    public setMuted(muted: boolean): void {
        if (!!this.videoPlayer && (muted !== this.videoPlayer.muted)) {
            this.videoPlayer.muted = muted;

            if (!!this.videoControls) {
                this.videoControls.setMuted(muted);
            }
        }
    }

    /**
    * @name - setFullscreen
    * @description - Sets the player into fullscreen mode.
    * @public
    * @returns {void}
    */
    public setFullscreen(): void {
        if (!!this.videoPlayer) {
            if (this.videoPlayer.requestFullscreen ||
                (<any>this.videoPlayer).msRequestFullscreen ||
                (<any>this.videoPlayer).mozRequestFullScreen ||
                this.videoPlayer.webkitRequestFullscreen ||
                this.videoPlayer.webkitSupportsFullscreen) {
                let fullScreenElement = (<any>document).fullScreenElement ||
                                        (<any>document).msFullscreenElement ||
                                        (<any>document).mozFullScreenElement ||
                                        document.webkitFullscreenElement;
                let cancelFullScreen = (<any>document).cancelFullScreen ||
                                        (<any>document).msExitFullscreen ||
                                        (<any>document).mozCancelFullScreen ||
                                        document.webkitCancelFullScreen ||
                                        document.webkitCancelFullScreen;
                let enterFullScreen = this.videoPlayer.requestFullscreen ||
                                        (<any>this.videoPlayer).msRequestFullscreen ||
                                        (<any>this.videoPlayer).mozRequestFullScreen ||
                                        this.videoPlayer.webkitRequestFullscreen ||
                                        this.videoPlayer.webkitEnterFullScreen;

                if (fullScreenElement) {
                    cancelFullScreen();
                }

                enterFullScreen.call(this.videoPlayer);
            }
        }
    }

    /**
    * @name - initializeClosedCaptions
    * @description - Initializes the close captions.
    * @private
    * @returns {void}
    */
    private initializeClosedCaptions(): void {
        this.ccOverlay = selectFirstElement('.f-video-cc-overlay', this.videoComponent);

        if (!this.ccOverlay) {
            return;
        }

        this.closedCaptions = new VideoClosedCaptions(this.ccOverlay);

        this.initializeClosedCaptionsMenu();
    }

    /**
    * @name - initializeClosedCaptionsMenu
    * @description - Initializes the close captions options menu.
    * @private
    * @param {IVideoOption[]} [ccOptions] - The closed captions options to initialize the options menu from.
    *                                       If omitted the cc options are extracted from the markup.
    * @returns {void}
    */
    private initializeClosedCaptionsMenu(ccOptions?: IVideoOption[]): void {
        if (!this.ccOverlay || !this.closedCaptions) {
            return;
        }

        let ccLanguageId: string;

        if (!ccOptions) {
            ccOptions = [];

            // Build the options from the existing menu markup.
            let menuOptions = selectElementsT<HTMLAnchorElement>(
                'ul[data-video-sub-options=f-video-captions] li a[data-video-selectable]',
                this.videoComponent);

            if (menuOptions) {
                // Remove the "off" item before building the true options.
                menuOptions = menuOptions.slice(1);

                for (let option of menuOptions) {
                    let id = this.removeIdPrefix(option.parentElement.id);
                   let selected = (option.parentElement.getAttribute('aria-selected') === 'true');

                    if (selected) {
                        ccLanguageId = id;
                    }

                    ccOptions.push({ id: id, value: getText(option), selected: selected, href: option.href });
                }
            }
        }

        if (!ccOptions || !ccOptions.length) {
            this.ccOptions = null;
            return;
        }

        // If the users cc language preference is already persisted it overrides the markup setting, if any.
        let ccLanguageCookie = getCookie(Video.cookieCcPreference);

        if (ccLanguageCookie) {
            ccLanguageId = ccLanguageCookie;
        }

        for (let option of ccOptions) {
            if (ccLanguageId) {
                option.selected = (ccLanguageId === option.id);
            }

            option.id = this.addIdPrefix(option.id);
        }

        this.ccOptions = ccOptions;

        // Update the video controls cc options menu.
        this.videoControls.setOptions({ category: 'f-video-captions', options: ccOptions });
    }

    /**
    * @name - onOptionChanged
    * @description - The options dialog's click event listener.
    * @public
    * @param {IVideoOptionChangedNotification} notification - The option notification.
    * @returns {void}
    */
    public onOptionChanged(notification: IVideoOptionChangedNotification): void {
        switch (notification.category) {
            case 'f-video-captions': {
                this.setCC(notification.id);
                break;
            }

            case 'f-video-quality': {
                this.setQuality(notification.id);
                break;
            }

            case 'f-video-share': {
                this.shareVideo(notification.id);
                break;
            }
        }
    }

    /**
    * @name - setCC
    * @description - Sets the close captioning language/locale.
    * @private
    * @param {string} ccLanguageId - The desired new cc value.
    * @returns {void}
    */
    private setCC(ccLanguageId: string): void {
        if (this.closedCaptions) {
            // Ensure that the language id is valid for this video
            let selectedOption: any = null;

            if (ccLanguageId && this.ccOptions) {
                for (let option of this.ccOptions) {
                    if (option.id === ccLanguageId) {
                        selectedOption = option;
                        break;
                    }
                }
            }

            ccLanguageId = this.removeIdPrefix(ccLanguageId);
            this.closedCaptions.setCcLanguage(ccLanguageId, selectedOption ? selectedOption.href : null);
            setCookie(Video.cookieCcPreference, ccLanguageId, '/', 365);
        }
    }

    /**
    * @name - setQuality
    * @description - Sets the video playback quality.
    * @private
    * @param {string} qualityId - The desired new quality value.
    * @returns {void}
    */
    private setQuality(qualityId: string): void {
        // TODO: 8479736: Update build step to remove commented code.
        // The following console.log useful for debugging and is left in commented out for easy restoration.
        //console.log('videoplayer setQuality(' + qualityId + ') not implemented.');
    }

    /**
    * @name - shareVideo
    * @description - Shares the video via the specified method.
    * @private
    * @param {string} shareById - The desired new shareBy value.
    * @returns {void}
    */
    private shareVideo(shareById: string): void {
        // TODO: 8479736: Update build step to remove commented code.
        // The following console.log useful for debugging and is left in commented out for easy restoration.
        //console.log('videoplayer shareVideo(' + shareById + ') not implemented.');
    }

    /**
    * @name - addIdPrefix
    * @description - Adds the id prefix to form a child id.
    * @private
    * @param {string} childId - The child id to prefix.
    * @returns {string} - The prefixed id or the original id if no prefix is built.
    */
    private addIdPrefix(childId: string): string {
        let prefix = (this.videoComponent && this.videoComponent.id)
            ? this.videoComponent.id + '-'
            : null;

        return (prefix && !startsWith(childId, prefix, false)) ? (prefix + childId) : childId;
    }

    /**
    * @name - removeIdPrefix
    * @description - Removes the id prefix from a child id.
    * @private
    * @param {string} childId - The child id to prefix.
    * @returns {string} - The un-prefixed id or the original id if no prefix was found.
    */
    private removeIdPrefix(childId: string): string {
        let prefix = (this.videoComponent && this.videoComponent.id)
            ? this.videoComponent.id + '-'
            : null;

        return (prefix && startsWith(childId, prefix, false)) ? childId.substring(prefix.length) : childId;
    }

    /**
    * @name - showTrigger
    * @description - Show the trigger overlay
    * @private
    * @returns {void}
    */
    private showTrigger(): void {
        if (!!this.triggerContainer) {
            this.triggerContainer.setAttribute(Video.ariaHidden, 'false');
        }
    }

    /**
    * @name - hideTrigger
    * @description - Hide the trigger overlay
    * @private
    * @returns {void}
    */
    private hideTrigger(): void {
        if (!!this.triggerContainer) {
            this.triggerContainer.setAttribute(Video.ariaHidden, 'true');
        }
    }

    /**
    * @name - displayErrorMessage
    * @description - Create an error message overlay
    * @private
    * @param {IVideoErrorMessageData} - Error message content
    * @returns {void}
    */
    private displayErrorMessage(errorMessage: IVideoErrorMessageData): void {
        if (!errorMessage || !errorMessage.title && !errorMessage.message) {
            return;
        }

        this.errorMessageDisplayed = true;

        // If error message exists
        if (!!this.errorMessage) {
            setText(this.errorMessage.title, errorMessage.title || '');
            setText(this.errorMessage.message, errorMessage.message || '');
            this.errorMessage.container.setAttribute(Video.ariaHidden, 'false');
        } else {
            this.errorMessage = {} as IVideoErrorMessage;
            this.errorMessage.container = document.createElement('div');
            let contentWrapper = document.createElement('div');
            this.errorMessage.title = document.createElement('p');
            this.errorMessage.message = document.createElement('p');
            this.errorMessage.container.setAttribute('role', 'status');
            this.errorMessage.title.setAttribute('class', 'c-heading');
            this.errorMessage.message.setAttribute('class', 'c-paragraph');

            if (!!errorMessage.title) {
                setText(this.errorMessage.title, errorMessage.title);
            }

            if (!!errorMessage.message) {
                setText(this.errorMessage.message, errorMessage.message);
            }

            // Combine pieces
            this.errorMessage.container.appendChild(contentWrapper);
            contentWrapper.appendChild(this.errorMessage.title);
            contentWrapper.appendChild(this.errorMessage.message);

            // Attach everything to the DOM
            this.videoComponent.appendChild(this.errorMessage.container);
        }

        this.hideControlPanel();
        this.hideTrigger();

    }

    /**
    * @name - hideErrorMessage
    * @description - Removes the error message overlay
    * @private
    * @returns {void}
    */
    private hideErrorMessage(): void {
        if (!!this.errorMessage && !!this.errorMessage.container) {
            this.errorMessage.container.setAttribute(Video.ariaHidden, 'true');
            this.errorMessageDisplayed = false;
        }
    }

    /**
    * @name - onResized
    * @description - Handles the window resize event.
    * @private
    * @returns {void}
    */
    private onResized = (): void => {
        if (!!this.videoComponent && !!this.triggerParagraph) {
            if (getDimensions(this.videoComponent).width < Viewports.allWidths[2]) {
                this.triggerParagraph.setAttribute(Video.ariaHidden, 'true');
            } else {
                this.triggerParagraph.removeAttribute(Video.ariaHidden);
            }
        }
    }
}
