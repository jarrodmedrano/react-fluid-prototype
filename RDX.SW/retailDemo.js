// Copyright (C) Microsoft. All rights reserved.

//*******************************************************************
// Global variables

// Slider Div
var slider = document.getElementById('slider');
var sliderElementStyles = slider.style;

var currentlyShowingSlide;
var currentlyShowingSlideID;
var leftSideID = "";
var rightSideID = "";

// Will be minified eventually
var rightString = "right";
var leftString = "left";
var MsGrid = "-ms-grid";

var buildingJustOneSide = false;
var buildJustThisSide = "";

// Array of Slide IDs info
var arrayOfSlideIDsLength;
var lastSlideIDin_ArrayOfSlideIDs;
var secondToLastSlideIDin_ArrayOfSlideIDs;

var carouselWidth;
var thePointerType;
var directionSliderMoving = "";

var sliderTransitionSpeed = "1s";
var sliderTransitionSpeedTimeout = 1050;

var buildLandRExecuted = false;
var buildExecuted = false;

var built_slide_margin_left = "";
var builtOffSCreenOnThisSide = "";

var pixelWidth = 0;
var pixelWidthPxString = "";
var negPixelWidthPxString = "";
// Variables used in moving() & end()
var InitialXPoint;
var oneFifthOriginalCarouselWidth;
var movedX = 0;

// goForwardOrBack() Variables
var currentlyShowingPageIDIndex;

var increaseFlipperZIndexFired = false;

// Locks
var isBuilt = false;
var isAnimating = false;
var pointerType;

// Variables generated on window.load by generateArraysOfSlideIDs()
var arrayOfSlideIDs = [];
var arrayOfSections = [];
var lastSection;

//*******************************************************************
// Carousel state

var currentSection = 0;
var currentPage = 0;
var pageCounts = [];

function currentID() {
    return currentSection.toString() + "-" + currentPage.toString();
}

function setActivePageIndicator() {
    var pageIndicators = document.getElementsByClassName("layoutRoot-indicatorContainer");
    for (var i = 0; i < pageIndicators.length; i++) {
        if (i === currentPage) {
            pageIndicators[i].firstElementChild.classList.add("active");
        } else {
            pageIndicators[i].firstElementChild.classList.remove("active");
        }
    }
}

function onSectionChange() {
    setActiveHubButton();

    var pageIndicators = document.getElementsByClassName("layoutRoot-indicatorContainer");
    for (var i = 0; i < pageIndicators.length; i++) {
        if (pageCounts[currentSection] === 1) {
            // Hide page indicators if there's only one page
            pageIndicators[i].style.display = "none";
        } else if (i < pageCounts[currentSection]) {
            // Indicator divs have the class indicator-{{value:sectionId}}
            pageIndicators[i].firstElementChild.className = "indicatorContainer-indicator indicator-" + currentSection;
            pageIndicators[i].style.display = "inline-block";
        } else {
            pageIndicators[i].style.display = "none";
        }
    }
}

function setActiveHubButton() {
    var hubButtons = document.getElementsByClassName("template-hubButton");
    for (var i = 0; i < hubButtons.length; i++) {
        if (i === currentSection) {
          hubButtons[i].classList.add("active");
        } else {
          hubButtons[i].classList.remove("active");
        }
    }
}

function pauseOrPlay() {
  for (var i = 0; i < document.getElementsByTagName("video").length; i++) {
    var currentVideo = document.getElementsByTagName("video")[i];
    var SecondUpID = currentVideo.parentNode.parentNode.id;
    var ThirdUpID = currentVideo.parentNode.parentNode.parentNode.id;
    var SecondUp = document.getElementById(SecondUpID);
    var ThirdUp = document.getElementById(ThirdUpID);
    if (SecondUpID.length === 3 && typeof parseInt(SecondUpID.slice(0, 1)) === "number") {
      if (SecondUp.style.display === "none") {
        currentVideo.pause();
        document.exitFullscreen();

      } else {
        if(!SecondUp.classList.contains('noautoplay')) {
          currentVideo.play();
        }
      };
    };
    if (ThirdUpID.length === 3 && typeof parseInt(ThirdUpID.slice(0, 1)) === "number") {
      if (document.getElementById(ThirdUpID).style.display === "none") {
        currentVideo.pause();
        document.exitFullscreen();

      } else {
        if(!ThirdUp.classList.contains('noautoplay')) {
          currentVideo.play();
        }
      };
    };
  };
};

//*******************************************************************

function reCentering(eventHappening){
  directionSliderMoving = "neither";
  sliderElementStyles.transition = sliderTransitionSpeed;
  if (buildLandRExecuted === true) {
    sliderElementStyles.marginLeft = "-100%";
  } else if (buildExecuted === true) {
    if (builtOffSCreenOnThisSide === rightString) {
      sliderElementStyles.marginLeft = "";
    } else {
      sliderElementStyles.marginLeft = "-100%";
    };
  };
};

function updatePage(num) {
  if (num === 1) {
    if (++currentPage === pageCounts[currentSection]) {
      currentPage = 0;
      if (++currentSection === pageCounts.length) {
        currentSection = 0;
      };
      onSectionChange();
    };
    setActivePageIndicator();
  } else if (num === -1) {
    if (--currentPage === -1) {
      if (--currentSection < 0) {
        currentSection = pageCounts.length - 1;
        currentPage = pageCounts[currentSection] - 1;
      } else {
        currentPage = pageCounts[currentSection] - 1;
      }
        onSectionChange();
    } else {
    }
    setActivePageIndicator();
  } else {
  };
};

function generateArraysOfSlideIDs() {
  var sliderParentDiv = document.getElementById("slider");
  var sliderDivChildren = sliderParentDiv.getElementsByTagName("div");
  for (i=0; i < sliderDivChildren.length; i++) { 
    if (sliderDivChildren[i].parentNode === sliderParentDiv) {
      arrayOfSlideIDs.push(sliderDivChildren[i].id);
    };
  };
  for (var i = 0; i < arrayOfSlideIDs.length; i++) {
    var arrayOfSectionsIndex = arrayOfSections.length - 1;
    var currentArraySection = parseInt(arrayOfSlideIDs[i].slice(0,1));
    if (currentArraySection <= arrayOfSections[arrayOfSectionsIndex]) {
      // do nothing
    } else {
      arrayOfSections.push(currentArraySection);
    };
  };
  lastSection = arrayOfSections[(arrayOfSections.length-1)];
  arrayOfSlideIDsLength = arrayOfSlideIDs.length;
  lastSlideIDin_ArrayOfSlideIDs = arrayOfSlideIDs[(arrayOfSlideIDsLength - 1)];
  secondToLastSlideIDin_ArrayOfSlideIDs = arrayOfSlideIDs[(arrayOfSlideIDsLength - 2)];
};

//*******************************************************************
// window.OnLoad

window.addEventListener('load', function(){
  generateArraysOfSlideIDs();
  pauseOrPlay();
  slider.addEventListener('pointerdown', function(e){
    begin(e);
    e.preventDefault();
  }, false)
  slider.addEventListener('pointermove', function(e){
    moving(e);
    e.preventDefault();
  }, false)
  slider.addEventListener('pointerup', function(e){
    end(e);
    e.preventDefault();
  }, false)
}, false)

//*******************************************************************
// begin

var begin = function(event) {
  if (event.isPrimary === true) {
    pointerType = event.pointerType;
    if(!isBuilt && isAnimating === false) {
      isBuilt = true;
      carouselWidth = slider.clientWidth;
      determingShowingSlide();
      determineLandR(currentlyShowingSlideID);
      buildLandR(leftSideID,rightSideID,currentlyShowingSlideID);
    };
  };
};

//*******************************************************************
// begin RELATED FUNCTIONS

function build(onThisSide,offScreenSlideID,showingSlideID) { 
  var showingSlideIDStyles = document.getElementById(showingSlideID).style;
  sliderElementStyles.transition = "all";
  builtOffSCreenOnThisSide = onThisSide;
  buildExecuted = true;
  buildingJustOneSide = true;
  buildJustThisSide = onThisSide;
  if (onThisSide === rightString) {
    var sideOfScreenWithNoSlide = leftString;
  } else {
    var sideOfScreenWithNoSlide = rightString;
    sliderElementStyles.marginLeft = "-100%";
  };
  setShowingSlideToClientWidth(showingSlideID);
  if (showingSlideID === arrayOfSlideIDs[0] && onThisSide === leftString) {
    showingSlidePositionAndSliderWidth();
    showingSlideIDStyles.marginLeft = "100%";
    fabricate([offScreenSlideID,onThisSide]);
  } else if (showingSlideID === lastSlideIDin_ArrayOfSlideIDs && onThisSide === rightString) {
    showingSlidePositionAndSliderWidth();
    showingSlideIDStyles.marginLeft = '';
    var firstSlideStyles = document.getElementById(arrayOfSlideIDs[0]).style;
    firstSlideStyles.position = 'absolute';
    firstSlideStyles.marginLeft = '100%';
    firstSlideStyles.display = MsGrid;
  } else {
    showingSlideIDStyles.float = sideOfScreenWithNoSlide;  
    sliderElementStyles.vw = "200";  
    fabricate([offScreenSlideID,onThisSide]);
  };
  function showingSlidePositionAndSliderWidth() {
    showingSlideIDStyles.position = "absolute";
    sliderElementStyles.vw = "200";
  };
};

function buildLandR(left,right,showing) {
  buildLandRExecuted = true;
  var rightNowShowingIDStyles = document.getElementById(showing).style;
  sliderElementStyles.transition = "all";
  rightNowShowingIDStyles.transition = "all";
  rightNowShowingIDStyles.display = MsGrid;
  rightNowShowingIDStyles.margin = "0 auto";
  setShowingSlideToClientWidth(showing);
  sliderElementStyles.vw = "300";
  sliderElementStyles.marginLeft = "-100%";
  rightNowShowingIDStyles.margin = "";
  if (currentlyShowingSlideID === arrayOfSlideIDs[0] || currentlyShowingSlideID === lastSlideIDin_ArrayOfSlideIDs) {
    rightNowShowingIDStyles.position = "absolute";
    fabricateFirstAndLast_LandR(left,right);
    rightNowShowingIDStyles.marginLeft = "100%";
    increaseFlipperZIndex();
  } else {
    rightNowShowingIDStyles.marginLeft = pixelWidthPxString;
    fabricate([left,leftString],[right,rightString]);
    rightNowShowingIDStyles.marginLeft = "";
  };
};

/////////////////////////////////
// increaseFlipperZIndex() and resetFlipperZIndex() are needed 
// to get flippers to display on First and Last slide, since since the touch transitions 
// for those slides use different positioning JS than the others
function increaseFlipperZIndex() {
  increaseFlipperZIndexFired = true;
  var hubButtons = document.getElementsByClassName("template-hubButton");
  for (var i = hubButtons.length - 1; i >= 0; i--) {
    hubButtons[i].style.zIndex = "5";
  };
  var rightFlipper = document.querySelector(".rightNav");
  var leftFLipper = document.querySelector(".leftNav");
  rightFlipper.style.zIndex = "2";
  leftFLipper.style.zIndex = "2";
};

function resetFlipperZIndex() {
  increaseFlipperZIndexFired = false;
  var hubButtons = document.getElementsByClassName("template-hubButton");
  for (var i = hubButtons.length - 1; i >= 0; i--) {
    hubButtons[i].style.zIndex = "";
  };
  var rightFlipper = document.querySelector(".rightNav");
  var leftFLipper = document.querySelector(".leftNav");
  rightFlipper.style.zIndex = "";
  leftFLipper.style.zIndex = "";
};

/////////////////////////////////

function determingShowingSlide() {
  for (var i = 0; i < arrayOfSlideIDs.length; i++) {
    if (document.getElementById(arrayOfSlideIDs[i]).style.display === MsGrid) {
      currentlyShowingSlide = document.getElementById(arrayOfSlideIDs[i]);
      currentlyShowingSlideID = arrayOfSlideIDs[i];
    };
  };
};

function determineLandR(currentSlideID) {
  if (currentlyShowingSlideID === arrayOfSlideIDs[0]) {
    leftSideID = lastSlideIDin_ArrayOfSlideIDs;
    rightSideID = arrayOfSlideIDs[1];
  } else if (currentlyShowingSlideID === lastSlideIDin_ArrayOfSlideIDs) {
    leftSideID = secondToLastSlideIDin_ArrayOfSlideIDs;
    rightSideID = arrayOfSlideIDs[0];
  } else {
    for (var i = 0; i < arrayOfSlideIDs.length; i++) {
      if (currentlyShowingSlideID === arrayOfSlideIDs[i]) {
        leftSideID = arrayOfSlideIDs[i-1];
        rightSideID = arrayOfSlideIDs[i+1];
      };
    };
  };
};

function fabricateFirstAndLast_LandR(left,right) {
  var leftStyles = document.getElementById(left).style;
  var rightStyles = document.getElementById(right).style;
  leftStyles.transition = "all";
  rightStyles.transition = "all";
  leftStyles.marginLeft = "-200%!important";
  rightStyles.marginLeft = "200%";
  absoluteAndNoFloat(rightStyles,leftStyles);
  leftStyles.display = MsGrid;
  rightStyles.display = MsGrid;
  function absoluteAndNoFloat() {
    for (var i = 0; i < arguments.length; i++) {
      arguments[i].float = "";
      arguments[i].position = 'absolute';
    };
  };
};

function fabricate() {
  // [SlideIDstring, floatSide]
  // Example:   fabricate([left,leftString],[right,rightString]);
  for (var i = 0; i < arguments.length; i++) {
    document.getElementById(arguments[i][0]).style.float = arguments[i][1];
    document.getElementById(arguments[i][0]).style.display = MsGrid;
  };
};

function setShowingSlideToClientWidth(showingSlideID) {
  pixelWidth = document.getElementById(showingSlideID).clientWidth;
  pixelWidthPxString = pixelWidth.toString() + "px";
  negPixelWidthPxString = "-" + pixelWidth.toString() + "px";
  document.getElementById(showingSlideID).style.width = pixelWidthPxString;
};

//*******************************************************************
// moving
document.addEventListener('fullscreeneventchange', function(e) {
  if (document.isFullScreen) {
    /* make it look good for fullscreen */
    alert('test');
  } else {
    alert('false');
    /* return to the normal state in page */
  }
}, true);

var moving = function(event) {
    if (event.isPrimary === true && 
      pointerType       === event.pointerType && 
      isAnimating       === false && 
      isBuilt           === true) {
      var midX = event.clientX;
      var movedX = 0;
      var absoluteDiffrerence = Math.abs(Math.abs(InitialXPoint) - Math.abs(midX));
      var difference = Math.abs(InitialXPoint) - Math.abs(midX);
        if (InitialXPoint === undefined) {
          InitialXPoint = midX;
        } else {
          movedX = midX - InitialXPoint;
        };
        sliderElementStyles.transition= "all";
        movedX = movedX - carouselWidth;
        sliderElementStyles.marginLeft = movedX.toString() + "px";
        oneFifthOriginalCarouselWidth = (carouselWidth / 5);
        if (absoluteDiffrerence > oneFifthOriginalCarouselWidth && difference > 0) {
          isAnimating = true;
          var oldPage = currentID();
          updatePage(1);
          //WinGS.LogBI("Swipe", "{'direction':'previous','oldPage':'" + oldPage + "','newPage':'" + currentID() + "'}");
          slideSlider(leftString);
        } else if (absoluteDiffrerence > oneFifthOriginalCarouselWidth && difference < 0) {
          isAnimating = true;
          var oldPage = currentID();  
          updatePage(-1);
          //WinGS.LogBI("Swipe", "{'direction':'next','oldPage':'" + oldPage + "','newPage':'" + currentID() + "'}");
          slideSlider(rightString);
        };
    };
  };

//*******************************************************************
// end

var end = function(event) {
  if (event.isPrimary === true) {
    if (!isAnimating) {
      isAnimating = true;
      reCentering(event);
      isAnimating = false;
      InitialXPoint = undefined;
    };
  };
};

//*******************************************************************
// sliding

function slideSlider(directionMoving) {
  sliderElementStyles.transition = sliderTransitionSpeed;
  if (directionMoving === rightString) {
    directionSliderMoving = rightString;
    sliderElementStyles.marginLeft = "";
  } else if (directionMoving === leftString && buildingJustOneSide === true) {
    directionSliderMoving = leftString;
    sliderElementStyles.marginLeft = "-100%";
  } else if (directionMoving === leftString) {
    directionSliderMoving = leftString;
    sliderElementStyles.marginLeft = "-200%";
  };

  // Move page indicators to bottom for specs page
  var target;
  if (directionMoving === rightString) {
    target = document.getElementById(leftSideID);
  } else {
    target = document.getElementById(rightSideID);
  }
  if (target.classList.contains("contentCard-specs")) {
    document.getElementsByClassName("template-pageIndicator")[0].classList.add("indicators-bottom");
  } else {
    document.getElementsByClassName("template-pageIndicator")[0].classList.remove("indicators-bottom");
  }
  setTimeout(function(){
    disassemble();
    isAnimating = false;
    isBuilt = false;
  }, sliderTransitionSpeedTimeout);
};

//*******************************************************************
// disassemble AND hiding functions

function disassemble() {
  var directionSliderMoved = directionSliderMoving;
  sliderElementStyles.transition = "all";
  InitialXPoint = undefined;
  if (increaseFlipperZIndexFired) {
    resetFlipperZIndex();
  };
  if (directionSliderMoved === "neither" || directionSliderMoved === undefined) {
    hideTwoSlides("both");
  } else if (buildingJustOneSide === true && buildJustThisSide === rightString) {
    hideOneSlide(leftString,true);
  } else if (buildingJustOneSide === true && buildJustThisSide === leftString) {
    hideOneSlide(rightString,true);
  } else if (buildingJustOneSide !== true && directionSliderMoved === leftString) {
    hideTwoSlides(leftString);
  } else if (buildingJustOneSide !== true && directionSliderMoved === rightString) {
    hideTwoSlides(rightString);
  };
  pauseOrPlay();
};

function hideOneSlide(onThisSide,hasSlideExecuted) {
  buildingJustOneSide = false;
  if (onThisSide === rightString && hasSlideExecuted === true) {
    hiding(currentlyShowingSlideID,leftSideID);
  } else if (onThisSide === rightString && hasSlideExecuted === false) {
    hiding(leftSideID,currentlyShowingSlideID);
  } else if (onThisSide === leftString && hasSlideExecuted === true) {
    hiding(currentlyShowingSlideID,rightSideID);
  } else if (onThisSide === leftString && hasSlideExecuted === false) {
    hiding(rightSideID,currentlyShowingSlideID);
  };
};

function hiding(hiding,visible) {
  document.getElementById(visible).style.width = "100%";
  dissapearUnusedSlides_UnFloatCenter_reSetSlider(visible,[hiding]);
  resetCurrentlyShowingSlides(visible);
  resetBooleansAndLogicValues();
};

function hideTwoSlides(onThisSide) {
  sliderElementStyles.transition = "all";
  if (onThisSide === leftString) {
    dissapearUnusedSlides_UnFloatCenter_reSetSlider(rightSideID,[leftSideID,currentlyShowingSlideID]);
    resetCurrentlyShowingSlides(rightSideID);
    resetBooleansAndLogicValues();
  } else if (onThisSide === rightString) {
    dissapearUnusedSlides_UnFloatCenter_reSetSlider(leftSideID,[rightSideID,currentlyShowingSlideID]);
    resetCurrentlyShowingSlides(leftSideID);
    resetBooleansAndLogicValues();
  } else if (onThisSide === "both") {
    leaveCenterVisibleMargin();
    dissapearUnusedSlides_UnFloatCenter_reSetSlider(currentlyShowingSlideID,[rightSideID,leftSideID]);
    resetCurrentlyShowingSlides(currentlyShowingSlideID);
    resetBooleansAndLogicValues();
  };
};

function dissapearUnusedSlides_UnFloatCenter_reSetSlider(slideIDCSSfloattoEmptyString,arrayOfSlideIDsToVanish) {
  var aSlideToReset = document.getElementById(slideIDCSSfloattoEmptyString).style;
  aSlideToReset.float = "";
  aSlideToReset.position = "static";
  aSlideToReset.marginLeft = "";
  for (var i = 0; i < arrayOfSlideIDsToVanish.length; i++) {
    if (arrayOfSlideIDsToVanish[i].length > 1) {
      var slideToStyle = document.getElementById(arrayOfSlideIDsToVanish[i]).style;
      slideToStyle.display = "none";
      slideToStyle.float = "";
      slideToStyle.position = "static";
      slideToStyle.marginLeft = "";
    };
  };
  sliderWidthAndMarginReSet();
};

function resetCurrentlyShowingSlides(NEWcurrentlyShowingSlideID) {
  currentlyShowingSlide = document.getElementById(NEWcurrentlyShowingSlideID);
  currentlyShowingSlideID = NEWcurrentlyShowingSlideID;
};

function sliderWidthAndMarginReSet() {
  sliderElementStyles.marginLeft = "";
  sliderElementStyles.width = "100%";
};

function leaveCenterVisibleMargin() {
  sliderElementStyles.marginLeft = "-100%";
};

function resetBooleansAndLogicValues() {
  buildLandRExecuted = false;
  buildExecuted = false;
};

//*******************************************************************
// section sliding
//  possible bug - will there ever be only 1 section?

// Fired ONLY on initial page load at 5000 millisecond intervals
var isNewSlideToNextSectionRightExecuting = false;

function newSlideToNextSectionRight() {

  var isNextSectionHigher = false;
  isNewSlideToNextSectionRightExecuting = true;
  var nextSection = currentSection;
  nextSection = nextSection + 1;
  for (var i = 0; i < arrayOfSections.length; i++) {
    if (nextSection === arrayOfSections[i]) {
      isNextSectionHigher = true;
      goToArbitrarySection(nextSection);
    };
  };
  if (isNextSectionHigher === false) {
    goToArbitrarySection(0);
  };
  isNextSectionHigher = false;
};


//*******************************************************************
// huButton & dot-indicator functions

function goToArbitrarySection(sectionNumber) {
  if (!isAnimating) {

    isAnimating = true;
    ifIsBuiltIsTrue_Dissassemble();
    determingShowingSlide();
    if (currentSection !== sectionNumber) {
      var firstSlideOfSectionToGoTo = sectionNumber.toString() + "-0";
      determingShowingSlide();
      if (currentSection < sectionNumber || isNewSlideToNextSectionRightExecuting) {
        rightSideID = firstSlideOfSectionToGoTo;
        build(rightString,firstSlideOfSectionToGoTo,currentlyShowingSlideID);
        slideSlider(leftString);

        isNewSlideToNextSectionRightExecuting = false;
      } else { // currentSection > sectionNumber
        leftSideID = firstSlideOfSectionToGoTo;
        build(leftString,firstSlideOfSectionToGoTo,currentlyShowingSlideID);
        slideSlider(rightString);

      };
      executeUpdatePage(currentlyShowingSlideID,firstSlideOfSectionToGoTo);
    } else {
      isAnimating = false;
    };
    isNextSectionActuallyAHigherInt = false;
  };
};

function goToArbitraryPage(page) {
  if (!isAnimating) {
    isAnimating = true;
    ifIsBuiltIsTrue_Dissassemble();
    determingShowingSlide();
    var slideIDNavigatingTo = currentSection.toString() + "-" + page.toString();
    if (currentPage === page) {
      isAnimating = false;
    } else if (currentPage < page) {
      rightSideID = slideIDNavigatingTo;
      build(rightString,slideIDNavigatingTo,currentlyShowingSlideID);
      slideSlider(leftString);
    } else { // currentPage > page
      leftSideID = slideIDNavigatingTo;
      build(leftString,slideIDNavigatingTo,currentlyShowingSlideID);
      slideSlider(rightString);
    };
    executeUpdatePage(currentlyShowingSlideID,slideIDNavigatingTo);
  };
};

function executeUpdatePage(showingSlideID,slideComingInID){
  var showingSlideIDIndex
  var slideComingInIDIndex
  for (var i = 0; i < arrayOfSlideIDs.length; i++) {
    if (arrayOfSlideIDs[i] === showingSlideID) {
      showingSlideIDIndex = i;
    } else if (arrayOfSlideIDs[i] === slideComingInID) {
      slideComingInIDIndex = i;
    };
  };
  var difference = showingSlideIDIndex - slideComingInIDIndex;
  var absDifference = Math.abs(difference);
  if (difference > 0) {
    while (difference--) {
        updatePage(-1);
    };
  } else { // difference < 0
    while (absDifference--) {
        updatePage(1);
    };
  };
};

//*******************************************************************
// L&R FLIPPER FUNCTIONS

function toTheNextPage() {
  if (!isAnimating) {
    isAnimating = true;
    ifIsBuiltIsTrue_Dissassemble();
    determingShowingSlide();
    determineLandR(currentlyShowingSlideID);
    updatePage(1);
    build(rightString,rightSideID,currentlyShowingSlideID);
    slideSlider(leftString);
  };
};

function toThePreviousPage() {
  if (!isAnimating) {
    isAnimating = true;
    ifIsBuiltIsTrue_Dissassemble();
    determingShowingSlide();
    determineLandR(currentlyShowingSlideID);
    updatePage(-1);
    build(leftString,leftSideID,currentlyShowingSlideID);
    slideSlider(rightString);
  };
};


function ifIsBuiltIsTrue_Dissassemble(){
  // for toThePreviousPage(), toTheNextPage(), goToArbitrarySection(), & goToArbitraryPage()
  if (isBuilt && directionSliderMoving === "neither") {
    disassemble();
    isBuilt = false;
  };
};

//*******************************************************************
// Business logic

// Grab page counts embedded in HTML
var pageCountsElems = document.getElementById("pageCounts").children;
for (var i = 0; i < pageCountsElems.length; i++) {
    pageCounts[i] = parseInt(pageCountsElems[i].innerHTML);
}

// Show 0-0 card and set controls for initial use
document.getElementById("0-0").style.display = MsGrid;
onSectionChange();
setActivePageIndicator();

// Rotate through sections every 5 seconds until user breaks interaction
// Subsequently show flippers whenever the mouse moves
/*
var timer;
document.body.addEventListener("mousemove", function () {
    clearTimeout(timer);
    var flippers = document.getElementsByClassName("sideNav")
    flippers[0].style.display = MsGrid;
    flippers[1].style.display = MsGrid;

    function hideFlippers() {
        flippers[0].style.display = "none";
        flippers[1].style.display = "none";
    }
    timer = setInterval(hideFlippers, 300);
});
*/

// Left + right arrow key functionality
document.onkeydown = function (evt) {

    evt = evt || window.event;
    switch (evt.keyCode) {
        case 37:
            var oldPage = currentID();
            toThePreviousPage();
            //WinGS.LogBI("KeyPress", "{'direction':'left','oldPage':'" + oldPage + "','newPage':'" + currentID() + "'}");
            break;
        case 39:
            var oldPage = currentID();
            toTheNextPage();
            //WinGS.LogBI("KeyPress", "{'direction':'right','oldPage':'" + oldPage + "','newPage':'" + currentID() + "'}");
            break;
    }
};

//*******************************************************************
// Wrappers for HTML events

function pageNext() {
    var oldPage = currentID();
    toTheNextPage();
    //WinGS.LogBI("Click", "{'target':'rightNav','oldPage':'" + oldPage + "','newPage':'" + currentID() + "'}");
}

function pagePrev() {
    var oldPage = currentID();
    toThePreviousPage();
    //WinGS.LogBI("Click", "{'target':'leftNav','oldPage':'" + oldPage + "','newPage':'" + currentID() + "'}");
}

function sectionNext() {
    newSlideToNextSectionRight();
}

function navigateToPage(page) {
    var oldPage = currentID();
    goToArbitraryPage(page);
    //WinGS.LogBI("Click", "{'target':'pageIndicator','oldPage':'" + oldPage + "','newPage':'" + currentID() + "'}");
}

function navigateToSection(section) {
    var oldPage = currentID();
    goToArbitrarySection(section);
    //WinGS.LogBI("Click", "{'target':'hubButton','oldPage':'" + oldPage + "','newPage':'" + currentID() + "'}");
}

//*******************************************************************
// Miscellaneous functions

function showModal(event) {
    event.preventDefault();
    event.currentTarget.parentNode.parentNode.parentNode.firstElementChild.style.display = "";
}

function hideModal(event) {
    event.currentTarget.parentNode.parentNode.style.display = "none";
}
