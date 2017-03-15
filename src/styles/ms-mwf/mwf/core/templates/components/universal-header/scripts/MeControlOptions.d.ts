/**
 * The MeControl's configuration options.
 */

/* tslint:disable */​​​
interface IMeControlOptions 
{

    /** -------- MANDATORY Properties -------- */ 

    /**
     * The id for the HTML element where the header piece of the MeControl will render.
     */
    containerId: string;

    /**
     * The IDP related configs.
     */
    rpData: IRPData;

    /** -------- OPTIONAL Properties -------- */ 

    /**
     * The active user's information. If not present the MeControl assumes there is no user signed in.
     */
    userData?: IUserData;

    /**
     * The jQuery instance to be used. If not provided we'll try to use it from the public namespace: jQuery or $.
     */
    jQuery?: JQueryStatic;

    /**
     * A flag that indicates if this is an INT environment. Defaults to false.
     * This flag only affects the user tile's URL for MSA profile pictures.
     */
    isINT?: boolean;

    /**
     * Allows overriding the default header height of 64px (optional).
     */
    headerHeight?: number;

    /**
     * Flag that indicates if the MeControl should attempt to auto sign in to MSA (optional).
     */
    autoSignIn?: boolean;

    /**
     * URL to the host's endpoint that will handle MSA's postback with the auto signed in user (optional).
     */
    autoSignInReturnUrl?: string;

    /**
     * Text used for "Sign in" as a fallback in case we can't download the control's script. 
     * Should be localized. If not provided, we fall back to english. (optional)
     */
    signInStr?: string;

    /**
     * Text used for "Sign out" as a fallback in case we can't download the control's script. 
     * Should be localized. If not provided, we fall back to english. (optional)
     */
    signOutStr?: string;

    /**
     * The MeControl's mobile breakpoints used for responsive design.
     */
    mobileBreakpoints?: IMobileBreakpoints;

    /**
     * Object containing extensions to customize MeControl (optional).
     */
    custom?: IMeControlCustom;

    /**
     * Object containing callbacks to handle some or all MeControl events (optional).
     */
    events?: IMeControlEvents;

    /** -------- DEPRECATED Properties -------- */ 

    /**
     * The market for localization purposes (DEPRECATED).
     */
    market?: string;

    /**
     * The specific version to be used (DEPRECATED).
     */
    version?: string;

    /**
     * A flag that indicates if the control should use minified(false) or unminified(true) scripts (DEPRECATED).
     */
    debug?: boolean;

    /**
     * The base URL for the control's CDN (DEPRECATED).
     */
    urlBase?: string;

   /** 
    * An array of ISectionItemData where each element describes one extensible link.
    */
    extensibleLinks?: ISectionItemData[];

    /**
     * Whether to open MeControl internal links on a new tab/window.
     * 
     * IMPORTANT: This does not apply to Sign In/Out or extensible links.
     * If this behavior is required for extensible links, use the same option on ISectionItemData.
     */
    openLinksInNewTab?: boolean;
}

/** 
 * Describes all possible authentication states 
 */
interface IAuthState 
{
    /** 
     * User is signed in on both IDP and RP: Value = 1 
     */
    SignedIn: number;

    /** 
     * User is signed in on IDP only: Value = 2
     */
    SignedInIdp: number;

    /** 
     * User is not signed in: Value = 3
     */
    NotSignedIn: number;
}


/** 
 * This IDP enumeraion, it contains all supported IDPs
 */
interface IIdp 
{
    /** 
     * Identifies MSA as an IDP: Value = 'msa' 
     */
    MSA: string;

    /** 
     * Identifies AAD as an IDP: Value = 'aad'
     */
    AAD: string;

    /**
     * Identifies MSA Federated as an IDP: Value = 'msaFed'
     */
    MSA_FED: string;
}

/**
 * Contains configuration specific to one IDP
 * Most of those URLs are usually generated by:
 *  - RPS for MSA
 *  - Owin for AAD
 */
interface IIdpInfo 
{
    /**
     * The sign in URL.
     */
    signInUrl: string;

    /**
     * The sign out URL.
     */
    signOutUrl: string;

    /**
     * The URL to the IDP's endpoint used to get remembered accounts.
     * IMPORTANT: The presence of this URL for MSA means this IDP is enabled on the consumer site
     */
    meUrl: string;

    /**
     * Callback that returns a dynamic sign in return URL.
     * The URLs returned must be from an allow-listed domain
     */
    generateSignInReturnUrl?: () => string;

    /**
     * Callback that returns a dynamic sign out return URL.
     * The URLs returned must be from an allow-listed domain
     */
    generateSignOutReturnUrl?: () => string;
}

/**
 * Contains configuration specific to AAD
 *
 * For AAD, only the signOutUrl is required.
 * The MeControl is capable of building the signInUrl and meUrls based on the other parameters provided
 */
interface IAADInfo extends IIdpInfo
{
    /**
     * The application ID.
     * IMPORTANT: The presence of this requred param means AAD is enabled on the consumer site
     */
    appId: string;

    /**
     * The URL to the site, used on AAD for domain validation purposes.
     * This URL is also used as the return URL for sign in and sign in with another account
     */
    siteUrl: string;

    /**
     * The account settings URL.
     * Optional. 
     * If left empty, the "View account" link will be hidden
     */
    accountSettingsUrl?: string;

    /**
     * Value indicating whether to block MSA accounts signed in throguh AAD.
     * Defaults to false.
     */
    blockMsaFed?: boolean;

    /**
     * Value indicating the state field used by OWIN to validate requests.
     * If left empty, it will not be used on sign in URLs.
     */
    state?: string;

    /**
     * The nonce to be used for user verification, will be passed in on sign in URLs if provided.
     */
    nonce?: string;

    /**
     * This will tell the MeControl to use any given sign in and sign out URLs as if they were direct URLs to AAD.
     * Any partner that sets this to true should implement the parameter pipeline for OWIN described on the onboarding onenote:
     * 
     * AAD integration with OWIN
     * onenote:https://microsoft.sharepoint.com/teams/osg_oss/mem/Shared Documents/MeControl/Onboarding MeControl/Onboarding.one#AAD%20integration%20with%20OWIN&section-id={8EA0F3B6-77EC-4F29-9A1E-F10D8A3D7748}&page-id={0B3987BB-5CC1-4A54-ABF9-E9707F0EE710}&end
     */
    allowNonAadUrls?: boolean;
}


/**
 * Contains all of the IDP configs for the Me Control.
 */
interface IRPData 
{
    /**
     * The MSA related configs.
     */
    msaInfo?: IIdpInfo;

    /**
     * The AAD related configs.
     */
    aadInfo?: IAADInfo;

    /**
     * The IDP that will be used by default when there are ambiguous decisions to be made.
     * Ex: If we have both MSA and AAD users signed in, which one we pick?
     */
    preferredIdp: string;
}

/**
 * Contains all the user fields common to both AAD and MSA
 */
interface IUserData 
{
    /**
     * The User's IDP. Value: Idp.MSA, Idp.AAD, or Idp.MSA_FED
     */
    idp: string;

    /**
     * The User's first name (optional).
     */
    firstName?: string;

    /**
     * The User's last name (optional).
     */
    lastName?: string;

    /**
     * The User's nick name (optional).
     * If provided this takes precedence over first/last name on the header.
     * It will also be displayed on the dropdown below display name.
     */
    nickName?: string;

    /**
     * The User's sign in identifier, could be email, phone or any other identifier.
     *
     * IMPORTANT: If you are using MSA with Lightweight accounts enabled, please map this 
     * property to SignInName from RPS (Membername from RPS will be empty).
     */
    memberName: string;

    /**
     * The User's tile URL (optional).
     */
    tileUrl?: string;

    /**
     * The User's authtenticated state. Value: one of IAuthState states.
     */
    authenticatedState: number;
}

/**
 * Contains all the user fields specific to MSA
 */
interface IMsaUserData extends IUserData
{
    /**
     * The User's CID.
     */
    cid: string;
}

/**
 * Contains all the user fields specific to AAD
 */
interface IAadUserData extends IUserData
{
    /**
     * The User's display name (optional).
     */
    displayName?: string;
    
    /**
     * The User's org name (optional).
     */
    orgName?: string;

    /**
     * The User's company logo URL (optional).
     */
    orgLogoUrl?: string;

    /**
     * The User's sessionId (optional).
     */
    sessionId?: string;

    /*
     * The User's role name (optional)
     */
    roleName?: string;
}

/**
 * The MeControl's event handlers options.
 * All event handlers are optional.
 */
interface IMeControlEvents 
{
    /** 
     * When this callback is provided, it will be called when the user clicks on the sign in link.
     * This will happen instead of the page redirect.
     * This mechanism is built in for the case where the RP needs to show some disambiguation UX before redirecting to the appropriate sign in URL.
     */
    onSignIn?: () => {};

    /** 
     * This event hander is called when a user clicks on sign out for the active account.
     * This will be called before the page redirect.
     */
    onBeforeSignOut?:
        /** 
         * @param {IUserData} userData The object that represents the user being signed out 
         */
        (userData: IUserData) => {};

    /**
     * The MeControl's logging callback.
     */
    onEventLog?: EventLogCallback;
}

/**
 * The MeControl's logging callback.
 */
interface EventLogCallback
{
    /** 
     * @param {string} eventId The event id is a unique identifier for the event being logged
     * @param {any} dataPoints A bag of properties related to the event being logged
     */
    (eventId: string, dataPoints: any): void;
}

/**
 * The MeControl's customization options.
 */
interface IMeControlCustom 
{
    /** 
     * The HTML markup that will be used to compose the chevron when the control renders in mobile mode
     */
    chevHtml?: string;
}

/**
 * The MeControl's mobile breakpoints used for responsive design.
 *
 * For each state, if specified, the control will automatically switch to that stage mode when the screen's 
 * width is smaller than the provided value in pixels 
 */
interface IMobileBreakpoints 
{
    /**
     * The pixel break point at which the Me Control transitions into the short header stage. 
     * The short header stage hides the name and only displays the profile picture
     */
    shortHeader?: number;

    /**
     * The pixel break point at which the Me Control transitions into mobile mode. 
     * The mobile mode changes are: 
     * - Header element has more info about active account and shows a chevron to expand the control
     * - The dropdown takes the entire screen below the header element to show the MeControl content
     */
    mobile?: number;
}

/** 
 * This interface defines a single section item for the control, including extensible links
 */
interface ISectionItemData 
{
    /** 
     * The text to be used on the secion (link text)
     * 
     * @deprecated 
     */
    string?: string;

    /** 
     * The text to be used on the secion (link text)
     */
    label: string;

    /** 
     * The callback to be triggered whenever the user activates the section link
     * @returns True will make the original event stop propagation and cancel default, false will let the event bubble normally. 
     */
    onClick?: () => boolean;

    /** 
     * The URL used on the link represented by this SectionItemData
     */
    url?: string;

    /** 
     * An identifier for this action.
     * This ID will be used to report clicks as part of MeControl's telemetry, expect to see a BiCi event called "<id>Clicked" when this extensible link is clicked
     */
    id?: string;

    /**
     * Whether or not to open the link in a new tab.
     * Default value is false.
     */
    openInNewTab?: boolean;

}
/* tslint:enable */​​​

