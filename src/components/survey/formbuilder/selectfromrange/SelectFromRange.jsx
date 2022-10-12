import { replaceBBCode } from "../../../../helpers/bbcode"

function shuffle(array) {
  let currentIndex = array.length, randomIndex

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]]
  }

  return array
}


export const SelectFromRange = ({ name, label, options, onChange, alignment, randomizeOrder, ...otherAttrs }) => {

  const handleChange = (e) => {
    return onChange(e)
  }

  let selOptions = options
  if (randomizeOrder) {
    shuffle(selOptions)
  }

  if (alignment === 'vertical') {
    return (
      <div key={name} className="p-0 w-full">
        <div className="max-w-full pb-5 font-bold" dangerouslySetInnerHTML={{
          __html: replaceBBCode(label) || ' '
        }}></div>

        <div className="w-full">
          {selOptions.map((opt, idx) => (
            <div className="h-12">
              <span className="w-min"><input type="radio" name={name} id={`${name}${opt.value}`} value={opt.value} onChange={handleChange} /></span> &nbsp;
              <label className="w-full border border-solid" key={idx} htmlFor={`${name}${opt.value}`}>
                <span className="h-16 font-bold text-center whitespace-pre" dangerouslySetInnerHTML={{
                  __html: replaceBBCode(opt.label) || ' '
                }}>
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>
    )
  } else {
    return (<div key={name} className="p-0 w-full">
      <div className="max-w-full pb-5 font-bold" dangerouslySetInnerHTML={{
        __html: replaceBBCode(label) || ' '
      }}></div>

      <div className="w-full flex">
        {options.map((opt, idx) => (
          <label className="w-full border border-solid" key={idx} htmlFor={`${name}${opt.value}`}>
            <div className="h-16 font-bold text-center whitespace-pre" dangerouslySetInnerHTML={{
              __html: replaceBBCode(opt.label) || ' '
            }}>
            </div>
            <div className="text-center"><input type="radio" name={name} id={`${name}${opt.value}`} value={opt.value} onChange={handleChange} /></div>
            <div className="text-center">{opt.value}</div>
          </label>
        ))}
      </div>
    </div>)
  }
}