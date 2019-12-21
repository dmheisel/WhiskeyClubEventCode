//creates the event!
function createWhiskeyEvent() {
	var eventRecurrence = buildRecurrenceRule();
	var guestList = guestList();
	var startDate = getDates(2020)[0]; // need this to set the start and end times on the event because reasons
	var startTime = new Date(startDate.setHours(18));
	var endTime = new Date(startDate.setHours(22));

	var whiskeyEvent = CalendarApp.getDefaultCalendar()
		.createEventSeries(
			"Polybius Whiskey Club Meeting!",
			startTime,
			endTime,
			eventRecurrence,
			{
				description:
					"Let's get together for some whiskey, scotch, whisky, bourbon, rye...but most importantly, good times with good friends! \n\nIn the spirit of software development, it feels necessary that this meeting's schedule has an odd component.  Therefor, we are meeting on the second-to-last Thursday of every month.  Default location is Merlin's Rest -- so far a pretty suitable place for code-wizards but subject to change with future discussions.  \n\nPlease be sure to RSVP and notify of any +1s by the preceding Monday, so I can call ahead and get a table for us/check for conflicts.  \n\n And if  anyone's interested, you can find the code I used to make this event on my Github! (turns out, Google Calendars doesn't natively support second-to-last Thursday scheduling, so this was made in Google Apps Script.)",
				location: "Merlins Rest",
				sendInvites: true,
				guestList: guestList
			}
		)
		.setAnyoneCanAddSelf(true)
		.setGuestsCanInviteOthers(true)
		.setGuestsCanSeeGuests(true)
		.setGuestsCanModify(false)
		.addEmailReminder(8640); // email reminder 6 days before the event
}
//grabs the list of attendees from our last gathering in December 2019 -- may update to pull from slack somehow?
function getAttendees() {
	var date = new Date("December 19, 2019");
	var guestList = CalendarApp.getDefaultCalendar() // find my calendar, get the second event for the day, get the guest list, and get everyone's emails.
		.getEventsForDay(date)[1]
		.getGuestList()
		.map(function(guest) {
			return guest.getEmail();
		})
		.join();
	// Logger.log(guestList);
	return guestList;
}

//figure out what the second to last thursday was in the specified month/year
function getSecondToLastThursday(month, year) {
	var daysInMonth = new Date(year, month, 0).getDate(); // get total number of days in the month (gets the date of the last day of the month)
	var counter = 0;
	for (var i = daysInMonth; i > 0; i--) {
		// count down from the last day of the month.
		var date = new Date(year, month - 1, i); // create a new Date object for each day of the month.
		if (date.getDay() === 4) {
			// date.getDay() returns 0 - 6 for the day of the week, 0 = Sunday.  Thursday will be a 4.
			counter += 1;
		}
		if (counter === 2) {
			// the second time we increment the counter, that's our second-to-last thursday!
			return date;
		}
	}
}
//collect all the dates of second to last thursdays for one year.
function getDates(year) {
	var dates = [];
	for (var i = 1; i <= 12; i++) {
		dates.push(getSecondToLastThursday(i, year));
	}
	return dates;
}
//build the recurrenceRule for the CalendarApp Event Series, using the dates gathered in the getDates function.
function buildRecurrenceRule() {
	var recurrenceRule = CalendarApp.newRecurrence();
	var dates = getDates(2020);
	for (var i = 0; i < dates.length; i++) {
		recurrenceRule.addDate(dates[i]); // for each date, add a new date to the recurrence rule
	}
	return recurrenceRule;
}
