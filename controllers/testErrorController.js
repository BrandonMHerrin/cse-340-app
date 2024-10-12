const testErrorController = {};

testErrorController.throwTestError = async function (req, res, next) {
    throw Error("Hit test error route.")
}

module.exports = testErrorController;