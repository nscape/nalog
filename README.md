## Overview

Simplog is a simple logging and error handling utility using MongoDB

## Installation

    $ npm install simplog

## Usage

Require Simplog

    var Simplog = require('simplog');

Initialize Simplog using a URI

    var simpl = new Simplog();
    simpl.connect(URI, callback);

Or pass in a Mongoose instance
    
    var mongoose = require('mongoose')
    mongoose.connect('mongodb://localhost/test');

    var simpl = new Simplog(mongoose);

Log something by specifying a code and a message

    simpl.log(1001, 'wow log');

Log and return the standard Error object

    var Error = simpl.error;

    function(err, res) {
      if (err) return new Error(1002, 'so error')
    };

Set logging criteria. If a code is passed, it will be evaluated it to determine whether it will be logged or not.
    
    simpl.setCritera({
      gte: 1000,
      lte: 50,
      equal: [60, 65]
    })

Or pass options to the constructor

    var simpl = new Simplog('mongodb://localhost/test', {
      criteria: {
        gte: 1000,
        lte: 50,
        equal: [60, 65]
      }
    })

Other options:
  
    {
      console: false, // prints logs to the console
      colName: 'logs' // name of the collections logs are stored in
    }

Viewing logs

    Coming soon...


## License

Copyright (c) 2014 nscape

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
