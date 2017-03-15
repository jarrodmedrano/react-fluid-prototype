/// <amd-module name="table"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ComponentFactory} from 'componentFactory';
import {ObservableComponent} from 'observableComponent';
import {
    addClass,
    addEvent,
    eventTypes,
    getEvent,
    getEventTargetOrSrcElement,
    getText,
    hasClass,
    preventDefault,
    removeClass,
    removeEvent,
    removeInnerHtml,
    selectElements,
    selectElementsT,
    selectFirstElementT,
    setText
} from 'htmlExtensions';
import {apiDeprecated, getKeyCode, getVirtualKey} from 'utility';
import {format} from 'stringExtensions';
import {keycodes} from 'keycodes';

/**
* @class - Table
* @classdesc - The Table component
* @export
*/
export class Table extends ObservableComponent {
    /**
    * @name - selector
    * @description - The pagination component selector.
    * @static
    * @public
    * @type {string}
    */
    public static selector = '.c-table';

    /**
    * @name - floatRegEx
    * @description - The floating point number regex matcher. Used to determine if a text value is a floating point number.
    * @static
    * @private
    * @type {string}
    */
    private static floatRegEx = /(\d+|\,|\.)+/g;

    /**
    * @name - sortableTable
    * @description - The sortable table element.
    * @private
    * @type {HTMLTableElement}
    */
    private sortableTable: HTMLTableElement;

    /**
    * @name - tableBody
    * @description - The sortable table's body element.
    * @private
    * @type {HTMLTableSectionElement}
    */
    private tableBody: HTMLTableSectionElement;

    /**
    * @name - originalRows
    * @description - The list of the sortable table's original table rows.
    * @private
    * @type {HTMLTableRowElement[]}
    */
    private originalRows: HTMLTableRowElement[];

    /**
    * @name columnInfos
    * @description - The list ColumnInfo objects that preserve the information about each column.
    * @private
    * @type {ColumnInfo[]}
    */
    private columnInfos: ColumnInfo[];

    /**
     * @name ariaLiveRegion
     * @description - Live region to announce changes to sorting.
     * @private
     * @type {HTMLElement}
     */
    private ariaLiveRegion: HTMLElement;

    /**
     * @name ascendingLocString
     * @description - Localized string to denote ascending sorting.
     * @private
     * @type {HTMLElement}
     */
    private ascendingLocString: string;

    /**
     * @name descendingLocString
     * @description - Localized string to denote descending sorting.
     * @private
     * @type {string}
     */
    private descendingLocString: string;
    /**
    * @name - constructor
    * @description - Constructor for the Table component.
    * @public
    * @param {HTMLElement} element - the native element to attach the Table behavior to.
    */
    constructor(element: HTMLElement) {
        super(element);
        this.update();
    }

    /**
    * @name - update
    * @description - Updates the component if there is any change to its underlying DOM.
    * @protected
    * @returns {void}
    */
    protected update(): void {
        if (!this.element) {
            return;
        }

        this.sortableTable = selectFirstElementT<HTMLTableElement>('table[data-f-sort="true"]', this.element);

        if (!!this.sortableTable && !this.ariaLiveRegion) {
            this.ariaLiveRegion = document.createElement('p');
            addClass(this.ariaLiveRegion, 'x-screen-reader');
            this.ariaLiveRegion.setAttribute('aria-live', 'polite');
            this.element.appendChild(this.ariaLiveRegion);
            this.ascendingLocString = this.element.getAttribute('data-f-loc-ascending') || 'Sorted by {0} - ascending';
            this.descendingLocString = this.element.getAttribute('data-f-loc-dascending') || 'Sorted by {0} - descending';
        }

        this.reloadTable();
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
        // Remove the click listeners.
        for (let sortableRow of selectElementsT<HTMLTableRowElement>('thead > tr', this.sortableTable)) {
            for (let cellIndex = 0, cellsLength = sortableRow.cells.length;
                cellIndex < cellsLength; cellIndex++) {
                let cell = sortableRow.cells[cellIndex] as HTMLTableHeaderCellElement;

                if (hasClass(cell, 'f-sortable')) {
                    removeEvent(cell.firstElementChild, eventTypes.click, this.onSortButtonClicked);
                    removeEvent(cell.firstElementChild, eventTypes.keydown, this.onSortButtonKeydown);
                }
            }
        }

        // Reset non static members
        this.sortableTable = null;
        this.tableBody = null;
        this.originalRows = null;
        this.columnInfos = null;
    }

    /**
    * @name - alertUserToSorting
    * @description - Writes text to the ariaLiveRegion
    *
    * @param {string} columnHeaderString - The string from the column header
    * @param {string} locString - The localized string to format with the columnHeaderString
    * @private
    * @returns {void}
    */
    private alertUserToSorting(columnHeaderString: string, locString: string): void {
        if (!this.ariaLiveRegion) {
            return;
        }

        setText(this.ariaLiveRegion, format(locString, columnHeaderString));

        // Remove content after short interval so that screen readers do not hear
        // this again after moving through the whole table.
        setTimeout(() => {
            this.ignoreNextDOMChange = true;
            removeInnerHtml(this.ariaLiveRegion);
        }, 3000);
    }

    /**
    * @name - reloadTable
    * @description - Reloads the tbody rows information.
    * Call this whenever the tbody rows have changed.
    * @private
    * @returns {void}
    */
    private reloadTable(): void {
        // We may have both sortable and non-sortable tables on the page so check that this one is sortable first
        if (this.sortableTable) {
            if (!this.tableBody) {
                this.tableBody = selectFirstElementT<HTMLTableSectionElement>('tbody', this.sortableTable);
            }

            this.originalRows = null;

            if (!!this.tableBody) {
                this.originalRows = selectElementsT<HTMLTableRowElement>('tr', this.tableBody);
                this.rebuildSortInfo();
            }
        }
    }

    /**
    * @name - rebuildSortInfo
    * @description - Rebuilds the SortInfo collection.
    *                Call this whenever the tbody rows have changed or the sortable column headers have changed.
    * @private
    * @returns {void}
    */
    private rebuildSortInfo(): void {
        // Ensure there are sortable rows before doing more
        if (!this.originalRows || !this.originalRows.length) {
            return;
        }

        // Ensure that the colummnInfo's are built first in case they may not have been.
        if (!this.columnInfos || !this.columnInfos.length) {
            this.rebuildColumnInfo();
        }

        if (this.columnInfos && this.columnInfos.length) {
            // Build a SortOrder for each sortable column
            for (let columnInfosIndex = 0,
                columnInfoslength = this.columnInfos.length; columnInfosIndex < columnInfoslength;
                columnInfosIndex++) {
                // Unsortable columns are null and can just be skipped...
                if (this.columnInfos[columnInfosIndex]) {
                    let sortOrder = new Array<SortInfo>();

                    for (let originalRowsIndex = 0, originalRowsLength = this.originalRows.length;
                        originalRowsIndex < originalRowsLength;
                        originalRowsIndex++) {
                        let row = this.originalRows[originalRowsIndex];
                        let sortInfo = new SortInfo(originalRowsIndex,
                                            this.getSortKey(row.cells[columnInfosIndex] as HTMLTableCellElement));
                        sortOrder.push(sortInfo);
                    }

                    this.columnInfos[columnInfosIndex].sortOrder = sortOrder;
                }
            }
        }
    }

    /**
    * @name - rebuildColumnInfo
    * @description - Rebuilds the ColumnInfo collection.
    *                Call this whenever the sortable column headers have changed.
    * @private
    * @returns {void}
    */
    private rebuildColumnInfo(): void {
        let sortableHeaderRows = selectElementsT<HTMLTableRowElement>('thead > tr', this.sortableTable);

        this.columnInfos = [];

        // First we determine which columns are sortable by looping through the <thead><tr>'s and building the ColumnInfos so we'll know
        // which columns are sortable and which aren't. We'll put these into the this.columnInfos collection such that it has ColumnInfo
        // object entry for each sortable column and a null for each unsortable column.
        // NOTE: This is a simplistic mapping that:
        // assumes a two header row maximum,
        // ignores rowSpan,
        // and assumes colSpan greater than one implies unsortable.
        for (let sortableRowsIndex = 0, sortableRowsLength = sortableHeaderRows.length;
            sortableRowsIndex < sortableRowsLength;
            sortableRowsIndex++) {
            let nextColumnIndex = this.findNextNull(this.columnInfos, 0);
            for (let cellIndex = 0, cellsLength = sortableHeaderRows[sortableRowsIndex].cells.length;
                cellIndex < cellsLength;
                cellIndex++) {
                let cell = sortableHeaderRows[sortableRowsIndex].cells[cellIndex] as HTMLTableHeaderCellElement;
                if (hasClass(cell, 'f-sortable')) {
                    let sortButton = cell.firstElementChild as HTMLButtonElement;
                    let columnInfo = new ColumnInfo(cell, sortButton);
                    cell.setAttribute('aria-sort', 'none');
                    sortButton.setAttribute('data-sort-index', nextColumnIndex.toString());
                    addClass(sortButton, 'c-glyph');
                    addEvent(sortButton, eventTypes.click, this.onSortButtonClicked);
                    addEvent(sortButton, eventTypes.keydown, this.onSortButtonKeydown);
                    this.columnInfos[nextColumnIndex] = columnInfo;
                    nextColumnIndex = this.findNextNull(this.columnInfos, nextColumnIndex + 1);
                } else if (sortableRowsIndex === 0) {
                    // For first thead/tr only we need to push nulls into the list for unsortable columns
                    for (let spanIndex = 0, span = cell.colSpan; spanIndex < span; spanIndex++) {
                        this.columnInfos.push(null);
                        nextColumnIndex++;
                    }
                } else {
                    nextColumnIndex++;
                }
            }
        }

        if (this.columnInfos.length > 2) {
            // Go through all the columnInfos removing all but the first and last buttons from the tab order so we can impose our own.
            let first: ColumnInfo;
            let last: ColumnInfo;

            for (let info of this.columnInfos) {
                if (info && info.button) {
                    if (!first) {
                        first = info;
                    } else {
                        if (last) {
                            last.button.setAttribute('tabIndex', '-1');
                        }

                        last = info;
                    }
                }
            }
        }
    }

    /**
    * @name - findNextNull
    * @description - Find the next index in the ColumnInfo[] that contains a null.
    * @private
    * @param {ColumnInfo[]} array - The array to look in.
    * @param {number} start - The index to start the search from.
    * @returns {number} - The index of the next null entry, or the length of the array if there are no null entries.
    */
    private findNextNull(array: ColumnInfo[], start: number): number {
        for (let index = start, length = array.length; index < length; index++) {
            if (!array[index]) {
                return index;
            }
        }

        return array.length;
    }

    /**
    * @name - onSortButtonClicked
    * @description - Handles the sort button click events.
    *                Calls reSort to do the real re-sorting work.
    * @private
    * @param {Event} - The click event.
    * @returns {void}
    */
    private onSortButtonClicked = (event: Event): void => {
        let candidate = (event.currentTarget || getEventTargetOrSrcElement(event)) as HTMLElement;
        let sortButton: HTMLElement;

        // If candidate doesn't immediately point at our sort button
        // start walking up its parentElement chain until we find it.
        while (candidate !== this.element) {
            if (candidate.getAttribute('data-sort-index')) {
                sortButton = candidate;
                break;
            }

            candidate = candidate.parentElement;
        }

        if (sortButton) {
            this.reSort(sortButton);
        }
    }

    /**
    * @name - onSortButtonKeydown
    * @description - Handles the sort button keydown events. We use this to impose our own tab order
    * @private
    * @param {KeyboardEvent} - The keydown event.
    * @returns {void}
    */
    private onSortButtonKeydown = (event: KeyboardEvent): void => {
        if ((getKeyCode(event) === keycodes.Tab) || (getVirtualKey(event) === 'Tab')) {

            let sortButton = (event.currentTarget || getEventTargetOrSrcElement(event)) as HTMLElement;
            let currentInfo: ColumnInfo;
            let targetInfo: ColumnInfo;

            if (event.shiftKey) {
                // Find the previous info in this.columnInfos
                for (let info of this.columnInfos) {
                    if (info && info.button) {
                        if  (info.button === sortButton) {
                            currentInfo = info;
                            break;
                        } else {
                            targetInfo = info;
                        }
                    }
                }
            } else {
                // Find the next info in this.columnInfos
                for (let info of this.columnInfos) {
                    if (info && info.button) {
                        if (info.button === sortButton) {
                            currentInfo = info;
                        } else if (currentInfo) {
                            targetInfo = info;
                            break;
                       }
                    }
                }
            }

            if (currentInfo && targetInfo) {
                preventDefault(event);
                targetInfo.button.focus();
            }
        }
    }

    /**
    * @name - reSort
    * @description - Re-sorts the table by the column associated with the specified sort button.
    * @private
    * @param {HTMLElement} sortButton.
    * @returns {void}
    */
    private reSort(sortButton: HTMLElement) {
        let columnInfo = this.columnInfos[parseInt(sortButton.getAttribute('data-sort-index'), 10)];
        let sortOrder = columnInfo.header.getAttribute('aria-sort');
        let ascending = (sortOrder !== 'ascending');

        this.clearSortIndicators();
        this.reorderTableRows(columnInfo, ascending);

        if (ascending) {
            columnInfo.header.setAttribute('aria-sort', 'ascending');
            addClass(columnInfo.button, 'f-ascending');
            this.alertUserToSorting(getText(sortButton), this.ascendingLocString);
        } else {
            columnInfo.header.setAttribute('aria-sort', 'descending');
            addClass(columnInfo.button, 'f-descending');
            this.alertUserToSorting(getText(sortButton), this.descendingLocString);
        }
    }

    /**
    * @name - clearSortIndicators
    * @description - Clear the sort indicators from all the columns.
    * @private
    * @returns {void}
    */
    private clearSortIndicators(): void {
        for (let columnInfo of this.columnInfos) {
            if (!columnInfo) {
                continue;
            }
            columnInfo.header.setAttribute('aria-sort', 'none');
            removeClass(columnInfo.button, 'f-descending');
            removeClass(columnInfo.button, 'f-ascending');
        }
    }

    /**
    * @name - reorderTableRows
    * @description - Reorder the table rows using the specified ColumnInfo.
    * @private
    * @param {ColumnInfo} columnInfo - The ColumnInfo to reorder by.
    * @param {boolean} ascending - Ascending or descending order.
    * @returns {void}
    */
    private reorderTableRows(columnInfo: ColumnInfo, ascending: boolean): void {
        let count = this.tableBody.rows.length;

        columnInfo.ensureColumnInfoIsSorted();

        // Set the ignore flag because we're intentionally changing the DOM here and
        // don't want to trigger teardown/update cycle due to our re-sorting the table rows.
        this.ignoreNextDOMChange = true;

        for (let index = 0; index < count; index++) {
            let sortInfo = ascending ? columnInfo.sortOrder[index] : columnInfo.sortOrder[count - index - 1];
            this.tableBody.appendChild(this.originalRows[sortInfo.originalRowIndex]);
        }
    }

    /**
    * @name - getSortKey
    * @description - Reorder the table rows using the specified ColumnInfo.
    * @private
    * @param {HTMLTableCellElement} cell - the cell to get the sort key of.
    * @returns {string} - The sort key for the cell content.
    */
    private getSortKey(cell: HTMLTableCellElement): string {
        if (hasClass(cell, 'f-numerical')) {
            //Find numerical values and strip everything except the int
            if (selectElements('[content="0.00"]', cell).length > 0) {
                // Set free items to 0
                return '';
            }

            let str = cell.textContent || cell.innerText;
            let matches = str.match(Table.floatRegEx);

            if (!!matches) {
                return matches[0];
            }
        }

        //Not a numerical value or empty, return full raw string
        return (cell.textContent || cell.innerText).trim();
    }
}

/**
* @class - SortInfo
* @classdesc - Contains the sort information for each sorted item.
*/
class SortInfo {
    /**
    * @name - originalRowIndex
    * @description - The original row index this sort key is from.
    * @public
    * @type {number}
    */
    public originalRowIndex: number;

    /**
    * @name - key
    * @description - The sort key value.
    * @public
    * @type {string}
    */
    public key: string;

    /**
    * @name - constructor
    * @description - Constructor for the SortInfo class.
    * @public
    * @param {number} rowIndex - The original row index this sort key is from.
    * @param {string} key - The sort key value.
    */
    constructor(rowIndex: number, key: string) {
        this.originalRowIndex = rowIndex;
        this.key = key;
    }
}

/**
* @class - ColumnInfo
* @classdesc - Contains the state information about each sortable column.
*/
class ColumnInfo {
    /**
    * @name - header
    * @description - The <th> for this column. Used to update the aria-sort attribute on sorting.
    * @public
    * @type {HTMLTableHeaderCellElement}
    */
    public header: HTMLTableHeaderCellElement;

    /**
    * @name - button
    * @description - The sort button for this column. Used to update the ascending/descending glyph on sort.
    * @public
    * @type {HTMLButtonElement}
    */
    public button: HTMLButtonElement;

    /**
    * @name - sortOrder
    * @description - The SortInfo list for this column.
    * @public
    * @type {boolean}
    */
    public sortOrder: SortInfo[];

    /**
    * @name - isSorted
    * @description - Flag that indicates whether or not the sortOrder list has been sorted.
    * @public
    * @type {boolean}
    */
    private isSorted: boolean;

    /**
    * @name - constructor
    * @description - Constructor for the SortInfo class.
    * @public
    * @param {HTMLTableHeaderCellElement} header - The original row index this sort key is from.
    * @param {HTMLButtonElement} button - The sort key value.
    */
    constructor(header: HTMLTableHeaderCellElement, button: HTMLButtonElement) {
        this.header = header;
        this.button = button;
    }

    /**
    * @name - ensureColumnInfoIsSorted
    * @description - Ensures that the sortOrder collection is sorted.
    * @private
    * @returns {void}
    */
    public ensureColumnInfoIsSorted(): void {
        if (this.sortOrder && !this.isSorted) {
            this.sortOrder.sort((a, b): number => {
                let aVal = a.key;
                let bVal = b.key;

                if (aVal === bVal) {
                    return 0;
                }

                let fA = parseFloat(aVal);
                let fB = parseFloat(bVal);
                if (isNaN(fA) || isNaN(fB)) {
                    return (aVal > bVal) ? 1 : -1;
                }

                return (fA > fB) ? 1 : -1;
            });

            this.isSorted = true;
        }
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('Table.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: Table,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}