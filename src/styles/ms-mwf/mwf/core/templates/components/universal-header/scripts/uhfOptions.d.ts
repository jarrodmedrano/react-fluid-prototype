declare interface UHFOptions {
    events?: any;
    meControlOptions?: IMeControlOptions;
    currentMenuItemId?: string;
    currentGlobalItemId?: string;
    as?: IUHFAutosuggestOptions;
    searchSuggestCallback?: (query: IUHFAutosuggestQuery) => void;
    theme?: string;
}

type LegacySuggestion = ILegacyTerm | ILegacyProduct;

declare interface ILegacyAutosuggestResponse {
    suggestions: [LegacySuggestion];
}

declare interface ILegacyTerm {
    title: string;
}

declare interface ILegacyProduct {
    title: string;
    image: string;
    target: string;
}

declare interface IUHFAutosuggestOptions {
    callback?: IUHFAutosuggestCallback;
    ussAPIParams?: IUSSRequestParams;
}

declare interface IUHFAutosuggestCallback {
    (query: IUHFAutosuggestQuery): void;
}

declare interface IUHFAutosuggestQuery {
    text: string;
    response: IUHFAutosuggestDoneCallback;
}

declare interface IUHFAutosuggestDoneCallback {
    (suggestions: any[]): void;
}

declare interface Window {
    awa: any;
    msCommonShell: any;
    onShellReadyToLoad: Function;
    MSA: any;
}


