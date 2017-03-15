/// <amd-module name="keycodes"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

/**
 * Enum for keyboard event key codes
 * Note: capitalized first letter used on purpose to avoid keyword collisions
 * 
 * @enum {number}
 */
export const enum keycodes {
    Back = 8,
    Tab = 9,
    Enter = 13,
    Shift = 16,
    Ctrl = 17,
    Alt = 18,
    Break = 19,
    CapsLock = 20,
    Escape = 27,
    Space = 32,
    PageUp = 33,
    PageDown = 34,
    End = 35,
    Home = 36,
    ArrowLeft = 37,
    ArrowUp = 38,
    ArrowRight = 39,
    ArrowDown = 40,
    Print = 44,
    Insert = 45,
    Delete = 46,
    Colon2 = 59, // Opera and Firefox
    Equals2 = 61, // Opera
    Equals3 = 107, // Firefox
    Minus2 = 109, // Opera and Firefox
    Period = 190,
    WindowsLeft = 91,
    WindowsRight = 92,
    WindowsOpera = 219, // Opera
    Menu = 93,
    NumPad0 = 96,
    NumPad1 = 97,
    NumPad2 = 98,
    NumPad3 = 99,
    NumPad4 = 100,
    NumPad5 = 101,
    NumPad6 = 102,
    NumPad7 = 103,
    NumPad8 = 104,
    NumPad9 = 105,
    NumPadMultiply = 106,
    NumPadPlus = 107,
    NumPadMinus = 109,
    NumPadDot = 110,
    NumPadDivide = 111,
    Function1 = 112,
    Function2 = 113,
    Function3 = 114,
    Function4 = 115,
    Function5 = 116,
    Function6 = 117,
    Function7 = 118,
    Function8 = 119,
    Function9 = 120,
    Function10 = 121,
    Function11 = 122,
    Function12 = 123,
    NumLock = 144,
    ScrollLock = 145,
    Colon = 186,
    Equals = 187,
    Comma = 188,
    Minus = 189,
    ForwardSlash = 191,
    Tilde = 192,
    OpenBracket = 219,
    BackSlash = 220,
    CloseBracket = 221,
    Quote = 222
}