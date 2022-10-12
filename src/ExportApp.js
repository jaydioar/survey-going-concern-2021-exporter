import { useEffect, useState } from 'react'
import clsx from 'clsx'

function escVal(val) {
  return JSON.stringify(val)
}

function ExportApp() {
  const [jsonIsValid, setJsonIsValid] = useState(false)
  const [jsonParsed, setJsonParsed] = useState(false)
  const [resultCsv, setResultCsv] = useState('')

  function convertToCsv(headings, data) {
    let res = ''
    res += headings.map((val) => (`"${val}"`)).join(';') + '\n'
    data.forEach((line) => res += line.map((val) => (`${escVal(val || '')}`)).join(';') + '\n')
    return res
  }

  function resolveSearchHistory(searchTrials) {
    let memTimeOpen = null

    let cueReadingTimes = []
    // initialize for every cue with 0
    for (let i = 1; i <= 23; i++) {
      cueReadingTimes[i] = 0
    }

    searchTrials.forEach(trial => {

      if (trial.action === 'OPEN') {
        memTimeOpen = trial.time_
      }

      if (trial.action === 'CLOSE') {
        const diff = trial.time_ - memTimeOpen
        memTimeOpen = null

        if (trial.info?.url) {
          cueReadingTimes[parseInt(trial.info?.url.match(/[0-9]+/gi), 10)] += diff
        }
      }
    })

    let foundCues = 0

    const resCues = Object.keys(cueReadingTimes).map((k) => {
      const v = cueReadingTimes[k]
      if (v === 0) return ["0", "0"]
      if (v >= 1) {
        foundCues++
        return ["1", v / 1000]
      }
    })

    let totalTrials = 0
    let tmp = []

    const resSearches = searchTrials.reduce((acc, trial) => {
      if (trial.action === 'SEARCH-FAILED' || trial.action === 'SEARCH-SUCCESS') {
        if (tmp.indexOf(trial.info) == -1) {
          tmp.push(trial.info)
        }
        totalTrials++
        acc.push(trial.info)
        acc.push(trial.action === 'SEARCH-SUCCESS' ? '1' : '0')
      }
      return acc
    }, [])

    const uniqueSearchTerms = tmp.length

    return [
      totalTrials,
      uniqueSearchTerms,
      foundCues,
      resCues.flat(),
      resSearches
    ].flat()
  }

  function triggerExport(e) {
    let csvDataLines = []
    let headings = [
      "sessionId",
      "startDate",
      "totalTimeSecs",
      "total1",
      "total2",
      "total3",
      'GClikelihoodpre', // q3:1
      'ConfidencePre', // q3:2
      'Condition', // p4_version
      "Paradoxicalstatement1", // q4:1_v1
      "Paradoxicalstatement2", // q4:2_v1
      "Paradoxicalstatement3", // q4:3_v1
      "Interestingstatement1", // q4:1_v2
      "Interestingstatement2", // q4:2_v2
      "Interestingstatement3", // q4:3_v2
      "BewertungCues", // q6:1
      "GClikelihoodpost", // q6:2
      "ConfidencePost", // q6:3
      "WichtigsteInformationen", // q6:4
      "Creativityscore1", // q7:score1
      "Creativityscore2", // q7:score2
      "MCParadoxicalstatements", // q8:1
      "RealismCase", // q8:2
      "DifficultyCase", // q8:3
      "PositioninFirm", // q9:1
      "Yearsinfirm", // q9:2
      "MonthsAudit", // q9:3
      "GoingconcernExperience", // q9:4
      "FamiliarityAuditstandards", // q9:5
      "Age", // q9:6
      "Gender", // q9:7
      "GewünschteInformationen", // q10:1
      "Anmerkungen", // q10:2
      "InfobyMail", // q10:3
      "Mail",  // q10:4
      "totalSearchTerms",
      "uniqueSearchTerms",
      "foundCues",
    ]

    for (let i = 1; i <= 23; i++) {
      headings.push(`cue${i}-open?`)
      headings.push(`cue${i}-time`)
    }

    const res = Object.keys(jsonParsed.surveys['2022-going-concern']).map((key) => {
      const val = jsonParsed.surveys['2022-going-concern'][key]['data']

      let tmp = [
        (val['sessionId'].toString().substring(0, 9) || ""),
        (val['startDate']),
        (val['completionTimeInSeconds']),
        (Math.ceil((val['page:04']?.['_timeComplete'] - val['_startDate']) / 1000)),
        (Math.ceil((val['page:05']?.['_timeComplete'] - val['page:04']?.['_timeComplete']) / 1000)),
        (Math.ceil((val['_endDate'] - val['page:05']?.['_timeComplete']) / 1000)),
        (val['page:03']?.["q3:1"] || ""),
        (val['page:03']?.["q3:2"] || ""),
        (val['page:04']?.["p4_version"] ? "2" : "1"),
        (val['page:04']?.["q4:1_v1"] || ""),
        (val['page:04']?.["q4:2_v1"] || ""),
        (val['page:04']?.["q4:3_v1"] || ""),
        (val['page:04']?.["q4:1_v2"] || ""),
        (val['page:04']?.["q4:2_v2"] || ""),
        (val['page:04']?.["q4:3_v2"] || ""),
        (val['page:06']?.["q6:1"] || ""),
        (val['page:06']?.["q6:2"] || ""),
        (val['page:06']?.["q6:3"] || ""),
        (val['page:06']?.["q6:4"] || ""),
        (val['page:07']?.["q7:1"]?.["score1"] || "0"),
        (val['page:07']?.["q7:1"]?.["score2"] || "0"),
        (val['page:08']?.["q8:1"] || ""),
        (val['page:08']?.["q8:2"] || ""),
        (val['page:08']?.["q8:3"] || ""),
        (val['page:09']?.["q9:1"] || ""),
        (val['page:09']?.["q9:2"] || ""),
        (val['page:09']?.["q9:3"] || ""),
        (val['page:09']?.["q9:4"] || ""),
        (val['page:09']?.["q9:5"] || ""),
        (val['page:09']?.["q9:6"] || ""),
        (val['page:09']?.["q9:7"] || ""),
        (val['page:10']?.["q10:1"] || ""),
        (val['page:10']?.["q10:2"] || ""),
        (val['page:10']?.["q10:3"] || ""),
        (val['page:10']?.["q10:4"] || ""),
        resolveSearchHistory(val['page:05']?.["q5:1_search_history"]).flat()
      ].flat()

      return tmp
    })

    const csvRes = convertToCsv(headings, res)
    setResultCsv(csvRes)
  }

  function checkIfJsonIsValid(e) {
    const jsonTxt = e.target.value
    if (jsonTxt.length > 0) {
      try {
        const jsonObj = JSON.parse(jsonTxt)
        setJsonIsValid(true)
        setJsonParsed(jsonObj)
      } catch (error) {
        setJsonIsValid(false)
        setJsonParsed(null)
      }
    }
  }

  return (
    <div className='p-10'>
      <h3 className='text-2xl font-bold'>Export JSON To CSV</h3>
      <p className='my-6'>Bitte den JSON Text aus dem Firebase export in dieses Feld kopieren und dann den Export-Button drücken.</p>

      <p><label>JSON</label></p>
      <textarea heigth="20" cols="10"
        className="border border-black w-full h-96"
        onChange={checkIfJsonIsValid}
      ></textarea>
      <button className={clsx({
        "m-5 bg-blue-300 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed": jsonIsValid === false,
        "m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline": jsonIsValid === true
      })} type="button" onClick={triggerExport}>
        Export
      </button>

      <p><label>CSV</label></p>
      <textarea heigth="20" cols="10"
        className="border border-black w-full h-96"
        onChange={checkIfJsonIsValid}
        defaultValue={resultCsv}
      ></textarea>
      <p className='my-6'>Bitte den CSV Text in eine Datei mit der Endung .csv kopieren</p>


    </div>
  )
}

export default ExportApp
