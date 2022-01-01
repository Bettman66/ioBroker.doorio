/*
 *
 *      ioBroker DoorIO Adapter
 *
 *      (c) 2022 bettman66<w.zengel@gmx.de>
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
    if ((adapter.config.ring1 != "none") && (adapter.config.ring1 != '')) { adapter.subscribeForeignStates(adapter.config.ring1) };
    if ((adapter.config.ring2 != "none") && (adapter.config.ring2 != '')) { adapter.subscribeForeignStates(adapter.config.ring2) };
    if ((adapter.config.ring3 != "none") && (adapter.config.ring3 != '')) { adapter.subscribeForeignStates(adapter.config.ring3) };
    if ((adapter.config.ring4 != "none") && (adapter.config.ring4 != '')) { adapter.subscribeForeignStates(adapter.config.ring4) };
    adapter.subscribeStates('*');

    client = new Client(adapter);
}

// If started as allInOne/compact mode => return function to create instance
// @ts-ignore
if (module && module.parent) {
    module.exports = startAdapter;
} else {
    // or start the instance directly
    startAdapter();
}