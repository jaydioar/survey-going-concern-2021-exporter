export const NumericalInput = ({ onChange, onComplete, label, ...otherProps }) => {
  const handleOnChangeEvent = e => {
    if (e.target.value.length > 0) {
      onChange(e)
      onComplete(e)
    }
  }

  return (
    <>
      {label && <div className="font-bold pb-5">{label}</div>}
      <input type="number"
        onChange={handleOnChangeEvent}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        {...otherProps} />
    </>
  )
}