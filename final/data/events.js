const helpers = require('../../helpers');
const users = require('./users');
const mongoCollections = require('../config/mongoCollections');
const user_collection = mongoCollections.user_collection;
const event_collection = mongoCollections.event_collection;

const createEvent = async (
	eventName,
	location,
	startTime,
	endTime,
	postedBy,
	tags,
	description,
	capacity
) => {
	//
	const event_collection_c = await event_collection();

	helpers.errorIfNotProperString(eventName, 'eventName');
	helpers.errorIfNotProperString(location, 'location');
	helpers.errorIfNotProperDateTime(startTime);
	helpers.errorIfNotProperDateTime(endTime);
	if (Date.parse(startTime) >= Date.parse(endTime)) {
		throw `StartTime can't after endTime`;
	}

	//check if user exists
	helpers.errorIfNotProperUserName(postedBy, 'postedBy');
	postedBy = postedBy.trim();
	let user = await users.getUserData(postedBy);
	if (!user) throw `No user present with userName: ${postedBy}`;

	if (tags) {
		helpers.errorIfNotProperString(tags, 'Tags');
		tags = tags.split(',');
	}
	helpers.errorIfNotProperString(description, 'description');

	//	helpers.errorIfNotProperString(college, 'college');
	college = user.college;

	helpers.errorIfStringIsNotNumber(capacity);
	capacity = parseFloat(capacity);

	if (capacity < 1 || capacity % 1 > 0) {
		throw `Invalid Capacity provided`;
	}

	let new_event = {
		eventName: eventName,
		location: location,
		startTime: startTime,
		endTime: endTime,
		postedBy: postedBy,
		tags: tags,
		description: description,
		capacity: capacity,
		numUserRegistered: 0,
		usersRegistered: [],
		numFavorite: 0,
		favoriteUsers: [],
		images: [],
		college: college,
		comments: [],
	};

	const insertInfo = await event_collection_c.insertOne(new_event);

	if (insertInfo.insertedCount === 0) {
		throw `Server Error`;
	} else {
		return { eventInserted: true };
	}
};

const findAllEvent = async (filter) => {
	//
	const event_collection_c = await event_collection();
	let eventList = await event_collection_c.find(filter).toArray();
	if (!eventList) throw 'Could not get all movies';
	//ObjectID to String
	eventList = eventList.map(function (val) {
		val['_id'] = val['_id'].toString();
		return val;
	});

	return eventList;
};
module.exports = { createEvent, findAllEvent };