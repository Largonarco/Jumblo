const randomWords = require("random-words");

const getGrid = () => {
  const allLtrs = [];

  for (let i = 1; i <= 100; i++) {
    allLtrs.push({
      letter: null,
      word: null,
      wordPos: null,
      wordLength: null,
      gridPos: i,
      direction: null,
    });
  }

  return allLtrs;
};

let grid = getGrid();

const getWordLtrs = () => {
  const newWord = randomWords({ exactly: 1, maxLength: 8 }).toString();
  const newWordLtrs = newWord.split("");
  const newWordLtrObjs = newWordLtrs.map((letter, index) => ({
    letter,
    wordPos: index + 1,
    word: newWord,
    wordLength: newWordLtrs.length,
  }));

  return newWordLtrObjs;
};

const noWrap = (start, end) => {
  for (let i = start; i <= end; i++) {
    if (i % 10 == 0) {
      return false;
    }
  }

  return true;
};

const areSlotsEmpty = (start, end, direction) => {
  let emptySlots = 0;

  if (end <= 100) {
    if (direction == "right") {
      for (let i = start; i <= end; i++) {
        if (grid[i - 1].letter == null) {
          emptySlots++;
        }
      }
    } else if (direction == "down") {
      for (let i = start; i <= end; i = i + 10) {
        if (grid[i - 1].letter == null) {
          emptySlots++;
        }
      }
    }

    if (direction == "right" && emptySlots == end - start + 1) {
      return true;
    } else if (direction == "down" && start == end - (emptySlots - 1) * 10) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const arrangeWordLtrs_v1 = (wordLetters, start, direction) => {
  const wordLtrs = wordLetters;

  wordLtrs.forEach((ltrObj, index) => {
    direction == "right"
      ? (grid[start - 1 + index] = {
          ...ltrObj,
          gridPos: start + index,
          direction,
        })
      : (grid[start - 1 + 10 * index] = {
          ...ltrObj,
          gridPos: start + 10 * index,
          direction,
        });
  });
};

const arrangeWordLtrs_v2 = (wordLetters, allLetters) => {
  const wordLtrs = wordLetters;
  const initialLtrObj = wordLtrs[0];
  const allLtrs = allLetters;

  for (let i = 0; i < allLtrs.length; i++) {
    const ltrObj = allLtrs[i];

    if (ltrObj.letter == initialLtrObj.letter) {
      if (
        ltrObj.direction == "down" &&
        noWrap(ltrObj.gridPos + 1, ltrObj.gridPos + wordLtrs.length - 1) &&
        areSlotsEmpty(
          ltrObj.gridPos + 1,
          ltrObj.gridPos + wordLtrs.length - 1,
          "right"
        )
      ) {
        const f_wordLtrs = wordLtrs.filter((ltrObj) => ltrObj.wordPos != 1);
        arrangeWordLtrs_v1(f_wordLtrs, ltrObj.gridPos + 1, "right");

        return true;
      } else if (
        ltrObj.direction == "right" &&
        ltrObj.gridPos + (wordLtrs.length - 1) * 10 < 100 &&
        areSlotsEmpty(
          ltrObj.gridPos + 10,
          ltrObj.gridPos + (wordLtrs.length - 1) * 10,
          "down"
        )
      ) {
        const f_wordLtrs = wordLtrs.filter((ltrObj) => ltrObj.wordPos != 1);
        arrangeWordLtrs_v1(f_wordLtrs, ltrObj.gridPos + 10, "down");

        return true;
      }
    }
  }

  return false;
};

const arrangeWordLtrs_v3 = (wordLetters, allLetters) => {
  const wordLtrs = wordLetters;
  let allLtrs = allLetters;

  for (let i = 0; i < allLtrs.length; i++) {
    const ltrObj = allLtrs[i];

    if (ltrObj.letter == null) {
      if (
        noWrap(ltrObj.gridPos + 1, ltrObj.gridPos + wordLtrs.length) &&
        areSlotsEmpty(
          ltrObj.gridPos + 1,
          ltrObj.gridPos + wordLtrs.length,
          "right"
        )
      ) {
        arrangeWordLtrs_v1(wordLtrs, ltrObj.gridPos + 1, "right");

        return true;
      } else if (
        ltrObj.gridPos + 1 + (wordLtrs.length - 1) * 10 < 100 &&
        areSlotsEmpty(
          ltrObj.gridPos + 1,
          ltrObj.gridPos + 1 + (wordLtrs.length - 1) * 10,
          "down"
        )
      ) {
        arrangeWordLtrs_v1(wordLtrs, ltrObj.gridPos + 1, "down");

        return true;
      }
    }
  }

  return false;
};

const magic = () => {
  arrangeWordLtrs_v1(getWordLtrs(), 1, "right");
  let v2, v3;

  do {
    const newWordLtrs = getWordLtrs();
    v2 = arrangeWordLtrs_v2(newWordLtrs, grid);

    if (!v2) {
      v3 = arrangeWordLtrs_v3(newWordLtrs, grid);
    }
  } while (v2 || v3);
};

magic();
