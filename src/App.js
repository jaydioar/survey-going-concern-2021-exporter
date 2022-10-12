import { useEffect, useState } from 'react'
import { SurveyManager } from './components/survey/SurveyManager'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import sha256 from 'crypto-js/sha256'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, push, child, update } from "firebase/database"
import { Routes, Route } from "react-router-dom"
import ExportApp from './ExportApp'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFasaqUqOltO4gxPbNmR4gYQqusN2Zthg",
  authDomain: "escp-survey-2022.firebaseapp.com",
  databaseURL: "https://escp-survey-2022-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "escp-survey-2022",
  storageBucket: "escp-survey-2022.appspot.com",
  messagingSenderId: "105376003688",
  appId: "1:105376003688:web:8a1b08d2a162565648eddd"
}

// Initialize Firebase
initializeApp(firebaseConfig)
const dbDatabase = getDatabase()
const startDate = new Date()

const getRandomHash = () => {
  const hash = sha256(Math.random().toString() + new Date().getUTCMilliseconds.toString())
  return hash.toString(CryptoJS.enc.Hex)
}

const getDatePrefix = (now) => {
  return now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') + '_' +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0') +
    now.getMilliseconds().toString().padStart(2, '0')
}

const surveySessionId = getRandomHash()

const writeToDatabase = (data) => {
  const endDate = new Date()
  data._startDate = startDate.getTime()
  data.startDate = new Date(startDate).toISOString()
  data._endDate = endDate.getTime()
  data.endDate = new Date(endDate).toISOString()
  data.completionTimeInMinutes = Math.round((data._endDate - data._startDate) / 60000)
  data.completionTimeInSeconds = Math.round((data._endDate - data._startDate) / 1000)

  const emailAddress = data['page:10']?.['q10:4']?.toString()
  if (emailAddress) { data['page:10']['q10:4'] = 'moved to mailinglist' }

  set(ref(dbDatabase, `surveys/${data.surveyId}/${getDatePrefix(endDate)}_${data.sessionId.toString().substr(0, 10)}`), {
    data: data
  })
    .then(() => {
      console.log('Survey Data Saved successfully!', data)
    })
    .catch((error) => {
      console.error('Not Saved successfully!')
    })

  if (emailAddress && data['page:10']['q10:3'] === 'y') {

    const newMailKey = push(child(ref(dbDatabase), `mailinglists/survey-${data.surveyId}`)).key
    const updates = {}
    updates[`mailinglists/survey-${data.surveyId}/` + newMailKey] = { email: emailAddress }

    update(ref(dbDatabase), updates).then(() => {
      console.log('E-Mail Saved successfully!')
    })
      .catch((error) => {
        console.error('E-Mail Not Saved successfully!')
      })
  }
}

const validateRuleSet = (unvalidatedRules) => {
  // @TODO verify the structure of the survey.json (using ajv?) in order to avoid unnescessary problems with broken json

  return unvalidatedRules
}

function SurveyApp() {
  const [surveyControlData, setSurveyControlData] = useState(null)

  useEffect(() => {
    // this json contains the variables and steering commands for customizing survey
    axios.get('./content/survey.json').then(response => {
      const validRuleSet = validateRuleSet(response.data)

      if (validRuleSet) {
        setSurveyControlData(validRuleSet)
      } else {
        console.log('Control data invalid.')
      }
    })
  }, [])

  return surveyControlData ? (
    <div className="container max-w-screen-md ml-auto mr-auto">
      <SurveyManager ruleSet={surveyControlData} onSaveData={writeToDatabase} sessionId={surveySessionId} />
    </div>
  ) : (
    <div className='flex h-screen'>
      <div className='m-auto text-6xl'>Daten werden geladen...</div>
    </div>
  )
}



const initBeforeUnLoad = (showExitPrompt) => {
  window.onbeforeunload = (event) => {
    if (showExitPrompt) {
      const e = event || window.event
      e.preventDefault()
      if (e) {
        e.returnValue = ''
      }
      return ''
    }
  }
}

// Hook
function useExitPrompt(bool) {
  const [showExitPrompt, setShowExitPrompt] = useState(bool)

  window.onload = function () {
    initBeforeUnLoad(showExitPrompt)
  }

  useEffect(() => {
    initBeforeUnLoad(showExitPrompt)
  }, [showExitPrompt])

  return [showExitPrompt, setShowExitPrompt]
}



function App() {
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(true)

  //NOTE: this similar to componentWillUnmount()
  useEffect(() => {
    return () => {
      setShowExitPrompt(false)
    }
  }, [])

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ExportApp />} />
      </Routes>
    </div>
  )
}

export default App
