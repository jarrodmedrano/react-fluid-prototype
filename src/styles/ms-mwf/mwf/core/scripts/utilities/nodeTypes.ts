/// <amd-module name="nodeTypes"/>
// amd-module directive only required for OneRf.
// TODO: 8607647 - Update OneRf build task to add this directive automatically.

/**
 * Enum for keyboard event key codes
 * Note: capitalized first letter used on purpose to avoid keyword collisions
 *
 * @enum {number}
 */
const enum nodeTypes {
    Element                 = 1,
    Attr                    = 2,
    Text                    = 3,
    CDATASection            = 4,
    EntityReference         = 5,
    Entity                  = 6,
    ProcessingInstruction   = 7,
    Comment                 = 8,
    Document                = 9,
    DocumentType            = 10,
    DocumentFragment        = 11,
    Notation                = 12
}