// const USAGE = "usage: node get_shedules.js <x-api-key>";

const request = require("request")
const querystring = require("querystring")
const fs = require("fs")

const URL = "https://prod-relapi.ewp.gg/persisted/gw/getSchedule"
const URL_PARAMS = {
  hl: "en-US",
}

const LEAGUES = {
  WORLDS: "World Championship",
  ALLSTARS: "All-Star Event",
  LCS: "LCS",
  LEC: "LEC",
  LCK: "LCK",
  LPL: "LPL",
  LCSA: "LCS Academy",
  MSI: "MSI",
  RIFT_EAST: "Rift Rivals: KR/CN/LMS/VNf",
  RIFT_WEST: "Rift Rivals: NA vs. EU",
}

const LEAGUES_JSON = {
  data: {
    leagues: [
      {
        id: "101382741235120470",
        slug: "lla",
        name: "LLA",
        region: "LATAM",
        image: "https://lolstatic-a.akamaihd.net/esports-assets/production/league/lla-ar0gow4l.png",
        priority: 105,
      },
      {
        id: "98767975604431411",
        slug: "worlds",
        name: "World Championship",
        region: "INTERNATIONAL",
        image:
          "https://lolstatic-a.akamaihd.net/esports-assets/production/league/worlds-3om032jn.png",
        priority: 108,
      },
      {
        id: "98767991295297326",
        slug: "all-star",
        name: "All-Star Event",
        region: "INTERNATIONAL",
        image:
          "https://lolstatic-a.akamaihd.net/esports-assets/production/league/all-star-1bgd8l0u.png",
        priority: 110,
      },
      {
        id: "98767991299243165",
        slug: "lcs",
        name: "LCS",
        region: "NORTH AMERICA",
        image: "https://lolstatic-a.akamaihd.net/esports-assets/production/league/lcs-79qe3e0y.png",
        priority: 0,
      },
      {
        id: "98767991302996019",
        slug: "lec",
        name: "LEC",
        region: "EUROPE",
        image:
          "https://lolstatic-a.akamaihd.net/esports-assets/production/league/eu-lcs-dgpu3cuv.png",
        priority: 1,
      },
      {
        id: "98767991310872058",
        slug: "lck",
        name: "LCK",
        region: "KOREA",
        image: "https://lolstatic-a.akamaihd.net/esports-assets/production/league/lck-7epeu9ot.png",
        priority: 2,
      },
      {
        id: "98767991314006698",
        slug: "lpl",
        name: "LPL",
        region: "CHINA",
        image:
          "https://lolstatic-a.akamaihd.net/esports-assets/production/league/lpl-china-6ygsd4c8.png",
        priority: 100,
      },
      {
        id: "98767991316828753",
        slug: "lms",
        name: "LMS",
        region: "HONG KONG, MACAU, TAIWAN",
        image: "https://lolstatic-a.akamaihd.net/esports-assets/production/league/lms-61367pag.png",
        priority: 104,
      },
      {
        id: "98767991331560952",
        slug: "oce-opl",
        name: "OPL",
        region: "OCEANIA",
        image:
          "https://lolstatic-a.akamaihd.net/esports-assets/production/league/oce-opl-aun5eljl.png",
        priority: 106,
      },
      {
        id: "98767991332355509",
        slug: "cblol-brazil",
        name: "CBLOL",
        region: "BRAZIL",
        image:
          "https://lolstatic-a.akamaihd.net/esports-assets/production/league/cblol-brazil-dox5yh1x.png",
        priority: 103,
      },
      {
        id: "98767991343597634",
        slug: "turkiye-sampiyonluk-ligi",
        name: "TCL",
        region: "TURKEY",
        image:
          "https://lolstatic-a.akamaihd.net/esports-assets/production/league/turkiye-sampiyonluk-ligi-4c8nym1o.png",
        priority: 102,
      },
      {
        id: "98767991349978712",
        slug: "ljl-japan",
        name: "LJL",
        region: "JAPAN",
        image:
          "https://lolstatic-a.akamaihd.net/esports-assets/production/league/ljl-japan-j27k8oms.png",
        priority: 107,
      },
      {
        id: "99332500638116286",
        slug: "na-academy",
        name: "LCS Academy",
        region: "NORTH AMERICA",
        image:
          "https://lolstatic-a.akamaihd.net/esports-assets/production/league/lcs-academy-4o8goq8n.png",
        priority: 101,
      },
      {
        id: "98767991325878492",
        slug: "msi",
        name: "MSI",
        region: "INTERNATIONAL",
        image: "https://lolstatic-a.akamaihd.net/esports-assets/production/league/msi-iu1t0cjd.png",
        priority: 209,
      },
      {
        id: "102299952872678379",
        slug: "rift-rivals-kr-cn-lms-vn",
        name: "Rift Rivals: KR/CN/LMS/VN",
        region: "INTERNATIONAL",
        image:
          "https://lolstatic-a.akamaihd.net/esports-assets/production/league/rift-rivals-kr-cn-lms-vn-95oqqlz8.png",
        priority: 101,
      },
      {
        id: "98767991349120232",
        slug: "league-of-legends-college-championship",
        name: "College Championship",
        region: "NORTH AMERICA",
        image:
          "https://lolstatic-a.akamaihd.net/esports-assets/production/league/league-of-legends-college-championship-h6j74ouz.png",
        priority: 211,
      },
      {
        id: "98767991351263126",
        slug: "rift-rivals-na-eu",
        name: "Rift Rivals: NA vs. EU",
        region: "INTERNATIONAL",
        image:
          "https://lolstatic-a.akamaihd.net/esports-assets/production/league/rift-rivals-na-eu-1ts7gmu5.png",
        priority: 100,
      },
    ],
  },
}

const SHORT_NAMES = {
  [LEAGUES.LEC]: "🇪🇺",
  [LEAGUES.LCS]: "🇺🇸",
  [LEAGUES.LPL]: "🇨🇳",
  [LEAGUES.LCK]: "🇰🇷",
  [LEAGUES.LCSA]: "A🇺🇸",
  [LEAGUES.WORLDS]: "",
  [LEAGUES.ALLSTARS]: "",
  [LEAGUES.MSI]: "",
  [LEAGUES.RIFT_EAST]: "",
  [LEAGUES.RIFT_WEST]: "",
}
const CALENDARS = {
  // "LCS": [LEAGUES.LCS],
  // "LEC": [LEAGUES.LEC],
  // "LCK": [LEAGUES.LCK],
  // "LPL": [LEAGUES.LPL],
  // "LCSA": [LEAGUES.LCSA],
  CUSTOM: [
    LEAGUES.WORLDS,
    LEAGUES.ALLSTARS,
    LEAGUES.MSI,
    LEAGUES.LEC,
    LEAGUES.LCK,
    LEAGUES.LPL,
    LEAGUES.LCS,
    LEAGUES.RIFT_EAST,
    LEAGUES.RIFT_WEST,
  ],
  // "NA": [LEAGUES.LCS, LEAGUES.LCSA],
}

const SMALL_HIGHLIGHT = "⭐"
const BIG_HIGHLIGHT = "🌟"

// -1 = hide
//  0 = neutral
//  3 = +
//  4 = +++
const TEAM_PRIORITY = {
  // LCK
  GRF: 2,
  SB: 2,
  KZ: 2,
  DWG: 2,
  AF: 2,
  SKT: 1,
  JAG: -1,
  HLE: -1,

  // LPL
  IG: 2,
  RNG: 2,
  TOP: 2,
  FPX: 2,
  EDG: 1,

  // EU
  G2: 2,
  FNC: 2,
  OG: 1,

  // NA
  C9: 2,
  CLG: 2,
  TSM: 2,
  TL: 2,
  GGS: 1,
}

const LEAGUE_PRIORITY = {
  [LEAGUES.LPL]: -3,
}

const LEAGUES_TO_CRAWL = (function() {
  const names = {}

  Object.values(CALENDARS).forEach(function(leagues) {
    leagues.forEach(function(league) {
      names[league] = true
    })
  })

  const leagues = LEAGUES_JSON.data.leagues
  return Object.keys(names)
    .map(function(name) {
      const l = leagues.find(function(it) {
        return it.name === name
      })
      return l && l.id
    })
    .filter(function(it) {
      return it
    })
})()

URL_PARAMS.leagueId = LEAGUES_TO_CRAWL.join(",")

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
        if (!firstEventStartTime.startsWith("2018")) {
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
  Object.keys(CALENDARS).forEach(function(calendarName) {
    const calendarLeagues = CALENDARS[calendarName]

    let calendarString = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:github.com/coIIector/lol-esport-calendar/${calendarName}
NAME:LoL esport
X-WR-CALNAME:LoL esport
X-PUBLISHED-TTL:P1W`

    allEvents.forEach(function(event) {
      if (calendarLeagues.indexOf(event.league.name) === -1) return

      const ts = new Date(Date.parse(event.startTime))

      let matchLength = 1000 * 60 * 60
      let bo = null
      if (event.match.strategy.type === "bestOf") bo = event.match.strategy.count

      if (bo) {
        matchLength *= bo - (bo - 1) / 4
      }

      const te = new Date(Date.parse(event.startTime) + matchLength)

      let leagueName = event.league.name
      if (leagueName in SHORT_NAMES) leagueName = SHORT_NAMES[leagueName]

      let summary = leagueName || ""

      let highlight = LEAGUE_PRIORITY[event.league.name] || 0

      event.match.teams.forEach(function(team) {
        highlight += TEAM_PRIORITY[team.code] || 0
      })

      summary += event.match.teams[0].code + "×" + event.match.teams[1].code

      if (highlight < 0) {
        return
      } else if (highlight === 3) {
        summary += SMALL_HIGHLIGHT
      } else if (highlight === 4) {
        summary += BIG_HIGHLIGHT
      }

      calendarString += "\nBEGIN:VEVENT"
      calendarString += "\nDTSTART:" + formatDate(ts)
      calendarString += "\nDTEND:" + formatDate(te)

      calendarString += "\nSUMMARY:" + summary

      let description = event.blockName + "|"
      if (bo) description += "bo" + bo + "|"

      description += "https://watch.na.lolesports.com/vod/" + event.match.id

      calendarString += "\nDESCRIPTION:" + description
      calendarString += "\nURL:" + "https://watch.na.lolesports.com/vod/" + event.match.id
      calendarString += "\nEND:VEVENT"
    })

    calendarString += "\nEND:VCALENDAR"

    fs.writeFile("output/" + calendarName + ".ics", calendarString, function(err) {
      if (err) {
        return console.log(err)
      }

      console.log("Saved", calendarName)
    })
  })

  fs.writeFile("output/allEvents.json", JSON.stringify(allEvents, null, 2), function(err) {
    if (err) {
      return console.log(err)
    }

    console.log("Saved", "allEvents.json")
  })

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

getNextPage()
