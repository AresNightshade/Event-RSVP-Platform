//Here you will require data files and export them as shown in lecture code and worked in previous labs.
const users = require('./users');
const comments = require('./comments');
const events = require('./events');
const { collegeList } = require('./const_data');
const { localDateTime } = require('./const_data');
const getLocalTime = require('./const_data').getLocalTime;

module.exports = {
	users,
	comments,
	events,
	collegeList,
	localDateTime,
	getLocalTime,
};
