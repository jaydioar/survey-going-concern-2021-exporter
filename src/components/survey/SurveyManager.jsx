import { useState } from 'react'
import { SurveyQuestionaire } from './SurveyQuestionaire'


export const SurveyManager = ({ ruleSet, onSaveData, sessionId }) => {
  const [surveyIsComplete, setSurveyIsComplete] = useState(false)
  const [surveyData, setSurveyData] = useState({
    sessionId: sessionId,
    surveyId: ruleSet.meta.surveyId
  })

  const handleQuestionaireComplete = (pageId, data) => {
    let sd = Object.assign({}, surveyData)
    sd[pageId] = data
    delete sd.undefined
    onSaveData(sd)
    setSurveyIsComplete(true)
  }

  const handleQuestionaireChange = (pageId, data) => {
    let sd = Object.assign({}, surveyData)
    sd[pageId] = data
    setSurveyData(sd)
  }

  return surveyIsComplete ? (
    <div className='flex h-screen'>
      <div className='text-black font-bold text-3xl m-auto text-4xl'>
        Umfrage beendet. Du darfst das Fenster jetzt schließen.
      </div>
    </div>
  ) : (
    <>
      <SurveyQuestionaire
        sessionId={sessionId}
        pages={ruleSet?.pages}
        onChange={handleQuestionaireChange}
        onComplete={handleQuestionaireComplete}
        defaultValues={surveyData}
      />
    </>
  )
}