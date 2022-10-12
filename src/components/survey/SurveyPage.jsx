import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { FormBuilder } from './formbuilder/FormBuilder'
import { SimpleModal } from './simplemodal/SimpleModal'


export const SurveyPage = ({ page, onComplete, onChange, onNextPage, onPrevPage, defaultValues }) => {
  const allowProceed = useMemo(() => page.settings?.allowProceed, [page, page.thisId])
  const [currentPageIsComplete, setCurrentPageIsComplete] = useState(false)
  const [modalContent, setModalContent] = useState({ show: false })
  const [formData, setFormData] = useState(defaultValues)

  const lockNextButton = () => {
    if (allowProceed === true) {
      setCurrentPageIsComplete(true)
    } else {
      setCurrentPageIsComplete(false)
    }
  }


  useEffect(() => {
    setCurrentPageIsComplete(allowProceed)
  }, [allowProceed, setCurrentPageIsComplete])

  const triggerNextPage = (e) => {
    if (page.nextId) {
      if (page.settings?.confirmMoveForward) {
        const { title, text, buttons } = page.settings?.confirmMoveForward

        setModalContent({
          show: true,
          title,
          text,
          buttons,
          onAccept: () => {
            setModalContent({ show: false })
            lockNextButton()
            onNextPage()
          },
          onReject: () => { setModalContent({ show: false }) }
        })
      } else {
        setModalContent({ show: false })
        lockNextButton()
        onNextPage()
      }
    } else {
      lockNextButton()
      onNextPage()
    }
  }

  const triggerPrevPage = (e) => {
    if (page.prevId) {
      onPrevPage()
    }
  }

  const handleFormChanged = (formName, formData) => {
    formData._timeComplete = new Date().getTime()
    formData.timeComplete = new Date().toISOString()
    setFormData(formData)
    onChange(formName, formData)
  }

  const handleFormComplete = (formName, formData) => {
    setFormData(formData)
    setCurrentPageIsComplete(true)
  }

  const renderBackButton = () => {
    if (page.settings?.allowMoveBack !== true) {
      return null
    }

    return (
      <button className={clsx({
        "m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline": currentPageIsComplete === true
      })} type="button" onClick={triggerPrevPage}>
        Zurück
      </button>
    )
  }

  const renderNextButton = () => {
    if (page.nextId === null) {
      page.labelNextPage = 'Umfrage beenden'
    }

    return (<button disabled={currentPageIsComplete === false && 'disabled'} className={clsx({
      "m-5 bg-blue-300 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed": currentPageIsComplete === false,
      "m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline": currentPageIsComplete === true
    })} type="button" onClick={triggerNextPage}>
      {page.labelNextPage || 'Weiter'}
    </button>)
  }

  const backButton = renderBackButton()
  const nextButton = renderNextButton()

  const {
    show,
    title,
    text,
    buttons,
    onAccept,
    onReject
  } = modalContent

  const modalWindow = show ?
    <SimpleModal
      title={title}
      text={text}
      buttons={buttons}
      onAccept={onAccept}
      onReject={onReject}
    />
    : null

  return (
    <div key={page.thisId}>
      {(page.sections?.length > 0) ?
        <FormBuilder
          formSections={page.sections}
          formName={`page:${page.thisId.toString().padStart(2, '0')}`}
          onFormChanged={handleFormChanged}
          onFormComplete={handleFormComplete}
          defaultValues={formData[page.thisId]}
        /> :
        null}

      <div className="flex items-center justify-between">
        {backButton}
        {nextButton}
      </div>

      {modalWindow}
    </div>
  )
}