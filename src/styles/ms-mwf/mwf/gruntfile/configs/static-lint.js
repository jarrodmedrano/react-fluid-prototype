module.exports = {
    options: {
        accessibilityLevel: 'WCAG2AA',
        displayReportAfter: false,
        reportLevels:{
            notice: false,
            warning: true,
            error: true
        },
        force: true,
        reportType: 'json',
        reportLocation: 'accessibility-reports',
        reportRoot: 'accessibility-reports',
        reportPort: 9003,
        reportServerTime: 15,
        serverRoot: 'dist',
        ignore: [
                'WCAG2AA.Principle1.Guideline1_1.1_1_1.H37',
                'WCAG2AA.Principle2.Guideline2_4.2_4_1.H64.1',
                'WCAG2AA.Principle1.Guideline1_3.1_3_1_A.G141',
                'WCAG2AA.Principle1.Guideline1_3.1_3_1.H73.3.NoSummary',
                'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail',
                'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Abs',
                'WCAG2AA.Principle1.Guideline1_4.1_4_3_F24.F24.FGColour',
                'WCAG2AA.Principle1.Guideline1_1.1_1_1.H67.2',
                'WCAG2AA.Principle1.Guideline1_4.1_4_3_F24.F24.BGColour',
                'WCAG2AA.Principle1.Guideline1_3.1_3_1.H48',
                'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.A.Placeholder',
                'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.Button.Name',
                'WCAG2AA.Principle3.Guideline3_2.3_2_2.H32.2',
                'WCAG2AA.Principle1.Guideline1_3.1_3_1.H44.NonExistentFragment',
                'WCAG2AA.Principle1.Guideline1_3.1_3_1.H71.NoLegend',
                'WCAG2AA.Principle4.Guideline4_1.4_1_1.F77',
                'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.InputFile.Name',
                'WCAG2AA.Principle1.Guideline1_4.1_4_3.G145.Abs',
                'WCAG2AA.Principle1.Guideline1_3.1_3_1.H85.2',
                'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.Select.Value',
                'WCAG2AA.Principle1.Guideline1_3.1_3_1.H49.S',
                'WCAG2AA.Principle1.Guideline1_3.1_3_1.H49.Small',
                'WCAG2AA.Principle1.Guideline1_3.1_3_1.H49.I',
                'WCAG2AA.Principle1.Guideline1_3.1_3_1.F68',
                'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.InputText.Name',
                'WCAG2AA.Principle1.Guideline1_3.1_3_1.H49.B',
                'WCAG2AA.Principle1.Guideline1_3.1_3_1.H49.U',
                'WCAG2AA.Principle1.Guideline1_3.1_3_1.H71.SameName',
                'WCAG2AA.Principle1.Guideline1_3.1_3_1.H39.3.NoCaption',
                'WCAG2AA.Principle1.Guideline1_3.1_3_1.H43.ScopeAmbiguous',
                'WCAG2AA.Principle1.Guideline1_3.1_3_1.H43.HeadersRequired',
                'WCAG2AA.Principle1.Guideline1_3.1_3_1.H42',
                'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.A.NoContent',
                'WCAG2AA.Principle1.Guideline1_4.1_4_3.G145.Fail',
                'WCAG2AA.Principle2.Guideline2_4.2_4_1.G1,G123,G124.NoSuchID',
                'WCAG2AA.Principle2.Guideline2_4.2_4_2.H25.1.EmptyTitle',
                'WCAG2AA.Principle1.Guideline1_1.1_1_1.H2.EG5',
                'WCAG2AA.Principle1.Guideline1_3.1_3_1.H49.AlignAttr',
                'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.A.EmptyNoId',
                'WCAG2AA.Principle4.Guideline4_1.4_1_2.ARIA6',
                'WCAG2AA.Principle1.Guideline1_3.1_3_1.ARIA6']
    },
    coreComponents: {
        options: {
            displayReportAfter: true,
            force: true,
            ignore: []
        },
        files: {
            src: ['dist/core/templates/components/**/*.html', '!dist/**/fixtures/**']
        }
    },
    coreModules: {
        options: {
            displayReportAfter: true,
            force: true,
            ignore: []
        },
        files: {
            src: ['dist/core/templates/modules/**/*.html', '!dist/**/fixtures/**', '!dist/core/templates/modules/product-placement/index.html']
        }
    },
    coreValidate: {
        options: {
            force: false
        },
        files: {
            src: ['dist/**/templates/**/*.html', '!dist/**/fixtures/**', '!dist/core/templates/modules/product-placement/index.html']
        }
    },
    partnerValidateAll: {
        options: {
            force: false
        },
        files: {
            src: ['dist/partners/templates/**/*.html']
        }
    },
    partnerValidate: {
        options: {
            displayReportAfter: true,
            force: false
        },
        files: {
            src: ['dist/partners/<%= partner %>/templates/**/*.html']
        }
    }
};