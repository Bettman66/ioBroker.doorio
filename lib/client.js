'use strict';
const net  = require('net');
const utils = require('@iobroker/adapter-core');
const tools = require(utils.controllerDir + '/lib/tools');
const Netstring = require('netstring-stream');

function BaresipClient(adapter) {
    if (!(this instanceof BaresipClient)) return new BaresipClient(adapter);

    let client = null;
    let connected = false;
	let dtmf = '';
	let call = '';
	
    this.destroy = () => {
        if (client) {
            client.destroy();
            client = null;
        }
    };

    this.onStateChange = (id, state) => send2Server(id, state);

    function send2Server(id, state) {
		if ((!client) || (!connected) || (!state.val)) return;	
		adapter.log.info('stateChange ' + id + ': ' + JSON.stringify(state));
        switch (id) {
            case (adapter.config.ring1) :
                client.write(Netstring.write('{"command":"dial","params":"' + adapter.config.number1 + '"}'));
				call = '1';
                break;
            case (adapter.config.ring2) :
                client.write(Netstring.write('{"command":"dial","params":"' + adapter.config.number2 + '"}'));
				call = '2';
                break;
            case (adapter.config.ring3) :
                client.write(Netstring.write('{"command":"dial","params":"' + adapter.config.number3 + '"}'));
				call = '3';
                break;
            case (adapter.config.ring4) :
                client.write(Netstring.write('{"command":"dial","params":"' + adapter.config.number4 + '"}'));
				call = '4';
                break;
        }
    }

    (function _constructor(config) {
        client = new net.Socket();
        client.connect(config.port, config.url, () => {});
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
            try {
				adapter.log.debug(data);
                adapter.log.debug('Netstring : ' + Netstring.read(data));
                var jsonContent = JSON.parse(Netstring.read(data));
				switch (jsonContent.type) {
				case ('REGISTER_OK') :
				    adapter.log.info('REGISTER_OK');
				    break;
				case ('REGISTER_FAIL') :
				
				    break;
                case ('CALL_DTMF_END') :
				    adapter.log.info('CALL_DTMF_END');
				    break;
                case ('CALL_DTMF_START') :
					if (dtmf.length == 0) {
						const timeout = setTimeout(() => {
							dtmf = "";
							adapter.log.info('DTMF Timeout');
						}, 5000);
					}	
					dtmf = dtmf + jsonContent.param;
					adapter.log.info('CALL_DTMF_START : ' + dtmf);				
					switch (call) {
					case '1' :
						if (dtmf == adapter.config.dtmf11) {
							adapter.setForeignState(adapter.config.out11, true);
							const out11 = setTimeout(() => {
								adapter.setForeignState(adapter.config.out11, false);
							}, adapter.config.time11 * 1000);
						} else if (dtmf == adapter.config.dtmf12) {
							adapter.setForeignState(adapter.config.out12, true);
							const out12 = setTimeout(() => {
								adapter.setForeignState(adapter.config.out12, false);
							}, adapter.config.time12 * 1000);
						} else if (dtmf == adapter.config.dtmf13) {
							adapter.setForeignState(adapter.config.out13, true);
							const out13 = setTimeout(() => {
								adapter.setForeignState(adapter.config.out13, false);
							}, adapter.config.time13 * 1000);
						} else if (dtmf == adapter.config.dtmf14) {
							adapter.setForeignState(adapter.config.out14, true);
							const out14 = setTimeout(() => {
								adapter.setForeignState(adapter.config.out14, false);
							}, adapter.config.time14 * 1000);
						}
						break;
					case '1' :
						if (dtmf == adapter.config.dtmf21) {
							adapter.setForeignState(adapter.config.out21, true);
							const out21 = setTimeout(() => {
								adapter.setForeignState(adapter.config.out21, false);
							}, adapter.config.time21 * 1000);
						} else if (dtmf == adapter.config.dtmf12) {
							adapter.setForeignState(adapter.config.out22, true);
							const out22 = setTimeout(() => {
								adapter.setForeignState(adapter.config.out22, false);
							}, adapter.config.time22 * 1000);
						} else if (dtmf == adapter.config.dtmf13) {
							adapter.setForeignState(adapter.config.out23, true);
							const out23 = setTimeout(() => {
								adapter.setForeignState(adapter.config.out23, false);
							}, adapter.config.time23 * 1000);
						} else if (dtmf == adapter.config.dtmf14) {
							adapter.setForeignState(adapter.config.out24, true);
							const out24 = setTimeout(() => {
								adapter.setForeignState(adapter.config.out24, false);
							}, adapter.config.time24 * 1000);
						}
						break;
					case '1' :
						if (dtmf == adapter.config.dtmf31) {
							adapter.setForeignState(adapter.config.out31, true);
							const out31 = setTimeout(() => {
								adapter.setForeignState(adapter.config.out31, false);
							}, adapter.config.time31 * 1000);
						} else if (dtmf == adapter.config.dtmf32) {
							adapter.setForeignState(adapter.config.out32, true);
							const out32 = setTimeout(() => {
								adapter.setForeignState(adapter.config.out32, false);
							}, adapter.config.time32 * 1000);
						} else if (dtmf == adapter.config.dtmf33) {
							adapter.setForeignState(adapter.config.out33, true);
							const out33 = setTimeout(() => {
								adapter.setForeignState(adapter.config.out33, false);
							}, adapter.config.time33 * 1000);
						} else if (dtmf == adapter.config.dtmf34) {
							adapter.setForeignState(adapter.config.out34, true);
							const out34 = setTimeout(() => {
								adapter.setForeignState(adapter.config.out34, false);
							}, adapter.config.time34 * 1000);
						}
						break;
					case '4' :
						if (dtmf == adapter.config.dtmf41) {
							adapter.setForeignState(adapter.config.out41, true);
							const out41 = setTimeout(() => {
								adapter.setForeignState(adapter.config.out41, false);
							}, adapter.config.time41 * 1000);
						} else if (dtmf == adapter.config.dtmf42) {
							adapter.setForeignState(adapter.config.out42, true);
							const out42 = setTimeout(() => {
								adapter.setForeignState(adapter.config.out42, false);
							}, adapter.config.time42 * 1000);
						} else if (dtmf == adapter.config.dtmf43) {
							adapter.setForeignState(adapter.config.out43, true);
							const out43 = setTimeout(() => {
								adapter.setForeignState(adapter.config.out43, false);
							}, adapter.config.time43 * 1000);
						} else if (dtmf == adapter.config.dtmf44) {
							adapter.setForeignState(adapter.config.out44, true);
							const out44 = setTimeout(() => {
								adapter.setForeignState(adapter.config.out44, false);
							}, adapter.config.time44 * 1000);
						}
						break;	
					}			    
				    break;
                case ('CALL_ESTABLISHED') :
				    adapter.log.info('CALL_ESTABLISHED');
				    break;
                case ('CALL_CLOSED') :
					dtmf = '';
				    adapter.log.info('CALL_CLOSED');
				    break;          					
				}
            } catch(e) {
                adapter.log.debug(e);
            }
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
