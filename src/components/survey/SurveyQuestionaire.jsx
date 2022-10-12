import { useState } from 'react'
import { SurveyPage } from './SurveyPage'


const getPage = (pageSet, pageId) => {
  const pages = pageSet.filter(val => val.thisId === pageId)
  if (pages.length > 1) { console.error(`Found more than 1 page with id (${pageId})`) }
  return pages[0]
}

const getFirstPage = (pageSet) => {
  const rootPages = pageSet.filter(val => val.prevId === null)
  if (rootPages.length > 1) { console.error('Found more than 1 root page') }
  return rootPages[0]
}

export const SurveyQuestionaire = ({ pages, onChange, onComplete, defaultValues }) => {
  const [currentPage, setCurrentPage] = useState(null)

  if (!pages || pages.length < 1) {
    console.error('No pages defined in survey')
    return null
  }

  if (!currentPage) {
    const firstPage = getFirstPage(pages)
    if (firstPage && firstPage.thisId >= 0) {
      setCurrentPage(firstPage)
    }
    return null
  }

  const triggerNextPage = () => {
    if (currentPage.nextId) {
      setCurrentPage(getPage(pages, currentPage.nextId))
      window.scrollTo(0, 0)
    } else {
      onComplete()
    }
  }

  const triggerPrevPage = () => {
    if (currentPage.prevId) {
      setCurrentPage(getPage(pages, currentPage.prevId))
    }
  }

  const handleFormPageCompleted = (formName, formData) => {
    //onComplete(formName, formData)
  }

  const handleFormPageChanged = (formName, formData) => {
    onChange(formName, formData)
  }

  return (
    <>
      <div className="flex justify-end">
        <div className="text-white bg-gray-400 px-2 py-0">
          Seite: {currentPage.thisId}
        </div>
      </div>
      <SurveyPage
        page={currentPage}
        onChange={handleFormPageChanged}
        onComplete={handleFormPageCompleted}
        onNextPage={triggerNextPage}
        onPrevPage={triggerPrevPage}
        defaultValues={defaultValues[currentPage.thisId] || {}}
      />
    </>
  )
}