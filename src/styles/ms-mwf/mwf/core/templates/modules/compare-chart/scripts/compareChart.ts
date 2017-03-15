/// <amd-module name="compareChart"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ObservableComponent} from 'observableComponent';
import {ComponentFactory} from 'componentFactory';
import {addDebouncedEvent, eventTypes, removeEvent, selectElements} from 'htmlExtensions';
import {getDimensions, apiDeprecated, poll} from 'utility';

/**
 * @export
 * @class - CompareChart
 * @description - The compare chart behavior ensures that rows between columns are the same height.
 * @extends {ObservableComponent}
 */
export class CompareChart extends ObservableComponent {

    /**
     * @name - selector
     * @description - compare chart element class selectors
     * @static
     * @type {string}
     */
    public static selector: string = '.c-compare-chart, .m-compare-chart';

    /**
     * @name - columns
     * @description - The column Elements found in the component
     *                [column0, column1, ..., columnN]
     * @private
     * @type {HTMLElement[]}
     */
    private columns: HTMLElement[];

    /**
     * @name - columnRows
     * @description - store the row Elements for each column
     *                [ [rows for column0], [rows for column1], ..., [rows for columnN] ]
     * @private
     * @type {HTMLElement[][]}
     */
    private columnRows: HTMLElement[][];

    /**
     * @name - resizeDebouncedEventHandler
     * @description - the event handler for debounced window resize events 
     * @private
     * @type {EventListener}
     */
    private resizeDebouncedEventHandler: EventListener;

    /**
     * @name - needToPoll
     * @description - when true, we need to poll the compare chart for height changes
     * @private
     * @type {boolean}
     */
    private needToPoll = false;

    /**
     * @name - constructor
     * @description - Creates an instance of CompareChart
     * @public
     * @param {HTMLElement} element - the native element to attach the compare chart behavior to
     */
    constructor(element: HTMLElement) {
        super(element);

        if (!element) {
            return;
        }

        this.update();
    }

    /**
     * @name - update
     * @description - Updates the component if there is any change to its underlying DOM.
     * @protected
     * @returns {void}
     */
    protected update(): void {
        this.recalculate();

        // Add debounced event to update on resize
        this.resizeDebouncedEventHandler = addDebouncedEvent(window, eventTypes.resize, this.recalculate);

    }

    /**
     * @name - teardown
     * @description - Called by ObservableComponent when the component needs to clean up its state.
     *                Components should remove any event bindings they've added to ensure they are
     *                not duplicated during repeated update/teardown cycles.
     * @protected
     * @returns {void}
     */
    protected teardown(): void {
        removeEvent(window, eventTypes.resize, this.resizeDebouncedEventHandler);
    }

    /**
     * @name - checkPollingCriteria
     * @description - checks whether or not polling is required
     * @private
     * @returns {boolean} - true indicates criteria is met and polling is no longer required; else false
     */
    private checkPollingCriteria = (): boolean => {
        this.needToPoll = false;
        this.checkForDeferredContent();
        this.setRowHeightsAcrossAllColumns();

        // return inverse of needToPoll -- if needToPoll is true, criteria is not met and should return false
        return !this.needToPoll;
    }

    /**
     * @name - getMaxRowsFromAllColumns
     * @description - Get the max number of rows that exist in one column, from all columns
     * @private
     * @returns {number} - The maximum number of rows found in any of the columns 
     */
    private getMaxRowsFromAllColumns = (): number  => {
        // determine the max number of rows in any of the columns on the page
        let maxRows = 0;

        for (let column of this.columns) {
            const rows = selectElements('.f-row', column) as HTMLElement[];

            if (rows.length > maxRows) {
                maxRows = rows.length;
            }

            this.columnRows.push(rows);
        }

        return maxRows;
    }

    /**
     * @name - recalculate
     * @description - recalculates the compare chart and initializes polling if necessary
     * @private
     * @returns {void}
     */
    private recalculate = () => {
        this.needToPoll = false;
        this.checkForDeferredContent();
        this.setRowHeightsAcrossAllColumns();

        if (this.needToPoll) {
            poll(this.checkPollingCriteria, 250, -1);
        }
    }

    /**
     * @name - setRowHeightsAcrossAllColumns
     * @description - Set the row height to the same across all rows of the same index in each column 
     * @private
     * @returns {void}
     */
    private setRowHeightsAcrossAllColumns = (): void => {
        // Ensure the element storage arrays are empty, for resize events.
        this.columns = selectElements('.f-column', this.element);
        this.columnRows = [];

        const maxRows = this.getMaxRowsFromAllColumns();

        // Make the rows in each column the same height.
        for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
            let rowHeightToSet = this.getMaxRowHeight(rowIndex);

            // if max row height is zero, something went wrong -- continue but poll to see if height changes
            if (rowHeightToSet === 0 && !this.needToPoll) {
                this.needToPoll = true;
            }

            // For every column, get same row for each column, and set the height
            for (let columnIndex in this.columns) {
                if (this.columnRows[columnIndex][rowIndex] !== undefined) {
                    this.columnRows[columnIndex][rowIndex].style.height = rowHeightToSet.toString() + 'px';
                }
            }
        }
    }

    /**
     * @name - getMaxRowHeight
     * @description - Find the max height of a row between multiple columns
     * @private
     * @param {number} rowIndex - The row index to get the heights for in each column 
     * @returns {number} - the max height of a row (in pixels)
     */
    private getMaxRowHeight = (rowIndex: number): number => {
        let maxRowHeight = 0;

        for (let columnIndex in this.columns) {
            // Get the numerical value of the height as a float
            if (this.columnRows[columnIndex][rowIndex] !== undefined) {

                // Reset all rows to 'auto' height, prior to getting the actual height.
                this.columnRows[columnIndex][rowIndex].style.height = 'auto';

                let rowHeight = getDimensions(this.columnRows[columnIndex][rowIndex]).height;

                if (rowHeight > maxRowHeight) {
                    maxRowHeight = rowHeight;
                }
            }
        }

        return maxRowHeight;
    }

    /**
     * @name - checkForDeferredContent
     * @description - method which will check for deferred content to see if it's all loaded
     * @private
     * @returns {void}
     * @todo - 9145683 remove deferred image check from compareChart.ts once OneRF adds expected DIV around images
     */
    private checkForDeferredContent = (): void => {
        // all deferred content checks should be added here
        let deferredContentNotReady = false;

        let images = selectElements('img', this.element) as HTMLImageElement[];
        for (let image of images) {
            if (image.height < 2) {
                deferredContentNotReady = true;
                break;
            }
        }

        this.needToPoll = deferredContentNotReady;
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('CompareChart.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: CompareChart,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}