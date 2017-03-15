// TODO: Move this to UTILS
// 
// This configuration points to the UHF PPE environment, and sets two query string params to use CI CSS - item=staticsmode:debug, and CI JS setswitch=UhfJs_Ci:1
// We use the PPE environment because it points to production compass content.
// If you're using the url in a browser, note that setswitch will set a cookie that you'll need to clear if you want to use the default PPE version of the UhfJs bundle.
var grunt = require('grunt');
var uhfDomain = grunt.option('uhf') || 'uhf-ppe';
var uhfPartner = (grunt.option('uhf-partner') || 'webframework').toLowerCase();

var headerid = 'webframework-header';
var footerid = 'webframework-footer';
var partnerPage = 'webframework';

switch (uhfPartner) {
    case 'microsoftstore':
        headerid = 'OneStoreSharedHeaderWithCMenu';
        footerid = 'MainFooter';
        partnerPage = 'RetailStore';
        break;
    default:
        break;
}

if (uhfDomain != 'uhf-int' && uhfDomain != 'uhf-ppe' && uhfDomain != 'uhf') {
    grunt.fail.fatal('For the uhf option, the valid values are [uhf-int|uhf-ppe|uhf], default is uhf-ppe. You entered:' + uhfDomain);
}

module.exports = {
    uhf: {
        src: {
            url: 'https://' + uhfDomain + '.microsoft.com/en-us/shell/xml/webframework?headerId=webframework-header&footerid=webframework-footer',
            headers: {
                'User-Agent': 'User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko'
            }
        },
        dest: 'temp/uhf.xml'
    }
};