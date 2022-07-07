const letterFrequencies = {
    'A': 0.0812,
    'B': 0.0149,
    'C': 0.0271,
    'D': 0.0432,
    'E': 0.1202,
    'F': 0.023,
    'G': 0.0203,
    'H': 0.0592,
    'I': 0.0731,
    'J': 0.001,
    'K': 0.0069,
    'L': 0.0398,
    'M': 0.0261,
    'N': 0.0695,
    'O': 0.0768,
    'P': 0.0182,
    'Q': 0.0011,
    'R': 0.0602,
    'S': 0.0628,
    'T': 0.091,
    'U': 0.0288,
    'V': 0.0111,
    'W': 0.0209,
    'X': 0.0017,
    'Y': 0.0211,
    'Z': 0.0007    
}

export function generateRandomLetter() {
    let letter, sum = 0, r = Math.random();
    for (letter in letterFrequencies) {
        sum += letterFrequencies[letter];
        if (r <= sum) return letter;
    }
    return 'E'; // Just in case!
}