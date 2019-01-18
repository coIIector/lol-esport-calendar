// const USAGE = "usage: node get_shedules.js <x-api-key>";

const request = require('request');
const querystring = require('querystring');
// const fs = require('fs');

const URL = 'https://prod-relapi.ewp.gg/persisted/gw/getSchedule';
const URL_PARAMS = {
    hl: "en-US",
};

const LEAGUES = [
    '98767991299243165', // LCS
    '98767991302996019', // LEC
    '98767991310872058', // LCK
    // '98767991314006698', // LPL
    // '99332500638116286', // NA ACADEMY
    '98767975604431411', // WORLDS
    // '98767991295297326', // ALL STARS
];
URL_PARAMS.leagueId = LEAGUES.join(',');

let xApiKey = '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z';

// process.argv.forEach(function (val, index, array) {
//     if (index === 2) {
//         xApiKey = val;
//     }
// });

// if (!xApiKey)
//     return console.log(USAGE);

const httpClient = request.defaults({
    headers: {
        'x-api-key': xApiKey,
    }
});

const allEvents = [];
let calendarString = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:github.com/coIIector/lol-esport-calendar
NAME:LoL esport
X-WR-CALNAME:LoL esport`;

function getNextPage(pageToken) {
    if (pageToken)
        URL_PARAMS.pageToken = pageToken;

    httpClient.get(URL + "?" + querystring.stringify(URL_PARAMS), function (err, httpResponse, body) {
        if (err)
            return;

        const data = JSON.parse(body).data.schedule;
        allEvents.push.apply(allEvents, data.events);

        console.log(allEvents.length);
        if (data.pages.newer) {
            getNextPage(data.pages.newer);
        } else {
            generateCalendar();
        }
    });
}

function generateCalendar() {
    allEvents.forEach(function (event) {
        const ts = new Date(Date.parse(event.startTime));
        const te = new Date(Date.parse(event.startTime) + 1000 * 60 * 60);

        calendarString += "\nBEGIN:VEVENT";
        calendarString += "\nDTSTART:" + formatDate(ts);
        // calendarString += "\nDTEND:" + formatDate(te);
        calendarString += "\nSUMMARY:" + event.match.teams[0].code + " vs. " + event.match.teams[1].code;
        calendarString += "\nDESCRIPTION:" + event.league.name + " " + event.blockName + " | VOD: " + "https://watch.na.lolesports.com/vod/" + event.match.id;
        calendarString += "\nURL:" + "https://watch.na.lolesports.com/vod/" + event.match.id;
        calendarString += "\nEND:VEVENT";
    });

    calendarString += "\nEND:VCALENDAR";

    console.log(calendarString);
}

function formatDate(date) {
    function prependZero(number) {
        if (number < 10) {
            return "0" + number;
        } else {
            return number;
        }
    }

    return "" + date.getUTCFullYear()
        + prependZero(date.getUTCMonth() + 1)
        + prependZero(date.getUTCDate()) + "T"
        + prependZero(date.getUTCHours())
        + prependZero(date.getUTCMinutes()) + "00Z";
}

getNextPage();