import { useEffect, useState } from "react";
import RICIBs from "./ReactIndividualCharacterInputBoxes";
import { Button, Container, Grid, Input, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { dictionary } from "../assets/dictionary";
import InfiniteScroll from "react-infinite-scroll-component";
export default function Worddit(props) {
  const increment = 50;

  const [numLetters, setNumLetters] = useState(5);
  const [filtered, setFiltered] = useState(
    dictionary.filter((word) => word.length === numLetters)
  );
  const [suggestedWord, setSuggestedWord] = useState(
    "Whatever your heart desires"
  );
  const [wordCount, setWordCount] = useState({
    prev: 0,
    next: increment,
  });
  const [hasMore, setHasMore] = useState(true);
  const [current, setCurrent] = useState(
    dictionary.slice(wordCount.prev, wordCount.next)
  );

  // For RICBs functionality
  const [rows, setRows] = useState([
    {
      characterArray: Array(numLetters).fill(null),
      colourArray: Array(numLetters).fill("black"),
      inputElements: [],
      index: 0,
    },
  ]);

  const handleOutput = (string) => {};

  const setModuleOutput = (target, index) => {
    setRows((prevRows) => {
      let updatedCharacters = prevRows[index].characterArray.map(
        (char, number) => {
          return prevRows[index].inputElements["input" + number].value;
        }
      );
      let newRows = [...prevRows];
      newRows[index].characterArray = updatedCharacters;
      return newRows;
    });
  };

  const setColours = (colours, index) => {
    let newRows = [...rows];
    newRows[index].colourArray = colours;
    setRows(newRows);
  };

  // For adjusting rows

  const addRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        characterArray: Array(numLetters).fill(null),
        colourArray: Array(numLetters).fill("black"),
        inputElements: [],
        index: prevRows.length,
      },
    ]);
  };
  const deleteRow = () => {
    setRows((prevRows) => [...prevRows].slice(0, -1));
  };

  // For adjusting number of letters

  useEffect(() => {
    setFiltered(dictionary.filter((word) => word.length === numLetters));
  }, [numLetters]);

  const changeNumberLetters = (newNumLetters) => {
    let newRows = [...rows];
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].characterArray.length < newNumLetters) {
        newRows[i].characterArray.push(null);
        newRows[i].colourArray.push("black");
      } else if (rows[i].characterArray.length > newNumLetters) {
        newRows[i].characterArray.pop();
        newRows[i].colourArray.pop();
      }
    }
    setRows(newRows);
    setNumLetters(newNumLetters);
  };

  // Dictionary functionality

  const getMoreWords = () => {
    if (current.length === filtered.length) {
      setHasMore(false);
      return;
    }
    setWordCount((prevState) => {
      return {
        prev: prevState.prev + increment,
        next: prevState.next + increment,
      };
    });
  };

  useEffect(() => {
    let { prev, next } = wordCount;
    if (next >= filtered.length) {
      next = filtered.length;
      prev += wordCount.next - next;
      setHasMore(false);
      return;
    }
    if (hasMore)
      setCurrent((prevCurrent) =>
        prevCurrent.concat(filtered.slice(prev, next))
      );
  }, [wordCount, filtered, hasMore]);

  const filterWords = () => {
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
    setFiltered(newFiltered);
    setCurrent(newFiltered.slice(0, increment));
    setWordCount({ prev: 0, next: increment });
  };

  const getSuggestion = () => {
    let maxScore = 0;
    let maxWord = "";
    let score = 0;
    let countOccurances = new Array(26).fill(0);
    let countedLetters = new Array(26).fill(false);
    const scoreWord = (word, countOccurances) => {
      let counted = new Array(26).fill(false);
      let score = 0;
      let index = -1;
      for (let i = 0; i < word.length; i++) {
        index = word.charCodeAt(i) - "a".charCodeAt(0);
        if (!counted[index]) {
          score += countOccurances[index];
          counted[index] = true;
        }
      }
      return score;
    };
    for (let i = 0; i < filtered.length; i++) {
      countedLetters.fill(false);
      for (let j = 0; j < filtered[i].length; j++) {
        if (!countedLetters[filtered[i].charCodeAt(j) - "a".charCodeAt(0)]) {
          countOccurances[filtered[i].charCodeAt(j) - "a".charCodeAt(0)]++;
        }
      }
    }
    for (let i = 0; i < filtered.length; i++) {
      score = scoreWord(filtered[i], countOccurances);
      if (score > maxScore) {
        maxWord = filtered[i];
        maxScore = score;
      }
    }
    setSuggestedWord(maxWord);
  };

  return (
    <Grid align="center">
      <Grid item container direction="column">
        <Grid item align="center">
          <Button aria-label="add row" onClick={addRow} endIcon={<AddIcon />}>
            Add
          </Button>
          <Button
            aria-label="delete row"
            onClick={deleteRow}
            endIcon={<DeleteIcon />}
          >
            Delete
          </Button>
          Number of Letters
          <Input
            sx={{ width: 40, margin: 1 }}
            label="Number of Letters"
            defaultValue={5}
            type="number"
            min="4"
            max="15"
            onChange={(e) => changeNumberLetters(parseInt(e.target.value))}
          ></Input>
        </Grid>

        {rows.map(({ index }) => (
          <RICIBs
            amount={numLetters}
            autoFocus
            values={rows[index]}
            handleOutputString={handleOutput}
            setModuleOutput={(target) => setModuleOutput(target, index)}
            setColours={(colours) => setColours(colours, index)}
            index={index}
            key={`row${index}`}
            inputProps={[{ className: "first-box" }, {}, { placeholder: "_" }]}
            inputRegExp={/^[a-z]$/}
          />
        ))}
      </Grid>
      
      <Box sx={{display: 'flex', flexDirection:"column", width: 200, p: 3}} >
      <Button type="submit" variant="contained" endIcon={<SendIcon />} onClick={filterWords}>
        Filter
      </Button>
        <Button onClick={getSuggestion}>Give Suggestion</Button>
        <p>Suggested Word: {suggestedWord}</p>
      </Box>

      <Container fixed maxWidth="md">
        <p>Number of possible words: {filtered.length} </p>
        <InfiniteScroll
          dataLength={current.length}
          next={getMoreWords}
          hasMore={hasMore}
          loader={<h3>Loading...</h3>}
          height={250}
        >
          <Grid container direction="row" spaceing={3}>
            {current &&
              current.map((item, index) => (
                <Grid item xs={2} key={`${item}${index}`}>
                  {item}
                </Grid>
              ))}
          </Grid>
        </InfiniteScroll>
      </Container>
    </Grid>
  );
}
