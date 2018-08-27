function Transposer() {
  this.roots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  this.notesSharps = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  this.notesFlats = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  this.notesNatural = ["C", null, "D", null, "E", "F", null, "G", null, "A", null, "B"];
  this.numberOfNotes = this.roots.length;
  this.octaveOffset = 1;
  this.defaultBPitch = 2;
  this.defaultNonBPitch = 3;

  this.midiNumberToNote = function(midiNumber, noteSet) {
    var octave = Math.floor(midiNumber / this.numberOfNotes) - this.octaveOffset;
    var root = midiNumber % this.numberOfNotes;
    return noteSet[root] + octave;
  };

  // NOTE: This function expects that note be capitalized and be
  // properly sanitized and free of errors.
  this.noteToMidiNumber = function(noteString) {
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

    var root = this.notesNatural.indexOf(note);

    return root + pitchOffset + (octave + this.octaveOffset) * this.numberOfNotes;
  };

  this.parseScaleString = function(scaleString) {
    // Remove invalid characters
    var sanitizedInput = scaleString.replace(/[^A-Ga-g0-9#, ]+/g, '');

    // Capitalize notes and lowercase flat symbols
    sanitizedInput = sanitizedInput.toUpperCase().replace(/([A-G])B+/g, '$1b');

    // Replace consecutive commas and spaces with single spaces
    sanitizedInput = sanitizedInput.replace(/[,\s]+/g, ' ');

    return sanitizedInput.split(' ');
  };

  this.checkOctaveNumbers = function(notes) {
    var hasOctaveNumbers = /\d/.test(notes[0]);

    if (hasOctaveNumbers) {
      return notes;
    }
    else {
      var currentOctave = this.defaultNonBPitch;
      var notesAtOctave = [];

      if (notes[0] === "B") {
        currentOctave = this.defaultBPitch;
      }

      for (var i = 0; i < notes.length; i++) {
        var note = notes[i];

        if (notesAtOctave.indexOf(note) !== -1) {
          currentOctave += 1;
          notesAtOctave = [];
        }

        notes[i] = note + currentOctave.toString();
        notesAtOctave.push(note);
      }

      return notes;
    }
  };

  this.scaleStringToMidiNumbers = function(scaleString) {
    var scale = this.parseScaleString(scaleString);
    scale = this.checkOctaveNumbers(scale);
    var numbers = [];

    for (var i = 0; i < scale.length; i++) {
      numbers.push(this.noteToMidiNumber(scale[i]));
    }

    return numbers;
  };

  this.transposeMidiNumbers = function(numbers, offset) {
    var result = [];

    for (var i = 0; i < numbers.length; i++) {
      result[i] = numbers[i] + offset;
    }

    return result;
  };

  this.midiNumbersToScaleString = function(midiNumbers, noteSet) {
    var result = [];

    for (var i = 0; i < midiNumbers.length; i++) {
      result[i] = this.midiNumberToNote(midiNumbers[i], noteSet);
    }

    return result.join(", ");
  };

  this.checkOctaveRange = function(midiNumbers) {
    // If first midi number is greater than 58 (A#)
    // Subtract 12 (octave) from all notes
    // TODO: Replace magic number
    console.log("midiNumbers", midiNumbers);
    if (midiNumbers[0] > 58) {
      for (var i = 0; i < midiNumbers.length; i++) {
        midiNumbers[i] -= this.numberOfNotes;
      }
    }

    return midiNumbers;
  };

  this.transposedScales = function(scaleString, noteSet) {
    var numbers = this.scaleStringToMidiNumbers(scaleString);
    var scales = [];
    var transposedScaleNumbers = [];
    var scaleNumbersTransposed;
    var scaleTransposed;

    for (var i = 0; i < this.numberOfNotes; i++) {
      scaleNumbersTransposed = this.transposeMidiNumbers(numbers, i);
      scaleNumbersTransposed = this.checkOctaveRange(scaleNumbersTransposed);

      transposedScaleNumbers.push(scaleNumbersTransposed);
    }

    transposedScaleNumbers.sort();

    for (i = 0; i < transposedScaleNumbers.length; i++) {
      scaleTransposed = this.midiNumbersToScaleString(transposedScaleNumbers[i], noteSet);
      scales.push(scaleTransposed);
    }

    return scales;
  };

  this.test = function() {
    var numbers = [0, 1, 2, 3, 4, 12, 27, 48, 49, 60];
    var i;

    for (i = 0; i < numbers.length; i++) {
      var number = numbers[i];
    }

    var scale = ["C4", "C-1", "C#1", "Ebb5", "B11", "D##-1", "A", "E#"];

    for (i = 0; i < scale.length; i++) {
      var note = scale[i];
      var midiNumber = this.noteToMidiNumber(note);
    }

    console.log(this.transposedScales("C, G, C, E, G, A, B, C", this.notesSharps));
    console.log(this.transposedScales("B, F#, B, D#, F#, G#, A#, B, C#", this.notesSharps));
    console.log(this.transposedScales("C, G, G, E, G, A, B, C, D, E, F, G, A#, Bb, C", this.notesSharps));
  };
}
