export const SelfAssessment = ({ data, onAllChosen, ...otherAttrs }) => {
  if (!data?.attributes || data.attributes.length === 0) {
    return <div>No attributes given</div>
  }

  const shuffleArray = (inputArray) => {
    const ia = inputArray
    ia.sort(() => Math.random() - 0.5)
    return ia
  }

  const calcGoughScore = (answers, attributes) => {
    let score = 0
    let posMatches = 0
    let negMatches = 0

    Object.keys(answers).forEach(element => {
      const attr = attributes.filter(v => { return (v.name === element) })[0]

      if (attr.trend === 'pos' && answers[element] === 'y') {
        score++
        posMatches++
      }

      if (attr.trend === 'neg' && answers[element] === 'y') {
        score--
        negMatches++
      }
    })

    return ({
      score,
      posMatches,
      negMatches
    })
  }

  const randomOrder = shuffleArray(Object.keys(data.attributes))

  const fieldsOrdered = randomOrder.map(key => {
    return data.attributes[key].name
  })

  let inputData = {
    fieldsOrdered: fieldsOrdered,
    answers: {}
  }

  const handleOptChange = e => {
    inputData.answers[e.target.name] = e.target.value

    if (Object.keys(inputData.answers).length > 0 &&
      Object.keys(inputData.answers).length === inputData.fieldsOrdered.length) {
      const { score, posMatches, negMatches } = calcGoughScore(inputData.answers, data.attributes)

      inputData.score1 = score
      inputData.score2 = posMatches / (posMatches + negMatches)
      onAllChosen({
        target: {
          name: data.name,
          value: inputData,
        }
      })
    }
  }

  return (
    <div className="flex flex-wrap">
      {randomOrder.map((key, idx) => {
        const attrData = data.attributes[key]

        return (
          <div className="flex w-full md:w-1/2" key={idx}>
            <div className="border border-solid border-gray-200 bg-gray-50 flex p-2 w-full">
              <div className="flex-grow">{attrData.label}</div>
              <label htmlFor={attrData.name} className="flex-0 w-1/4">
                <input type="radio" name={attrData.name} id={attrData.name} value="y" onChange={handleOptChange} />&nbsp; Ja
              </label>
              <label htmlFor={attrData.name + '2'} className="flex-0">
                <input type="radio" name={attrData.name} id={attrData.name + '2'} value="n" onChange={handleOptChange} />&nbsp; Nein
              </label>
            </div>
          </div>)
      })}
    </div>
  )





}