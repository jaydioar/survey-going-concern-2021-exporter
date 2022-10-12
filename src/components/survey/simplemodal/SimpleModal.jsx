export const SimpleModal = ({ title, text, buttons, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-70 h-full w-full">
      <div className="md:w-1/2 bg-white m-auto my-10">
        <div className="flex w-full bg-gray-400 p-3 text-white text-2xl">
          <div className="flex-grow text-center">{title}</div>
        </div>
        <div className="p-6 lg:text-lg md:text-md">
          {text.map((t, idx) => {
            return <p className="p-5 py-2" key={idx}>{t}</p>
          })}
        </div>
        <div className="flex pl-6">
          <button className="flex-grow flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-5" onClick={onAccept}>{buttons.accept}</button>
          <button className="flex-grow flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-5" onClick={onReject}>{buttons.reject}</button>
        </div>
      </div>
    </div>
  )
}