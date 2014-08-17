## Overview

nalog is yet another logging and error handling NodeJS utility using MongoDB

## Installation

    $ npm install nalog

## Usage

Require nalog

    var nalog = require('nalog');

Initialize nalog using a URI

    var na = new nalog('mongodb://localhost/test');
    na.connect(URI, callback);

Or create and pass in a Mongoose instance
    
    var mongoose = require('mongoose')
    mongoose.connect('mongodb://localhost/test');

    var na = new nalog(mongoose);

Log something by specifying a code and a message

    na.log(100, 'wow log'); // 

Log objects

    na.log(100, 'log object', {});
    na.log('without the code', {})
    na.log({})

Log and return the standard Error object

    var Error = na.error;

    function(err, res) {
      if (err) return Error(1002, 'so error');
    };

Set logging level criteria. If a level number is passed, it will be evaluated to determine whether to log or not.
    
    // log everything except when level = 4
    na.setCritera({
      gte: 5,
      lte: 1,
      equal: [2, 3, 4]
    });

Or pass options to the constructor
    
    var na = new nalog(mongoose, {
      criteria: {
        gte: 5,
        lte: 1,
        equal: [2, 3]
      } 
    });

Then Specify the level when logging

    na.log(500, 'this will be logged', {}, 5);
    na.log(500, 'but this will not be', {}, 4);
    na.error(500, 'levels work for errors too', 3)

Other options:
  
    {
      verbose: false // for debugging purposes, will print database level responses and errors
      console: true, // prints logs to the console, default: false
      colName: 'logs' // name of the logging collection
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
