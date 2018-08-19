var roots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
var notesSharps = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
var notesFlats = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
var notesNatural = ["C", null, "D", null, "E", "F", null, "G", null, "A", null, "B"];
var numberOfNotes = roots.length;
var octaveOffset = 1;

var midiNumberToNote = function(midiNumber, noteSet) {
  var octave = Math.floor(midiNumber / numberOfNotes) - octaveOffset;
  var root = midiNumber % numberOfNotes;
  return noteSet[root] + octave;
};

// NOTE: This function expects that note be capitalized and be
// properly sanitized and free of errors.
var noteToMidiNumber = function(noteString) {
  var noteParsed = noteString.match(/([A-G])(##|#|bb|b)?(-)?([0-9]+)?/);

  var note = noteParsed[1];
  var pitchOffset = 0;

  var sharp = noteParsed[2] === "#";
  var doubleSharp = noteParsed[2] === "##";
  var flat = noteParsed[2] === "b";
  var doubleFlat = noteParsed[2] === "bb";

  if (sharp) {
    pitchOffset++;
  } else if (doubleSharp) {
    pitchOffset += 2;
  } else if (flat) {
    pitchOffset--;
  } else if (doubleFlat) {
    pitchOffset -= 2;
  }

  var negativeOctave = noteParsed[3];
  var octave = noteParsed[4] ? parseInt(noteParsed[4]) : -1;

  if (negativeOctave) {
    octave = parseInt(negativeOctave + octave);
  }

  var root = notesNatural.indexOf(note);

  return root + pitchOffset + (octave + octaveOffset) * numberOfNotes;
};

var parseScaleString = function(scaleString) {
  // Remove invalid characters
  var sanitizedInput = scaleString.replace(/[^A-Ga-g0-9#, ]+/g, '');

  // Capitalize notes and lowercase flat symbols
  sanitizedInput = sanitizedInput.toUpperCase().replace(/([A-G])B+/g, '$1b');

  // Replace consecutive commas and spaces with single spaces
  sanitizedInput = sanitizedInput.replace(/[,\s]+/g, ' ');

  // Guess octave numbers if no octave numbers are present

  // Are octave numbers present?
  // There should be an integer at first character. 
  // Choose "2" as the first octave.
  // Successively add octaves. How? 

  return sanitizedInput.split(' ');
};

var scaleStringToMidiNumbers = function(scaleString) {
  console.log(scaleString);
  var scale = parseScaleString(scaleString);
  console.log(scale);
  var numbers = [];

  for (var i = 0; i < scale.length; i++) {
    numbers.push(noteToMidiNumber(scale[i]));
  }

  return numbers;
};

var transposeMidiNumbers = function(numbers, offset) {
  var result = [];

  for (var i = 0; i < numbers.length; i++) {
    result[i] = numbers[i] + offset;
  }

  return result;
};

var midiNumbersToScaleString = function(midiNumbers, noteSet) {
  var result = [];

  for (var i = 0; i < midiNumbers.length; i++) {
    result[i] = midiNumberToNote(midiNumbers[i], noteSet);
  }

  return result.join(" ");
};

var transposedScales = function(scaleString, noteSet) {
  var notes = parseScaleString(scaleString);
  var numbers = scaleStringToMidiNumbers(scaleString);
  var scales = [];
  var scaleNumbersTransposed;
  var scaleTransposed;

  for (var i = 0; i < numberOfNotes; i++) {
    scaleNumbersTransposed = transposeMidiNumbers(numbers, i);
    scaleTransposed = midiNumbersToScaleString(scaleNumbersTransposed, noteSet);
    console.log(scaleTransposed);

    scales.push(scaleTransposed);
  }

  return scales;
};

var test = function() {
  var numbers = [0, 1, 2, 3, 4, 12, 27, 48, 49, 60];
  var i;

  for (i = 0; i < numbers.length; i++) {
    var number = numbers[i];
    //console.log(number, midiNumberToNote(number, notesSharps));
  }

  var scale = ["C4", "C-1", "C#1", "Ebb5", "B11", "D##-1", "A", "E#"];

  for (i = 0; i < scale.length; i++) {
    var note = scale[i];
    var midiNumber = noteToMidiNumber(note);
      //console.log(note, midiNumber);
  }

  //console.log(noteToMidiNumber('C4'));
  //console.log(parseScaleString("Ab, B#, Z, F; G# - E5 (*&(*, Eb5"));

  //console.log(transposedScales("C2, G2, C3, E3, G3, A3, B3, C4", notesSharps));

  console.log(transposedScales("C, G, C, E, G, A, B, C", notesSharps));
};

test();
