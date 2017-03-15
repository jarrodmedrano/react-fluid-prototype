/// <amd-module name='videoControls'/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ComponentFactory} from 'componentFactory';
import {Slider, ISliderNotification} from 'slider';
import {isNumber, toElapsedTimeString} from 'utility';
import {selectFirstElement, selectFirstElementT, selectElements, addEvent, addEvents, eventTypes, css,
        addClass, removeClass, removeClasses, removeElement, getClientRect, getEvent,
        getEventTargetOrSrcElement, preventDefault} from 'htmlExtensions';

export class VideoControls implements IVideoControls {
    /**
      * @name - selector
      * @description - selector to use to find VideoControls components in the document.
      * @static
      * @public
      * @type {string}
      */
    public static selector = '.f-video-controls';

    /**
      * @name - ariaHidden
      * @description - The aria-hidden attribute value.
      * @static
      * @private
      * @type {string}
      */
    private static ariaHidden = 'aria-hidden';

    /**
      * @name - ariaLabel
      * @description - The aria-label attribute value.
      * @static
      * @private
      * @type {string}
      */
    private static ariaLabel = 'aria-label';

    /**
      * @name - videoPlayer
      * @description - The video player this VideoControls component is associated with.
      *                The VideoControls component communicates with all players via the IVideoPlayer interface only.
      * @private
      * @type {IVideoPlayer}
      */
    private videoPlayer: IVideoPlayer;

    /**
      * @name - progressSlider
      * @description - The progress slider that tracks the current play position of the video.
      * @private
      * @type {Slider}
      */
    private progressSlider: Slider;

    /**
      * @name - volumeSlider
      * @description - The volume slider.
      * @private
      * @type {Slider}
      */
    private volumeSlider: Slider;

    /**
      * @name - timeCurrent
      * @description - The current playback time offset in the video.
      * @private
      * @type {HTMLElement}
      */
    private timeCurrent: HTMLElement;

    /**
      * @name - timeDuration
      * @description - The video's playback duration.
      * @private
      * @type {HTMLElement}
      */
    private timeDuration: HTMLElement;

    /**
      * @name - playButton
      * @description - The control panel play/pause button.
      * @private
      * @type {HTMLButtonElement}
      */
    private playButton: HTMLButtonElement;

    /**
      * @name - playTooltip
      * @description - The control panel play/pause button's tooltip.
      * @private
      * @type {HTMLElement}
      */
    private playTooltip: HTMLElement;

    /**
      * @name - fullScreenButton
      * @description - The control panel fullscreen toggle button.
      * @private
      * @type {HTMLButtonElement}
      */
    private fullScreenButton: HTMLButtonElement;

    /**
      * @name - fullScreenTooltip
      * @description - The control panel fullscreen button's tooltip.
      * @private
      * @type {HTMLElement}
      */
    private fullScreenTooltip: HTMLElement;

    /**
      * @name - volumeButton
      * @description - The control panel volume button.
      * @private
      * @type {HTMLButtonElement}
      */
    private volumeButton: HTMLButtonElement;

    /**
      * @name - volumeContainer
      * @description - The control panel volume button's container.
      * @private
      * @type {HTMLElement}
      */
    private volumeContainer: HTMLElement;

    /**
      * @name - optionsButton
      * @description - The control panel options button.
      * @private
      * @type {HTMLButtonElement}
      */
    private optionsButton: HTMLButtonElement;

    /**
      * @name - optionsContainer
      * @description - The control panel options dialog popup's container.
      * @private
      * @type {HTMLElement}
      */
    private optionsContainer: HTMLElement;

    /**
      * @name - odParent
      * @description - The control panel top level options dialog (od) popup's menu container.
      * @private
      * @type {HTMLElement}
      */
    private odParent: HTMLElement;

    /**
      * @name - odDimensions
      * @description - The top level options dialog (od) dimensions. This is preserved so that is can be restored
      *                when going back from a submenu or reopening the options menu via the options button.
      * @private
      * @type {HTMLElement}
      */
    private odDimensions: ClientRect;

    /**
      * @name - odSubActive
      * @description - The currently active options dialog (od) submenu. (ie cc, quality, share)
      * @private
      * @type {HTMLElement}
      */
    private odSubActive: HTMLElement;

    /**
      * @name - locPlay
      * @description - The localized play string.
      * @private
      * @type {string}
      */
    private locPlay: string;

    /**
     * @name - locPause
     * @description - The localized pause string.
     * @private
     * @type {string}
     */
    private locPause: string;

    /**
     * @name - screenReaderOnlyClass
     * @description - The class to apply when an element should be visually hidden but still
     *                accessible to screen readers
     * @static
     * @private
     * @type {string}
     */
    private static screenReaderOnlyClass = 'x-screen-reader';
    /**
     * @constructor
     * @description - Constructor for the VideoControls component.
     * @public
     * @param {HTMLElement} videoControls - the native element to attach the VideoControls behavior to.
     * @param {IVideoPlayer} videoPlayer - the VideoPlayer associated with this VideoControls component.
     */
    constructor(private videoControls: HTMLElement, videoPlayer: IVideoPlayer) {
        if (!videoControls || !videoPlayer) {
            return;
        }

        this.videoPlayer = videoPlayer;
        this.playButton = selectFirstElementT<HTMLButtonElement>('.f-play-pause', this.videoControls);
        this.playTooltip = selectFirstElement('span', this.playButton);
        this.fullScreenButton = selectFirstElementT<HTMLButtonElement>('.f-full-screen', this.videoControls);
        this.fullScreenTooltip = selectFirstElement('span', this.fullScreenButton);
        this.volumeButton = selectFirstElementT<HTMLButtonElement>('.f-volume-button', this.videoControls);
        this.volumeContainer = selectFirstElement('.f-volume-slider', this.videoControls);
        this.optionsButton = selectFirstElementT<HTMLButtonElement>('.f-options', this.videoControls);
        this.optionsContainer = selectFirstElement('.f-options-dialog', this.videoControls);
        this.timeCurrent = selectFirstElement('.f-current-time', this.videoControls);
        this.timeDuration = selectFirstElement('.f-duration', this.videoControls);

        let progressSlider = selectFirstElement('.c-slider.f-progress', this.videoControls);
        let volumeSlider = selectFirstElement('.c-slider', this.volumeContainer);

        if (!this.playButton || !this.playTooltip || !this.fullScreenButton || !this.fullScreenTooltip ||
            !progressSlider || !this.volumeButton || !this.volumeContainer || !volumeSlider ||
            !this.timeCurrent || !this.timeDuration || !this.optionsButton || !this.optionsContainer) {
            return null;
        }

        // Due to a shape change, we remove aria-label and aria-hidden if
        // the attributes exist
        this.playButton.removeAttribute('aria-label');
        this.playTooltip.removeAttribute('aria-hidden');
        addClass(this.playTooltip, VideoControls.screenReaderOnlyClass);

        this.initializeLocalization();
        this.updatePlayPauseState();
        this.optionsDialogInit();

        addEvents(window, 'resize scroll', this.hideOptionsContainer);

        addEvents(this.playButton, 'click mouseover mouseout', this.onPlayPauseEvents);
        addEvents(this.fullScreenButton, 'click mouseover mouseout', this.onFullScreenEvents);
        addEvents(
            [this.volumeButton, this.volumeContainer],
            'click mouseover mouseout focus blur', this.onVolumeEvents );

        addEvent(this.optionsButton, eventTypes.click, this.toggleOptionsDialog);

        // Create the progress and volume sliders.
        ComponentFactory.create([{
            component: Slider,
            eventToBind: 'DOMContentLoaded',
            elements: [progressSlider, volumeSlider],
            callback: (results: Slider[]): void => {
                if (!!results && !!results.length && (results.length === 2)) {
                    this.progressSlider = results[0];
                    this.volumeSlider = results[1];

                    // Subscribe to progress and volume sliders.
                    this.progressSlider.subscribe({
                        'onValueChanged':
                        (notification: ISliderNotification): string => { return this.onProgressChanged(notification); }
                    });

                    this.volumeSlider.subscribe({
                        'onValueChanged':
                        (notification: ISliderNotification): string => { return this.onVolumeChanged(notification); }
                    });

                    addEvents(selectFirstElement('button', this.volumeSlider['element']), 'focus blur', this.onVolumeSliderEvents);
                }
            }
        }]);
    }

    /**
     * @name - initializeLocalization
     * @description - Initialize all the localization strings.
     * @private
     * @returns {void}
     */
    private initializeLocalization(): void {
        if (!!this.playButton) {
            this.locPlay = this.playButton.getAttribute('data-locPlay') || 'Play';
            this.locPause = this.playButton.getAttribute('data-locPause') || 'Pause';
        }
    }

    /**
     * @name - setDuration
     * @description - Set the duration (max) of the VideoControl's progress slider.
     * @public
     * @param {number} duration - The video's duration in seconds.
     * @returns {void}
     */
    public setDuration(duration: number): void {
        if (isNumber(duration)) {
            if (!!this.progressSlider) {
                this.progressSlider.resetSlider(0, duration);
            }

            if (!!this.timeDuration) {
                this.timeDuration.innerHTML = toElapsedTimeString(duration);
            }
        }
    }

    /**
     * @name - setPlayPosition.
     * @description - Set the duration of the VideoControl's progress slider.
     * @public
     * @param {number} position - The position to set the current progress slider to.
     * @returns {void}
     */
    public setPlayPosition(position: number): void {
        if (isNumber(position) && !!this.progressSlider) {
            this.progressSlider.setValue(position);
        }
    }

    /**
     * @name - setVolume.
     * @description - Sets the volume.
     * @public
     * @param {number} volume - The desired volume (0-1).
     * @returns {void}
     */
    public setVolume(volume: number): void {
        if (isNumber(volume) && !!this.videoPlayer) {
            this.videoPlayer.setVolume(volume);

            if (!!this.volumeSlider) {
                this.volumeSlider.setValue(Math.round(volume * 100));
                this.updateMuteGlyph();
            }
        }
    }

    /**
     * @name - setMuted.
     * @description - Sets the muted state.
     * @public
     * @param {boolean} muted - The desired mute state, true if the video should be muted, otherwise false.
     * @returns {void}
     */
    public setMuted(muted: boolean): void {
        if (!!this.videoPlayer) {
            this.videoPlayer.setMuted(muted);
            this.updateMuteGlyph();
        }
    }

    /**
     * @name - updateMuteGlyph.
     * @description - Updates the mute/unmute glyph on the volume button.
     * @private
     * @returns {void}
     */
    private updateMuteGlyph(): void {
        if (!!this.videoPlayer && !!this.volumeButton) {
            removeClasses(this.volumeButton, ['glyph-volume', 'glyph-mute']);

            let isMuted = this.videoPlayer.isMuted() || (this.videoPlayer.getVolume() === 0);

            addClass(this.volumeButton, isMuted ? 'glyph-mute' : 'glyph-volume');
        }
    }

    /**
     * @name - prepareToHide.
     * @description - Called when the video controls are about to be hidden.
     *                We use this notification to close all open dialogs.
     * @public
     * @returns {void}
     */
    public prepareToHide(): void {
        this.hideOptionsContainer();
        this.hideVolumeContainer();
    }

    /**
     * @name - onProgressChanged.
     * @description - The progress slider's value changed listener.
     * @private
     * @param {ISliderNotification} notification - The slider notification.
     * @returns {string} - The string to use to represent the current value in the slider thumb tooltip.
     */
    private onProgressChanged(notification: ISliderNotification): string {
        if (!notification) {
            return null;
        }

        if (!!this.videoPlayer && notification.userInitiated) {
            this.videoPlayer.setPlayPosition(notification.value);
        }

        let elapsedTime = toElapsedTimeString(notification.value);

        if (!!this.timeCurrent) {
            this.timeCurrent.innerHTML = elapsedTime;
        }

        return elapsedTime;
    }

    /**
     * @name - onVolumeChanged.
     * @description - The volume slider's value changed listener.
     * @private
     * @param {ISliderNotification} notification - The slider notification.
     * @returns {string} - The string to use to represent the current value in the slider thumb tooltip.
     */
    private onVolumeChanged(notification: ISliderNotification): string {
        if (!notification) {
            return null;
        }

        if (!!this.videoPlayer && (notification.value > 0)) {
            this.videoPlayer.setMuted(false);
        }

        let volume = Math.round(notification.value);

        this.setVolume(volume / 100);
        return volume.toString();
    }

    /**
     * @name - play.
     * @description - Updates the play/pause button's state and calls videoPlayer.play().
     * @private
     * @returns {void}
     */
    private play(): void {
        if (!!this.videoPlayer) {
            this.videoPlayer.play();
        }
    }

    /**
     * @name - pause.
     * @description - Updates the play/pause button's state and calls videoPlayer.pause().
     * @private
     * @returns {void}
     */
    private pause(): void {
        if (!!this.videoPlayer) {
            this.videoPlayer.pause();
        }
    }

    /**
     * @name - updatePlayPauseState.
     * @description - Updates the play/pause button's ux state.
     * @public
     * @returns {void}
     */
    public updatePlayPauseState(): void {
        if (!!this.videoPlayer && !!this.playButton) {
            if (this.videoPlayer.isPlayable()) {
                this.playButton.removeAttribute('disabled');

                if (this.videoPlayer.isPaused()) {
                    if (!!this.playTooltip) {
                        this.playTooltip.innerHTML = this.locPlay;
                    }

                    removeClass(this.playButton, 'glyph-pause');
                    addClass(this.playButton, 'glyph-play');
                } else {
                    if (!!this.playTooltip) {
                        this.playTooltip.innerHTML = this.locPause;
                    }

                    removeClass(this.playButton, 'glyph-play');
                    addClass(this.playButton, 'glyph-pause');
                    this.prepareToHide();
                }
            } else {
                // When the video isn't playable we'll show as play but disabled.
                if (!!this.playTooltip) {
                    this.playTooltip.innerHTML = this.locPlay;
                }

                removeClass(this.playButton, 'glyph-pause');
                addClass(this.playButton, 'glyph-play');
                this.playButton.setAttribute('disabled', 'disabled');
            }
        }
    }

    /**
     * @name - onPlayPauseEvents
     * @private
     * @description - The play/pause button's click/mouse event listener.
     * @param {Event} event - The event.
     * @returns {void}
     */
    private onPlayPauseEvents = (event: Event): void => {
        if (event.type === 'click') {
            if (!!this.videoPlayer) {
                if (this.videoPlayer.isPaused()) {
                    this.play();
                } else {
                    this.pause();
                }
            }
        } else if (event.type === 'mouseover') {
            if (!!this.playTooltip) {
                removeClass(this.playTooltip, VideoControls.screenReaderOnlyClass);
            }
        } else if (event.type === 'mouseout') {
            if (!!this.playTooltip) {
                addClass(this.playTooltip, VideoControls.screenReaderOnlyClass);
            }
        }
    }

    /**
     * @name - onVolumeEvents
     * @description - The volume button's keyboard/mouse event listener.
     * @private
     * @param {Event} event - The event.
     * @returns {void}
     */
    private onVolumeEvents = (event: Event): void => {
        if (event.type === 'click') {
            if (getEventTargetOrSrcElement(event) === this.volumeButton) {
                this.setMuted(!this.videoPlayer.isMuted());
            }
        } else if (event.type === 'mouseover' || event.type === 'focus') {
            this.showVolumeContainer();
        } else if (event.type === 'mouseout' || event.type === 'blur') {
            this.hideVolumeContainer();
        }
    }

    /**
      * @name - onVolumeSliderEvents
      * @description - The volume slider's keyboard/mouse event listener.
      * @private
      * @param {Event} event - The event.
      * @returns {void}
      */
    private onVolumeSliderEvents = (event: Event): void => {
       if (event.type === 'focus') {
           this.showVolumeContainer();
       } else if (event.type === 'blur') {
           this.hideVolumeContainer();
       }
    }

    /**
     * @name - showVolumeContainer
     * @description - Show the volume container.
     * @private
     * @returns {void}
     */
    private showVolumeContainer(): void {
        if (!!this.volumeContainer) {
            this.volumeContainer.setAttribute(VideoControls.ariaHidden, 'false');
            this.onlyOneDialog(this.volumeContainer);
        }
    }

    /**
     * @name - hideVolumeContainer
     * @description - Hide the volume container.
     * @private
     * @returns {void}
     */
    private hideVolumeContainer(): void {
        if (!!this.volumeContainer) {
            this.volumeContainer.setAttribute(VideoControls.ariaHidden, 'true');
        }
    }

    /**
     * @name - onFullScreenEvents
     * @description - The fullScreen button's click/mouse event listener.
     * @private
     * @param {Event} event - The event.
     * @returns {void}
     */
    private onFullScreenEvents = (event: Event): void => {
        if (event.type === 'click') {
            if (!!this.videoPlayer) {
                this.videoPlayer.setFullscreen();
            }
        } else if (event.type === 'mouseover') {
            if (!!this.fullScreenTooltip) {
                this.fullScreenTooltip.setAttribute(VideoControls.ariaHidden, 'false');
            }
        } else if (event.type === 'mouseout') {
            if (!!this.fullScreenTooltip) {
                this.fullScreenTooltip.setAttribute(VideoControls.ariaHidden, 'true');
            }
        }
    };

    /**
     * @name - optionsDialogInit
     * @description - Initializes the options dialog. Persists top level menu information and adds click listeners.
     * @private
     * @returns {void}
     */
    private optionsDialogInit(): void {
        if (!!this.optionsContainer) {
            this.odParent = selectFirstElement('ul', this.optionsContainer);
            this.odDimensions = getClientRect(this.odParent);
            addEvent(this.odParent, eventTypes.click, this.onOptionsDialogClick);
        }
    }

    /**
     * @name - toggleOptionsDialog
     * @description - Toggles the options container's show/hide state.
     * @private
     * @returns {void}
     */
    private toggleOptionsDialog = (): void => {
        if (!!this.optionsContainer) {
            if (this.optionsContainer.getAttribute(VideoControls.ariaHidden) === 'false') {
                this.hideOptionsContainer();
            } else {
                this.showOptionsContainer();
            }
        }
    }

    /**
     * @name - showOptionsContainer
     * @description - Show the options container.
     * @private
     * @returns {void}
     */
    private showOptionsContainer(): void {
        if (!!this.optionsContainer && !!this.odParent) {
            this.optionsContainer.setAttribute(VideoControls.ariaHidden, 'false');
            css(this.optionsContainer, 'height', this.odDimensions.height + 'px');
            css(this.optionsContainer, 'overflowY', 'hidden');
            css(this.odParent, 'left', '0');
            this.odClearSubActive();
            this.onlyOneDialog(this.optionsContainer);
        }
    }

    /**
     * @name - hideOptionsContainer
     * @description - Hide the options container.
     * @private
     * @returns {void}
     */
    private hideOptionsContainer = (): void => {
        if (!!this.optionsContainer) {
            this.optionsContainer.setAttribute(VideoControls.ariaHidden, 'true');
        }
    }

    /**
     * @name - onlyOneDialog
     * @description - Ensures that only one dialog (options/volume) is open at a time.
     * @private
     * @param {HTMLElement} dialog - The dialog that is allowed to remain open.
     * @returns {void}
     */
    private onlyOneDialog(dialog: HTMLElement): void {
        if (!!this.optionsContainer && !!this.volumeContainer &&
            (this.optionsContainer.getAttribute(VideoControls.ariaHidden) === 'false') &&
            (this.volumeContainer.getAttribute(VideoControls.ariaHidden) === 'false')) {
            if (dialog === this.optionsContainer) {
                this.hideVolumeContainer();
            } else {
                this.hideOptionsContainer();
            }
        }
    }

    /**
     * @name - onOptionsDialogClick
     * @description - The options dialog's click event listener.
     * @private
     * @param {MouseEvent} event - the click event.
     * @returns {void}
     */
    private onOptionsDialogClick = (event: MouseEvent): void => {
        event = getEvent(event) as MouseEvent;

        let target = getEventTargetOrSrcElement(event);
        let nextMenuName = target.getAttribute('data-video-options');

        if (nextMenuName === 'back') {
            this.showOptionsContainer();
            preventDefault(event);
            return;
        }

        if (nextMenuName) {
            if (!!this.optionsContainer && !!this.odParent) {
                let nextMenu = selectFirstElement('ul[data-video-sub-options=' + nextMenuName + ']', this.optionsContainer);

                css(nextMenu, 'display', 'block');

                // This must be done after the above display block setting or the height will be zero.
                let nextHeight = this.calcHeight(nextMenu);

                css(this.optionsContainer, 'height', nextHeight + 'px');
                css(this.odParent, 'left', '-160px');
                this.odSubActive = nextMenu;
            }

            preventDefault(event);
            return;
        }

        if (!!this.odSubActive) {
            preventDefault(event);

            let value = target.getAttribute('data-video-selectable');

            if (!value && (<any>target).firstElementChild) {
                target = (<any>target).firstElementChild;
                value = target.getAttribute('data-video-selectable');
            }

            if (value) {
                for (let sibling of selectElements('a', this.odSubActive)) {
                    removeClass(sibling, 'glyph-check-mark');
                }

                addClass(target, 'glyph-check-mark');

                if (!!this.videoPlayer) {
                    this.videoPlayer.onOptionChanged({
                        category: this.odSubActive.getAttribute('data-video-sub-options'),
                        id: target.parentElement.id,
                        href: target.getAttribute('href')
                    });
                }
            }
        }

        this.hideOptionsContainer();
    }

    /**
     * @name - calcHeight
     * @description - Calculate the options dialog's submenu's height.
     * @private
     * @param {HTMLElement} submenu - the submenu to calcuate the height of.
     * @returns {number} - The calculated height.
     */
    private calcHeight(submenu: HTMLElement): number {
        if (!submenu || !this.videoControls) {
            return 0;
        }

        let subMenuHeight = getClientRect(submenu).height;
        let videoDimensions = getClientRect((this.videoControls as Node).parentElement);
        let videoControlsDimensions = getClientRect(this.videoControls);
        let availableHeight = videoDimensions.height - videoControlsDimensions.height;

        if (subMenuHeight > availableHeight) {
            css(this.optionsContainer, 'overflowY', 'scroll');
            subMenuHeight = availableHeight;
        } else {
            css(this.optionsContainer, 'overflowY', 'hidden');
        }

        return subMenuHeight;
    }

    /**
     * @name - odClearSubActive
     * @description - Clear the options dialog's active submenu.
     * @private
     * @returns {void}
     */
    private odClearSubActive(): void {
        if (!!this.odSubActive) {
            css(this.odSubActive, 'display', 'none');
            this.odSubActive = null;
        }
    }

    /**
     * @name - setOptions
     * @description - Sets the list of supported options into the specified options menu.
     * @public
     * @param {IVideoOptionCollection} optionsCollection - A collection of options supported by the current video.
     * @returns {void}
     */
    public setOptions(optionsCollection: IVideoOptionCollection): void {
        if (!optionsCollection || !optionsCollection.options || !optionsCollection.options.length ||
            !optionsCollection.category || !this.odParent) {
            return;
        }

        if (optionsCollection.category === 'info') {
            let option = optionsCollection.options[0];

            if (option && option.href) {
                let infoLink = selectFirstElementT<HTMLAnchorElement>('a', this.odParent);

                if (infoLink) {
                    infoLink.setAttribute('href', option.href);
                }
            }

            return;
        }

        let fixedItems = optionsCollection.category === 'f-video-share' ? 1 : 2;
        let optionsList = selectFirstElement('ul[data-video-sub-options=\'' + optionsCollection.category + '\']', this.odParent);

        if (!!optionsList) {
            let oldOptions = selectElements('li', optionsList);

            if (!!oldOptions && (oldOptions.length > fixedItems)) {
                while (oldOptions.length > fixedItems) {
                    removeElement(oldOptions.pop());
                }

                let cloneSource = oldOptions.pop();

                if (fixedItems === 1) {
                    cloneSource = cloneSource.cloneNode(true) as HTMLLIElement;
                    removeClasses(cloneSource.firstElementChild as HTMLElement, ['glyph-chevron-left', 'c-glyph']);
                    cloneSource.firstElementChild.removeAttribute('data-video-options');
                }

                removeClass(cloneSource.firstElementChild as HTMLElement, 'glyph-check-mark');

                let selectedOption: HTMLElement = null;

                for (let option of optionsCollection.options) {
                    let item = optionsList.appendChild(cloneSource.cloneNode(true)) as HTMLElement;

                    item.id = option.id;
                    item.firstElementChild.innerHTML = option.value;

                    if (option.selected) {
                        selectedOption = item.firstElementChild as HTMLElement;
                    }

                    if (option.href) {
                        item.firstElementChild.setAttribute('href', option.href);
                        addClass(item.firstElementChild as HTMLElement, option.glyph);
                    }

                    if (option.glyph) {
                        addClass(item.firstElementChild as HTMLElement, 'c-glyph');
                        addClass(item.firstElementChild as HTMLElement, option.glyph);
                    }

                    if (option.image) {
                        let image = item.firstElementChild.appendChild(document.createElement('img')) as HTMLElement;

                        addClass(image, 'c-image');
                        image.setAttribute('src', option.image);
                    }
                }

                if (optionsCollection.category !== 'f-video-share') {
                    if (!selectedOption) {
                        selectedOption = cloneSource.firstElementChild as HTMLAnchorElement;
                    }

                    addClass(selectedOption, 'glyph-check-mark');

                    if (!!this.videoPlayer) {
                        this.videoPlayer.onOptionChanged({
                            category: optionsCollection.category,
                            id: selectedOption.parentElement.id,
                            href: selectedOption.getAttribute('href')
                        });
                    }
                }
            }
        }
    }
}

/**
 * @interface - IVideoOption
 * @interfacedesc - The IVideoOption interface that defines of the data structure used to convey option information.
 * @export
 */
export interface IVideoOption {
    id?: string;
    href?: string;
    value?: string;
    selected?: boolean;
    image?: string;
    glyph?: string;
}

/**
 * @interface - IVideoOptionCollection
 * @interfacedesc - The IVideoOptionCollection interface that defines of the data structure used to convey option information.
 * @export
 */
export interface IVideoOptionCollection {
    category: string;
    options: IVideoOption[];
}

/**
 * @interface IVideoOptionChangedNotification
 * @interfacedesc - The data contract interface used for video option changed notifications.
 * @export
 */
export interface IVideoOptionChangedNotification {
    category: string;
    id: string;
    href?: string;
}

/**
 * @interface - IVideoControls
 * @interfacedesc - The IVideoControls interface that video controls must implement for Video players to interoperate with.
 * @export
 */
export interface IVideoControls {
    setMuted(muted: boolean): void;
    setVolume(volume: number): void;
    setDuration(duration: number): void;
    setPlayPosition(position: number): void;
    updatePlayPauseState(): void;
    prepareToHide(): void;
    setOptions(optionCollections: IVideoOptionCollection): void;
}

/**
 * @interface - IVideoPlayer
 * @interfacedesc - The IVideoPlayer interface that video players must implement for VideoControls to interoperate with.
 * @export
 */
export interface IVideoPlayer {
    play(): void;
    pause(): void;
    isPlayable(): boolean;
    isPaused(): boolean;
    setPlayPosition(position: number): void;
    getVolume(): number;
    setVolume(volume: number): void;
    isMuted(): boolean;
    setMuted(muted: boolean): void;
    setFullscreen(): void;
    onOptionChanged(notification: IVideoOptionChangedNotification): void;
}
