module.exports = {
    before : function (browser) {
        browser.resizeWindow(1024, 800);
    },
    'RDX Page 1 Slide 0': function(browser) {
        browser
            .url('http://rdx-gsa.sitebox-s.redant.selfhost.corp.microsoft.com/')
            .waitForElementVisible('body', 5000)
            .compareScreenshot('RDX-desktop-page1-slide-0.png')
            .end();
    },
    'RDX Page 1 Slide 1': function(browser) {
        browser
            .url('http://rdx-gsa.sitebox-s.redant.selfhost.corp.microsoft.com/')
            .waitForElementVisible('.rightNav', 5000)
            .click('.rightNav')
            .pause(1000)
            .compareScreenshot('RDX-desktop-page1-slide-1.png')
            .end();
    },
    'RDX Page 1 Slide 2': function(browser) {
        browser
            .url('http://rdx-gsa.sitebox-s.redant.selfhost.corp.microsoft.com/')
            .waitForElementVisible('.rightNav', 5000)
            .click('.rightNav')
            .pause(1000)
            .click('.rightNav')
            .pause(1000)
            .compareScreenshot('RDX-desktop-page1-slide-2.png')
            .end();
    },
    'RDX Page 1 Slide 3': function(browser) {
        browser
            .url('http://rdx-gsa.sitebox-s.redant.selfhost.corp.microsoft.com/')
            .waitForElementVisible('.rightNav', 5000)
            .click('.rightNav')
            .pause(1000)
            .click('.rightNav')
            .pause(1000)
            .click('.rightNav')
            .pause(1000)
            .compareScreenshot('RDX-desktop-page1-slide-3.png')
            .end();
    },
    'RDX Page 1 Slide 4': function(browser) {
        browser
            .url('http://rdx-gsa.sitebox-s.redant.selfhost.corp.microsoft.com/')
            .waitForElementVisible('.rightNav', 5000)
            .click('.rightNav')
            .pause(1000)
            .click('.rightNav')
            .pause(1000)
            .click('.rightNav')
            .pause(1000)
            .click('.rightNav')
            .pause(1000)
            .compareScreenshot('RDX-desktop-page1-slide-4.png')
            .end();
    },
    'RDX Page 2 Slide 0': function(browser) {
        browser
            .url('http://rdx-gsa.sitebox-s.redant.selfhost.corp.microsoft.com/')
            .waitForElementVisible('.windows-hubButton', 5000)
            .click('.windows-hubButton')
            .pause(1000)
            .compareScreenshot('RDX-desktop-page2-slide-0.png')
            .end();
    },
    'RDX Page 2 Slide 1': function(browser) {
        browser
            .url('http://rdx-gsa.sitebox-s.redant.selfhost.corp.microsoft.com/')
            .waitForElementVisible('.windows-hubButton', 5000)
            .click('.windows-hubButton')
            .pause(1000)
            .click('.rightNav')
            .pause(1000)
            .compareScreenshot('RDX-desktop-page2-slide-1.png')
            .end();
    },
    'RDX Page 2 Slide 2': function(browser) {
        browser
            .url('http://rdx-gsa.sitebox-s.redant.selfhost.corp.microsoft.com/')
            .waitForElementVisible('.windows-hubButton', 5000)
            .click('.windows-hubButton')
            .pause(1000)
            .click('.rightNav')
            .pause(1000)
            .click('.rightNav')
            .pause(1000)
            .compareScreenshot('RDX-desktop-page2-slide-2.png')
            .end();
    },
    'RDX Page 2 Slide 3': function(browser) {
        browser
            .url('http://rdx-gsa.sitebox-s.redant.selfhost.corp.microsoft.com/')
            .waitForElementVisible('.windows-hubButton', 5000)
            .click('.windows-hubButton')
            .pause(1000)
            .click('.rightNav')
            .pause(1000)
            .click('.rightNav')
            .pause(1000)
            .click('.rightNav')
            .pause(1000)
            .compareScreenshot('RDX-desktop-page2-slide-3.png')
            .end();
    },
    'RDX Page 3 Slide 0': function(browser) {
        browser
            .url('http://rdx-gsa.sitebox-s.redant.selfhost.corp.microsoft.com/')
            .waitForElementVisible('.office-hubButton', 5000)
            .click('.office-hubButton')
            .pause(1000)
            .compareScreenshot('RDX-desktop-page3-slide-0.png')
            .end();
    },
    'RDX Page 3 Slide 1': function(browser) {
        browser
            .url('http://rdx-gsa.sitebox-s.redant.selfhost.corp.microsoft.com/')
            .waitForElementVisible('.office-hubButton', 5000)
            .click('.office-hubButton')
            .pause(1000)
            .click('.rightNav')
            .pause(1000)
            .compareScreenshot('RDX-desktop-page3-slide-1.png')
            .end();
    },
    'RDX Page 3 Slide 2': function(browser) {
        browser
            .url('http://rdx-gsa.sitebox-s.redant.selfhost.corp.microsoft.com/')
            .waitForElementVisible('.office-hubButton', 5000)
            .click('.office-hubButton')
            .pause(1000)
            .click('.rightNav')
            .pause(1000)
            .click('.rightNav')
            .pause(1000)
            .compareScreenshot('RDX-desktop-page3-slide-2.png')
            .end();
    },
    'RDX Page 3 Slide 3': function(browser) {
        browser
            .url('http://rdx-gsa.sitebox-s.redant.selfhost.corp.microsoft.com/')
            .waitForElementVisible('.office-hubButton', 5000)
            .click('.office-hubButton')
            .pause(1000)
            .click('.rightNav')
            .pause(1000)
            .click('.rightNav')
            .pause(1000)
            .compareScreenshot('RDX-desktop-page3-slide-3.png')
            .end();
    },
    'RDX Page 4 Slide 1': function(browser) {
        browser
            .url('http://rdx-gsa.sitebox-s.redant.selfhost.corp.microsoft.com/')
            .waitForElementVisible('.retailer-hubButton', 5000)
            .click('.retailer-hubButton')
            .pause(1000)
            .compareScreenshot('RDX-desktop-page4-slide-1.png')
            .end();
    },
    'RDX Page 4 Slide 2': function(browser) {
        browser
            .url('http://rdx-gsa.sitebox-s.redant.selfhost.corp.microsoft.com/')
            .waitForElementVisible('.retailer-hubButton', 5000)
            .click('.retailer-hubButton')
            .pause(1000)
            .click('.rightNav')
            .pause(1000)
            .compareScreenshot('RDX-desktop-page4-slide-2.png')
            .end();
    },
    'RDX Page 5 Slide 1': function(browser) {
        browser
            .url('http://rdx-gsa.sitebox-s.redant.selfhost.corp.microsoft.com/')
            .waitForElementVisible('.processor-hubButton', 5000)
            .click('.processor-hubButton')
            .pause(1000)
            .compareScreenshot('RDX-desktop-page5-slide-1.png')
            .end();
    }
};