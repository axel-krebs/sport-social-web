/* This is just a dummy; find out how to skip the backend module for webpack task! */
const path = require('path');

module.exports = {
    mode: "production",
    context: path.resolve(__dirname, '.'),
    resolve: {
     }
}
