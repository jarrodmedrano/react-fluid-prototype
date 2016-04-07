module.exports = {
    sections: {
        slideshow: {
            selector: '#slider',
            elements: {
                rightNav: {
                    selector: 'button[class="rightNav"]'
                }
            }
        }
    },
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
            .waitForElementVisible('body', 5000)
            .FireEvent("pageNext", "click"),
            .compareScreenshot('RDX-desktop-page1-slide-1.png')
            .end();
    },
};