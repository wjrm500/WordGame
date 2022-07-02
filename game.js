function generateRandomLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }

function populateBoxesWithLetters() {
    let elements = document.getElementsByClassName('inner-box');
    for (let element of elements) {
        element.innerHTML = generateRandomLetter();
    }
}

populateBoxesWithLetters();