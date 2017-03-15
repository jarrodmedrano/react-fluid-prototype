/**
 * @description - Response from USS v3 api call
 * 
 * @interface IUSSV3Response
 */
declare interface IUSSV3Response {
    ErrorSets: any;
    Query: string;
    ResultSets: IUSSResultSet[];
}


/**
 * @description - Result set from USS api
 * 
 * @interface IUSSResultSet
 */
declare interface IUSSResultSet {
    Source: string;
    FromCache: boolean;
    Suggests: IUSSProductSuggestion[] | IUSSTermSuggestion[];
}


/**
 * @description - Term result from USS api
 * 
 * @interface IUSSTermSuggestion
 */
declare interface IUSSTermSuggestion {
    FromCache: boolean;
    Txt: string;
}


/**
 * @description - A USS product suggestion result.
 * 
 * @interface IUSSProductSuggestion
 */
declare interface IUSSProductSuggestion {
    Curated: boolean;
    Description: string;
    ImageUrl: string;
    Metas: IUSSMetaData[];
    Source: string;
    Title: string;
    Url: string;
}


/**
 * @description - A single Metadata field in the USS product search result
 * 
 * @interface IUSSMetaData
 */
declare interface IUSSMetaData {
    Key: string;
    Value: string;
}

/**
 * @description - Request parameters for USS API
 * 
 * @interface IUSSRequestParams
 */
declare interface IUSSRequestParams {
    clientId: string;
    sources: string;
    counts?: string;
    market?: string;
    query?: string;
}