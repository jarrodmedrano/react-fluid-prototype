# MWF Changelog
## Release Notes v1.19.0
### New
* **[component] Action menu:** adds action menu as a new component, closes [#10305624](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10305624)
* **[component] Drawer:** adds an example of a simple drawer with text content, closes [#10680934](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10680934)
* **[component] Drawer:** adds responsive drawer to core, closes [#9255743](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9255743)
* **[component] Navigation menu:** adds navigation menu component, closes [#10305630](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10305630)
* **[component] Range slider:** adds TypeScript bindings file for behaviors, closes [#10889482](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10889482)
* **[component] Rating:** adds TypeScript bindings file for behaviors, closes [#10889482](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10889482)
* **[component] Universal header:** adds call to action with image in category menu, closes [#10733694](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10733694)
* **[module] Highlight feature:** adds option of f-lean, closes [#10556920](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10556920)

### Changed
* **[component] Breadcrumb:** adds responsive behavior, closes [#7818517](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7818517)
* **[component] Breadcrumb:** changes direction of delimiter from \ to / while maintaining RTL mirroring functionality, closes [#10127611](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10127611)
* **[component] Carousel:** changed having multi and single slide carousel code co-mingled and duplicated carousel code in other modules. Carousel is now deprecated an either MultiSlideCarousel or SingleSlideCarousel should be used in its place, closes [#8865684](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8865684)
* **[component] Dialog:** adds the ability to hide arbitrary areas of content from screen readers when the dialog is being shown, closes [#9926277](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9926277)
* **[component] Dialog:** updates flow dialog to have a max width of 640px, closes [#10729283](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10729283)
* **[component] Pivot:** changed Pivot to implement IController, closes [#8865684](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8865684)
* **[component] Sequence indicator:** changed SequenceIndicator to implement IController, closes [#8865684](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8865684)
* **[component] Tooltip:** alters the tooltip template to allow the code examples to show the triggering element, closes [#10143181](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10143181)
* **[component] Universal header:** changes c-menu component dependency to reduce fragility and override complexity, closes [#10209720](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10209720)
* **[component] Universal header:** changes c-menu-item component dependency to reduce fragility and override complexity, closes [#10210942](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10210942)
* **[component] Universal header:** changes select-menu component dependency to reduce fragility and override complexity, and streamlines selectors to improve performance, closes [#10209720](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10209720)
* **[component] Universal header:** update UHF multicolumn adding media queries, closes [#10724682](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10724682)
* **[component] Universal header:** update UHF multicolumn shape and update CSS, closes [#10286951](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10286951)
* **[module] Feed hero item:** refactored to extend from hero-item-base (new script dependency), inherits sloppy click functionallity now, closes [#10747274](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10747274)
* **[module] Heading:** deprecates select menu option and replaces with new option using action menu, closes [#10563477](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10563477)
* **[module] Hero item:** refactored to extend from hero-item-base (new script dependency), closes [#10747274](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10747274)
* **[module] Immersive hero item:** refactored to extend from hero-item-base (new script dependency), inherits sloppy click functionallity now, closes [#10747274](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10747274)
* **[module] Multi-hero-item:** refactored to extend from hero-item-base (changed script dependency), closes [#10747274](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10747274)

### Fixed
* **[component] Action toggle:** adjusting glyph alignment, closes [#9590215](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9590215)
* **[component] Button:** removes unused TypeScript code, closes [#10889482](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10889482)
* **[component] Call to action:** fixes an issue where absolute positioning on the after element was causing issues in certain layouts, closes [#10572886](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10572886)
* **[component] Carousel:** fixes an issue where an autoplaying carousel will play while a CTA inside of a slide is focused, closes [#10301857](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10301857)
* **[component] Choice summary:** fixes issue with hover state being off due to change in action trigger margins, closes [#10803201](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10803201)
* **[component] Choice summary:** restrict hover and focus states to only the actionable part of component, closes [#9925726](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9925726)
* **[component] Dialog:** fixes an issue where dialog was respecting window width in IE at small viewports, closes [#10557138](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10557138)
* **[component] Dialog:** fixes dismission interaction model for each dialog type., closes [#10409204](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10409204)
* **[component] Dialog:** updates behavior on mobile viewports, closes [#10575805](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10575805)
* **[component] Drawer:** fixes an issue where drawer would always initialize as open regardless of aria-expanded state, closes [#10663368](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10663368)
* **[component] Flyout:** fixes behavior so flyout gets focus when it's shown and focus reverts back to the opening button when it's hidden, closes [#9269864](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9269864)
* **[component] Flyout:** fixes issue with flyout focus incorrectly being reset when the browser viewport size changes, closes [#10893053](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10893053)
* **[component] Glyph:** fixes the missing `search` glyph, closes [#10751289](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10751289)
* **[component] Navigation menu:** removes unused TypeScript code, closes [#10305630](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10305630)
* **[component] Pivot:** fixed Pivot to support nested Pivots, closes [#10629345](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10629345)
* **[component] Radio:** fixes an issue where captions were misaligned, closes [#10574856](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10574856)
* **[component] Radio:** fixes an issue where items were extending outside their content area, closes [#10548903](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10548903)
* **[component] Rating:** fixes cursor for non-interactive ratings, closes [#10521709](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10521709)
* **[component] Refine item:** fixes issue where single select did not receive the close glyph, closes [#10803405](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10803405)
* **[component] Select menu:** fixes focus issues while running NVDA and JAWS, closes [#10436252](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10436252)
* **[component] Slider:** fixes issue where value and aria-valuenow attributes were getting set to invalid values (eg, 00:12), closes [#10071720](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10071720)
* **[component] Text action:** fixes the missing `search` option, closes [#10751289](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10751289)
* **[component] Universal header:** fixes click focus states for UHF service, closes [#9358805](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9358805)
* **[component] Universal header:** fixes hover color on links in mobile, closes [#10798065](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10798065)
* **[component] Universal header:** fixes issue with focus treatments in uhf menus in desktop, closes [#9574345](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9574345)
* **[component] Universal header:** fixes issue with focus treatments in uhf menus in mobile, closes [#9580298](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9580298)
* **[component] Universal header:** fixes issue with links not stacking in mobile, closes [#10728045](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10728045)
* **[component] Universal header:** fixes mobile f-current highlighting, closes [#10728045](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10728045)
* **[component] Video:** fixes hiding the trigger paragraph on narrow video components, closes [#8998213](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8998213)
* **[core] MWF:** fixes expection thrown by customEvent method on IE9 and above, closes [#10447023](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10447023)
* **[module] Alert:** fixes an issue where margins on call to actions and glyphs were causing incorrect alignments, closes [#10676530](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10676530)
* **[module] Alert:** fixes contrast between text and background, closes [#10679326](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10679326)
* **[module] Heading:** fixes pivot anchors to be disabled when heading is disabled, closes [#9589611](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9589611)
* **[module] Histogram:** fixes an issue where histogram was extending outside its container causing issues with page margins at low viewports, closes [#10571334](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10571334)
* **[module] Immersive hero item:** fixes issue with initial image fade in for IE and Edge., closes [#10518721](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10518721)
* **[module] Multi-feature:** fixes issue with missing left/right padding for text on smaller viewports, closes [#10676313](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10676313)
* **[module] Skip to main:** fixes contrast between text and background, closes [#10591607](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10591607)

# MWF Changelog
## Release Notes v1.18.0
### New
* **[component] Blockquote:** adds component, closes [#9745223](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9745223)
* **[component] Drawer:** adds option to add divider to default drawer, closes [#10191887](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10191887)
* **[component] Image:** adds the ability for image module to have a caption, closes [#9925802](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9925802)
* **[component] Label:** adds label elements to example that include inputs to ensure proper accessibility, closes [#10205158](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10205158)
* **[component] Link navigation:** adds an option to allow for left aligned text links, closes [#10133966](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10133966)
* **[component] Metatext:** adds example using em, closes [#9925935](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9925935)
* **[component] Pivot:** adds aria-selected attributes to pivot tab elements to enhance accessibility, closes [#10187321](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10187321)
* **[component] Universal header:** adds site wide promo banner, closes [#10166219](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10166219)
* **[core] MWF:** adds a helper class of x-offset-content to provide a way to align content correctly to the content grid, closes [#10192065](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10192065)
* **[module] Action bar:** adds module, closes [#8540088](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8540088)

### Changed
* **[component] Action toggle:** accessibility updates including adding tooltip to glyph-only examples, closes [#9925737](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9925737)
* **[component] Action trigger:** accessibility updates adds tooltip to glyph-only examples, closes [#9925737](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9925737)
* **[component] Badge:** replaces the span tag with the more semantically meaningful strong tag, closes [#9925772](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9925772)
* **[component] Breadcrumb:** changes ul to ol for better semantic meaning, closes [#10127611](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10127611)
* **[component] Call to action:** changes aria-label text format and makes the attribute optional, closes [#10213524](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10213524)
* **[component] Dialog:** changes position of lightbox close button, closes [#9583097](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9583097)
* **[component] Image:** removes the ability to have an aria-label based on new accessibility guidance, closes [#9925868](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9925868)
* **[component] Price:** changes discounted price to better work with screen readers by removing aria-label on the strikethrough, and adding the appropriate text to a x-screen-reader span, closes [#9926197](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9926197)
* **[component] Rating:** updated shape for accessibility to allow focus states to have the same visual design as hover, closes [#9926204](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9926204)
* **[component] Select menu:** improved accessibility and screen reader support, closes [#9926312](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9926312)
* **[component] Structured list:** updates the shape to allow for ordered and unordered lists for better accessibility , closes [#9926245](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9926245)
* **[component] Universal header:** changes hyperlink component dependency to reduce fragility and override complexity, and streamlines selectors to improve performance, closes [#9782544](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9782544)
* **[core] MWF:** Updates customEvent method in htmlExtensions to support passing event name as string, closes [#10285623](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10285623)
* **[core] MWF:** adds text underline to focus states of button, call to action, and heavyweight action triggers, closes [#10123209](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10123209)
* **[module] Hyperlink group:** updates hyperlink group content placement images to better match the intended reflow and remove inconsistencies, closes [#9188047](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9188047)
* **[module] Product placement item:** adds the f-clean option to remove the outline on image hover, closes [#10154532](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10154532)

### Fixed
* **[component] Action toggle:** fixes alignment issue in carousel, closes [#10165459](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10165459)
* **[component] Action toggle:** fixes an issue where the default color did not match the spec, closes [#10031910](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10031910)
* **[component] Action toggle:** fixes glyph alignment in edge/IE, closes [#9590215](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9590215)
* **[component] Age rating:** fixes size of ESRB (Entertainment Software Rating Board) image to 68px square., closes [#10129158](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10129158)
* **[component] Carousel:** fixes an issue where the touch swipe not working when a user swipes diagonally, closes [#9234177](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9234177)
* **[component] Choice summary:** fixes an issue where Internet Explorer is inferring styles on before elements, closes [#9943957](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9943957)
* **[component] Combo:** fixes alt theme list item hover color to white, closes [#10145477](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10145477)
* **[component] Combo:** fixes tabbing through the combo without making a selection, closes [#10145677](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10145677)
* **[component] Datetime picker:** fixes horizontal alignment of picker items, closes [#10401728](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10401728)
* **[component] Datetime picker:** makes focus states more visible, closes [#10144038](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10144038)
* **[component] Datetime picker:** replace use of aria-checked attribute with aria-selected to improve accessibility, closes [#9926817](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9926817)
* **[component] Flyout:** fixes behavior so flyout hides when the escape key is pressed, closes [#9137054](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9137054)
* **[component] Select:** fixes select to fallback to values when ids are missing, closes [#10380948](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10380948)
* **[component] Select:** removes unnecessary height restriction on c-select class, closes [#10143312](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10143312)
* **[component] Table:** updates table to improve accessibility, including adding headers attributes and creating an aria-live region to announce sorting changes, closes [#9926259](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9926259)
* **[component] Text field:** fixes overflow issue found on iPhone 5 viewports, closes [#10413754](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10413754)
* **[component] Textarea:** fixes overflow issue found on iPhone 5 viewports, closes [#10413421](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10413421)
* **[component] Universal header:** fixes IE8 issue with search box too narrow/dark, closes [#10076358](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10076358)
* **[component] Universal header:** fixes issue with broken menus in no-js scenario, closes [#9510374](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9510374)
* **[component] Universal header:** fixes issue with category menu focus color, closes [#10232875](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10232875)
* **[component] Universal header:** fixes issue with mobile menu hover state, closes [#10210559](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10210559)
* **[component] Video:** fixes the video fullscreen button on IE/Edge, closes [#10140686](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10140686)
* **[core] MWF:** fixes an issue transpiling keycodes.ts in partner projects, closes [#10251499](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10251499)
* **[core] MWF:** fixes an issue where focus states were incorrect on multi-hero and feed-hero items, closes [#10409042](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10409042)
* **[core] MWF:** fixes an issue where the placeholder text was too light on input fields, closes [#10033105](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10033105)
* **[module] Auto suggest:** fixes issue with suggestion positioning getting reset by parent components, closes [#10444495](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10444495)
* **[module] Banner:** removes extra margin on blockquote element, closes [#10225257](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10225257)
* **[module] Feature group:** fixes an issue where features within the module did not align to the content grid per the spec, closes [#10108165](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10108165)
* **[module] Feed hero:** fixes an issue where the module was not spanning the full width of the screen, closes [#10298565](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10298565)
* **[module] Media gallery:** fixes an issue where the focus and active states for the play trigger were visually broken, closes [#10135181](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10135181)
* **[module] Panes:** fixes an issue where older browsers were not recognizing the flex property shorthand references, closes [#10354379](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10354379)

# MWF Changelog
## Release Notes v1.17.1
### Fixed
* **[component] Pivot:** fixes an issue with pivot setting focus when the pivot behavior is first initialized, closes [#10163224](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10163224)

# MWF Changelog
## Release Notes v1.17.0
### New
* **[component] Action trigger:** adds heavyweight style as a new option, closes [#9745220](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9745220)
* **[component] Button:** adds new option of f-flex to have the text box snap to the full width of the container, closes [#9283760](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9283760)
* **[component] Checkbox:** adds pub-sub to checkbox, closes [#9925647](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9925647)
* **[component] Divider:** adds a new subdivider option, closes [#9725282](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9725282)
* **[component] Drawer:** adds option to remove divider from responsive drawers, closes [#9745233](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9745233)
* **[component] Heading:** adds the classes f-initial-baseline-large and f-initial-baseline-small to allow disparate heading components to align via baseline when in columns next to each other, closes [#9745235](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9745235)
* **[component] Label:** adds example of label working within a form with the proper HTML shape, closes [#9776101](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9776101)
* **[component] Range slider:** adds component, closes [#9681422](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9681422)
* **[component] Select menu:** adds f-accent option to enable accent-themed select menus, closes [#9725357](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9725357)
* **[component] Text action:** adds the text action component which involves a text field and a glyph corresponding with the intended action, closes [#9725342](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9725342)
* **[module] Feature:** adds an option to set aspect ratio for the entire module to limit flash of content on load, closes [#9821314](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9821314)
* **[module] Feed hero item:** adds new module consisting of an image, heading, and subheading, that can be of dark and light theme, closes [#10073492](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10073492)
* **[module] Feed hero:** adds new module consisting of a group of feed heroes that carousel, closes [#10073492](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10073492)
* **[module] Multi-hero-item:** adds new module, closes [#9360331](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9360331)
* **[module] Multi-hero:** adds new module, closes [#9360331](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9360331)

### Changed
* **[component] Call to action:** updates lightweight call to action to allow for longer strings before truncation, closes [#9300342](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9300342)
* **[component] Image:** numerous accessibility updates, closes [#9925042](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9925042)
* **[component] Pivot:** updates the focus state styles to be closer to Windows guidance, closes [#8687538](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8687538)
* **[component] Text field:** adds label component to pass validation and enhance accessibility, closes [#9955849](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9955849)
* **[core] MWF:** updates heading and subheading to have regular font weight when under 20 pixels, closes [#8498383](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8498383)
* **[core] MWF:** updates hover and focus states for call to actions, buttons, social, and heavyweight action triggers, closes [#9813204](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9813204)
* **[module] Feed hero:** changes higher end viewport imagery to 16:6 ratio and updates padding accordingly, closes [#10107082](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10107082)
* **[module] Panes:** updates module styles for compatibility in IE 10/11, closes [#9851912](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9851912)
* **[module] Product placement item:** fixes regression found in focus outline, resolving it solid accent outline as prescribed by the focus standards, closes [#9859052](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9859052)

### Fixed
* **[component] Action toggle:** fixes foreground on hover to have accessible contrast, closes [#9769423](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9769423)
* **[component] Checkbox:** adds aria-checked to checkbox to pass validation, closes [#9925647](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9925647)
* **[component] Checkbox:** fixes issue with focus rectangle incorrectly appearing on mouse cick, closes [#9435953](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9435953)
* **[component] Datetime picker:** fixes issue with focus state rectangles mistakenly appearing on click, closes [#9435982](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9435982)
* **[component] File:** adding label for validation and better accessibility, closes [#9926999](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9926999)
* **[component] Flyout:** fixes flyout loading issue because of slow binding of JavaScript, closes [#9784463](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9784463)
* **[component] Menu item:** removes invalid aria-selected attribute from elements with the menuitemradio role, closes [#9927452](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9927452)
* **[component] Rating:** changes button type to submit for interactive rating components to pass validation - all forms require a submit button, closes [#9450573](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9450573)
* **[component] Select:** adds label to pass validation and enhance accessibility, closes [#9955420](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9955420)
* **[component] Sequence indicator:** fixes issue found in high contrast mode where the background color was being overridden improperly, closes [#9564643](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9564643)
* **[component] Sequence indicator:** fixes issue with focus rectangle incorrectly appearing on mouse click, closes [#9435739](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9435739)
* **[component] Universal header:** fixes issue with border not showing on auto-suggest, closes [#8995120](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8995120)
* **[component] Universal header:** fixes issue with focus rectangle disappearing from global menus when using the keyboard to expand the menu, closes [#9751765](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9751765)
* **[component] Universal header:** fixes issue with inconsistent styling of language toggle and streamlines menu selector output, closes [#9385952](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9385952)
* **[component] Video:** fixes validation error resulting from the legend element not being a direct child of the fieldset element, closes [#9461874](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9461874)
* **[module] Additional information:** fixes issue where horizontal scroll bars were appearing on IE 10, closes [#8691057](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8691057)
* **[module] Alert:** fixes the vertical alignment of the glyphs, closes [#9179940](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9179940)
* **[module] Compare chart:** fixes issue where there was extra spacing after badge and above heading, not enough space after price, and the heading text wraps too early, closes [#9627310](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9627310)
* **[module] Hero item:** fixes clicking in non call-to-action area of hero item and adds pub/sub support for hero-item clicked notification, closes [#9607222](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9607222)
* **[module] Hero item:** fixes various issues with touch and tapping/clicking not working in non-MSFT browsers, closes [#10065767](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10065767)
* **[module] Hyperlink group:** fixes an issue where unsupported styles were not being applied adding extra top padding in Internet Explorer, closes [#9620078](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9620078)
* **[module] Immersive hero item:** fixes an issue where certain styles were not being applied correctly on small viewports in Internet Explorer, closes [#9620097](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9620097)
* **[module] Immersive hero item:** fixes issue with image resize on vertical browser resize, debounce image resize function., closes [#9896629](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9896629)
* **[module] Multi-feature:** fixes an issue where focus would accidentally be set and potentially scroll the browser when the multi-feature first initializes, closes [#9791675](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9791675)
* **[module] Multi-feature:** fixes an issue where image pivots did not have a focus state, closes [#9589525](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9589525)
* **[module] Panes:** fixes issue with the max width of images causing unwanted behavior when rendering in viewports 4-6, closes [#10012003](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10012003)
* **[module] Search help:** fixes an issue where certain styles were not being applied in Internet Explorer, closes [#9620158](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9620158)
* **[module] Skip to main:** fixes an issue where the module was not overlaying the UHF, closes [#9771160](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9771160)
* **[module] Social:** fixes heading sizes, text placement, and spacing., closes [#9640378](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9640378)
* **[module] Supplemental navigation:** fixes hover state of buttons, closes [#9749208](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9749208)

# MWF Changelog
## Release Notes v1.16.0
### New
* **[component] Action trigger:** adds chat bubbles glyph as a new option, closes [#9711101](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9711101)
* **[component] Action trigger:** adds phone glyph as a new option, closes [#9710798](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9710798)
* **[component] Divider:** adds new options to provide vertical padding, closes [#9718778](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9718778)
* **[component] Image:** adds new options to provide left/right padding to images, closes [#9736737](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9736737)
* **[component] Radio:** adds support to include a brief description with radio, closes [#9718909](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9718909)
* **[component] Table:** adds support to use checkbox component within table data, closes [#9636081](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9636081)
* **[core] MWF:** adds lightweight options to call to action and button components, closes [#9510034](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9510034)
* **[module] Immersive hero item:** adds fade-in animations to foreground content to improve loading experience and remove flash of content, closes [#9582778](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9582778)
* **[module] Page bar:** adds responsive behavior to buy box, in-page, and link navigation, closes [#7909932](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7909932)
* **[module] Panes product placement item:** adds the panes product placement item module, consisting of a placement containing imagery, text, price, rating, and call to action, closes [#9452578](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9452578)
* **[module] Panes:** adds the panes module, consisting of several placement patterns containing imagery, text, price, rating, and call to action, closes [#9452578](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9452578)
* **[module] Product placement:** adds functionality to automatically insert a contextual placeholder image (SVG) when a default product placement image fails to load, closes [#8647479](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8647479)

### Changed
* **[component] Datetime picker:** adds pub/sub for onDateTimeChanged, closes [#9583097](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9583097)
* **[component] Dialog:** adds onShown and onHidden notifications to IDialogSubscriber, closes [#9583097](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9583097)
* **[component] Text field:** updates default width to match combo component, closes [#9718749](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9718749)
* **[component] Universal header:** made edge promo banner show on windows 10 and non-edge browsers, closes [#9672680](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9672680)
* **[core] MWF:** increases font weight for pivots in components, multi-feature and heading modules, closes [#9734362](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9734362)
* **[core] MWF:** updates textarea and text field components flex option to fill the full width of their container, closes [#971876](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=971876)
* **[module] Feature group:** changed call to action color to accent color, closes [#9590310](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9590310)
* **[module] Skip to main:** changed dotted outline on focus state to be visible, closes [#9574492](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9574492)

### Fixed
* **[component] Carousel:** fixes tracking item focus and show/hiding flippers in gallery mode, closes [#9545488](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9545488)
* **[component] In-page navigation:** fixes the sticky option behavior in IE, closes [#8467649](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8467649)
* **[component] Link navigation:** fixes an issue where there was not enough space between items when multiple rows existed, closes [#9180206](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9180206)
* **[component] Select button:** fixes hover state of select buttons, closes [#9450854](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9450854)
* **[component] Select:** fixes border being added by default; border will only be added when f-border class is present alongside c-select class, closes [#9589448](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9589448)
* **[component] Table:** fixes table column tabbing to follow perceived order instead of source order, closes [#9450034](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9450034)
* **[component] Universal header:** fixes issue with CTA text color on transparent header, closes [#9226593](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9226593)
* **[component] Universal header:** fixes issue with blurry microsoft logo, closes [#9564142](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9564142)
* **[component] Universal header:** fixes issue with chevrons wrapping on global menus, closes [#9402889](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9402889)
* **[component] Universal header:** fixes issue with left right padding at vp3 and lower, closes [#9312594](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9312594)
* **[component] Universal header:** fixes issue with long category menu items covering submenu chevron, closes [#9403155](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9403155)
* **[component] Universal header:** fixes issue with no border on search box at VP3, closes [#9406621](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9406621)
* **[component] Universal header:** fixes issue with submenu alignment (1px), closes [#9578578](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9578578)
* **[component] Universal header:** fixes issue with submenu positioning when menu appears to the left, closes [#9208316](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9208316)
* **[module] Feature:** fixes in issue where call to action focus state was incorrect and inaccessable on dark backgrounds, closes [#9564198](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9564198)
* **[module] Histogram:** fixes focus treatment for histogram, closes [#9582461](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9582461)
* **[module] Multi-feature:** fixes an issue where the active content did not update on swipe, closes [#9679430](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9679430)
* **[module] Supplemental navigation:** fixes the button focus state styling in supplemental nav, closes [#9259895](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9259895)

# MWF Changelog
## Release Notes v1.15.0
### New
* **[component] Universal header:** adds Edge promotional banner, closes [#9360764](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9360764)
* **[module] Highlight feature:** adds option to use ambient video as a background, closes [#9453015](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9453015)

### Changed
* **[component] Flyout:** overhauls flyout placement algorithm to better handle flyouts nested inside positioned elements, closes [#8614790](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8614790)
* **[module] Feature:** removes 'Microsoft' name from label and logotype on logo, closes [#9444452](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9444452)

### Fixed
* **[component] Carousel:** fixes an issue where the carousel can scroll beyond the end of the single slide content if the content width changes due to carousel resizing, closes [#9502030](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9502030)
* **[component] Carousel:** fixes an issue where the flipper arrows do not work when screen width is less than the width of the content, closes [#9260013](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9260013)
* **[component] Combo:** fixes WCAG 2.0 AA accessibility issues, closes [#9305853](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9305853)
* **[component] Refine menu:** fixes WCAG 2.0 AA accessibility issues regarding duplicate id's, closes [#9305853](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9305853)
* **[component] Search:** fixes WCAG 2.0 AA accessibility issues regarding missing title attribute, closes [#9305853](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9305853)
* **[component] Tooltip:** fixes WCAG 2.0 AA accessibility issues regarding missing title attribute, closes [#9305853](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9305853)
* **[component] Universal header:** fixes issue with extra margin at vp5 and higher, closes [#9443655](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9443655)
* **[component] Universal header:** fixes issue with global menu positioning in mobile viewports, closes [#9109809](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9109809)
* **[component] Universal header:** fixes issues with focus states being clipped, closes [#9413370](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9413370)
* **[component] Video:** fixes multiple WCAG 2.0 AA accessibility issues, closes [#9305853](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9305853)
* **[module] Additional information:** fixes WCAG 2.0 AA accessibility issues regarding duplicate id's, closes [#9305853](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9305853)
* **[module] Auto suggest:** fixes WCAG 2.0 AA accessibility issues regarding missing alt tags, closes [#9305853](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9305853)
* **[module] Feature:** fixes call to action text to be black on light backgrounds, closes [#9186988](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9186988)
* **[module] Hero item:** updates vp3/vp4 hero content block layouts to narrow them so they don't overlap so much of the image, closes [#9360141](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9360141)
* **[module] Multi-feature:** fixes an issue where the flipper arrows do not work when screen width is less than the width of the content, closes [#9260013](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9260013)
* **[module] Multi-feature:** fixes the controls not working via mouse click in Firefox, closes [#9470310](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9470310)
* **[module] Rich heading:** fixes WCAG 2.0 AA accessibility issues regarding long alternate description, closes [#9305853](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9305853)
* **[module] Rich heading:** fixes issue of the image being squeezed at mobile breakpoints, closes [#9179936](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9179936)
* **[module] Search results:** fixes WCAG 2.0 AA accessibility issues regarding duplicate links, closes [#9305853](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9305853)
* **[module] Social:** fixes an issue where high contrast mode was causing images to not be visible, closes [#9337782](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9337782)
* **[module] Social:** fixes an issue where text was misaligned in horizontal layouts, closes [#9462687](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9462687)
* **[module] Social:** fixes misspelled alt text on icons, closes [#9444515](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9444515)

# MWF Changelog
## Release Notes v1.14.0
### New
* **[component] Action toggle:** adds new action-toggle component, closes [#8443790](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8443790)
* **[component] Carousel:** adds pub/sub support so subscribers can receive slide change notifications, closes [#8094624](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8094624)
* **[component] Pivot:** adds pub/sub support so subscribers can receive change notifications, closes [#8218176](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8218176)
* **[component] Select:** adds f-border to generated select-menu and also adds support for f-flex, closes [#8974527](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8974527)
* **[core] MWF:** applies variable to base Sass for UHF selector reduction, closes [#8724147](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8724147)

### Changed
* **[component] Drawer:** changes opacity of button text from 60% to 100% opacity, closes [#8468855](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8468855)
* **[component] Subheading:** updates padding for subheadings to match design requirements, closes [#7904859](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7904859)

### Fixed
* **[component] Combo:** fixes undesired window scrolling when clicked, closes [#9101130](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9101130)
* **[component] Mosaic placement:** fixes an issue where padding was causing call to actions to truncate too quickly, closes [#9234701](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9234701)
* **[module] Auto suggest:** fixes products with white on transparent PNGs not showing in products section, closes [#8102040](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8102040)
* **[module] Product placement:** fixes an issue where the picturefill dependency was removed causing a regression in browsers without picture element support, closes [#9299909](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9299909)
* **[module] Supplemental navigation:** fixes the focus state missing on supplemental nav and add keyboard support for expanding collapsed items on code examples, closes [#9179883](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9179883)
* **[module] Supplemental navigation:** fixes the focus state missing on supplemental nav and add keyboard support for expanding collapsed items, closes [#9259895](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9259895)

# MWF Changelog
## Release Notes v1.13.0
### New
* **[component] Button:** anchors with role='button' will now emit a click event when the user presses the spacebar on the element, closes [#8525079](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525079)
* **[component] Link navigation:** adds aria-labelledby attribute to the nav element, and an id to the heading element, to assign as the nav element's accessible name, closes [#8525491](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525491)
* **[component] Universal header:** adds language selector to global navigation, closes [#8708015](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8708015)
* **[component] Universal header:** adds subtle outline around menus when they are open, closes [#8027599](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8027599)
* **[component] Universal header:** adds support for multi-column menus at the category-2 level, closes [#8664026](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8664026)
* **[component] Video:** adds ability for video component to display an error message, closes [#8122027](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8122027)
* **[core] MWF:** applies UHF namespacing to dependencies to prevent version conflicts, closes [#9033400](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9033400)
* **[module] Banner:** adds quotes to heading and image, closes [#8353810](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8353810)
* **[module] Image-intro:** adds image intro as a new module, closes [#8320245](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8320245)

### Changed
* **[component] Carousel:** updates multi-slide carousels with tab/tabpanel roles to enhance accessibility, closes [#8525649](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525649)
* **[component] Choice summary:** updates component shape to use an anchor instead of a button per accessibility standards, closes [#8790072](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8790072)
* **[component] Combo:** updates several items to improve accessibility including: changing the aria label text to be more descriptive, adding the role combobox to the input element, adding the role button to the button, adding the role listbox to the ul element, switching the aria hidden attribute to the aria expanded attribute on the ul element, and adding the role option to the list items, closes [#8525110](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525110)
* **[component] Datetime picker:** Updates shape and script to better support keyboard focus and screen readers, closes [#8525126](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525126)
* **[component] Image:** changes handlebars files to check for f-pad option, closes [#9007551](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9007551)
* **[component] In-page navigation:** changes active link with a high contrast ratio, closes [#8333142](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8333142)
* **[component] Progress:** changes display of progess in IE8 and IE9 to none, closes [#6989902](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=6989902)
* **[component] Select menu:** updates select and select-menu to be more accessible by adding tabindex of 0 to the trigger, the list, and the spans on select, adding role listbox to the menu in select, adding role option to the list items in select; updates typescript to handle accessible keyboard keycodes across select and select menu, closes [#8776622](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8776622)
* **[component] Slider:** updates several items to improve accessibility including: adding the aria-valuemin, aria-valuemax, aria-valuenow, and aria-valuetext role=slider to the slider button; allowing for more robust keyboard support including: home to go to slider min, end to go to slider max, page up to increase by double the step, and page down to decrease by double the step; providing more descriptive labels and aria values, closes [#8884803](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8884803)
* **[component] Text field:** updates disabled and read only versions with aria label and aria hidden, closes [#8525366](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525366)
* **[component] Universal header:** changes breakpoint for shorter category nav to the start of viewport 4, closes [#8822290](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8822290)
* **[component] Universal header:** changes category label size to be 24px semilight in all viewports, closes [#8822359](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8822359)
* **[component] Universal header:** changes top spacing to 12px on vp6 or greater, 8px on vp5, and 0px for less than vp4, closes [#8821295](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8821295)
* **[component] Universal header:** updates Microsoft logo to align with global link baseline, closes [#8976671](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8976671)
* **[component] Video:** changes video background to be transparent, closes [#8793309](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8793309)
* **[module] Auto suggest:** updates all buttons below content-placement-items to be vertically aligned, closes [#9092435](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9092435)
* **[module] Hyperlink group:** removes maxlines and increases top and bottom padding, closes [#8889522](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8889522)
* **[module] Ratings and reviews:** changes ratings, reviews & histogram to a max-width of 800px, closes [#8142673](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8142673)

### Fixed
* **[component] Feature:** fixes a padding issue on the heading in small viewports when a badge or logo is not included, closes [#9025440](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9025440)
* **[component] Universal footer:** fixes an issue where the footer text had the potential to overlap in languages with long words, closes [#8042518](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8042518)
* **[component] Universal footer:** fixes spacing between bottom links and the language selector, closes [#8938783](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8938783)
* **[component] Universal header:** fixes mobile menu items being hidden as menus were pushed below viewport, closes [#8579053](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8579053)
* **[component] Video:** fixes tracking and volume sliders in RTL, closes [#8981742](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8981742)
* **[component] Video:** fixes video menu to support RTL locales, closes [#8407867](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8407867)
* **[core] MWF:** fixes an issue where c-paragraph-4 recieved too much top padding, closes [#8735969](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8735969)
* **[module] Additional information:** fixes an issue where additional padding was being added to the module height by the heading component, closes [#8276883](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8276883)
* **[module] Multi-feature:** fixes spacing issues on paragraphs and headings, closes [#9090732](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9090732)
* **[module] Multi-feature:** removes border around multi-feature images, closes [#9090604](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9090604)
* **[module] Ratings and reviews:** fixes an issue where words would overflow beyond the page margin instead of breaking onto a new line, closes [#8440128](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8440128)
* **[module] Supplemental navigation:** fixes the links without child items to be selectable, closes [#7891517](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7891517)

# MWF Changelog
## Release Notes v1.12.0
### New
* **[component] Action trigger:** adds new option to align action trigger with content that is above or below, closes [#8807250](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8807250)
* **[component] Checkbox:** adds an aria-label to input for improved accessibility on screen readers, closes [#8525092](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525092)
* **[component] Heading:** adds new lean option to remove top padding from heading, closes [#8734866](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8734866)
* **[component] Image:** adds new options to provide vertical padding to images, closes [#8734774](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8734774)
* **[component] Price:** adds option of large to price component, closes [#8775111](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8775111)
* **[component] Select menu:** adds new option of f-flex to allow select-menu to fill the width of its container, closes [#8776622](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8776622)
* **[component] Universal header:** adds the f-current class to delineate the active menu item, closes [#8549597](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8549597)
* **[component] Universal header:** updates Microsoft logos with new image assets, closes [#8737329](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8737329)
* **[core] MWF:** adds immersive hero item and immersive hero as new modules, closes [#7909787](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7909787)
* **[module] Email sign-up:** adds the email sign up module, which consists of a drawer, a text field, a submit button, a hyperlink, and a checkbox, closes [#8430053](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8430053)
* **[module] Feature group:** adds feature group as a module, consisting of an area heading and any number of features beneth it, closes [#8527192](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8527192)
* **[module] Highlight feature:** adds highlight feature as new module, closes [#8527288](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8527288)
* **[module] Multi-feature:** adds a new multi-feature module for displaying features with additional content, closes [#8527201](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8527201)

### Changed
* **[component] Flipper:** removes title attribute from flipper for accessibility standards, closes [#8609500](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8609500)
* **[component] Radio:** updates the template to use fieldset, legend, and aria-label to enhance the experience of screen-reader users, closes [#8525271](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525271)
* **[component] Refine menu:** changes markup to provide an intuitive interface for screen readers, closes [#8525533](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525533)
* **[component] Search:** removes title attribute from input for accessibility requirements, closes [#8525503](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525503)
* **[component] Select button:** updates select button to use aria-labelledby and aria-live properties for better accessibility when activating buttons, closes [#8525297](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525297)
* **[component] Select menu:** updates select menu to close when the last item on the list is tabbed off, removes redundant aria-haspopup, closes [#8525303](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525303)
* **[component] Text field:** changes style to include input type email, closes [#8703495](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8703495)
* **[component] Universal header:** changes VFI contrast ratio to meet accessibility standards for all anchors and buttons, closes [#8528329](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8528329)
* **[component] Universal header:** changes lower level menu color and background differences between light and dark themes, closes [#8790984](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8790984)
* **[component] Universal header:** changes the text size for the category label to remain consistent from vp4-vp6, closes [#8722937](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8722937)
* **[module] Hero item:** removes darken effect on hover, closes [#8377875](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8377875)
* **[module] Hero item:** updates vertical spacing to match other modules when hero follows other modules, closes [#8578011](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8578011)

### Fixed
* **[component] Menu item:** fixes hover state on f-product spans, closes [#8737292](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8737292)
* **[component] Universal header:** fixes spacing between menu items to be exactly 48px, closes [#8722898](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8722898)
* **[module] Compare chart:** fixes issue where headings were not being displayed on view port 1, closes [#8662054](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8662054)
* **[module] Hyperlink group:** fixes an issue where hyperlink group in mosaic placement was not center aligned, closes [#8703525](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8703525)

# MWF Changelog
## Release Notes v1.11.0
### New
* **[component] Breadcrumb:** adds new parent nav element to unordered list for improved accessibility, closes [#8525693](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525693)
* **[component] Call to action:** adds aria-label to emphasize link similar to using styles for sighted users, closes [#8525594](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525594)
* **[component] Image:** adds the ability to have an aria-label for images requiring a more verbose description to promote accessibility, closes [#8478668](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8478668)
* **[module] Hero item:** adds option for use with transparent header, closes [#8661390](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8661390)
* **[module] Skip to main:** adds a skip to main module for accessibility; will be first item in DOM, closes [#8629036](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8629036)

### Changed
* **[component] Choice summary:** updates accessibility by updating choice summary aria-label to describe what action is occuring and adding aria-live example and documentation, closes [#8525008](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525008)
* **[component] Content toggle:** updates to hide more/less buttons on screen readersfor improved accessibility, closes [#8525672](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525672)
* **[component] Flipper:** updates flipper to not output an aria-label if the flipper is hidden from screen readers, closes [#8478668](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8478668)
* **[component] Mosaic placement:** removes maxlines restrictions from heading and subheading, closes [#8499959](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8499959)
* **[component] Tooltip:** updates accessibility by removing the tab index and changing how the focus state is implemented, closes [#8525071](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525071)
* **[component] Universal header:** removes max width from auto-suggest flyout to allow longer content in smaller viewports, closes [#8571566](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8571566)
* **[component] Universal header:** removes skip to main from header shape to resolve dependency issues, closes [#8579059](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8579059)
* **[component] Universal header:** removes underline behavior in mobile from global and category main anchors and updates transparent theme colors, closes [#8653029](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8653029)
* **[component] Universal header:** updates category label so that the font-size reacts to viewport size, closes [#8454694](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8454694)
* **[component] Universal header:** updates color in transparent header to allow for usage on pages with white backgrounds, closes [#8691756](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8691756)
* **[component] Universal header:** updates default, hover, focus, and active color of shopping cart to match the design, closes [#8454155](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8454155)
* **[component] Universal header:** updates hover and focus states of global navigation, transparent category navigation, and unbranded category navigation, closes [#8549704](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8549704)
* **[component] Universal header:** updates mobile viewport nav items to have consistent color behavior, closes [#8631246](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8631246)
* **[component] Universal header:** updates search component styling in light and dark themes, closes [#8453951](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8453951)
* **[component] Universal header:** updates spacing above header in higher viewports, closes [#8478694](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8478694)
* **[component] Universal header:** updates transparency in mobile viewport to match new design, closes [#8478734](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8478734)
* **[module] Auto suggest:** updates to use aria-owns, aria-activedescendant, aria-live, the role combobox and adds tabbing behavior to collapse dropdown, closes [#8525566](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525566)
* **[module] Back to top:** updates example and guidance to have the id assigned to the first element inside the main content of the page, closes [#8525572](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525572)
* **[module] Content placement item:** removes max-line enforcement. This will be handled by content curators, closes [#8353357](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8353357)

### Fixed
* **[component] Select menu:** fixes issue where select-menu would not close when an item was selected, closes [#8407191](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8407191)
* **[component] Universal header:** fixes issue for select-menus where the underline would extend under the down caret and would also persist while the menu was open, closes [#8549704](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8549704)
* **[component] Universal header:** fixes issue where auto-suggest displayed behind category navigation, closes [#8684925](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8684925)
* **[component] Universal header:** fixes issue where the category nav label would not align with the Microsoft logo at VP6, closes [#8375982](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8375982)
* **[component] Universal header:** fixes vertical and horizontal alignment of select menu chevrons, closes [#8478806](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8478806)
* **[module] Content placement item:** fixes an issue causing heading text descenders to be clipped, closes [#8536398](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8536398)

# MWF Changelog
## Release Notes v1.10.0
### New
* **[component] Refine menu:** adds sublevel menus with expand and collapse functionality, closes [#8403315](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8403315)
* **[component] Search:** adds additional information for screen readers, closes [#8301515](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8301515)
* **[component] Select:** adds disabled state and required flag, closes [#7050052](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7050052)
* **[component] Universal header:** adds a 'skip to main content' link in the global menu, only accessible via tabbing, for accessibility standards, closes [#8286601](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8286601)
* **[component] Universal header:** adds light and dark theme support, closes [#8519553](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8519553)
* **[component] Universal header:** adds support for fixed top alert, closes [#8377031](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8377031)
* **[component] Video:** adds image overlay to video which when clicked, plays inline video, closes [#8353791](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8353791)
* **[module] Feature:** adds image priority option to feature giving a 65/35 split and taller height on image, closes [#8232789](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8232789)
* **[module] Social:** adds better accessibility by updating typescript and HTML shape, closes [#8301501](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8301501)

### Changed
* **[component] Tooltip:** removes unneeded aria tags for accessibility, closes [#8301476](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8301476)
* **[component] Universal header:** optimizes CSS selectors for IE9 issue and performance improvements, closes [#8222055](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8222055)
* **[core] MWF:** removes Bootstrap references from examples and CSS, closes [#7533226](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7533226)
* **[module] Content placement item:** decreases the heading size to match the updated design requirements, closes [#8382111](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8382111)
* **[module] Feature:** removes all maxlines restrictions, closes [#8353272](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8353272)
* **[module] Feature:** updates css and image sizes to allow for fixed aspect ratio, closes [#8353847](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8353847)
* **[module] Hero item:** updates hero typography sizes in viewports 5 and 6, closes [#8122713](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8122713)

### Fixed
* **[component] Dialog:** fixes the close behavior to only use buttons on all dialog excluding lightbox, closes [#8382812](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8382812)
* **[component] Universal footer:** fixes an issue where the footer was not aligned with the new module padding spec, closes [#8353838](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8353838)
* **[component] Universal header:** fixes several small validation errors, closes [#8454987](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8454987)
* **[module] Alert:** removes max width from fixed alert from updated design, closes [#8216399](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8216399)
* **[module] Multi-column:** fixes focus border overlapping across columns for hyperlink lists, closes [#8117933](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8117933)
* **[module] Product placement item:** fixes issue where product placement item was inheriting styles when inside a carousel limiting max lines to one, closes [#8378696](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8378696)
* **[module] Product placement item:** fixes issue with heading padding on video placement when no badge is included, closes [#8383808](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8383808)
* **[module] Search results:** fixes primary heading alignment, closes [#8365831](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8365831)

### Modules
* **[component] Image:** adds image as a new module, closes [#8353753](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8353753)
* **[module] Area heading:** adds area heading as new module, closes [#7387885](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7387885)
* **[module] Track-list:** adds track list module, closes [#7892673](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7892673)

# MWF Changelog
## Release Notes v1.9.0
### New
* **[component] Slider:** adds a vertical option to slider, closes [#8188712](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8188712)
* **[component] Universal header:** slims down category menu at vp3 to have a height of 50px, closes [#8053763](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8053763)
* **[module] Auto suggest:** adds the product type for showing products in results, closes [#8232728](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8232728)
* **[module] Content placement:** fixes an issue where module had extra top margin when following the heading module, closes [#8013722](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8013722)
* **[module] Structured-list:** adds structured list as a new module, closes [#7978657](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7978657)
* **[module] Typographic-intro:** adds typographic intro as a new module, closes [#7909876](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7909876)

### Changed
* **[component] Explicit:** toggle from long version of word to shorter version on vp1, closes [#7899955](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7899955)
* **[component] Feature:** adds support for background-colors to be applied to the component, closes [#7910035](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7910035)
* **[component] Feature:** adds support for logo placement option to be applied to the component, closes [#7845404](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7845404)
* **[component] Refine item:** updates a11y aria-controls attribute to target search results, closes [#6896064](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=6896064)
* **[component] Select menu:** updates f-border to also support fieldset, closes [#8121762](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8121762)
* **[component] Table:** updates columns and adds col-break to seperate column groups, closes [#7969241](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7969241)
* **[component] Video:** adds data-attributes for localization and js targeting, closes [#8188688](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8188688)
* **[component] Video:** restructure timecode markup for easier targeting of time, closes [#8188654](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8188654)
* **[core] MWF:** changes text on 'see all' links to 'show all', closes [#7636866](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7636866)
* **[core] MWF:** updates css browser prefix support to fix issues in iOS and Android browsers, closes [#8221466](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8221466)
* **[module] Compare chart:** removes heading from compare chart, closes [#8301724](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8301724)
* **[module] Content placement item:** adds badge option to template as detailed in the design spec, closes [#8220561](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8220561)
* **[module] Content placement item:** updates the placement shape to make both the image and text clickable, closes [#7888803](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7888803)
* **[module] Content rich block:** adds content toggle as an option, closes [#8154129](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8154129)
* **[module] Feature channel:** moves title to overlay image, adds paragraph content, and aligns vp3 with vp4-6 layout style, closes [#7978956](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7978956)
* **[module] Hero item:** changes content container width in centered layouts to allow for longer text strings before line breaks, closes [#7700635](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7700635)
* **[module] Product placement item:** updates images sizes and type sizes to meet new design spec and requirements, closes [#7845197](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7845197)
* **[module] Social:** updates support for .svg in IE10+ with .png fallback, closes [#7478042](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7478042)

### Fixed
* **[component] Dialog:** updates lightbox to remove border, closes [#8168987](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8168987)
* **[component] Pivot:** fixes an issue with pivot navigating to links, closes [#8088776](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8088776)
* **[component] Price:** fixes an issue where itemprop was missing from certain component variations, closes [#8316143](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8316143)
* **[component] Universal footer:** fixes an issue where relative positioning caused the footer to be misaligned, closes [#8182321](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8182321)
* **[component] Universal footer:** removes hardcoded string in copyright to json, closes [#8029619](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8029619)
* **[component] Universal header:** closes same scrolling issue as #8155896, closes [#7988642](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7988642)
* **[component] Universal header:** fixes an issue with C1 links being hidden at mobile, closes [#8183769](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8183769)
* **[component] Universal header:** fixes an issue with mobile header being fixed to top, closes [#8366500](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8366500)
* **[component] Universal header:** fixes an issue with the mobile menu changing the position of the header and background on scroll - the 'x-fixed' class should be placed on the body element while the mobile menu is open, and removed when closed, closes [#8155896](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8155896)
* **[component] Universal header:** fixes an issue with transparent header showing with a black background in IE8, closes [#7841849](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7841849)
* **[core] MWF:** fixes an issue where content toggle was not rendering correctly in modules including age-gate, closes [#8242339](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8242339)
* **[module] Auto suggest:** fixes an issue where position was spelled wrong, closes [#8208174](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8208174)
* **[module] Content placement item:** fixes issue with active/a11y state of CTA button where outlined button was cut off from view, closes [#7963159](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7963159)
* **[module] Histogram:** fixes inaccurate numeric data for improved bar display percentages, closes [#8143191](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8143191)
* **[module] Pagination:** fixes issue where next and previous to be hidden in vp1, closes [#8319595](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8319595)
* **[module] Product placement item:** fixes an issue with context-artist where css was targeting the wrong item and breaking the UI, closes [#8064483](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8064483)
* **[module] Product placement item:** fixes issue with video placement and layout rendering in IE 11 and below, closes [#8117122](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8117122)
* **[module] Rich heading:** adds data-grid to fix module sibling presentation, closes [#8300657](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8300657)

# MWF Changelog
## Release Notes v1.8.0
### New
* **[component] Menu:** adds the option to make a menu scrollable, closes [#7941732](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7941732)
* **[component] Select:** progressively enhance select to use select menu when js is available, closes [#7050052](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7050052)
* **[component] Textarea:** adds f-flex option to textarea component, closes [#8120372](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8120372)
* **[component] Universal header:** updates theme colors, closes [#8053053](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8053053)
* **[module] Banner:** adds paragraph option and updates schema, closes [#8101562](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8101562)
* **[module] Content rich block:** adds option of having two, three, or four columns, closes [#7898267](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7898267)
* **[module] Heading:** adds option for including one or more pivot or select menu, closes [#7978044](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7978044)

### Changed
* **[component] Choice summary:** updates component button to allow for radio option UI, closes [#7845315](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7845315)
* **[component] Content toggle:** adds content toggle line number configuration, toggle state, and auto-hide behavior for minimal content, closes [#7978296](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7978296)
* **[component] Content toggle:** adds the ability to use any HTML element for content toggle, closes [#7978271](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7978271)
* **[component] Refine menu:** updates to allow for anchor tag option on DOM, closes [#7993856](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7993856)
* **[component] Universal header:** changes cart from button to anchor, closes [#8084156](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8084156)
* **[core] MWF:** updates vertical spacing for heading, paragraph, caption, select menu with border, and textarea and text-field components when inside a form, closes [#8120336](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8120336)
* **[module] Hero item:** changes module to allow images to maintain a fixed aspect ratio instead of cropping, closes [#7977003](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7977003)
* **[module] Hero item:** updates default behavior to include opacity over the image when the hero item is hovered, closes [#8062282](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8062282)
* **[module] Hero item:** updates default functionality to include making the entire hero item clickable, closes [#7888744](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7888744)
* **[module] Hyperlink group:** updates layout rules to achieve flexible height, closes [#7976654](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7976654)

### Fixed
* **[component] Dialog:** fixes issue with dialog background color and opacity, closes [#7903737](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7903737)
* **[component] Dialog:** updates sass to remove interpolation dependency, closes [#7969197](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7969197)
* **[component] Dialog:** updates z-index to fix an issue where the current universal header was overlaying the dialog component, closes [#8059358](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8059358)
* **[component] Rating:** moves inline rating strings to .json data, closes [#7621108](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7621108)
* **[component] Toggle:** address issue where :hover UX was pointer on disabled nodes, closes [#7804106](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7804106)
* **[component] Toggle:** address issue where action toggle and label were not aligned, closes [#7743869](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7743869)
* **[component] Universal footer:** adds background color, closes [#8027314](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8027314)
* **[component] Universal footer:** fixes an issue with line wrapping in universal footer on iPad, closes [#7979571](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7979571)
* **[component] Universal footer:** fixes an issue with text wrapping in copyright and region area at smaller breakpoints, closes [#8027377](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8027377)
* **[component] Universal footer:** fixes an issue with the overall positioning and adds a top margin, closes [#8141625](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8141625)
* **[component] Universal footer:** fixes column shifting at vp3 to be 3x3, closes [#8027368](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8027368)
* **[component] Universal header:** changes link color to be lighter on default, closes [#8026603](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8026603)
* **[component] Universal header:** fixes an issue with aria-label not being needed in the paddles for category level, closes [#7898673](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7898673)
* **[component] Universal header:** fixes an issue with the shopping cart not being vertically aligned in smaller VPs, closes [#8013834](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8013834)
* **[component] Universal header:** fixes issue with search not showing when nav element is not present, closes [#8112347](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8112347)
* **[component] Universal header:** fixes issue with the after tag getting underlined on hover in Edge and IE browsers, closes [#7914430](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7914430)
* **[component] Universal header:** fixes search box mobile display overflow error, closes [#8027408](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8027408)
* **[component] Universal header:** removes menu bottom underline for default menu with category branding (migration header), closes [#8026576](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8026576)
* **[component] Universal header:** removes underline on hover for global and category parent links, closes [#8026550](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8026550)
* **[component] Universal header:** updates imagery used in hero in the universal header examples to the correct ratio, closes [#8170002](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8170002)
* **[component] Video:** fixes an issue with video play glyph toggle on autoplay, closes [#7927320](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7927320)
* **[component] Video:** fixes an issue with video player's volume slider at vp1, closes [#7477956](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7477956)
* **[core] MWF:** fixes RTL vars where interpolation is not needed, closes [#7969197](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7969197)
* **[core] MWF:** fixes issue with margins on module test pages, closes [#7904087](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7904087)
* **[core] MWF:** fixes layout issues on banner, compare-chart, content-rich-block, and refinements caused by incorrectly applied data-grid container, closes [#8053156](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8053156)
* **[module] Additional information:** addresses layout issue where stacked items had too much space at mobile breakpoints, closes [#7763386](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7763386)
* **[module] Alert:** fixes an issue where f-fixed was missing from documentation on MODX, closes [#8170038](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8170038)
* **[module] Compare chart:** changes image tag display property to inline-block to fix IE alignment issues, closes [#8012365](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8012365)
* **[module] Hero item:** removes default background color; IE8 does not recognize the overriding gradient, closes [#7842593](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=7842593)
* **[module] Pagination:** fixes issue where clicking outside element triggers events, closes [#8038031](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8038031)
* **[module] Product placement item:** fixes broken data reference and adds code example, closes [#8144238](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8144238)
* **[module] Product placement item:** fixes movie type code example/report to show rating stars, closes [#8065024](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8065024)

# MWF Changelog
## Release Notes v1.7.0
### New
- Task # 7159364: Added new Video placement content type.
- Task # 7506573: Added hover state to selected menu items in Select menu.
- Task # 7650471: Add new option for partner color custom values.
- Task # 7897491: Added option in Banner module for Heading, Caption, and Call to action.
- Task # 7903900: Added glyph options to Action trigger page.

### Changed
- Task # 7076529: Fixed inline styles showing up in module/page styles and store pages.
- Task # 7159295: Updated Ratings to use accent color blue instead of black.
- Task # 7160041: Deprecated Supplemental navigation, Pagination, Histogram, Auto-suggest, and Content placement components and completed conversion to module.
- Task # 7190362: Update Hyperlink group to meet a11y spec for active and hover states.
- Task # 7755828: Added f-detail-only option to provide css and padding updates to Product detail overview when only showing details.
- Task # 7818414: Removed overflow hidden from Group component to allow more flexibility.
- Task # 7829745: Fixed issue with Explicit visibility and position in Product Placement.
- Task # 7840601: Remove aria hidden rule for H3 within scope of Compare chart module.
- Task # 7841879: Updated placeholder images in Feature channel and Rich heading as to better illustrate our best practices.
- Task # 7845306: Updates UX of Refine items component to only illustrate `X` for Radio behavior.
- Task # 7879374: Update revised font library.
- Task # 7887968: Create utility to replace duplicated code for ellipsis use.
- Task # 7892538: Added additional breakpoints to Compare chart module.
- Task # 7892659: Added large size to Flipper and increased contrast.
- Task # 7898458: Update Hyperlink group module to have horizontal align option.
- Task # 7898758: Updated Product placement heading to allow for 2 lines.
- Task # 7903993: Updated example page to include a Hero inside the grid container and updated Hero style to include padding when it follows other modules within the page.
- Task # 7927143: Moved Product placement flippers out of the page gutter at VP2 and below.
- Task # 7940624: Added animations for mobile views in Universal header.
- Task # 7952609: Added top margin to Rich heading module.
- Task # 7959358: Added a counter to the cart in Universal header.

### Fixed
- Bug # 7472581: Fixed issue with Carousel flipper interactivity with keyboard tabbing.
- Bug # 7493246: Fixed padding for Badge small and large.
- Bug # 7545842: Fixed issue with placement of last item in Product Placement multi-row.
- Bug # 7694193: Fixed an issue with Carousel flippers and resizing browser.
- Bug # 7805660: Fixed an issue with Carousel leaving empty space on resize.
- Bug # 7852455: Fixed an issue with Compare chart's JSON.
- Bug # 7861706: Fixed issue with Video glyph behavior at the end of play.
- Bug # 7878328: Fixed issue with multi-column gutters not aligned with other module column spacing.
- Bug # 7880487: Fixed an issue with Video audio while using autoplay.
- Bug # 7886183: Fixed an issue with Universal header in which it was not centered in screen sizes above 1600px.
- Bug # 7892452: Fixed an issue on Mosaic placement where padding was creating a narrow region for content.
- Bug # 7892596: Fixed an issue with additional padding on the Media module.
- Bug # 7892599: Fixed issue with component specific padding.
- Bug # 7902337: Fixed an issue with Universal header in which the category hover states were incorrect.
- Bug # 7903524: Fixed an issue with Universal header in which the styles for mobile were not rendering correctly for neutral theme.
- Bug # 7903580: Fixed an issue with Universal header in which the previous and next paddles are incorrectly rendered in the neutral theme.
- Bug # 7903718: Fixed an issue where the height of Universal header was off causing clearing issues with modules below.
- Bug # 7904674: Fixed an issue with Bi-product placement module padding.
- Bug # 7914540: Fixed issues with Universal header's mobile view styling.
- Bug # 7914597: Fixed an issue with Universal header in which there was no menu title and previous and next paddles when the category nav was not present.
- Bug # 7914657: Fixed an issue with Universal header in which there was incorrect hover states in the neutral theme.
- Bug # 7922846: Fixed an issue with Universal footer in which the text was getting clipped.
- Bug # 7925940: Fixed issue with Carousel RTL animation.
- Bug # 7942606: Fixed an issue with Universal footer in which the bottom section was floated incorrectly.
- Bug # 7943918: Fixed an issue with link height in Universal header.
- Bug # 7948040: Fixed an issue with C1 links displaying improperly in Universal header.
- Bug # 7955860: Fixed issue with Product placement RTL thumbnail margin.
- Bug # 7963159: Fixed issue with a11y interactions on Hyperlink group and Product placement item.
- Bug # 7963559: Fixed issue with font lib naming convention.
- Bug # 7970270: Fixed issue with AMC placement module alignment at viewport 1.
- Bug # 7971458: Fixed an issue where the Heading module was too close when paired with the Content placement module.
- Bug # 7977895: Fixed issue with placement of play glyph in Video Product placement item.
- Bug # 7982225: Fixed an issue where padding on System preferences and Product detail overview modules were incorrect.
- Bug # 7990309: Fixed an issue where flippers were overlaying Product placements in VP2 and VP1.
- Bug # 7955134: Fixed an issue where heading was cut off too early in product placement.

### Reported Issues

### Pages

### Modules
- Task # 7613764: Added Device actions module.
- Task # 7819057: Added new Heading module.

# MWF Changelog
## Release Notes v1.6.0
### New
- Task # 7136933: Added additional scenarios for Video component, including closed captioning, quality, and more info.
- Task # 7219906: Added support for transparent Universal Header when in use with a hero
- Task # 7349304: Added localization for partner CSS.
- Task # 7612446: Added z-index across all components via new z-index-ramp for consistency.
- Task # 7639471: Added schema for feature channel module.
- Task # 7680417: Added support for bn-bd lang-locale.
- Task # 7555137: Added option for product placements to have default images with image error fallbacks.
- Task # 7560151: Added Media gallery option for Carousel component.
- Task # 7663932: Added additional content-type for product placement to illustrate the rectangular size.
- Task # 7762315: Added animations for dropdown and sub-menus.
- Task # 7762335: Added f-flip class to Menu item to allow js to flip position when reaching window bounds.

### Changed
- Task # 7157441: Updated JSON schema definition descriptions.
- Task # 7160041: Deprecated Alert, Back-to-top components and completed conversion to module.
- Task # 7190305: Updated Feature to switch layout to center layout.
- Task # 7396885: Updated read me and package to include revised instructions for node package consumption.
- Task # 7529759: Updated Subheading to include "p" tags and "h" tags.
- Task # 7530522: Changed typography color in Universal header. Added all branded examples. Added CTA and link examples.
- Task # 7559770: Standardized partner layout templates.
- Task # 7559810: DevToolbar updated to work with partner stylesheet.
- Task # 7579668: Updated "Code and preview" example names on Modx.
- Task # 7616725: Added left/right padding to modules and updated grid padding to improve content grid.
- Task # 7690437: Moved JavaScript for modules to live within the modules template folder.
- Task # 7719823: Updates baseline heading to Refine menu component in Refinements module.
- Task # 7750457: Updated schema for Product Placement to include artist.
- Task # 7763827: Updated Multi-Column module to include example of 5 column layout.
- Task # 7763950: Updated Label component to include code example class c-label.
- Task # 7774022: Moved JavaScript for components into their respective template folders.
- Task # 7775816: Removed all instances of anchors and replaced with buttons when they are opening submenus in Universal header.
- Task # 7813677: Removed bottom padding on Product placement module and updated top padding.
- Task # 7819577: Updated default margin for Featured collection module.
- Task # 7885907: Update staging tasks to match updated file structure for code examples.

### Fixed
- Bug # 7667952: Fixed an issue with Select Menu to allow href links to work properly.
- Bug # 7691267: Fixed issues with Feature Channel module in different viewports.
- Bug # 7761636: Fixed a bug where Menu item did not correctly wrap text.
- Bug # 7762762: Fixed a bug with height and text alignment defects with Link-navigation module.
- Bug # 7784135: Fixed issue with nested Mosaic modules and unnecessary data-grid attribute.
- Bug # 7815343: Fixed issue with variable height of Hyperlink Group module within the context of Hyperlink Group Content Placement module
- Bug # 7818545: Fixed image paths for Social component.
- Bug # 7815343: Fixed issue with variable height of Hyperlink group module within the context of Hyperlink group Content placement module

### Reported Issues

### Pages

### Modules
- Task # 7560151: Added new Media gallery module.
- Task # 7154256: Added a new Page bar module.

# MWF Changelog
## Release Notes v1.5.0
### New
- Task # 7530295: Added static sample pages for testing and examples.
- Task # 7414214: Added behavior and positioning for back to top.
- Task # 7398869: Added a content placement option to the Link list module.
- Task # 7517065: Added secondary style to CTA. Added disabled state to all CTAs.
- Task # 7560266: Added functionality to allow Hero, Feature, and Content placements to have zero, one, or two CTAs.
- Task # 7560270: Added a persistence option to the Select menu component.
- Task # 7072687: Added constant border to Product Placement component image.
- Task # 7528091: Added the option to hide Flipper component from screen readers.
- Task # 7640066: Added light and dark theme styles for Menu and Select menu.
- Task # 7601769: Added reports for partners.
- Task # 7159386: Added a toggle in the Product placement module to show the 'see all' link if there are more items than shown in a Carousel.
- Task # 7433797: Added the ME component to Universal header.
- Task # 7679173: Add content for Hololens views.
- Task # 7160007: Added the site-wide notification via the Alert module class 'f-fixed'.
- Task # 7434074: Added Structured list component.

### Changed
- Task # 7562903: Feature improvement request when in iPad portrait view where gap between image and content.
- Task # 7554293: Moved Carousel flippers to the gutter of Product placement module in VP4 and above.
- Task # 6751832: DevToolbar removed RTL button and added correct direction based on language selection.
- Task # 7520518: Replaced all "-example" class names with "-foo" as to clearly identify them as example selectors.
- Task # 7560030: Updates AMC responsive Drawer component to use Core JS versus custom development.
- Task # 7522783: Added mobile view for Universal header. Removed deprecated code.
- Task # 7443421: Updated inconsistencies in the Universal header to support either anchors or buttons for dropdowns.
- Task # 7433835: Added the ability for the Universal header to support either anchors or buttons for dropdowns.
- Task # 7720411: Added CTA back Universal header.
- Task # 7710998: Renamed Link list to Hyperlink group and placed Hyperlink group for Content placement in a 3 column and 9 column grid respectively.

### Fixed
- Bug # 7196417: Fixed a bug where the grid was applied to supplemental nav in the examples.
- Bug # 7603042: Fixed a bug where Select button had the wrong styling for the dark theme and disabled states.
- Bug # 7580177: Fixed a bug with hover state on pagination component; remove :hover from current page selected in pagination.
- Bug # 7614255: Fixed issue with caniuse data update that revised baseline of CSS files in reports.
- Bug # 7600933: Fixed a bug with Video in Content placements where Videos were overlapping.
- Bug # 7591190: Fixed a bug where table schema was mismatched with json data.
- Bug # 7365286: Fixed issue with menus where clicking off of the menu did not close the dropdown.
- Bug # 7701226: Fixed issue with Media module getting default top padding.

### Reported Issues
- Reported by: @vijayr : Bug # 7562903: When in iPad portrait view Feature component has extra gap between image and text.
- Reported by: @chwei : Bug # 7667952: Select menu anchor href's are not firing thus preventing navigation.

### Pages
- Task # 7279385, 7279392, 7279399, 7279404, 7279408, 7279414: Added MSN gallery page.
- Task # 7522783: Added six example pages for Universal header with the Hero component.
- Task # 7400478: Added interstitial checkout page for store.

### Modules
- Task # 7159420: Added new option of 3-up to content placement and expanded lines of text allowed from 2 to 4.
- Task # 7476412: Added the System requirements module.
- Task # 7159335: Added the Feature Channel module.
- Task # 7398938: Added the Age gate module for the store partner.
- Task # 7548380: Added new Media module.


# MWF Changelog
## Release Notes v1.4.0
### New
- Task # 7159998: Added a responsive option to the Drawer component.

### Changed

### Fixed
- Bug # 7512951: Fixed a bug where error and warning alert styles and glyph names were mapped incorrectly.
- Bug # 7047755: Fixed a bug correcting missing or incorrect letter spacing on CTA and Badge components.
- Bug # 7219346: Fixed a bug where multiple CTAs were not displayed correctly when grouped together in the Feature component.
- Bug # 7307248: Fixed a bug that caused List navigation component to extend outside the document body on mobile.
- Bug # 7395901: Fixed a bug where Pivot items would collapse on top of one another.
- Bug # 7401968: Fixed a bug where Pivot header was aligned out of bounds.
- Bug # 7432593: Fixed a bug where duplicate examples were shown for Select menu component.
- Bug # 7459824: Fixed a bug where Pivot sections would be hidden when clicking on the Pivot header.
- Bug # 7472455: Fixed a bug where the CTAs were colliding.
- Bug # 7472592: Fixed a bug where the CTA was being truncated too early in Content placement.
- Bug # 7472985: Fixed a bug where the CTA did not have a themed focus state.
- Bug # 7473862: Fixed a bug where the Action triggers in Alert where shown in the wrong order.
- Bug # 7492065: Fixed a bug where Flyout was incorrectly position on scroll and did not allow child elements within the launching element.
- Bug # 7513070: Fixed a bug where the CTAs were colliding in a Hero.
- Bug # 7472619: Fixed a bug where Product placement items in Carousel had poorly positioned focus rectangles.

### Reported Issues

### Pages

### Modules
- Task # 7135532: Added Alert module (Alert component will be deprecated in a future release).
- Task # 7158892: Added ratings and reviews module.
- Task # 7159350: Added the Bi-product placement module for placing two carousels in a single row.
- Task # 7159359: Added the AMC Product detail overview module consisting of product detail gallery and product detail information.
- Task # 7188569: Added the Content rich block module examples to include List component.
- Task # 7398758: Added the AMC placement module consisting of a default and hyperlink option.
- Task # 7398844: Added three new patterns to Mosaic, including usage of the link list module.
- Task # 7418702: Added a Multi column module which can incorporate list items and various content components.
- Task # 7448628: Added code examples for partners, includes page, module and component examples.
- Task # 7477398: Added the AMC Metatext info module.
- Task # 7159376: Added Additional Information module.


# MWF Changelog
## Release Notes v1.3.0
### New
- Task # 7180188: Added code example section in replace of code pen.
- Task # 7094616: Updated robots and humans files with latest contributors.
- Task # 7094673: Added a new developer page for MWF Spacing. Updated overview page with class names.
- Task # 7050053: Set up tasks to quickly create initial set up for new page template, modules and components.
- Task # 7010194: Added 2 new font regions (Armenian & Georgian) and 43 more locales.
- Task # 7190400: Added opacity mask options 10, 20, 40, 60, 80, 100 to Mosaic.
- Task # 7190390: Added Pattern 8, a single row with a medium A, medium B, and medium B layout to Mosaic.
- Task # 7202286: Fix documentation for modules for better consistency & readability.
- Task # 7240338: Adding report pages for modules and components to help partners track changes in MWF.
- Task # 7213519: Added vertical option for In-page navigation.
- Task # 7190324: Added two options to Text-field and Password that allow the field to be small and to flex to the parent container.
- Task # 7303676: Added two additional glyphs for warning and information to the alert component to show differing alert states.
- Task # 7258211: Added the JavaScript to close alerts.
- Task # 6645320: Added track list placement.
- Task # 7345945: Added option to product placement for TV shows and movies.
- Task # 7333123: Added large option to product placement.
- Task # 6863346: Added a new developer page for Search hub main page.
- Task # 7071985: Renamed left and right flippers to previous and next.
- Task # 7135033: Add callbacks to select menu and combo components.

### Changed
- Bug # 7210803: Moved isolated pieces of Universal Header to their own partial files.
- Bug # 7210803: Integrated auto-suggest into Universal Header search component.

### Fixed
- Bug # 7187284: Fixed a bug where Pivot was not working properly on Mac running FF 45.0.2.
- Bug # 7184087: Fixed a bug where Dialog is incorrectly positioned on mobile states.
- Bug # 7184530: Fixed a bug where disabled Rating states where the wrong opacity.
- Bug # 7291059: Fixed a bug where SASS was failing to compile when variables were defined within the scope of an if or if/else statement.
- Bug # 7292802: Fixed a bug where CTA and Badge components content was not all caps and should be in most localized languages.
- Bug # 6829642: Fixed a bug where Checkbox border is misaligned with the background.
- Bug # 6847289: Fixed a bug where Checkbox is misaligned in groups when long text is wrapped.
- Bug # 6829710: Fixed a bug where Checkbox mark is misaligned in groups when long text is wrapped.
- Bug # 7242721: Fixed a bug where CTA descenders were getting clipped.
- Bug # 7202729: Fixed a bug where CTA was getting clipped under certain scenarios.
- Bug # 7213199: Fixed a bug where CTA content was not shown in proper casing of all caps.

### Reported Issues
- Reported by: @bbrassell : Bug # 7184087: Dialog Bug on popup at 539 px wide screen in google chrome.
- Reported by: @brphelps, @chwei : Bug # 7183984: Complete the JavaScript story for SPA.
- Reported by: @arrayknight : Bug # 7185271: Content toggle JavaScript needs enhancements.
- Reported by: @kelly : Bug # 7187284: Pivot not working in FF on Mac.
- Reported by: @bbrassell : Bug # 7202737: Textarea bug where initial focus state started at at least 2 tab stops in rather than the top left corner.
- Reported by: @menzer : Task # 7365286: Menu type components should collapse on clicking outside of component.
- Reported by: @bbrassell : Bug # 7395901: Pivot item collapses into one another on mac safari.
- Reported by: @bbrassell : Bug # 7401968: Pivot header floats outside the bounds of the pivot section.

### Pages
- Task # 7159153, 7159159, 7159164, 7159163, 7159157 Added MSN article reader page.

### Modules
- Task # 5803299: Added refinement module consisting of refine menu, choice summary, heading, product placements and pagination components.
- Task # 6542316: Added a new video module.
- Task # 7207874: Added a new link list module.
- Task # 7190299: Added Rich heading module to display a heading with an image or logo paired with a small amount of descriptive text.
- Task # 7050121: Added compare chart module.
- Task # 7311139: Added a new search help module.
- Task # 7311132: Added a new item lists module.


# MWF Changelog
## Release Notes v1.2.0
### New
- Added the option for Price components to have text before and after.
- Added new option for Rating. Now supports a medium sized (f-individual) rating.
- Added the Feature module.
- Added the Content placement module.
- Added the Product placement module.
- Added the Link navigation module.
- Added the In-page navigation module.
- Added functionality to the Carousel component to allow images only.
- Added functionality to the Image component to be picture and accept an image for each breakpoint.
- Added the Mosaic module.
- Added the option for artist context type to Product placement component.
- Added Age rating component to provide concise and objective information about the age appropriateness of content in a video game, app, and/or media element.
- Added the Refine menu module.
- Added the Supplemental navigation module.
- Video player: Used to serve audio-visual content to a webpage to make it more engaging.
- Added social component to share and follow any number of social media networks.
- Added the Banner module which is a combination of a heading, sub-heading, images, and/or call-to-action in a meaningful container.
- Added the Table module.
- Added lean option to List component to remove internal padding between rows.
- Added the ability to use looping HTML 5 video in place of images in Heroes, Features, and Placements.
- Added no script design experience for those without JavaScript or without it enabled.
- Added additional background color options for Mosaic Placements.

### Changed
- Changed Social component (non-breaking) changes to add additional social button styles that have improved compatibility and accessibility over the previous network supplied components.
- Bundled JavaScript dependencies into single referenced mwf-main.js including minification for performance gains.
- Changed Badge styling to include 4px padding below the badge for all Product and Content Placements.
- Changed the deployment for CSS to include both region and lang-locale to CDN.

### Fixed
- Bug # 6516423: Fixed a bug where link navigation was misaligned in mobile views.
- Bug # 6868410: Fixed a bug where numeric data in tables should be right aligned.
- Bug # 6992200: Fixed a bug where in RTL the content was not switching appropriately.
- Bug # 7076583: Removed CSS uppercase text-transform to stop word meaning changes when localized.
- Bug # 7094575: Fixed a bug where uncaught reference error on JavaScript export was not defined on indexOf and bind polyfils.
- Bug # 7104840: Fixed a bug where the image was not correctly centered on viewport 2 and 3.
- Bug # 7106370: Fixed a bug where mosaic was not to scale when image and content were too small.
- Bug # 7108573: Fixed a bug where layout was incorrect for internet explorer 9.
- Bug # 7124034: Fixed a bug on carousel where the image was not correctly centered.
- Bug # 7134423: Fixed a bug where price has empty spans before and after the text.
- Bug # 7134423: Fixed a bug where price has empty spans before and after the text.


# MWF Changelog
## Release Notes v1.1.0
### New
- Added the File component.
- Added the Combo component.
- Compare chart module: A chart of organized images, paragraphs, lists, titles, and/or descriptions. Used to easily consume and compare information between items.
- Added the option for Select Menu to have a border.
- Added Universal Header and Universal Footer components to be included in packaged CSS for production.
- Added the option for images to be round.
- Added the option for select buttons component to have color swatches instead of text.
- Added responsive data-grid padding. This will resize the spacing between grid columns between viewports.

### Changed
- Removed DEPRECATED classes for all margin's and padding's. .m-r-\*, .m-b-\*, .m-l-\*, .m-\*, .p-v-\*, .p-h-\*, .p-t-\*, .p-r-\*, .p-b-\*, .p-l-\*, .p-\* including all spacers -xxl, -xl, -lg, -md, -sm, -xs, -xxs, -xxxs, -n.  Components contain their own padding/margin adjustments based on their position in relation to other components.  Otherwise, only the grid contains padding now pad-2x, pad-3x, pad-6x, and pad-12x"
- Changed CSS deployment from lang-local specific to region-specific on the CDN.
- Changed feature component to include content padding which previously didn't exist.
- Changed Mosaic placements to allow for heading only, sub-heading only, call-to-action only, or picture only.
- Removed source maps from inclusion when packaging CSS for production as it was bloating our CSS file unnecessarily.

### Fixed
- Bug # 6988517: Fixed a bug where media query range for x-visible-breakpoint classes was one size too small across viewports.
- Bug # 6988612: Fixed a bug where pivot content would disappear when pivot item was clicked.
- Bug # 6982467: Fixed a bug where dialogs could not be opened by more than one button or by anchor tags specifically c-call-to-action component.
- Bug # 7030329: Fixed a bug where focus state was being set incorrectly.
- Bug # 7029059: Fixed a bug where indeterminate progress bars did not have correct vertical height of 20px applied.
- Bug # 6717735: Fixed a bug where call to action had inconsistent vertical alignment of the glyph across browsers.
- Bug # 6846651: Fixed a bug where product placements displayed the currency symbol in an incorrect position.
- Bug # 6869904: Fixed a bug where album art was not centering when Hero layout was centered.
- Bug # 6870103: Fixed a bug where Date-time picker was styled incorrectly with list bullets.
- Bug # 7004224: Fixed a bug where Content-toggle was opening and closing when paragraph text was clicked.
- Bug # 7034049: Fixed a bug where fly-out position was broken on page resize events.

## Release Notes v1.0.0
- Officially released MWF v1 to public on http://www.getmwf.com