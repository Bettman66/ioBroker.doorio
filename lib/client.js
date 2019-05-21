'use strict';
const net  = require('net');
const utils = require('@iobroker/adapter-core');
const tools = require(utils.controllerDir + '/lib/tools');

let roomid;

function BaresipClient(adapter) {
    if (!(this instanceof BaresipClient)) return new BaresipClient(adapter);

    let client = null;
    let connected = false;

    this.destroy = () => {
        if (client) {
            client.destroy();
            client = null;
        }
    };

    this.onStateChange = (id, state, cn) => send2Server(id, state, cn);

    function send2Server(id, state, cn) {
        if (!client) return;
    }

    (function _constructor(config) {
        adapter.log.info('Try to connect to ' + config.url);
        var client = new net.Socket();
        client.connect(config.port, config.url, function() {
            adapter.log.info('Connected');
        });

        // create connected object and state
        adapter.getObject('info.connection', (err, obj) => {
            if (!obj || !obj.common || obj.common.type !== 'boolean') {
                obj = {
                    _id: 'info.connection',
                    type: 'state',
                    common: {
                        role: 'indicator.connected',
                        name: 'If connected to Baresip',
                        type: 'boolean',
                        read: true,
                        write: false,
                        def: false
                    },
                    native: {}
                };
                adapter.setObject('info.connection', obj, () => adapter.setState('info.connection', connected, true));
            }
        });

        client.on('data', function(data) {
            adapter.log.info('Received: ' + data);
        });

        client.on('connect', () => {
            adapter.log.info('Connected to ' + config.url);
            connected = true;
            adapter.setState('info.connection', connected, true);
        });

        client.on('error', err => {
            adapter.log.error('Client error:' + err);

            if (connected) {
                adapter.log.info('Disconnected from ' + config.url);
                connected = false;
                adapter.setState('info.connection', connected, true);
            }
        });

        client.on('close', err => {
            if (connected) {
                adapter.log.info('Disconnected from ' + config.url);
                connected = false;
                adapter.setState('info.connection', connected, true);
            }
        });
    })(adapter.config);

    process.on('uncaughtException', err => adapter.log.error('uncaughtException: ' + err));

    return this;
}

module.exports = BaresipClient;
