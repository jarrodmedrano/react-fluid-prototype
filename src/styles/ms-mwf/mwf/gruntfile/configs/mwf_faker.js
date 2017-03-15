module.exports = {
    core: {
        files: [
            {
                expand: true,
                cwd: "core/templates",
                src: "**/data/**/*.json",
                dest: "temp/assemble-data",
                flatten: true
            }
        ]
    },
    mdl: {
        files: [
            {
                expand: true,
                cwd: "partners/MDL/templates",
                src: "**/data/**/*.json",
                dest: "temp/assemble-data",
                flatten: true
            }
        ]
    },
    partner: {
        files: [
            {
                expand: true,
                cwd: "partners/<%= partner %>/templates",
                src: "**/data/**/*.json",
                dest: "temp/assemble-data",
                flatten: true
            }
        ]
    },
    staging: {
        files: [
            {
                expand: true,
                cwd: "core/templates/{components,modules}/",
                src: "**/example/data/*.json",
                dest: "temp/assemble-data",
                flatten: true
            }
        ]
    }
};