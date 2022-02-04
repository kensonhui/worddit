/** Filters words and returns remaining words from dictionary
 * @param {array} dictionary array of words
 * @param {array} rows row containing objects with two arrays: characterArray, colourArray
 * @param {number} numLetter number of letters
 */
const wordFilter = (dictionary, rows, numLetters) => {
    let blackLetters = [];
    let yellowLetters = Array(numLetters)
      .fill([])
      .map(() => []);
    let greenLetters = Array(numLetters).fill(".");
    let occurancesRegex = "";
    rows.forEach(({ colourArray, characterArray }) => {
      const blackLettersOfWord = [];
      const yellowLettersOfWord = [];
      const greenLettersOfWord = [];
      for (let i = 0; i < numLetters; i++) {
        if (colourArray[i] === "black") {
          blackLetters.push(characterArray[i]);
          blackLettersOfWord.push(characterArray[i]);
        } else if (colourArray[i] === "yellow") {
          yellowLetters[i].push(characterArray[i]);
          yellowLettersOfWord.push(characterArray[i]);
        } else if (colourArray[i] === "green") {
          greenLetters[i] = characterArray[i];
          greenLettersOfWord.push(characterArray[i]);
        }
      }
      // Max/min nubmer occurances for each character
      const yellowAndGreenFilter = yellowLettersOfWord.concat(greenLettersOfWord);
      const yellowAndGreenSet = [...new Set(yellowAndGreenFilter)];
      yellowAndGreenSet.forEach((char) => {
        let minOccurances = yellowAndGreenFilter.filter((letter) => letter === char).length;
        if (minOccurances > 1)
        occurancesRegex += `(?=^([^${char}\\n]*${char}[^${char}\\n]*){${minOccurances},${blackLettersOfWord.includes(char)? minOccurances: ''}}$)`;
      });
    });
    let yellowRegex = "";
    let yellowFilter = "";
    for (let i = 0; i < numLetters; i++) {
      yellowRegex +=
        yellowLetters[i].length > 0
          ? `(?=^${".".repeat(i)}[^${yellowLetters[i].join("")}]${".".repeat(
              numLetters - i - 1
            )}$)`
          : "";
      for (let j = 0; j < yellowLetters[i].length; j++) {
        yellowRegex += `(?=^.*${yellowLetters[i][j]}.*)`;
        yellowFilter += yellowLetters[i][j];
      }
    }
    const blackRegex =
      blackLetters.length > 0
        ? `(?=^[^${blackLetters
            .filter(
              (char) =>
                char && char.match(`[^${yellowFilter}${greenLetters.join("")}]`)
            )
            .join("")}]+$)`
        : "";
    const greenRegex = `${greenLetters.join("")}`;
    const completeRegex = `^${blackRegex}${yellowRegex}${occurancesRegex}${greenRegex}$`;
    const newFiltered = dictionary.filter((word) =>
      word.match(completeRegex)
    );
    return newFiltered;
}
export default wordFilter;