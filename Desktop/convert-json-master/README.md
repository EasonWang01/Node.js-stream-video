# Convert JSON

[![Build Status](https://travis-ci.org/DataGarage/convert-json.svg?branch=master)](https://travis-ci.org/DataGarage/convert-json)

A collection of converting multiple formats of files to JSON.

## Support

- csv, tsv, dsv.. (using `stream`)
- xlsx (using `readFile`)
- xls (using `readFile`)
- xml (using `readFile`)

## Install

```
npm install convert-json
```
## Usage

### CSV

```javascript
var cv2json = require('../');

var csv_trans = cv2json.csv('./test/test.csv', options /* optional */, function(err, result) {
  if(err)
    console.error(err);
  else 
    console.log(result);
    // result should be a json object or array.
})
```

The first argument is a csv input file, for options see details https://github.com/chilijung/CSVstream#options-csvstreamoptions, and the last argument is a callback function.

### XLS

```javascript
var cv2json = require('../');

var csv_trans = cv2json.xls('./test/test.xls', options /* optional */, function(err, result) {
  if(err)
    console.error(err);
  else 
    console.log(result);
    // result should be a json object or array.
})
```

The first argument is a xls input file, for options see details https://github.com/SheetJS/js-xls#parsing-options, and the last argument is a callback function.

### XLSX

```javascript
var cv2json = require('../');

var csv_trans = cv2json.xlsx('./test/test.xlsx', options /* optional */, function(err, result) {
  if(err)
    console.error(err);
  else 
    console.log(result);
    // result should be a json object or array.
})
```

The first argument is a xlsx input file, for options see details https://github.com/SheetJS/js-xlsx#parsing-options, and the last argument is a callback function.

### XML

```javascript
var cv2json = require('../');

var csv_trans = cv2json.xml('./test/test.xml', options /* optional */, function(err, result) {
  if(err)
    console.error(err);
  else 
    console.log(result);
    // result should be a json object or array.
})
```

The first argument is a xml input file, for options see details https://github.com/Leonidas-from-XIV/node-xml2js#options, and the last argument is a callback function.


## Library using

- csv
  
https://github.com/chilijung/csvstream

- xlsx

https://github.com/SheetJS/js-xlsx

- xls

https://github.com/SheetJS/js-xls

- xml

https://github.com/Leonidas-from-XIV/node-xml2js

## License

MIT 
