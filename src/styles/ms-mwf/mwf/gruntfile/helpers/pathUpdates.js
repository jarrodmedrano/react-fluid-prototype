module.exports = function () {

    // Helper function to remove /test/ from the compiled path of the assemble
    // task.
    removeTestFromPath = function (dest, src) {
        return dest + src.replace('test', '');
    }

    // Helper function to remove /report/ from the compiled path of the assemble
    // task.
    removeReportFromPath = function (dest, src) {
        return dest + src.replace('report', '');
    }
}