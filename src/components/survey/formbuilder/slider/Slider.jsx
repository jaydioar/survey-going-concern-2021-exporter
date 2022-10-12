import { useState } from "react"

export const Slider = ({ name, min, max, label, unit, onChange, ...otherAttrs }) => {
  const middleMinMax = Math.ceil(min + ((max - min) / 2))
  const [currentSliderValue, setCurrentSliderValue] = useState(null)

  const handleSlideChange = (e) => {
    setCurrentSliderValue(e.target.value)
  }

  const handleFinishedSlide = (e) => {
    return onChange({
      target: {
        name: name,
        value: currentSliderValue
      }
    })
  }

  return (<div key={name} className="p-0">
    <div className="max-w-sm font-bold pb-5">{label}</div>
    <input
      className="bg-gray-400"
      type="range"
      name={name}
      min={min}
      max={max}
      defaultValue={-1}
      onChange={handleSlideChange}
      onMouseUp={handleFinishedSlide}
      onKeyUp={handleFinishedSlide}
      {...otherAttrs}
    />&nbsp;
    <span>{currentSliderValue} {unit}</span>
  </div>)
}