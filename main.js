/*
 *
 *      ioBroker DoorIO Adapter
 *
 *      (c) 2020 bettman66<w.zengel@gmx.de>
 *
 *      MIT License
 *
 */

'use strict';

const utils = require('@iobroker/adapter-core'); // Get common adapter utils
const adapterName = require('./package.json').name.split('.').pop();
const Client      = require('./lib/client');
let   client      = null;
let adapter;

function startAdapter(options) {
    options = options || {};
    Object.assign(options, { name: adapterName });

    adapter = new utils.Adapter(options);

    adapter.on('ready', function () {
        main();
    });

    adapter.on('unload', function (callback) {
        if (client) client.destroy();
        callback();
    });

    adapter.on('stateChange', (id, state) => {
        client.onStateChange(id, state);
    });
    return adapter;
}

function main() {
    adapter.subscribeForeignStates(adapter.config.ring1 + '*');
    adapter.subscribeForeignStates(adapter.config.ring2 + '*');
    adapter.subscribeForeignStates(adapter.config.ring3 + '*');
    adapter.subscribeForeignStates(adapter.config.ring4 + '*');
    adapter.subscribeStates('*');

    adapter.setObjectNotExists(adapter.namespace + '.REGISTER_OK', {
        type: 'state',
        common: {
            name: 'REGISTER_OK',
            desc: 'Sipphone Registered',
            type: 'boolean',
            role: 'state',
            read: true,
            write: false
        },
        native: {}
    });

    adapter.setObjectNotExists(adapter.namespace + '.CALL_ACTIVE', {
        type: 'state',
        common: {
            name: 'CALL_ACTIVE',
            desc: 'Call is active',
            type: 'boolean',
            role: 'state',
            read: true,
            write: false
        },
        native: {}
    });

    adapter.setObjectNotExists(adapter.namespace + '.CALL_CLOSED', {
        type: 'state',
        common: {
            name: 'CALL_CLOSED',
            desc: 'Call is closed',
            type: 'boolean',
            role: 'state',
            read: true,
            write: false
        },
        native: {}
    });

    adapter.setObjectNotExists(adapter.namespace + '.CALL_ESTABLISHED', {
        type: 'state',
        common: {
            name: 'CALL_ESTABLISHED',
            desc: 'Call is established',
            type: 'boolean',
            role: 'state',
            read: true,
            write: false
        },
        native: {}
    });

    adapter.setObjectNotExists(adapter.namespace + '.CALL_1', {
        type: 'state',
        common: {
            name: 'CALL_1',
            desc: 'Call 1',
            type: 'boolean',
            role: 'state',
            read: true,
            write: false
        },
        native: {}
    });

    adapter.setObjectNotExists(adapter.namespace + '.CALL_2', {
        type: 'state',
        common: {
            name: 'CALL_2',
            desc: 'Call 2',
            type: 'boolean',
            role: 'state',
            read: true,
            write: false
        },
        native: {}
    });

    adapter.setObjectNotExists(adapter.namespace + '.CALL_3', {
        type: 'state',
        common: {
            name: 'CALL_3',
            desc: 'Call 3',
            type: 'boolean',
            role: 'state',
            read: true,
            write: false
        },
        native: {}
    });

    adapter.setObjectNotExists(adapter.namespace + '.CALL_4', {
        type: 'state',
        common: {
            name: 'CALL_4',
            desc: 'Call 4',
            type: 'boolean',
            role: 'state',
            read: true,
            write: false
        },
        native: {}
    });

    adapter.setObjectNotExists(adapter.namespace + '.DTMF_1', {
        type: 'state',
        common: {
            name: 'DTMF_1',
            desc: '',
            type: 'boolean',
            role: 'state',
            read: true,
            write: false
        },
        native: {}
    });

    adapter.setObjectNotExists(adapter.namespace + '.DTMF_2', {
        type: 'state',
        common: {
            name: 'DTMF_2',
            desc: '',
            type: 'boolean',
            role: 'state',
            read: true,
            write: false
        },
        native: {}
    });

    adapter.setObjectNotExists(adapter.namespace + '.DTMF_3', {
        type: 'state',
        common: {
            name: 'DTMF_3',
            desc: '',
            type: 'boolean',
            role: 'state',
            read: true,
            write: false
        },
        native: {}
    });

    adapter.setObjectNotExists(adapter.namespace + '.DTMF_4', {
        type: 'state',
        common: {
            name: 'DTMF_4',
            desc: '',
            type: 'boolean',
            role: 'state',
            read: true,
            write: false
        },
        native: {}
    });

    client = new Client(adapter);
}

// If started as allInOne/compact mode => return function to create instance
if (module && module.parent) {
    module.exports = startAdapter;
} else {
    // or start the instance directly
    startAdapter();
}
