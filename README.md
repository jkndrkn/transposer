# Transposer

Transposer is a JavaScript library that enables transposition of scales. It was developed primarily
for facilitating the design and development of melodic percussion instruments such as the steel handpan and
metal tongue drums. The concept for this tool was developed by Peter Levitov of Handpan360.

peterlevitov@gmail.com
https://www.youtube.com/user/Handpan360

## Installation

Add it to your project as follows:

```
  <head>
    ...
    <script src="transposer.js"></script>
    ...
  </head>
```

## Usage

Create a new instance of Transposer and pass in a list of notes as follows:

```
var transposer = new Transposer();
var scales = this.transposedScales("C, G, C, E, G, A, B, C", this.notesSharps);
```

`scales` will contain a list of every transposed scale for the given input argument. In this example
the first three transposed scales will look like:

```
C3, G3, C4, E4, G4, A4, B4, C5
C#3, G#3, C#4, F4, G#4, A#4, C5, C#5
D3, A3, D4, F#4, A4, B4, C#5, D5
D#3, A#3, D#4, G4, A#4, C5, D5, D#5
E3, B3, E4, G#4, B4, C#5, D#5, E5
```

These scales are given using [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation).

## Demo

Open `./index.html` in your browser to see a demo. This demo makes use of AngularJS.

## Un