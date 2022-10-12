import { useEffect, useState } from 'react'
import axios from 'axios'
import clsx from 'clsx'

const MIN_CHARS_FOR_SEARCH = 4
let viewerStart = null

export const ResearchSimulation = ({ name, onSearchHistoryChanged, placeholder, notFoundMessage, labelOpenDocument, ...otherAttrs }) => {
  const [searchKeywords, setSearchKeywords] = useState("")
  const [searchResults, setSearchResults] = useState({ init: true })
  const [loggedActions, logAction] = useState([])
  const [docToView, setDocToView] = useState({ title: null, url: null, viewerIsOpen: false })
  const [controlData, setControlData] = useState(null)

  const validateRuleSet = (ruleSet) => {
    if (!ruleSet?.researchSimulation) {
      throw Error('Die Daten in research-simulation.json sind ungültig!')
    }

    if (!ruleSet.researchSimulation?.config) {
      throw Error('Abschnitt "config: { ... }" in research-simulation.json fehlt!')
    }

    if (!ruleSet.researchSimulation?.cues?.length > 0) {
      throw Error('Abschnitt "cues": [ ... ] in research-simulation.json fehlt oder ist leer!')
    }

    try {
      ruleSet.researchSimulation.cues.forEach(element => {
        const { id, title, keywords, url } = element

        if (!id || typeof id !== "number") { throw Error(`Fehlendes oder ungültiges Attribute "id" (keine Zahl?) in ${JSON.stringify(element)}`) }
        if (!title || typeof title !== "string" || title?.length < 1) { throw Error(`Fehlendes oder ungültiges Attribute "title" (keine Zeichenkette?) in ${JSON.stringify(element)}`) }
        if (!keywords || !keywords?.length > 1) { throw Error(`Fehlendes oder ungültiges Attribute "keywords" (keine Zeichenkette?) in ${JSON.stringify(element)}`) }
        if (!url || !url?.length > 1) { throw Error(`Fehlendes oder ungültiges Attribute "url" (keine Zeichenkette?) in ${JSON.stringify(element)}`) }
      })
    } catch (err) {
      console.error(err)
      throw JSON.stringify(err.message)
    }

    return ruleSet
  }

  useEffect(() => {
    // this json contains the variables and steering commands for customizing survey
    axios.get('./content/research-simulation.json').then(response => {
      const validRuleSet = validateRuleSet(response.data)

      if (validRuleSet) {
        setControlData(validRuleSet)
      } else {
        console.log('Control data invalid.')
      }
    })
  }, [])

  const getSearchResults = (keywords) => {
    const kws = keywords.toLowerCase().split(';')

    return kws.reduce((acc, kw) => {
      if (kw.length === 0) return acc

      const cues4Kw = controlData.researchSimulation?.cues.filter((item) => {
        return item.keywords.toLowerCase().indexOf(kw) > -1
      })

      cues4Kw.forEach(cue => {
        acc[cue.id] = cue
      })

      return acc
    }, {})
  }

  const updateKeywords = (e) => {
    setSearchKeywords(e.target.value)
  }

  // try {
  //   ruleSetIsValid()
  // }
  // catch (err) {
  //   return (<div className="bg-red-100 text-red-700 p-20">
  //     Die Daten in der JSON-Datei für das Modul "Research Simulation" sind ungültig.<br />
  //     {JSON.parse(err)}
  //   </div>)
  // }

  const log = (action, info) => {
    const actions = loggedActions
    actions.push({
      time_: new Date().getTime(),
      time: new Date().toISOString(),
      action,
      info
    })
    logAction(actions)
    onSearchHistoryChanged({ target: { name: name, value: actions } })
  }

  const triggerSearch = (e) => {
    const res = getSearchResults(searchKeywords)
    if (Object.keys(res).length === 0) {
      log('SEARCH-FAILED', searchKeywords)
    } else {
      log('SEARCH-SUCCESS', searchKeywords)
    }

    setSearchResults(res)
  }

  const getViewer = (cue) => () => {
    log('OPEN', cue.url)
    const now = new Date()
    viewerStart = now.getTime()
    setDocToView({ title: cue.title, url: cue.url, viewerIsOpen: true })
  }

  const closeViewer = (e) => {
    const url = docToView.url
    const now = new Date()
    const durationOfView = now.getTime() - viewerStart
    viewerStart = null
    log('CLOSE', { url, durationInSec: durationOfView / 1000 })
    setDocToView({ title: null, url: null, viewerIsOpen: false })
  }

  const handleEnterKey = (e) => {
    if (e.key === 'Enter' && searchKeywords.length >= MIN_CHARS_FOR_SEARCH) {
      triggerSearch()
    }
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl pb-4">Recherche</h1>

      <div className="bg-blue-50 shadow-md px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <input autoFocus onKeyPress={handleEnterKey} onChange={updateKeywords} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="keywords" type="text" placeholder={placeholder} />
        </div>
        <div className="flex items-center justify-between">
          <button disabled={searchKeywords.length < MIN_CHARS_FOR_SEARCH && 'disabled'} className={clsx({
            "bg-blue-300 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed": searchKeywords.length < MIN_CHARS_FOR_SEARCH,
            "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline": searchKeywords.length >= MIN_CHARS_FOR_SEARCH
          })} type="button" onClick={triggerSearch}>
            Suchen
          </button>
        </div>
      </div>

      {searchResults.init !== true && Object.keys(searchResults).length === 0 && (
        <div className="bg-gray-50 p-10 my-10">
          <div>{notFoundMessage}</div>
        </div>)
      }

      {searchResults.init !== true && Object.keys(searchResults).map(k => (
        <div className="bg-gray-50 p-5 my-1 border-gray-500" key={k}>
          <div className="font-bold">{searchResults[k].title}</div>
          <div className="text-blue-400"><div className="cursor-pointer text-blue-700" onClick={getViewer(searchResults[k])}>{labelOpenDocument}</div></div>
        </div>)
      )}

      {docToView.viewerIsOpen && <div className="fixed inset-0 bg-gray-600 bg-opacity-99 overflow-y-auto h-full w-full">
        <div className="flex w-full bg-gray-800 text-white text-xl p-2">
          <button className="flex-none p-2 cursor-pointer m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline" onClick={closeViewer}>Zurück zur Suchmaske</button>
          <div className="flex-grow text-center pt-4 pl-52 text-2xl font-bold">{docToView.title}</div>
        </div>
        <div className="w-full h-full">
          <embed
            src={docToView.url}
            type="application/pdf"
            frameBorder="0"
            scrolling="auto"
            height="100%"
            width="100%"
          ></embed>
        </div>
      </div>}

    </div>
  )

}