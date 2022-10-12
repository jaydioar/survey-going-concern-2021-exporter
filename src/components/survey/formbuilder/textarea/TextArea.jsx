export const TextArea = ({ name, onChange, onComplete, label, isRequired, ...otherProps }) => {
  const onChangeHandler = e => {
    if (e.target.value.length > 0) {
      onChange(e)
    }
  }

  return (
    <>
      {label && <div className="font-bold pb-5">{label}</div>}
      <textarea
        name={name}
        onChange={onChangeHandler}
        onBlur={onComplete}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        {...otherProps} />
    </>
  )
}