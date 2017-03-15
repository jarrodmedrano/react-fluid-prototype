/// <amd-module name="mosaicPlacement"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

import {ComponentFactory} from 'componentFactory';
import {ObservableComponent} from 'observableComponent';
import {BreakpointTracker, IBreakpointTrackerSubscriber, IBreakpointTrackerNotification} from 'breakpointTracker';
import {apiDeprecated, isNumber, getWindowWidth, getDimensions} from 'utility';
import {addClasses, removeClasses} from 'htmlExtensions';

export class MosaicPlacement extends ObservableComponent {
    // width and height classes of a mosaic container. 
    private cssClassNames: ICssClass = {
        width: {
            large: 'f-width-large',
            small: 'f-width-small'
        },
        height: {
            large: 'f-height-large',
            medium: 'f-height-medium',
            small: 'f-height-small'
        }
    };

    // todo - bruk - this mapping need to come from configuration.
    // todo - bruk - the source of these numbers are not clear. Need to find out. 
    private mappings = [
        [
            [300, 0],
            [150, 320],
            [0, 160]
        ],
        [
            [300, 540],
            [150, 270],
            [0, 135]
        ],
        [
            [400, 768],
            [200, 384],
            [0, 0]
        ],
        [
            [400, 542],
            [200, 271],
            [0, 135]
        ],
        [
            [400, 542],
            [200, 271],
            [0, 135]
        ],
        [
            [400, 542],
            [200, 271],
            [0, 135]
        ]
    ];

    public static selector: string = '.c-mosaic-placement';

    /** Creates a mosaic object and subscribes to the break point tracker.
    * @param  {HTMLElement} element
    */
    constructor(element: HTMLElement) {
        super(element);
        this.update();

        BreakpointTracker.getBreakpointTracker().subscribe({
            onBreakpointChanged: (notification: IBreakpointTrackerNotification): void => {
                this.onBreakpointChanged(notification);
            }
        });
    }

    /**
     * Update the component state.
     * 
     * @protected
     * @abstract
     */
    protected update(): void {
        this.onBreakpointChanged({ breakpoint: BreakpointTracker.getBreakpointTracker().getBreakpoint(), width: 0 });
    }

    /**
     * Cleaning up the old state of the component.
     * 
     * @protected
     * @abstract
     */
    protected teardown(): void {
        // Nothing to teardown yet...
    }

    /** Removes all width and height related classes. 
     * @param  {HTMLElement} containerElement
     * @returns void
     */
    public removeClasses(containerElement: HTMLElement): void {
        if (containerElement == null) {
            return;
        }
        removeClasses(containerElement, this.concatenateCssClasses(this.cssClassNames));
    }

    /** todo - brukb - copied over from DI code as is with some additional code for error checking. Need to be revisited. 
     * @param  {HTMLElement} containerElement - The element that contains the mosaics.
     * @param  {number} windowWidth - The width of a rendering window.
     * @returns void
     */
    private applySizeClasses(containerElement: HTMLElement, breakpoint: number): void {
        let dimensions = getDimensions(containerElement);

        if (dimensions == null || !isNumber(dimensions.height) || !isNumber(dimensions.width)) {
            return;
        }

        let sizeClasses: string[] = [];
        let widthClass: string;

        if (dimensions.height >= this.mappings[breakpoint][0][0]) {
            sizeClasses.push(this.cssClassNames.height.large);
            widthClass = dimensions.width >= this.mappings[breakpoint][0][1]
                        ? this.cssClassNames.width.large
                        : this.cssClassNames.width.small;
            sizeClasses.push(widthClass);
        } else if (dimensions.height >= this.mappings[breakpoint][1][0]) {
            sizeClasses.push(this.cssClassNames.height.medium);
            widthClass = dimensions.width >= this.mappings[breakpoint][1][1]
                        ? this.cssClassNames.width.large
                        : this.cssClassNames.width.small;
            sizeClasses.push(widthClass);
        } else {
            sizeClasses.push(this.cssClassNames.height.small);
            widthClass = dimensions.width >= this.mappings[breakpoint][2][1]
                        ? this.cssClassNames.width.large
                        : this.cssClassNames.width.small;
            sizeClasses.push(widthClass);
        }

        addClasses(this.element, sizeClasses);
    }

    /** Updates the mosaic container class based on the current window width.
     * @param  {number} windowWidth
     * @returns void
     */
    public onBreakpointChanged(notification: IBreakpointTrackerNotification): void {
        this.removeClasses(this.element);
        this.applySizeClasses(this.element, notification.breakpoint);
    }

    /**
     * Convert cssClassNames into space delimated css classes for easy use of classes on DOM manipulation. 
     * @param  {ICssClassNames} cssClassnames - an object that has css classes.
     * @returns string
     */
    public concatenateCssClasses(cssClassNames: ICssClass): string[] {
        if (cssClassNames == null) {
            return;
        }
        let classNames: string[] = [];

        for (var cssProp in cssClassNames) {
            if (cssClassNames.hasOwnProperty(cssProp)) {
                let cssClassNamesAnyVersion = <any>cssClassNames;
                let currentProp = cssClassNamesAnyVersion[cssProp];
                if (typeof currentProp === 'object') {
                    for (var className in currentProp) {
                        if (currentProp.hasOwnProperty(className)) {
                            classNames.push(currentProp[className]);
                        }
                    }
                }
            }
        }

        return classNames;
    }

    /**
    * TODO: Remove this method as soon as we can verify partners are no longer calling it.
    */
    public static init(input: any): void {
        apiDeprecated('MosaicPlacement.init() is deprecated, please use ComponentFactory.create() instead.');

        ComponentFactory.create([
            {
                component: MosaicPlacement,
                selector: input ? input.selector : null,
                eventToBind: input ? input.eventToBind : null
            }
        ]);
    }
}

export interface IViewPortCssClass {
    large?: string;
    medium?: string;
    small?: string;
}

export interface ICssClass {
    width: IViewPortCssClass;
    height: IViewPortCssClass;
}
