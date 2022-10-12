
export const DropDown = ({ name, label, options, onValueSelect, ...otherAttrs }) => {
  return (
    <div key={name}>
      <div className="font-bold pb-5">{label}</div>
      <select name={name} onChange={onValueSelect} className="py-1 px-3 border border-solid border-black bg-gray-50">
        {options.map((opt, idx) => {
          return <option value={opt.value} key={idx}>{opt.label}</option>
        })}
      </select>
    </div>
  )
}