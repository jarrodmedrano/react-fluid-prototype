# MWF Changelog
## Release Notes v1.19.0
### Changed
* **[component] Carousel:** changed having multi and single slide carousel code co-mingled and duplicated carousel code in other modules. Carousel is now deprecated an either MultiSlideCarousel or SingleSlideCarousel should be used in its place, closes [#8865684](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8865684)

### Fixed
* **[component] Carousel:** fixes an issue where an autoplaying carousel will play while a CTA inside of a slide is focused, closes [#10301857](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=10301857)

# MWF Changelog
## Release Notes v1.18.0
### Fixed
* **[component] Carousel:** fixes an issue where the touch swipe not working when a user swipes diagonally, closes [#9234177](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9234177)

# MWF Changelog
## Release Notes v1.16.0
### Fixed
* **[component] Carousel:** fixes tracking item focus and show/hiding flippers in gallery mode, closes [#9545488](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9545488)

# MWF Changelog
## Release Notes v1.15.0
### Fixed
* **[component] Carousel:** fixes an issue where the carousel can scroll beyond the end of the single slide content if the content width changes due to carousel resizing, closes [#9502030](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9502030)
* **[component] Carousel:** fixes an issue where the flipper arrows do not work when screen width is less than the width of the content, closes [#9260013](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=9260013)

# MWF Changelog
## Release Notes v1.14.0
### New
* **[component] Carousel:** adds pub/sub support so subscribers can receive slide change notifications, closes [#8094624](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8094624)

# MWF Changelog
## Release Notes v1.13.0
### Changed
* **[component] Carousel:** updates multi-slide carousels with tab/tabpanel roles to enhance accessibility, closes [#8525649](https://microsoft.visualstudio.com/DefaultCollection/OSGS/_workitems?id=8525649)

