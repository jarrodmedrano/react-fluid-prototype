/// <amd-module name='dateTimePicker'/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {
    addClass,
    addEvent,
    addEvents,
    addThrottledEvents,
    eventTypes,
    getEvent,
    getEventTargetOrSrcElement,
    getText,
    isDescendent,
    preventDefault,
    removeClass,
    removeEvent,
    removeEvents,
    removeInnerHtml,
    setText,
    selectElements,
    selectFirstElement,
    stopPropagation
} from 'htmlExtensions';
import {format, isNullOrWhiteSpace} from 'stringExtensions';
import {apiDeprecated, getKeyCode} from 'utility';
import {Publisher, ISubscriber} from 'publisher';
import {ComponentFactory} from 'componentFactory';
import {keycodes} from 'keycodes';

/**
* @interface IDateTimePickerNotification
* @description - The data contract interface used for DateTimePicker notifications.
* @export
*/
export interface IDateTimePickerNotification {
    newDateTime: string;
    oldDateTime: string;
}

/**
* @interface IDateTimePickerSubscriber
* @description - The interface which DateTimePicker notification subscribers must implement.
* @export
*/
export interface IDateTimePickerSubscriber extends ISubscriber {
    onDateTimeChanged(notification: IDateTimePickerNotification): void;
}

/**
* @class - DateTimePicker
* @classdesc - The Date Time Picker component
* @export
*/
export class DateTimePicker extends Publisher<IDateTimePickerSubscriber> {

    /**
    * @name - selector
    * @description - The DateTimePicker component selector.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.c-date-time-picker';

    /**
    * @name - changeThreshold
    * @memberof - DateTimePicker
    * @description - Used when comparing two Date values to determine if they are close enough to not trigger a time
    *                change notification. We need to do this because using the js Date object can result in different
    *                millesecond values returned from getTime() for the same year/month/day/hour/minute/second. (argh)
    *                For now just comparing to the nearest second. If that proves to still be problematic we should
    *                be able to increase it to anywhere less than the DataTimePicker's one minute granularity.
    * @static
    * @private
    * @type {number}
    */
    public static changeThreshold = 1000;

    /**
     * @name - scrollUpValue
     * @description - The Data element attribute value for scrollUp button
     * @static
     * @private
     * @type {string}
     */
    private static scrollUpValue = 'scrollUp';

    /**
     * @name - scrollDownValue
     * @description - The Data element attribute value for scrollUp button
     * @static
     * @private
     * @type {string}
     */
    private static scrollDownValue = 'scrollDown';

    /**
     * @name - buttonFormatterAttribute
     * @description - The attribute that holds the formatter for aria labels on buttons
     * @static
     * @private
     * @type {string}
     */
    private static buttonFormatterAttribute = 'data-formatter-aria-label';

    /**
     * @name - activeValueStorageAttribute
     * @description - The data attribute that should store the active value of a column
     * @static
     * @private
     * @type {string}
     */
    private static activeValueStorageAttribute = 'data-active-value';

    /**
     * @name - hiddenFocusClass
     * @description - the CSS class to add to elements to remove the focus rectangle
     * @static
     * @private
     * @type {string}
     */
    private static hiddenFocusClass = 'x-hidden-focus';

    /**
     * @name - pickerType
     * @description - Describes what form of the Date Time Picker is being used
     * @private
     * @type {DateTimePickerType}
     */
    private pickerType: DateTimePickerType;

    /**
     * @name - picker
     * @description - The element wrapping picking options
     * @private
     * @type {HTMLElement}
     */
    private picker: HTMLElement;

    /**
     * @name - cancelButton
     * @description - The cancel button element
     * @private
     * @type {HTMLButtonElement}
     */
    private cancelButton: HTMLButtonElement;

    /**
     * @name - applyButton
     * @description - The apply button element
     * @private
     * @type {HTMLButtonElement}
     */
    private applyButton: HTMLButtonElement;

    /**
     * @name - scrollDelay
     * @description - Return number of setTimeout for scrolling delay
     * @private
     * @type {number}
     */
    private scrollDelay: number;

    /**
     * @name - scrollInterval
     * @description - Return number of setInternal for scrolling
     * @private
     * @type {number}
     */
    private scrollInterval: number;

    /**
     * @name - dateSelector
     * @description - The date selector element
     * @private
     * @type {HTMLElement}
     */
    private dateSelector: HTMLElement;

    /**
     * @name - monthColumn
     * @description - The month column
     * @private
     * @type {HTMLElement}
     */
    private monthColumn: HTMLElement;

    /**
     * @name - dayColumn
     * @description - The day column
     * @private
     * @type {HTMLElement}
     */
    private dayColumn: HTMLElement;

    /**
     * @name - yearColumn
     * @description - The year column
     * @private
     * @type {HTMLElement}
     */
    private yearColumn: HTMLElement;

    /**
     * @name - totalMonths
     * @description - The total number of months
     * @private
     * @type {number}
     */
    private totalMonths: number;

    /**
     * @name - months
     * @description - A localized list of all of the months in the year, including a fake '0' month for index 0 of the array.
     *                Months is a weird case.  Months are not treated as zero-based, but months are stored in arrays which are zero-based.
     *                Therefore, insert a fake '0' month at index 0.  That way this.months[1] === January
     *
     * @private
     * @type {string[]}
     */
    private months: string[];

    /**
     * @name - days
     * @description - Each item in the array corresponds to the number of days in the month.
     *                For example, days[1] = 31 which corresponds to January having 31 days.
     *                Index 0 has zero days since this.months[0] has a fake entry.
     * @private
     * @type {number[]}
     */
    private days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    /**
     * @name - ariaSelected
     * @description - The aria-selected element attribute
     * @private
     * @type {string}
     */
    private ariaSelected = 'aria-selected';

    /**
     * @name - ariaLabel
     * @description - The aria-label element attribute
     * @private
     * @type {string}
     */
    private ariaLabel = 'aria-label';

    /**
     * @name - ariaHidden
     * @description - The aria-hidden element attribute
     * @private
     * @type {string}
     */
    private ariaHidden = 'aria-hidden';

    /**
     * @name - dateTimePickerDataAttribute
     * @description - The Data element attribute for DateTimePicker
     * @private
     * @type {string}
     */
    private dateTimePickerDataAttribute = 'data-date-time-picker';

    /**
     * @name - monthInfo
     * @description - The compiled information about each month (its localized name and number of days per month)
     * @private
     * @type {DateTimePickerMonthInfo[]}
     */
    private monthInfo: DateTimePickerMonthInfo[];

    /**
     * @name - amPmSelection
     * @description - The list of possible values for AM/PM
     * @private
     */
    private amPmSelection = ['AM', 'PM'];

    /**
     * @name - timeSelector
     * @description - The time selector element
     * @private
     * @type {HTMLElement}
     */
    private timeSelector: HTMLElement;

    /**
     * @name - hourColumn
     * @description - The hour column element
     * @private
     * @type {HTMLElement}
     */
    private hourColumn: HTMLElement;

    /**
     * @name - minuteColumn
     * @description - The minute column element
     * @private
     * @type {HTMLElement}
     */
    private minuteColumn: HTMLElement;

    /**
     * @name - amPmColumn
     * @description - The AM/PM column element
     * @private
     * @type {HTMLElement}
     */
    private amPmColumn: HTMLElement;

    /**
     * @name - numberOfElementsThatAppearInColumn
     * @description - The number of elements that appear above or below the active item
     * @private
     * @type {number}
     */
    private numberOfElementsThatAppearInColumn = 5;

    /**
     * @name - scrollButtons
     * @description - The scroll buttons
     * @private
     * @type {HTMLElement[]}
     */
    private scrollButtons: HTMLElement[];

    /**
     * @name - columnTriggerButtons
     * @description - The trigger buttons to launch the dialog, relate to each column
     * @private
     * @type {HTMLElement[]}
     */
    private columnTriggerButtons: HTMLElement[];

    /**
     * @name - columns
     * @description - The columns of selectable elements
     * @private
     * @type {HTMLElement}
     */
    private columns: HTMLElement[];

    /**
     * @name - activeValueStorage
     * @description - The location to store the active value attribute
     * @private
     * @type {string}
     */
    private activeValueStorage: string;

    /**
     * @name - activeColumn
     * @description - The column currently being manipulated
     * @private
     * @type {string}
     */
    private activeColumn: HTMLElement;

    /**
     * @name - pickerIsOpen
     * @description - Open state of the picker
     * @private
     * @type {string}
     */
    private pickerIsOpen: boolean = false;

    /**
    * @name - lastClickedElement
    * @description - Store a reference to the last clicked element
    * @private
    * @type {HTMLElement}
    */
    private lastClickedElement: HTMLElement;

    /**
    * @name - currentDateTime
    * @memberof - DateTimePicker
    * @description - The current date/time value
    * @private
    * @type {Date}
    */
    private currentDateTime: Date;

    /**
     * @description - Creates an instance of DateTimePicker.
     * @param {HTMLElement} dateTimePicker  - the Date Time Picker DOM element
     */
    constructor(element: HTMLElement) {
        super(element);
        this.update();
    }

    /**
     * @name - update
     * @description - updates the component state
     *
     * @protected
     * @returns {Void}
     */
    protected update(): void {
        if (!this.element) {
            return;
        }

        let pickerType = this.element.getAttribute(this.dateTimePickerDataAttribute);
        this.picker = this.getDateTimePickerElement('date-selector')
                    || this.getDateTimePickerElement('time-selector12')
                    || this.getDateTimePickerElement('time-selector24');

        // Store the attribute where we should store the active value of the columns
        // This check provides backwards compat for legacy shape that uses aria-label
        // values in the logical flow of the component
        this.activeValueStorage
            = selectElements('button[' + DateTimePicker.activeValueStorageAttribute + ']', this.element).length
            ? DateTimePicker.activeValueStorageAttribute
            : this.ariaLabel;

        switch (pickerType) {
            case 'date':
                this.pickerType = DateTimePickerType.date;
                this.monthColumn = this.getDateTimePickerElement('month', 'ul');
                this.dayColumn = this.getDateTimePickerElement('day', 'ul');
                this.yearColumn = this.getDateTimePickerElement('year', 'ul');

                let localizedMonths = this.monthColumn.getAttribute('data-months');
                if (!localizedMonths) {
                    return;
                }

                // Months is a weird case.  Months are not treated as zero-based, but months are stored in arrays which are zero-based.
                // Therefore, insert a fake '0' month at index 0.  That way this.months[1] === January
                let daysLength = this.days.length;
                this.months = localizedMonths.split(',');
                this.months.splice(0, 0, '');
                if (this.months.length !== daysLength) {
                    return;
                }

                this.totalMonths = this.months.length - 1;

                this.monthInfo = new Array<DateTimePickerMonthInfo>(daysLength);
                for (let monthIndex = 0; monthIndex <= this.totalMonths; monthIndex++) {
                    this.monthInfo[monthIndex] = {
                        name: this.months[monthIndex],
                        days: this.days[monthIndex]
                    };
                }

                removeInnerHtml(this.monthColumn);
                removeInnerHtml(this.dayColumn);
                removeInnerHtml(this.yearColumn);
                this.buildSelector(this.monthColumn, 'month', null);
                this.buildSelector(this.dayColumn, 'day', null);
                this.buildSelector(this.yearColumn, 'year', null);
                break;
            case 'time':
            case 'time24':
                this.pickerType = pickerType.indexOf('24') < 0 ? DateTimePickerType.time12hours : DateTimePickerType.time24hours;
                let timeSelectorValue = 'time-selector';
                let hourColumnValue = 'hour';
                let minuteColumnValue = 'minute';

                if (this.pickerType === DateTimePickerType.time24hours) {
                    timeSelectorValue += '24';
                    hourColumnValue += '24';
                    minuteColumnValue += '24';
                } else {
                    timeSelectorValue += '12';
                    this.amPmColumn = this.getDateTimePickerElement('ampm', 'ul');
                }

                this.hourColumn = this.getDateTimePickerElement(hourColumnValue, 'ul');
                this.minuteColumn = this.getDateTimePickerElement(minuteColumnValue, 'ul');

                removeInnerHtml(this.hourColumn);
                removeInnerHtml(this.minuteColumn);
                this.buildSelector(this.hourColumn, hourColumnValue, null);
                this.buildSelector(this.minuteColumn, minuteColumnValue, null);

                if (this.pickerType === DateTimePickerType.time12hours) {
                    this.buildAmPm(this.amPmColumn);
                }
                break;
        }

        // We can't get around using aria-label as data in some places due to the
        // way this is built, but we can at least reference it from a different attribute
        if (this.activeValueStorage === DateTimePicker.activeValueStorageAttribute) {
            let listItems = selectElements('li', this.picker);

            for (let item of listItems) {
                let label = item.getAttribute(this.ariaLabel);
                if (!!label) {
                    item.setAttribute(DateTimePicker.activeValueStorageAttribute, label);
                }
            }
        }

        // initialize private variables and create HTML for the date/time picker selectors (the columns)
        this.cancelButton = this.getDateTimePickerElement('cancel') as HTMLButtonElement;
        this.applyButton = this.getDateTimePickerElement('apply') as HTMLButtonElement;
        this.scrollButtons = [] as HTMLElement[];
        this.columnTriggerButtons = [] as HTMLElement[];

        // Store all the buttons used to launch the picker
        let columnTriggerButtons = this.element.children;

        for (let triggerIndex = 0, triggerLength = columnTriggerButtons.length - 1; triggerIndex < triggerLength; triggerIndex ++) {
            let child = columnTriggerButtons.item(triggerIndex);
            if (child.nodeType === nodeTypes.Element && child.nodeName === 'BUTTON') {
                this.columnTriggerButtons.push(child as HTMLElement);
            }
        }

        this.columns = selectElements('div[' + this.dateTimePickerDataAttribute + ']', this.picker);

        for (let column of this.columns) {
            let scrollButtons = selectElements('button', column);
            if (scrollButtons.length === 2) {
                // There should only be two buttons in each column
                scrollButtons[0].setAttribute(this.dateTimePickerDataAttribute, DateTimePicker.scrollUpValue);
                scrollButtons[1].setAttribute(this.dateTimePickerDataAttribute, DateTimePicker.scrollDownValue);
                this.scrollButtons.push(scrollButtons[0], scrollButtons[1]);
            }
        }

        this.updateCurrentDateTime();

        // attach event listeners
        addEvents(this.applyButton, 'keydown click', this.handleApplyClicked);
        addEvents(this.cancelButton, 'keydown click', this.handleCancelClicked);
        addEvents(this.scrollButtons, 'mouseenter mouseleave', this.handleScrollButtons);
        addEvent(this.element, eventTypes.keydown, this.handleKeyDown);
        addEvent(this.element, eventTypes.click, this.handleMouseClick);
        this.ignoreNextDOMChange = true;
    }

    /**
     * @name - teardown
     * @description - cleans up the component
     *
     * @protected
     * @returns {Void}
     */
    protected teardown(): void {
        removeEvents(this.applyButton, 'keydown click', this.handleApplyClicked);
        removeEvents(this.cancelButton, 'keydown click', this.handleCancelClicked);
        removeEvents(this.scrollButtons, 'mouseenter mouseleave', this.handleScrollButtons);
        removeEvent(this.element, eventTypes.keydown, this.handleKeyDown);
        removeEvent(this.element, eventTypes.click, this.handleMouseClick);
        removeEvents(this.columns, 'mousewheel DOMMouseScroll', this.handleMouseScroll);
    }

    /**
     * @name - openPicker
     * @description - Opens the picker popup
     *
     * @private
     * @param {HTMLElement} target - The element clicked that caused the picker to open
     * @param [boolean] removeFocus - Remove the visual focus state after the picker opens
     * @returns {Void}
     */
    private openPicker(trigger: HTMLElement, removeFocus = false): void {
        this.pickerIsOpen = true;
        this.ignoreNextDOMChange = true;
        // Set focus to correct element
        let clickedColumn = selectFirstElement(
            '[' + this.dateTimePickerDataAttribute + '="' + trigger.getAttribute(this.dateTimePickerDataAttribute) + '"]',
            this.picker);

        this.activeColumn = clickedColumn;

        if (this.pickerType === DateTimePickerType.date) {
            removeInnerHtml(this.monthColumn);
            removeInnerHtml(this.dayColumn);
            removeInnerHtml(this.yearColumn);
            this.buildSelector(this.monthColumn, 'month', null);
            this.buildSelector(this.dayColumn, 'day', null);
            this.buildSelector(this.yearColumn, 'year', null);
        } else if (this.pickerType === DateTimePickerType.time12hours) {
            removeInnerHtml(this.hourColumn);
            removeInnerHtml(this.minuteColumn);
            this.buildSelector(this.hourColumn, 'hour', null);
            this.buildSelector(this.minuteColumn, 'minute', null);
            this.selectAmPm(null);
        } else if (this.pickerType === DateTimePickerType.time24hours) {
            this.buildSelector(this.hourColumn, 'hour24', null);
            this.buildSelector(this.minuteColumn, 'minute24', null);
        }

        this.picker.setAttribute(this.ariaHidden, 'false');

        let nextFocusedElement = (<HTMLElement>(selectFirstElement('[' + this.ariaSelected + '="true"]', clickedColumn)));

        if (!!nextFocusedElement) {
            nextFocusedElement.focus();

            // Make sure the focus rectangle stays away when the user clicks.
            // This has to be done here in the dateTimePicker because this method specifically tells pageBehaviors to ignore the DOM change
            // by setting this.ignoreNextDOMChange = true.
            if (removeFocus) {
                addClass(nextFocusedElement, DateTimePicker.hiddenFocusClass);
            }
        }

        addEvent(window, eventTypes.mousedown, this.handleOutsideClick);
        addEvents(this.columns, 'mousewheel DOMMouseScroll', this.handleMouseScroll);
    }

    /**
     * @name - closePicker
     * @description - Closes the picker and does cleanup
     *
     * @private
     * @returns {Void}
     */
    private closePicker():void {
        this.pickerIsOpen = false;
        this.picker.setAttribute(this.ariaHidden, 'true');
        removeEvent(window, eventTypes.scroll, this.handleMouseScroll);
        removeEvent(window, eventTypes.mousedown, this.handleOutsideClick);
        removeEvents(this.columns, 'mousewheel DOMMouseScroll', this.handleMouseScroll);

        let activeColumnIndex = this.columns.indexOf(this.activeColumn);

        if (activeColumnIndex >= 0 && activeColumnIndex < this.columnTriggerButtons.length) {
            this.columnTriggerButtons[activeColumnIndex].focus();
        }

        return;
    }

    /**
     * @name - handleKeyDown
     * @description - Handle the keydown event
     *
     * @protected
     * @param {KeyboardEvent} event - The event object
     * @returns {Void}
     */
    private handleKeyDown = (event: KeyboardEvent): void => {
        this.ignoreNextDOMChange = true;
        event = getEvent(event as Event) as KeyboardEvent;
        let keyCode = getKeyCode(event);
        let target = getEventTargetOrSrcElement(event);
        let nextColumn: HTMLElement;
        let previousColumn: HTMLElement;
        let element: HTMLElement;

        switch (keyCode) {
            case keycodes.Enter:
                if (this.pickerIsOpen) {
                    this.updatePicker();
                    this.closePicker();
                } else {
                    this.openPicker(target, false);
                }

                break;
            case keycodes.Escape:
                this.closePicker();
                break;
            case keycodes.ArrowLeft:
                if (!this.activeColumn) {
                    break;
                }

                previousColumn = this.activeColumn.previousElementSibling as HTMLElement;

                if (!previousColumn) {
                    break;
                }

                element = selectFirstElement('[' + this.ariaSelected + '="true"]',
                              previousColumn) as HTMLElement;
                if (element) {
                    this.activeColumn = previousColumn;
                    element.focus();
                }
                return;
            case keycodes.ArrowRight:
                if (!this.activeColumn) {
                    break;
                }

                nextColumn = this.activeColumn.nextElementSibling as HTMLElement;

                if (!nextColumn) {
                    break;
                }

                if (this.activeColumn.nextElementSibling !== null)  {
                    element = selectFirstElement('[' + this.ariaSelected + '="true"]',
                                  nextColumn as HTMLElement) as HTMLElement;
                    if (element) {
                        this.activeColumn = nextColumn;
                        element.focus();
                    }
                }
                return;
            case keycodes.ArrowUp:
                preventDefault(event);
                this.scrollColumn(this.activeColumn, DateTimePicker.scrollUpValue);
                return;
            case keycodes.ArrowDown:
                preventDefault(event);
                this.scrollColumn(this.activeColumn, DateTimePicker.scrollDownValue);
                return;
            case keycodes.Tab:
                if (!this.pickerIsOpen) {
                    break;
                }

                nextColumn = event.shiftKey
                    ? this.activeColumn.previousElementSibling as HTMLElement
                    : this.activeColumn.nextElementSibling as HTMLElement;

                if (!nextColumn) {
                    break;
                }

                this.activeColumn = nextColumn;

                break;
        }
    }

    /**
     * @name - handleMouseClick
     * @description - Handle mouse down event
     *
     * @protected
     * @param {MouseEvent} event - The click event
     * @returns {void}
     */
    private handleMouseClick = (event: MouseEvent): void => {
        this.ignoreNextDOMChange = true;
        let target = getEventTargetOrSrcElement(event);

        // Store a reference to the target to validate against later. We
        // need to do this because we can't verify where click events are
        // actually coming from because we're removing and adding elements to
        // the DOM all the time.
        this.lastClickedElement = target;

        if (!this.pickerIsOpen) {
            // If picker is closed, make sure the click event is on a button
            // and then open the picker
            if (this.columnTriggerButtons.indexOf(target) === -1) {
                target = this.columnTriggerButtons[0];
            }

            this.openPicker(target, true);

            return;
        }

        if (target.nodeName === 'LI') {
            if (!target.parentElement || !target.parentElement.parentElement) {
                return;
            }

            let columnType = target.parentElement.parentElement.getAttribute(this.dateTimePickerDataAttribute);
            let ariaLabel = target.getAttribute(this.ariaLabel);

            if (columnType === 'ampm') {
                this.selectAmPm(ariaLabel);
            } else {
                let targetColumn = target.parentElement;
                removeInnerHtml(targetColumn);
                let column = this.getDateTimePickerElement(columnType, 'ul');
                this.buildSelector(column, columnType, ariaLabel);
                this.recalculateDaysInMonth(targetColumn);
            }
        }
    }

    /**
     * @name - handleOutsideClick
     * @description - Handles click outside of datetime picker
     *
     * @protected
     * @param {Event} event - The event object
     * @returns {Void}
     */
    private handleOutsideClick = (event: Event): void => {
        let target = getEventTargetOrSrcElement(event);
        // If click comes from inside picker, don't close the picker
        if (!isDescendent(this.element, target) && this.lastClickedElement !== target) {
            this.updatePicker();
            this.closePicker();
        }
    }

    /**
     * @name - handleApplyClicked
     * @description - Handles click event from apply button
     *
     * @protected
     * @param {Event} event - The event object
     * @returns {Void}
     */
    private handleApplyClicked = (event: Event): void => {
        event = getEvent(event);
        // TODO: 9049461 - Remove stopPropagation
        stopPropagation(event);
        this.updatePicker();
        this.closePicker();
    }

    /**
     * @name - handleCancelClicked
     * @description - Handles click event from cancel button
     *
     * @protected
     * @param {Event} event - The event object
     * @returns {Void}
     */
    private handleCancelClicked = (event: Event): void => {
        event = getEvent(event);
        // TODO: 9049461 - Remove stopPropagation
        stopPropagation(event);
        this.closePicker();
    }

    /**
     * @name - handleScrollButtons
     * @description - Handles usage of scroll buttons
     *
     * @protected
     * @param {Event} event - The event object
     * @returns {Void}
     */
    private handleScrollButtons = (event: Event): void => {
        this.ignoreNextDOMChange = true;
        event = getEvent(event);
        // TODO: 9049461 - Remove stopPropagation
        stopPropagation(event);

        let target = getEventTargetOrSrcElement(event) as HTMLElement;
        let column = target.parentElement;
        let direction = target.getAttribute(this.dateTimePickerDataAttribute);


        // Control repeated scrolling action
        if (event.type === 'mouseenter') {
            this.scrollDelay = setTimeout(() => {
                this.scrollInterval = null;
                clearTimeout(this.scrollDelay);
                this.scrollDelay = null;
                this.scrollInterval = setInterval(() => {
                    this.scrollColumn(column, direction);
                    }, 300);
                }, 150);
            return;
        } else if (event.type === 'mouseleave') {
            clearTimeout(this.scrollDelay);
            clearInterval(this.scrollInterval);
            this.scrollInterval = null;
            this.recalculateDaysInMonth(target);
            return;
        }

        // Scroll Column
        if (direction !== null) {
            this.scrollColumn(column, direction);
        }
    }

    /**
     * @name - handleMouseScroll
     * @description - Handles user scrolling
     *
     * @protected
     * @param {Event} any - The event object. Should be type Event but typescript
                            was barfing on several properties.
     * @returns {Void}
     */
    private handleMouseScroll = (event: any): void => {
        event = getEvent(event as Event);
        preventDefault(event);

        let deltaY = event.deltaY || event.wheelDelta || -(event.detail),
            direction = deltaY < 0 ? DateTimePicker.scrollDownValue : DateTimePicker.scrollUpValue;

        this.scrollColumn(event.currentTarget, direction);
    }

    /**
     * @name - getDateTimePickerElement
     * @description - Gets the Date Time Picker element based on the data-date-time-picker attribute
     *
     * @private
     * @param {string} attributeValue - the attribute value
     * @param {string} [selector] - the extra selector to use (optional)
     * @returns {HTMLElement} - the Date Time Picker element
     */
    private getDateTimePickerElement(attributeValue: string, selector?: string): HTMLElement {
        let extraSelector = isNullOrWhiteSpace(selector) ? '' : ' ' + selector;
        return isNullOrWhiteSpace(attributeValue)
            ? null
            : selectFirstElement('[data-date-time-picker="' + attributeValue + '"] ' + extraSelector, this.element);
    }

    /**
     * @name - scrollColumn
     * @description - Scroll the given column element by creating the next element in the list,
     *                selecting the element now in the center of the list,
     *                and destroying the last element that is falling off the list.
     * @param {HTMLElement} target - The target column
     * @param {string} ariaButton - The button's aria-label attribute value
     *
     * @private
     * @returns {Void}
     */
    private scrollColumn = (column: HTMLElement, direction: string) => {
        if (column === null) {
            return;
        }

        this.ignoreNextDOMChange = true;
        let listItem = selectFirstElement('ul li', column);
        let list = selectFirstElement('ul', column);

        // TODO: Task #8645822: DateTimePicker - Type the date or time content array (don't use type 'any[]')
        let newText: any[];
        let columnType = column.getAttribute(this.dateTimePickerDataAttribute);

        if (columnType === 'ampm') {
            if (direction === DateTimePicker.scrollUpValue) {
                this.selectAmPm('AM');
            } else if (direction === DateTimePicker.scrollDownValue) {
                this.selectAmPm('PM');
            }

            return;
        }

        if (direction === DateTimePicker.scrollUpValue) {
            newText = this.newContent(column, 'up');
            this.prependChildren(listItem, newText[2]);
            this.isLastInList(list, newText[0], 'up', newText[1]);
            this.removeChildren(column, 'bottom');
        } else if (direction === DateTimePicker.scrollDownValue) {
            this.removeChildren(column, 'top');
            newText = this.newContent(column, 'down');
            this.appendChildren(list, newText[2]);
            this.isLastInList(list, newText[0], 'down', newText[1]);
        }
    }

    /**
     * @name - buildSelector
     * @description - Builds the HTML for the given selector (Month selector, day selector, year selector, hour selector, etc.)
     * @param {HTMLElement} column - The column element
     * @param {string} elementType - the column element type
     * @param {string} selectedByClick - the item in the column clicked on by the user (may be null if user did not act)
     *
     * @private
     * @returns {Void}
     */
    private buildSelector = (column: HTMLElement, elementType: string, selectedByClick: string) => {
        let selected = selectedByClick === null
            ? (this.getDateTimePickerElement(elementType)).getAttribute(this.activeValueStorage)
            : selectedByClick;

        switch (elementType) {
            case 'month':
                let monthPosition = this.months.indexOf(selected);
                this.buildNodes(monthPosition, column, 12, true, false);
                this.setFocus(column);
                break;
            case 'day':
                let currentMonth = selectFirstElement('[' + this.ariaSelected + '="true"]', this.element).getAttribute(this.ariaLabel);
                let monthIndex = this.months.indexOf(currentMonth);
                let daysInMonth = this.monthInfo[monthIndex].days;
                this.buildNodes(parseInt(selected, 0), column, daysInMonth, false, false);
                this.setFocus(column);
                break;
            case 'year':
                this.buildNodes(parseInt(selected, 0), column, null, false, true);
                this.setFocus(column);
                break;
            case 'hour':
                this.buildNodes(parseInt(selected, 0), column, 12, false, false);
                this.setFocus(column);
                break;
            case 'minute':
            case 'minute24':
                this.buildNodes(parseInt(selected, 0), column, 60, false, true);
                this.setFocus(column);
                break;
            case 'ampm':
                let amPmPosition = this.amPmSelection.indexOf(selected);
                this.buildAmPm(column);
                break;
            case 'hour24':
                this.buildNodes(parseInt(selected, 0), column, 24, false, true);
                this.setFocus(column);
                break;
        }
    }

    /**
     * @name - buildNodes
     * @description - Build the individual list item nodes in the selector element
     * @param {number} selectedPositon - the index of the selected item
     * @param {HTMLElement} column - the column in which the node being built is located
     * @param {number} totalElements - the number of elements in the column
     * @param {boolean} isMonthColumn - true if the column is the month column, else false
     * @param {boolean} zeroBased - true if the element is a zero-based item
     *
     * @private
     * @returns {Void}
     */
    private buildNodes = (selectedPositon: number,
                          column: HTMLElement,
                          totalElements: number,
                          isMonthColumn: boolean,
                          zeroBased: boolean) => {
        let lastElement = zeroBased ? totalElements - 1 : totalElements;

        for (let index = selectedPositon - this.numberOfElementsThatAppearInColumn;
            index < selectedPositon + this.numberOfElementsThatAppearInColumn + 1;
            index++) {
            let positionNumber: number;

            if ((index === 0 && zeroBased) || (index === totalElements && zeroBased)) {
                positionNumber = 0;
            } else {
                let signChanger = index < 1
                    ? 1
                    : index > totalElements
                        ? -1
                        : 0;
                positionNumber = index + (totalElements * signChanger);
                }

            let innerContent = isMonthColumn ? this.monthInfo[positionNumber].name : positionNumber.toString();

            this.appendChildren(column, innerContent);

            if (index === selectedPositon) {
                column.lastElementChild.setAttribute(this.ariaSelected, 'true');
                column.lastElementChild.setAttribute('tabindex', '0');
            } else {
                column.lastElementChild.setAttribute(this.ariaSelected, 'false');
            }

            column.lastElementChild.setAttribute('role', 'option');

            if (lastElement === positionNumber) {
                addClass(column.lastElementChild as HTMLElement, 'f-js-last');
            }
        }
    }

    /**
     * @name - appendChildren
     * @description - Create a new list item with a given string for the innerHTML and append it
     *                to the given element
     * @param {HTMLElement} element - the element the children should be appended to
     * @param {string} innerContent - the content that should be added to the children
     *
     * @private
     * @returns {Void}
     */
    private appendChildren = (element: HTMLElement, innerContent: string) => {
        this.insertChildren(element, innerContent, true);
    }

    /**
     * @name - prependChildren
     * @description - Create a new list item with a given string for the innerHTML and prepend it
     *                to the given element
     * @param {HTMLElement} element - the element the children should be prepended to
     * @param {string} innerContent - the content that should be added to the children
     *
     * @private
     * @returns {Void}
     */
    private prependChildren = (element: HTMLElement, innerContent: string) => {
        this.insertChildren(element, innerContent, false);
    }

    /**
     * @name - insertChildren
     * @description - Create a new list item with a given string for the innerHTML and either
                      prepend or append it to the given element
     * @param {HTMLElement} element - the element
     * @param {string} innerContent - the content that should be added to the children
     * @param {string} append - if true, append the children to the element
                                if false, prepend the child to the element
     *
     * @private
     * @returns {Void}
     */
    private insertChildren = (element: HTMLElement, innerContent: string, append: boolean) => {
        let newElement = document.createElement('li');
        newElement.appendChild(document.createTextNode(innerContent));
        newElement.setAttribute(this.ariaLabel, innerContent);
        append ? element.appendChild(newElement) : element.parentElement.insertBefore(newElement, element);
    }

    /**
     * @name - buildAmPm
     * @description - Build the AM/PM selector
     * @param {HTMLElement} column - the AM/PM column element
     *
     * @private
     * @returns {Void}
     */
    private buildAmPm = (column: HTMLElement) => {
        this.appendChildren(column, 'AM');
        column.lastElementChild.setAttribute(this.ariaSelected, 'true');
        column.lastElementChild.setAttribute('tabindex', '0');
        this.appendChildren(column, 'PM');
    }

    /**
     * @name - selectAmPm
     * @description - Select either AM or PM from the AM/PM Selector
     * @param {string} selected - the value selected (either 'AM' or 'PM')
     *
     * @private
     * @returns {Void}
     */
    private selectAmPm = (selected: string) => {
        if (!selected) {
            selected = (this.getDateTimePickerElement('ampm')).getAttribute(this.activeValueStorage).toUpperCase();
        }

        let checkedElement = selectFirstElement('[' + this.ariaSelected + '="true"]', this.amPmColumn) as HTMLElement;
        if (checkedElement) {
            checkedElement.removeAttribute('tabindex');
            checkedElement.removeAttribute(this.ariaSelected);
        }

        let addOrRemoveClass: Function = selected === 'AM' ? removeClass : addClass;
        addOrRemoveClass.call(this, this.amPmColumn, 'f-js-pm');

        let amPmElement = selectFirstElement('[aria-label="' + selected + '"]', this.amPmColumn) as HTMLElement;
        if (amPmElement) {
            amPmElement.setAttribute(this.ariaSelected, 'true');
            amPmElement.setAttribute('tabindex', '0');
            amPmElement.focus();
        }
    }

    // TODO: Task #8645822: DateTimePicker - Type the date or time content array (don't use type 'any[]')
    /**
     * @name - newContent
     * @description - Determines the new content for the given element (which will be a month, a day, an hour, etc.)
     * @param {HTMLElement} element - the element that needs new content
     * @param {string} direction - the direction the user is scrolling
     *
     * @private
     * @returns {any[]} - A collection that indicates the values.  The collection changes depending on the element type.
     *                    For example, for month it might be ['9' '12' 'September']
     *                    to indicate that the month is 9 of 12 and named 'September.'
     */
    private newContent = (element: HTMLElement, direction: string): any[] => {
        let currentlySelected = (<HTMLElement>selectFirstElement(
            '[' + this.ariaSelected + '="true"]', element)).getAttribute(this.ariaLabel);
        let column = element.getAttribute(this.dateTimePickerDataAttribute);

        // TODO: Task #8645822: DateTimePicker - Type the date or time content array (don't use type 'any[]')
        let result:any[] = [];
        let nextCurrent: number = null;
        let stagedPosition: number[] = null;

        switch (column) {
            case 'month':
                this.removeAriaSelected(this.monthColumn);
                let monthPosition = this.months.indexOf(currentlySelected);
                nextCurrent = this.nextCurrent(monthPosition, direction, this.totalMonths, false);
                this.setAriaSelected(this.monthColumn, this.months[nextCurrent]);
                stagedPosition = this.stagedElement(this.monthColumn, nextCurrent, direction, this.totalMonths, false);
                result[0] = stagedPosition[1];
                result[1] = this.totalMonths;
                result[2] = this.months[stagedPosition[0]];
                return result;
            case 'day':
                let currentMonthElement = selectFirstElement('[' + this.ariaSelected + '="true"]', this.monthColumn);
                if (!currentMonthElement) {
                    return;
                }

                let currentMonth = currentMonthElement.getAttribute(this.ariaLabel);
                if (!currentMonth) {
                    return;
                }

                let monthIndex = this.months.indexOf(currentMonth);
                let totalDays = this.monthInfo[monthIndex].days;
                this.removeAriaSelected(this.dayColumn);
                nextCurrent = this.nextCurrent(parseInt(currentlySelected, 0), direction, totalDays, false);
                this.setAriaSelected(this.dayColumn, nextCurrent.toString());
                stagedPosition = this.stagedElement(this.dayColumn, nextCurrent, direction, totalDays, false);
                result[0] = stagedPosition[1];
                result[1] = totalDays;
                result[2] = stagedPosition[0];
                return result;
            case 'year':
                this.removeAriaSelected(this.yearColumn);
                nextCurrent = this.nextCurrent(parseInt(currentlySelected, 0), direction, 9999, true);
                this.setAriaSelected(this.yearColumn, nextCurrent.toString());
                stagedPosition = this.stagedElement(this.yearColumn, nextCurrent, direction, 9999, true);
                result[0] = stagedPosition[1];
                result[1] = 9999;
                result[2] = stagedPosition[0];
                return result;
            case 'hour':
            case 'hour24':
                // case fall-through is intentional
                let is24hours = column.indexOf('24') > -1;
                let hours = is24hours ? 24 : 12;
                this.removeAriaSelected(this.hourColumn);
                nextCurrent = this.nextCurrent(parseInt(currentlySelected, 0), direction, hours, is24hours);
                this.setAriaSelected(this.hourColumn, nextCurrent.toString());
                stagedPosition = this.stagedElement(this.hourColumn, nextCurrent, direction, hours, is24hours);
                result[0] = stagedPosition[1];
                result[1] = is24hours ? 23 : 12;
                result[2] = stagedPosition[0];
                return result;
            case 'minute':
            case 'minute24':
                // case fall-through is intentional
                this.removeAriaSelected(this.minuteColumn);
                nextCurrent = this.nextCurrent(parseInt(currentlySelected, 0), direction, 60, true);
                this.setAriaSelected(this.minuteColumn, nextCurrent.toString());
                stagedPosition = this.stagedElement(this.minuteColumn, nextCurrent, direction, 60, true);
                result[0] = stagedPosition[1];
                result[1] = 59;
                result[2] = stagedPosition[0];
                return result;
        }
    }

    /**
     * @name - removeAriaSelected
     * @description - Sets the aria-checked attribute to false and removes the tabindex attribute
     * @param {HTMLElement} column - the column element to remove the aria-checked attribute from
     *
     * @private
     * @returns {Void}
     */
    private removeAriaSelected = (column: HTMLElement) => {
        let item = selectFirstElement('[' + this.ariaSelected + '="true"]', column) as HTMLElement;
        if (item) {
            item.removeAttribute('tabindex');
            item.removeAttribute(this.ariaSelected);
        }
    }

    /**
     * @name - setAriaSelected
     * @description - Sets the aria-selected attribute to true and adds the tabindex attribute
     * @param {HTMLElement} column - the column element to add the aria-checked attribute to
     * @param {string} elementType - the element type ('month', 'day', 'year', etc.)
     *
     * @private
     * @returns {Void}
     */
    private setAriaSelected = (column: HTMLElement, elementType: string) => {
        let item = selectFirstElement('[aria-label="' + elementType + '"]', column) as HTMLElement;
        if (item) {
            item.setAttribute(this.ariaSelected, 'true');
            item.setAttribute('tabindex', '0');
            item.focus();
        }
    }

    /**
     * @name - setFocus
     * @description - Sets focus on the given column item
     * @param {HTMLElement} column - the column element which contains the item needing focus
     *
     * @private
     * @returns {Void}
     */
    private setFocus = (column: HTMLElement) => {
        if (!!column && column.style.display !== '') {
            let item = selectFirstElement('[' + this.ariaSelected + '="true"]', column) as HTMLElement;
            if (item) {
                item.focus();
            }
        }
    }

    /**
     * @name - nextCurrent
     * @description - Determines which item in next in the list for the given column, in the given direction, taking into account
     *                the type of item (month, day, year, hour, minute, etc.), the total number of possible items,
     *                and whether or not it is zero-based.  It will return null if no suitable value is found.
     * @param {number} selected - the index or value of the selected item
     * @param {string} direction - the direction the user is scrolling
     * @param {number} total - the highest value allowed for the item type
     * @param {boolean} zeroBased - true if the element is a zero-based item
     *
     * @private
     * @returns {number} - the index (for months) or value (for hours, minutes, days, years) of the next item in the column
     */
    private nextCurrent = (selected: number, direction: string, total: number, zeroBased: boolean): number => {
        switch (direction) {
            case 'up':
                if (zeroBased && selected - 1 === 0) {
                    return 0;
                } else if (selected - 1 <= 0) {
                    return zeroBased ? total - 1 : total;
                } else {
                    return selected - 1;
                }
            case 'down':
                if (zeroBased && selected + 1 === total) {
                    return 0;
                } else if (selected + 1 > total) {
                    return 1;
                } else {
                    return selected + 1;
                }
        }

        return null;
    }

    /**
     * @name - stagedElement
     * @description - Gets the next element's value.  If the element is zero-based and at the edge of the range, return the first and last
     *                values of the range (e.g, 0 and 60 for minutes).
     * @param {HTMLElement} element - the selected element
     * @param {number} newContent - the index or value of the next item
     * @param {string} direction - the direction the user is scrolling
     * @param {number} total - the highest value allowed for the item type
     * @param {boolean} zeroBased - true if the element is a zero-based item
     * @private
     * @returns {number[]} - An array with the next value; or the first and last values of the range in certain cases.
     */
    private stagedElement = (element: HTMLElement, newContent: number, direction: string, total: number, zeroBased: boolean): number[] => {
        let nextNumber: number[] = [];
        if (direction === 'down') {
            newContent = newContent + this.numberOfElementsThatAppearInColumn;
        } else if (direction === 'up') {
            newContent = newContent - this.numberOfElementsThatAppearInColumn;
        }

        if (zeroBased && (newContent === 0 || newContent === total)) {
            nextNumber[0] = 0;
            nextNumber[1] = total;
        } else {
            let signChanger = newContent < 1
                ? 1
                : newContent > total
                    ? -1
                    : 0;
            nextNumber[0] = nextNumber[1] = newContent + (total * signChanger);
        }

        return nextNumber;
    }

    /**
     * @name - isLastInList
     * @description - Adds the 'f-js-last' class to the last element in the element range (e.g., 'December' for months or '31' for days)
     * @param {HTMLElement} element - the selected element
     * @param {number} newContent - the index or value of the next item
     * @param {string} direction - the direction the user is scrolling
     * @param {number} total - the highest value allowed for the item type

     * @private
     * @returns {Void}
     */
    private isLastInList = (element: HTMLElement, newContent: number, direction: string, total: number) => {
        if (newContent === total) {
            if (direction === 'down') {
                addClass(element.lastElementChild as HTMLElement, 'f-js-last');
            } else if (direction === 'up') {
                addClass(element.firstElementChild as HTMLElement, 'f-js-last');
            }
        }
    }

    /**
     * @name - removeChildren
     * @description - Removes the child elements from the given column
     * @param {HTMLElement} element - the element to remove the childern from
     * @param {string} listPosition - the list position ('top' or 'bottom')
     *
     * @private
     * @returns {Void}
     */
    private removeChildren = (columnElement: HTMLElement, listPosition: string) => {
        let listItems = selectElements('li', columnElement) as HTMLLIElement[];
        if (!listItems || listItems.length === 0) {
            return;
        }

        if (listPosition === 'top') {
            listItems[0].parentNode.removeChild(listItems[0]);
        } else if (listPosition === 'bottom') {
            let lastItemIndex = listItems.length - 1;
            listItems[0].parentNode.removeChild(listItems[lastItemIndex]);
        }
    }

    /**
     * @name - updatePicker
     * @description - Update the values in the Date Time Picker button because a new date/time has been selected
     *
     * @private
     * @return {Void}
     */
    private updatePicker = () => {
        switch (this.pickerType) {
            case DateTimePickerType.date:
                this.updateButton(this.monthColumn, 'month');
                this.updateButton(this.dayColumn, 'day');
                this.updateButton(this.yearColumn, 'year');
                break;
            case DateTimePickerType.time12hours:
                this.updateButton(this.hourColumn, 'hour');
                this.updateButton(this.minuteColumn, 'minute');
                this.updateButton(this.amPmColumn, 'ampm');
                break;
            case DateTimePickerType.time24hours:
                this.updateButton(this.hourColumn, 'hour24');
                this.updateButton(this.minuteColumn, 'minute24');
                break;
        }

        let oldDateTime = this.currentDateTime;

        this.updateCurrentDateTime();

        if (!this.areDatesCloseEnough(this.currentDateTime, oldDateTime)) {
            // TODO: 8479736: Update build step to remove commented code.
            // The following console.log useful for debugging and is left in commented out for easy restoration.
            //console.log('onDateTimeChanged: oldDateTime(' + oldDateTime + ') newDateTime(' + this.currentDateTime + ')');
            this.initiatePublish({ oldDateTime: oldDateTime, newDateTime: this.currentDateTime});
        }
    }

    /**
    * @name - areDatesCloseEnough
    * @memberof - DateTimePicker
    * @description - Used when comparing two Date values to determine if they are close enough to not trigger a time
    *                change notification. We need to do this because using the js Date object can result in different
    *                millesecond values returned from getTime() for the same year/month/day/hour/minute/second. (argh)
    * @private
    * @param {Date} date1 - The first date to compare.
    * @param {Date} date2 - The second date to compare.
    * @returns {boolean}
    */
    private areDatesCloseEnough(date1: Date, date2: Date): boolean {
        return Math.abs(date1.getTime() - date2.getTime()) <= DateTimePicker.changeThreshold;
    }

    /**
    * @name - updateCurrentDateTime
    * @memberof - DateTimePicker
    * @description - Updates the current date/time value
    * @private
    * @returns {void}
    */
    private updateCurrentDateTime(): void {
        let checkedAttribute = '[' + this.ariaSelected + '="true"]';

        switch (this.pickerType) {
            case DateTimePickerType.date: {
                let pickers = selectFirstElement('[data-date-time-picker="date-selector"]', this.element);
                let monthPicker = !pickers ? null : selectFirstElement('[data-date-time-picker="month"]', pickers);
                let datePicker = !pickers ? null : selectFirstElement('[data-date-time-picker="day"]', pickers);
                let yearPicker = !pickers ? null : selectFirstElement('[data-date-time-picker="year"]', pickers);
                let month = !monthPicker ? null : selectFirstElement(checkedAttribute, monthPicker);
                let date = !datePicker ? null : selectFirstElement(checkedAttribute, datePicker);
                let year = !yearPicker ? null : selectFirstElement(checkedAttribute, yearPicker);
                let yearValue = parseInt(getText(year), 10) || -1;
                let monthValue = this.months.indexOf(getText(month)) || -1;
                let dateValue = parseInt(getText(date), 10) || -1;

                if ((yearValue !== -1) && (monthValue > 0) && (dateValue !== -1)) {
                    this.currentDateTime = new Date(yearValue, monthValue - 1, dateValue);
                }

                break;
            }

            case DateTimePickerType.time12hours:
            case DateTimePickerType.time24hours: {
                let pickers = selectFirstElement('[data-date-time-picker^="time-selector"]', this.element);
                let hourPicker = !pickers ? null : selectFirstElement('[data-date-time-picker^="hour"]', pickers);
                let minutePicker = !pickers ? null : selectFirstElement('[data-date-time-picker^="minute"]', pickers);
                let ampmPicker = !pickers ? null : selectFirstElement('[data-date-time-picker="ampm"]', pickers);
                let hour = !hourPicker ? null : selectFirstElement(checkedAttribute, hourPicker);
                let minute = !minutePicker ? null : selectFirstElement(checkedAttribute, minutePicker);
                let ampm = !ampmPicker ? null : selectFirstElement(checkedAttribute, ampmPicker);
                let hourValue = parseInt(getText(hour), 10) || -1;
                let minuteValue = parseInt(getText(minute), 10) || -1;

                if ((hourValue !== -1) && (minuteValue !== -1)) {
                    this.currentDateTime = new Date();
                    this.currentDateTime.setSeconds(0);
                    this.currentDateTime.setMinutes(minuteValue);
                    this.currentDateTime.setHours((getText(ampm) === this.amPmSelection[1]) ? hourValue + 12 : hourValue);
                }

                break;
            }
        }
    }

    /**
    * @name - publish
    * @description - Overridden publish callback called by the Publisher super class during a publish cycle.
    *                This method will be called once for each registered subscriber.
    * @protected
    * @param {IDateTimePickerSubscriber} subscriber - the subscriber to make the callback to.
    * @param {any} [context] - the publish context use to determine which interface callback to make.
    * @returns {void}
    */
    protected publish(subscriber: IDateTimePickerSubscriber, context?: any): void {
        if (subscriber && subscriber.onDateTimeChanged) {
            subscriber.onDateTimeChanged(context as IDateTimePickerNotification);
        }
    }

    /**
     * @name - updateButton
     * @description - Updates the given button of the Date Time Picker, based on the button type
     * @param {HTMLElement} column - The column element
     * @param {string} buttonType - The button type ('month', 'day', 'year', etc.)
     *
     * @private
     * @returns {Void}
     */
    private updateButton = (column: HTMLElement, buttonType: string) => {
        if (!column || !buttonType) {
            return;
        }

        let button = this.getDateTimePickerElement(buttonType);
        if (!button) {
            return;
        }

        let selectedElement = selectFirstElement('[' + this.ariaSelected + '="true"]', column) as HTMLElement;
        if (!selectedElement) {
            return;
        }

        let desiredText = selectedElement.getAttribute(this.ariaLabel);
        if (!desiredText) {
            return;
        }

        setText(button, desiredText);
        button.setAttribute(this.activeValueStorage, desiredText);

        let formatter = button.getAttribute(DateTimePicker.buttonFormatterAttribute);

        // If we aren't using aria-label to store values for reference and a formatter
        // exists for the aria-label, we should go ahead an apply a new aria label
        if (this.activeValueStorage === DateTimePicker.activeValueStorageAttribute && !!formatter) {
            button.setAttribute(this.ariaLabel, format(formatter, desiredText));
        }
    }

    /**
     * @name - recalculateDaysInMonth
     * @description - Re-calculates the number of days in a month when the user has selected a new month.
     *                Useful when the user has selected (for example) January 31st, and the changes the month to February.
     *                At that point, the day selected would change from 31 to 28.
     * @param {HTMLElement} target - The selected element
     *
     * @private
     * @returns {Void}
     */
    private recalculateDaysInMonth = (target: HTMLElement) => {
        let columnType = target.parentElement.getAttribute(this.dateTimePickerDataAttribute);

        if (!columnType || columnType !== 'month') {
            return;
        }

        let selectedDayElement = selectFirstElement('[' + this.ariaSelected + '="true"]', this.dayColumn) as HTMLElement;
        if (!selectedDayElement) {
            return;
        }

        let selectedDayLabel = selectedDayElement.getAttribute(this.ariaLabel);
        if (!selectedDayLabel) {
            return;
        }

        let selectedDay = parseInt(selectedDayLabel, 0);
        if (!selectedDay) {
            return;
        }

        let currentMonthElement = selectFirstElement('[' + this.ariaSelected + '="true"]', target.parentElement);
        if (!currentMonthElement) {
            return;
        }

        let currentMonth = currentMonthElement.getAttribute(this.ariaLabel);
        if (!currentMonth) {
            return;
        }

        let monthIndex = this.months.indexOf(currentMonth);
        if (!this.monthInfo[monthIndex]) {
            return;
        }

        let daysInMonth = this.monthInfo[monthIndex].days;
        if (!daysInMonth) {
            return;
        }

        removeInnerHtml(this.dayColumn);

        let day = selectedDay === 31 && daysInMonth < 31 ? daysInMonth : selectedDay;
        this.buildNodes(day, this.dayColumn, daysInMonth, null, false);
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('DateTimePicker.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: DateTimePicker,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}

/**
 * @name - DateTimePickerType
 * @description - The different types of Date Time Pickers
 *
 * @export
 * @enum {number} - number representing the type of Date Time Picker
 */
export const enum DateTimePickerType {
    'date',
    'time12hours',
    'time24hours'
}

/**
 * @name - DateTimePickerMonthInfo
 * @description - Describes a month by giving its name and how many days are in that month
 *
 * @export
 * @interface DateTimePickerMonthInfo
 */
export interface DateTimePickerMonthInfo {
    /**
     * @name - name
     * @description - The localized name of the month
     *
     * @type {string}
     */
    name: string;

    /**
     * @name - days
     * @description - The number of days in the month
     *
     * @type {number}
     */
    days: number;
}
