'use strict';
require('app-module-path').addPath(__dirname);

var express = require('express');
var kraken = require('kraken-js');
var options, app;
var http = require('http');
var compression = require('compression');
var device = require('express-device');
/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
    onconfig: function(config, next) {
        /*
         * Add any additional config setup or overrides here. `config` is an initialized
         * `confit` (https://github.com/krakenjs/confit/) configuration object.
         */
        next(null, config);
    }
};

app = express();
app.use(kraken(options));
app.use(compression()); //required for gzip
app.use(device.capture());
//require('look').start();

require('lasso').configure({
    plugins: [
        'lasso-require',
        'lasso-marko',
        'lasso-less',
        'lasso-minify-css',
        'lasso-minify-js'
    ]
});

app.once('start', function() {
    console.log('Server ready');
    console.log('Application ready to serve requests.');
    console.log('Environment: %s', app.kraken.get('env:env'));

    if (process.send) {
        process.send('online');
    }
});

var server = http.createServer(app);
server.listen(process.env.PORT || 8000);
server.on('listening', function() {
    console.log('Server listening on http://localhost:%d', this.address().port);
});
