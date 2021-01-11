// const USAGE = "usage: node get_shedules.js <x-api-key>";

const request = require("request")
const querystring = require("querystring")
const fs = require("fs")
const path = require("path")

const MIN_DATE = "2019-06-00"

const URL = "https://prod-relapi.ewp.gg/persisted/gw/getSchedule"
const URL_PARAMS = {
  hl: "en-US",
}

const EVENT_INTERNAL_SLUGS = {
  WORLDS: "worlds",
  ALLSTARS: "allstarts",
  EU: "eu",
  LCS: "lcs",
  LEC: "lec",
  LCK: "lck",
  LPL: "lpl",
  LCSA: "lcsa",
  MSI: "msi",
  RIFT_EAST: "rift_east",
  RIFT_WEST: "rift_west",
  MSC: "msc",
}

const EVENTS_NAMES = {
  [EVENT_INTERNAL_SLUGS.WORLDS]: "Worlds",
  [EVENT_INTERNAL_SLUGS.ALLSTARS]: "All-Star Event",
  [EVENT_INTERNAL_SLUGS.EU]: "European Masters",
  [EVENT_INTERNAL_SLUGS.LCS]: "LCS",
  [EVENT_INTERNAL_SLUGS.LEC]: "LEC",
  [EVENT_INTERNAL_SLUGS.LCK]: "LCK",
  [EVENT_INTERNAL_SLUGS.LPL]: "LPL",
  [EVENT_INTERNAL_SLUGS.LCSA]: "LCS Academy",
  [EVENT_INTERNAL_SLUGS.MSI]: "MSI",
  [EVENT_INTERNAL_SLUGS.RIFT_EAST]: "Rift Rivals: KR/CN/LMS/VN",
  [EVENT_INTERNAL_SLUGS.RIFT_WEST]: "Rift Rivals: NA vs. EU",
  [EVENT_INTERNAL_SLUGS.MSC]: "Mid-Season Cup",
}

const EVENT_NAME_TO_SLUG = {}
for (const [eventSlug, eventName] of Object.entries(EVENTS_NAMES)) {
  EVENT_NAME_TO_SLUG[eventName] = eventSlug
}

// Rift Rivals is currently not available, but it does not cause any errors
const LEAGUES_JSON = {
  data: {
    leagues: [
      {
        id: "100695891328981122",
        slug: "european-masters",
        name: "European Masters",
        region: "EUROPE",
        image: "http://static.lolesports.com/leagues/1585044513499_EM_BUG_2020%20(1).png",
        priority: 2,
      },
      {
        id: "101097443346691685",
        slug: "turkey-academy-league",
        name: "TAL",
        region: "TURKEY",
        image: "http://static.lolesports.com/leagues/1592516072459_TAL-01-FullonDark.png",
        priority: 1000,
      },
      {
        id: "101382741235120470",
        slug: "lla",
        name: "LLA",
        region: "LATIN AMERICA",
        image: "http://static.lolesports.com/leagues/1592516315279_LLA-01-FullonDark.png",
        priority: 206,
      },
      {
        id: "104366947889790212",
        slug: "pcs",
        name: "PCS",
        region: "HONG KONG, MACAU, TAIWAN",
        image: "http://static.lolesports.com/leagues/1592515942679_PCS-01-FullonDark.png",
        priority: 1000,
      },
      {
        id: "102299952872678379",
        slug: "rift-rivals-kr-cn-lms-vn",
        name: "Rift Rivals: KR/CN/LMS/VN",
        region: "INTERNATIONAL",
        image:
          "https://lolstatic-a.akamaihd.net/esports-assets/production/league/rift-rivals-kr-cn-lms-vn-95oqqlz8.png",
        priority: 999,
      },
      {
        id: "104207827168893622",
        slug: "midseason-cup",
        name: "Mid-Season Cup",
        region: "INTERNATIONAL",
        image: "http://static.lolesports.com/leagues/1590701495142_midseason-cup.png",
        priority: 214,
      },
      {
        id: "104207832853093047",
        slug: "midseason-streamathon",
        name: "Mid-Season Streamathon",
        region: "INTERNATIONAL",
        image: "http://static.lolesports.com/leagues/1590701509841_mid.png",
        priority: 215,
      },
      {
        id: "98767975604431411",
        slug: "worlds",
        name: "Worlds",
        region: "INTERNATIONAL",
        image: "http://static.lolesports.com/leagues/1592594612171_WorldsDarkBG.png",
        priority: 209,
      },
      {
        id: "98767991295297326",
        slug: "all-star",
        name: "All-Star Event",
        region: "INTERNATIONAL",
        image: "http://static.lolesports.com/leagues/1592594737227_ASEDarkBG.png",
        priority: 211,
      },
      {
        id: "98767991299243165",
        slug: "lcs",
        name: "LCS",
        region: "NORTH AMERICA",
        image: "http://static.lolesports.com/leagues/LCSNew-01-FullonDark.png",
        priority: 3,
      },
      {
        id: "98767991302996019",
        slug: "lec",
        name: "LEC",
        region: "EUROPE",
        image: "http://static.lolesports.com/leagues/1592516184297_LEC-01-FullonDark.png",
        priority: 1,
      },
      {
        id: "98767991310872058",
        slug: "lck",
        name: "LCK",
        region: "KOREA",
        image: "http://static.lolesports.com/leagues/lck-color-on-black.png",
        priority: 4,
      },
      {
        id: "98767991314006698",
        slug: "lpl",
        name: "LPL",
        region: "CHINA",
        image: "http://static.lolesports.com/leagues/1592516115322_LPL-01-FullonDark.png",
        priority: 201,
      },
      {
        id: "98767991325878492",
        slug: "msi",
        name: "MSI",
        region: "INTERNATIONAL",
        image: "http://static.lolesports.com/leagues/1592594634248_MSIDarkBG.png",
        priority: 210,
      },
      {
        id: "98767991331560952",
        slug: "oce-opl",
        name: "OPL",
        region: "OCEANIA",
        image:
          "https://lolstatic-a.akamaihd.net/esports-assets/production/league/oce-opl-e0qfb3l8.png",
        priority: 207,
      },
      {
        id: "98767991332355509",
        slug: "cblol-brazil",
        name: "CBLOL",
        region: "BRAZIL",
        image: "http://static.lolesports.com/leagues/cblol-logo-symbol-offwhite.png",
        priority: 204,
      },
      {
        id: "98767991343597634",
        slug: "turkiye-sampiyonluk-ligi",
        name: "TCL",
        region: "TURKEY",
        image:
          "https://lolstatic-a.akamaihd.net/esports-assets/production/league/turkiye-sampiyonluk-ligi-8r9ofb9.png",
        priority: 203,
      },
      {
        id: "98767991349120232",
        slug: "league-of-legends-college-championship",
        name: "College Championship",
        region: "NORTH AMERICA",
        image:
          "https://lolstatic-a.akamaihd.net/esports-assets/production/league/league-of-legends-college-championship-h6j74ouz.png",
        priority: 212,
      },
      {
        id: "98767991349978712",
        slug: "ljl-japan",
        name: "LJL",
        region: "JAPAN",
        image: "http://static.lolesports.com/leagues/1592516354053_LJL-01-FullonDark.png",
        priority: 208,
      },
      {
        id: "98767991351263126",
        slug: "rift-rivals-na-eu",
        name: "Rift Rivals: NA vs. EU",
        region: "INTERNATIONAL",
        image:
          "https://lolstatic-a.akamaihd.net/esports-assets/production/league/rift-rivals-na-eu-1ts7gmu5.png",
        priority: 999,
      },
      {
        id: "99332500638116286",
        slug: "lcs-academy",
        name: "LCS Academy",
        region: "NORTH AMERICA",
        image:
          "https://lolstatic-a.akamaihd.net/esports-assets/production/league/lcs-academy-4o8goq8n.png",
        priority: 202,
      },
    ],
  },
}

const REGIONAL_FLAGS = {
  EU: "🇪🇺",
  US: "🇺🇸",
  KR: "🇰🇷",
  CN: "🇨🇳",
}

const EVENT_REGIONAL_FLAGS = {
  [EVENT_INTERNAL_SLUGS.LEC]: REGIONAL_FLAGS.EU,
  [EVENT_INTERNAL_SLUGS.EU]: REGIONAL_FLAGS.EU,
  [EVENT_INTERNAL_SLUGS.LCS]: REGIONAL_FLAGS.US,
  [EVENT_INTERNAL_SLUGS.LCSA]: REGIONAL_FLAGS.US,
  [EVENT_INTERNAL_SLUGS.LCK]: REGIONAL_FLAGS.KR,
  [EVENT_INTERNAL_SLUGS.LPL]: REGIONAL_FLAGS.CN,
}

// team specific calendars will be generated for these leagues
// number of teams is required to include only newest split teams
const LEAGUE_TEAMS_COUNT = {
  [EVENT_INTERNAL_SLUGS.LEC]: 10,
  [EVENT_INTERNAL_SLUGS.LCS]: 10,
  [EVENT_INTERNAL_SLUGS.LCSA]: 10,
  [EVENT_INTERNAL_SLUGS.LPL]: 17,
  [EVENT_INTERNAL_SLUGS.LCK]: 10,
}
const UNKNOWN_TEAM_NAME = "TBD"
const LEAGUE_TEAMS = {}
Object.keys(LEAGUE_TEAMS_COUNT).forEach(eventSlug => {
  LEAGUE_TEAMS[eventSlug] = new Set()
})

// filters events by league name
function theseEvents(eventSlugs) {
  const eventNames = eventSlugs.map(eventSlug => EVENTS_NAMES[eventSlug])
  return event => eventNames.indexOf(event.league.name) !== -1
}

// filters events by participating team name
function thisTeam(team) {
  return event => event.match.teams[0].code === team || event.match.teams[1].code === team
}

const SINGLE_EVENT_CALENDARS = {
  LEC: EVENT_INTERNAL_SLUGS.LEC,
  LCS: EVENT_INTERNAL_SLUGS.LCS,
  LCK: EVENT_INTERNAL_SLUGS.LCK,
  LPL: EVENT_INTERNAL_SLUGS.LPL,
  MSI: EVENT_INTERNAL_SLUGS.MSI,
  Worlds: EVENT_INTERNAL_SLUGS.WORLDS,
  "Rift Rivals West": EVENT_INTERNAL_SLUGS.RIFT_WEST,
  "Rift Rivals East": EVENT_INTERNAL_SLUGS.RIFT_EAST,
  "European Masters": EVENT_INTERNAL_SLUGS.EU,
  "LCS Academy": EVENT_INTERNAL_SLUGS.LCSA,
  "All-Star": EVENT_INTERNAL_SLUGS.ALLSTARS,
  MSC: EVENT_INTERNAL_SLUGS.MSC,
}

const FOLLOW_LEAGUE_CALENDAR_COMBINATIONS = {
  LEC: [
    EVENT_INTERNAL_SLUGS.LEC,
    EVENT_INTERNAL_SLUGS.RIFT_WEST,
    EVENT_INTERNAL_SLUGS.MSI,
    EVENT_INTERNAL_SLUGS.WORLDS,
    EVENT_INTERNAL_SLUGS.ALLSTARS,
  ],
  LCS: [
    EVENT_INTERNAL_SLUGS.LCS,
    EVENT_INTERNAL_SLUGS.RIFT_WEST,
    EVENT_INTERNAL_SLUGS.MSI,
    EVENT_INTERNAL_SLUGS.WORLDS,
    EVENT_INTERNAL_SLUGS.ALLSTARS,
  ],
  LCK: [
    EVENT_INTERNAL_SLUGS.LCK,
    EVENT_INTERNAL_SLUGS.RIFT_EAST,
    EVENT_INTERNAL_SLUGS.MSI,
    EVENT_INTERNAL_SLUGS.WORLDS,
    EVENT_INTERNAL_SLUGS.ALLSTARS,
    EVENT_INTERNAL_SLUGS.MSC,
  ],
  LPL: [
    EVENT_INTERNAL_SLUGS.LPL,
    EVENT_INTERNAL_SLUGS.RIFT_EAST,
    EVENT_INTERNAL_SLUGS.MSI,
    EVENT_INTERNAL_SLUGS.WORLDS,
    EVENT_INTERNAL_SLUGS.ALLSTARS,
    EVENT_INTERNAL_SLUGS.MSC,
  ],
  "LCS Academy": [EVENT_INTERNAL_SLUGS.LCSA],
  "European Masters": [EVENT_INTERNAL_SLUGS.EU],
}

const FOLLOW_LEAGUE_CALENDAR_COMBINATIONS_LIST = []
for (const [key, value] of Object.entries(FOLLOW_LEAGUE_CALENDAR_COMBINATIONS)) {
  FOLLOW_LEAGUE_CALENDAR_COMBINATIONS_LIST.push({
    name: key,
    events: value,
  })
}

const EVENTS_TO_CRAWL = (() => {
  const eventSlugs = new Set()

  Object.values(SINGLE_EVENT_CALENDARS).forEach(eventSlug => {
    eventSlugs.add(eventSlug)
  })

  Object.keys(LEAGUE_TEAMS_COUNT).forEach(eventSlug => {
    eventSlugs.add(eventSlug)
  })

  Object.values(FOLLOW_LEAGUE_CALENDAR_COMBINATIONS).forEach(_eventSlugs => {
    _eventSlugs.forEach(eventSlug => {
      eventSlugs.add(eventSlug)
    })
  })

  if (Object.entries(LEAGUE_TEAMS_COUNT).length !== 0) {
    eventSlugs.add(EVENT_INTERNAL_SLUGS.WORLDS)
    eventSlugs.add(EVENT_INTERNAL_SLUGS.MSI)
    eventSlugs.add(EVENT_INTERNAL_SLUGS.RIFT_EAST)
    eventSlugs.add(EVENT_INTERNAL_SLUGS.RIFT_WEST)
  }

  const events = LEAGUES_JSON.data.leagues
  return [...eventSlugs]
    .map(eventSlug => EVENTS_NAMES[eventSlug])
    .map(eventName => {
      const l = events.find(it => it.name === eventName)
      return l && l.id
    })
    .filter(it => it)
})()

URL_PARAMS.leagueId = EVENTS_TO_CRAWL.join(",")

let xApiKey = "0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z"

// process.argv.forEach(function (val, index, array) {
//     if (index === 2) {
//         xApiKey = val;
//     }
// });

// if (!xApiKey)
//     return console.log(USAGE);

const httpClient = request.defaults({
  headers: {
    "x-api-key": xApiKey,
  },
})

const allEvents = []

let crawlForward = true
let older = null

function getNextPage(pageToken) {
  if (pageToken) URL_PARAMS.pageToken = pageToken

  httpClient.get(URL + "?" + querystring.stringify(URL_PARAMS), function(err, httpResponse, body) {
    if (err) return

    const data = JSON.parse(body).data.schedule
    allEvents.push.apply(allEvents, data.events)
    let firstEventStartTime = (data.events[0] && data.events[0].startTime) || ""

    console.log("Total matches loaded:", allEvents.length, firstEventStartTime)

    let nextPage = null
    if (crawlForward) {
      nextPage = data.pages.newer
      if (!nextPage) crawlForward = false
      if (older === null) older = data.pages.older
    }

    if (!crawlForward) {
      if (older != null) {
        nextPage = older
        older = null
      } else {
        if (firstEventStartTime > MIN_DATE) {
          nextPage = data.pages.older
        }
      }
    }

    if (nextPage) {
      getNextPage(nextPage)
    } else {
      generateCalendar()
    }
  })
}

function generateCalendar() {
  for (let i = allEvents.length - 1; i >= 0; i--) {
    if (allEvents[i].type === "show") {
      allEvents.splice(i, 1)
    }
  }

  allEvents.sort(
    (a, b) => a.startTime.localeCompare(b.startTime) || a.match.id.localeCompare(b.match.id)
  )

  // determine list of teams
  allEvents.reverse() // search for names in newest events first
  for (const event of allEvents) {
    const eventSlug = EVENT_NAME_TO_SLUG[event.league.name]
    if (eventSlug in LEAGUE_TEAMS) {
      if (LEAGUE_TEAMS[eventSlug].size < LEAGUE_TEAMS_COUNT[eventSlug]) {
        for (const { code } of event.match.teams) {
          if (code !== UNKNOWN_TEAM_NAME) {
            LEAGUE_TEAMS[eventSlug].add(code)
          }
        }
      }
    }
  }
  allEvents.reverse() // reverse back

  console.log("Teams found:")
  console.log(LEAGUE_TEAMS)

  writeFileAsync(
    "docs/calendar/data.json",
    JSON.stringify(
      {
        teams: LEAGUE_TEAMS,
        combinations: FOLLOW_LEAGUE_CALENDAR_COMBINATIONS_LIST,
        eventNames: EVENTS_NAMES,
      },
      function(key, value) {
        if (typeof value === "object" && value instanceof Set) {
          return [...value]
        }
        return value
      }
    )
  )

  const calendars = {}
  for (const [eventDisplayName, eventSlug] of Object.entries(SINGLE_EVENT_CALENDARS)) {
    calendars[`${eventDisplayName}/all`] = theseEvents([eventSlug])
  }
  for (const [eventSlug, setOfTeams] of Object.entries(LEAGUE_TEAMS)) {
    for (const team of setOfTeams) {
      calendars[`${eventSlug}/${team}`] = thisTeam(team)
    }
  }

  forAllCombinations(Object.keys(FOLLOW_LEAGUE_CALENDAR_COMBINATIONS), combination => {
    if (combination.length === 0) return

    const filename = combination.join(" ")
    const eventSlugs = []
    for (const name of combination) {
      for (const eventSlug of FOLLOW_LEAGUE_CALENDAR_COMBINATIONS[name]) {
        eventSlugs.push(eventSlug)
      }
    }

    calendars[filename] = theseEvents(eventSlugs)
  })

  for (const includeResults of [true /*, false*/]) {
    for (const includePrefixes of ["flag" /*, true, false*/]) {
      for (const [calendarName, eventFilter] of Object.entries(calendars)) {
        let calendarString = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:github.com/coiiector/lol-calendar/${calendarName}
NAME:LoL
X-WR-CALNAME:LoL
X-PUBLISHED-TTL:P1W`

        let fileName = calendarName
        if (includeResults === false) {
          fileName += "_noresults"
        }
        if (includePrefixes === true) {
          fileName += "_prefix"
        } else if (includePrefixes === false) {
          fileName += "_noflags"
        }

        allEvents.forEach(event => {
          if (!eventFilter(event)) return

          const matchId = event.match.id
          const startTime = new Date(Date.parse(event.startTime))

          let duration = 1000 * 60 * 60
          let bo = null
          if (event.match.strategy.type === "bestOf") bo = event.match.strategy.count

          if (bo) {
            duration *= bo - (bo - 1) / 4
          }

          const endTime = new Date(Date.parse(event.startTime) + duration)

          let summary = ""
          let eventSlug = EVENT_NAME_TO_SLUG[event.league.name]
          if (includePrefixes === "flag") {
            summary += EVENT_REGIONAL_FLAGS[eventSlug] || ""
          }
          /*if (includePrefixes === true) {
            summary += SHORT_NAMES[leagueName] || ""
          }*/

          let separator = "×"
          if (
            includeResults === true &&
            event.match.teams[0].result &&
            event.match.teams[0].result.outcome
          )
            separator = ` ${event.match.teams[0].result.gameWins}-${event.match.teams[1].result.gameWins} `

          summary += event.match.teams[0].code + separator + event.match.teams[1].code

          calendarString += "\nBEGIN:VEVENT"
          calendarString += "\nUID:lol-match-" + matchId
          calendarString += "\nDTSTART:" + formatDate(startTime)
          calendarString += "\nDTEND:" + formatDate(endTime)

          calendarString += "\nSUMMARY:" + summary

          let description = event.blockName + "\\n"
          if (bo) description += "bo" + bo + "\\n"

          description += "https://watch.lolesports.com/vod/" + matchId

          calendarString += "\nDESCRIPTION:" + description
          calendarString += "\nURL:" + "https://watch.lolesports.com/vod/" + matchId
          // todo: CATEGORIES
          calendarString += "\nEND:VEVENT"
        })

        calendarString += "\nEND:VCALENDAR"

        writeFileAsync("docs/calendar/" + fileName + ".ics", calendarString)
      }
    }
  }

  writeFileAsync("docs/calendar/allEvents.json", JSON.stringify(allEvents, null, 2))

  function formatDate(date) {
    return (
      "" +
      date.getUTCFullYear() +
      prependZero(date.getUTCMonth() + 1) +
      prependZero(date.getUTCDate()) +
      "T" +
      prependZero(date.getUTCHours()) +
      prependZero(date.getUTCMinutes()) +
      "00Z"
    )

    function prependZero(number) {
      if (number < 10) {
        return "0" + number
      } else {
        return number
      }
    }
  }
}

function writeFileAsync(filePath, content) {
  filePath = filePath.toLowerCase().replace(/[\s,_&]+/g, "_")
  ensureDirectoryExistence(filePath)

  fs.writeFile(filePath, content, function(err) {
    if (err) {
      return console.log(err)
    }

    console.log("Saved", filePath)
  })

  function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath)
    if (fs.existsSync(dirname)) {
      return true
    }
    ensureDirectoryExistence(dirname)
    fs.mkdirSync(dirname)
  }
}

function forAllCombinations(arr, f) {
  const arrLength = arr.length
  const combinationsCount = 2 ** arrLength

  for (let i = 0; i < combinationsCount; i++) {
    const combination = []

    for (let j = 0; j < arrLength; j++) {
      if (i & (1 << j)) combination.push(arr[j])
    }

    f(combination)
  }
}

getNextPage()
