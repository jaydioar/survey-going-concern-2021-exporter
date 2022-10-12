import { DropDown } from "./dropdown/DropDown"
import { NumericalInput } from "./numericalinput/NumericalInput"
import { ResearchSimulation } from "./researchsimulation/ResearchSimulation"
import { SelectFromRange } from "./selectfromrange/SelectFromRange"
import { Slider } from "./slider/Slider"
import { TextArea } from "./textarea/TextArea"
import { TextInput } from "./textinput/TextInput"
import { replaceBBCode } from "./../../../helpers/bbcode"
import { SelfAssessment } from "./selfassessment/SelfAssessment"
import { memo } from "react"

// @TODO find better solution for generating unique element ids
let renderedElementId = 0


const propsAreEqual = (prevProps, nextProps) => {
  return prevProps.formSections === nextProps.formSections
}

export const FormBuilder = memo(({ formSections, formName, onFormChanged, onFormComplete, defaultValues }) => {

  let completedInputFields = Object.assign({}, defaultValues)
  let requiredInputFields = []

  const registerRequiredInputField = (name, isRequired) => {
    if (isRequired && !requiredInputFields.includes(name)) {
      requiredInputFields.push(name)
    }
  }

  /**
   * Renders a section headline
   */
  const renderHeadline = data => {
    return (
      <div className="text-xl pt-3 pb-4" key={data.text}>
        <strong>{data.text}</strong>
      </div>
    )
  }

  /**
   * Renders a bunch of text paragraphs
   */
  const renderText = data => {
    return data.paragraphs.map((p, idx) => (
      <p className="pb-3" key={idx} dangerouslySetInnerHTML={{
        __html: replaceBBCode(p)
      }}></p>
    ))
  }

  const renderBoxedText = data => {
    const text = renderText(data)
    return <div className="border border-gray-400 bg-gray-200 p-5 border-solid">
      {text}
    </div>
  }

  const renderBulletList = data => {
    const bPoints = data.paragraphs.map((p, idx) => {
      return <li className="pb-3 list-item" key={idx}>{p}</li>
    })

    return <ul className="pl-10 list-outside list-disc">
      {bPoints}
    </ul>
  }

  const formIsCompleted = () => {
    if (!completedInputFields) {
      return false
    }

    if (completedInputFields && Object.keys(completedInputFields).length < 1) {
      return true
    }

    let isCompleted = true

    requiredInputFields.forEach(reqFieldName => {
      if (completedInputFields[reqFieldName] === undefined || completedInputFields[reqFieldName] === null) {
        isCompleted = false
      }
    })
    return isCompleted
  }

  const stashInput = (xname, xvalue) => {
    const ci = completedInputFields
    ci[xname] = xvalue
    completedInputFields = ci
  }

  const saveCurrentInputValue = e => {
    stashInput(e.target.name, e.target.value)
    onFormChanged(formName, completedInputFields)

    if (formIsCompleted()) {
      let cif = Object.assign({}, completedInputFields)
      cif.isCompleted = true
      onFormComplete(formName, cif)
    }
  }


  const renderSlider = ({ label, name, unit, min, max, isOptional, ...otherAttributes }) => {
    registerRequiredInputField(name, !isOptional)
    return (
      <div key={name} className="bg-gray-200 p-5 w-full">
        <Slider
          name={name}
          className="min-w-full"
          label={label}
          unit={unit}
          onChange={saveCurrentInputValue}
          min={min}
          max={max}
        />
      </div>
    )
  }


  const renderSelectFromRange = ({ name, isOptional, label, options, alignment, randomizeOrder }) => {
    registerRequiredInputField(name, !isOptional)

    return (
      <div key={name} className="bg-gray-200 p-5">
        <SelectFromRange
          name={name}
          label={label}
          options={options}
          onChange={saveCurrentInputValue}
          alignment={alignment}
          randomizeOrder={randomizeOrder}
        />
      </div>
    )
  }


  /**
   * Renders a multiline text input field (<textarea...)
   */
  const renderTextArea = ({ name, label, rows, placeholder, isOptional }) => {
    registerRequiredInputField(name, !isOptional)
    const curVal = completedInputFields?.[name] || null
    return (
      <div key={name} className="border-1 border-solid bg-gray-200 p-5">
        <TextArea
          className="w-full p-5"
          onChange={saveCurrentInputValue}
          onComplete={() => { }}
          isRequired={!isOptional}
          label={label}
          name={name}
          rows={rows}
          placeholder={placeholder}
          defaultValue={curVal}
        />
      </div>
    )
  }

  /**
   * Renders a single line (<input ..) or a multiline (<textarea.. ) input field
   */
  const renderTextInput = ({ name, label, rows, placeholder, isOptional }) => {
    if (rows > 1) {
      return renderTextArea({ name, label, rows, placeholder })
    }

    registerRequiredInputField(name, !isOptional)
    const curVal = completedInputFields?.[name] || null
    return (
      <div key={name} className="border-1 border-solid bg-gray-200 p-5">
        <TextInput
          className="w-full p-5"
          onBlur={saveCurrentInputValue}
          onChange={() => null}
          onComplete={saveCurrentInputValue}
          label={label}
          name={name}
          rows={rows}
          placeholder={placeholder}
          defaultValue={curVal}
        />
      </div>
    )
  }

  const renderNumericalInput = ({ name, label, rows, placeholder, isOptional }) => {
    if (rows > 1) {
      return renderTextArea({ name, label, rows, placeholder })
    }

    registerRequiredInputField(name, !isOptional)
    const curVal = completedInputFields?.[name] || 0
    return (
      <div key={name} className="border-1 border-solid bg-gray-200 p-5">
        <NumericalInput
          className="w-full p-5"
          onBlur={saveCurrentInputValue}
          onChange={() => null}
          onComplete={saveCurrentInputValue}
          label={label}
          name={name}
          rows={rows}
          placeholder={placeholder}
          defaultValue={curVal}
        />
      </div>
    )
  }

  const renderDropDown = ({ name, label, options, isOptional }) => {
    registerRequiredInputField(name, !isOptional)
    return (
      <div key={name} className="border-1 border-solid bg-gray-200 p-5">
        <DropDown
          name={name}
          label={label}
          options={options}
          onValueSelect={saveCurrentInputValue}
        />
      </div>
    )
  }

  const renderResearchSimulation = ({ name, label, placeholder, notFoundMessage, labelOpenDocument }) => {
    return (
      <div key={name} className="border-1 border-solid bg-gray-200 p-5">
        <ResearchSimulation
          name={name}
          labe={label}
          placeholder={placeholder}
          notFoundMessage={notFoundMessage}
          labelOpenDocument={labelOpenDocument}
          onSearchHistoryChanged={saveCurrentInputValue}
        />
      </div>
    )
  }

  const registerOpen = (url, name) => {
    return (e) => {
      saveCurrentInputValue(
        {
          target: {
            name: name,
            value: { url: url, time_: new Date().getTime(), time: new Date().toISOString() }
          }
        }
      )
    }
  }

  const renderLinkThumbnail = ({ url, target, name, title, isOptional }) => {
    registerRequiredInputField(name, !isOptional)

    return (
      <a href={url} target={target} onClick={registerOpen(url, name)}>
        <div key={name} className="border-1 border-solid bg-gray-100 p-5 w-auto hover:bg-gray-200">
          {title}
        </div>
      </a>
    )
  }

  const renderPickVersion = ({ name, isOptional, versions }) => {
    const numVersions = versions?.length
    if (numVersions < 1) return null

    const a = new Uint32Array(1) //@TODO this is a hack just considering 2 versions - needs to be fixed if you wand pick more than 2 versions
    const choosenVersion = completedInputFields[name] || (crypto.getRandomValues(a)[0].toString()[1]) % numVersions

    stashInput(name, choosenVersion)
    const res = versions[choosenVersion].elements?.map((el, idx) => {
      if (!el.module) return null

      if (el.module !== 'subsections') {
        return <div className="__element p-2" key={idx}>{renderIncludedElement(el)}</div>
      }

      return null
    })

    return <div key={name}>{res}</div>
  }

  const renderAside = (elements) => {
    const sideElements = elements.map((el, idx) => {
      if (!el.module) return null

      if (el.module !== 'subsections') {
        return <div className="__element p-2" key={el.id}>{renderIncludedElement(el)}</div>
      }

      return null
    })

    return (<div className="absolute right-0 top-0 h-screen">
      <div className="__element p-2 sticky right-0 top-0">
        {sideElements}
      </div>
    </div>)
  }



  const renderSelfAssessment = (data) => {
    return (
      <div key={data.name} className="border-1 border-solid bg-gray-200 p-5">
        <SelfAssessment
          data={data}
          onAllChosen={saveCurrentInputValue}
        />
      </div>
    )
  }

  /**
   * Renders an element inside a cell or section
   */
  const renderIncludedElement = ({ data, elements, module }) => {
    let content = null
    data.id = renderedElementId++

    switch (module.toLowerCase()) {
      case 'aside':
        content = renderAside(elements)
        break
      case 'selfassessment':
        content = renderSelfAssessment(data)
        break
      case 'linkthumbnail':
        content = renderLinkThumbnail(data)
        break
      case 'researchsimulation':
        content = renderResearchSimulation(data)
        break
      case 'dropdown':
        content = renderDropDown(data)
        break
      case 'selectfromrange':
        content = renderSelectFromRange(data)
        break
      case 'slider':
        content = renderSlider(data)
        break
      case 'headline':
        content = renderHeadline(data)
        break
      case 'boxedtext':
        content = renderBoxedText(data)
        break
      case 'bulletlist':
        content = renderBulletList(data)
        break
      case 'pickversion':
        content = renderPickVersion(data)
        break
      case 'text':
        content = renderText(data)
        break
      case 'textarea':
      case 'textinput':
        content = renderTextInput(data)
        break
      case 'numericalinput':
        content = renderNumericalInput(data)
        break
      default:
        break
    }

    return content
  }

  /**
   * Renders a collection of sections (including all nested subsections)
   */
  const renderSections = (secs, depth) => {
    let content = null

    return secs.map((sec, secIdx) => {
      const elements = sec.elements.map((el, idx) => {
        if (!el.module) return null

        if (el.module !== 'subsections') {
          content = renderIncludedElement(el)

          return <div className="__element p-2" key={`${el.id}`}>{content}</div>
        } else {
          content = renderSections(el.sections, depth + 1)

          return content
        }
      })

      if (depth === 1) {
        return (
          <div className="p-6 border my-1 border-solid" key={`sect-${depth}:${secIdx}`}>
            {elements}
          </div>
        )
      } else {
        return (
          <div className="__subsection" key={`subsect-${depth}:${secIdx}`}>
            {elements}
          </div>
        )
      }
    })
  }

  const formContent = renderSections(formSections, 1)
  return <>
    {formContent}
  </>
}, propsAreEqual)