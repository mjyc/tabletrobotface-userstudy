var settings = require('../../settings.json');

settings = typeof settings === 'undfined' ? {} : settings;

typeof settings.filename === 'undefined' && (settings.filename = 'testdata.json');

module.exports = settings;