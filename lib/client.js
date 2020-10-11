'use strict';
const net = require('net');
const Netstring = require('netstring-stream');

function BaresipClient(adapter) {
    if (!(this instanceof BaresipClient)) return new BaresipClient(adapter);

    let client = null;
    let connected = false;
    let dtmf = '';
    let tout;
    let tout1;
    let tout2;
    let tout_dtmf;
    let tout_error;
    let tout_close;

    this.destroy = () => {
        if (client) {
            clearTimeout(tout);
            clearTimeout(tout1);
            clearTimeout(tout2);
            clearTimeout(tout_dtmf);
            clearTimeout(tout_error);
            clearTimeout(tout_close);
            tout = null;
            tout1 = null;
            tout2 = null;
            tout_dtmf = null;
            tout_error = null;
            tout_close = null;
            client.destroy();
            client = null;
        }
    };

    this.onStateChange = (id, state) => send2Server(id, state);

    function send2Server(id, state) {
        if ((!client) || (!connected) || (!state.val)) return;
        adapter.log.debug('stateChange ' + id + ': ' + JSON.stringify(state));
        switch (id) {
            case (adapter.config.ring1):
                adapter.setState('CALL_1', true, true);
                adapter.getState('detour1', function (err, state) {
                    if (state.val) { client.write(Netstring.write('{"command":"dial","params":"' + adapter.config.number1b + '"}')) }
                    else { client.write(Netstring.write('{"command":"dial","params":"' + adapter.config.number1 + '"}')) };
                });
                break;
            case (adapter.config.ring2):
                adapter.setState('CALL_2', true, true);
                adapter.getState('detour2', function (err, state) {
                    if (state.val) { client.write(Netstring.write('{"command":"dial","params":"' + adapter.config.number2b + '"}')) }
                    else { client.write(Netstring.write('{"command":"dial","params":"' + adapter.config.number2 + '"}')) };
                });
                break;
            case (adapter.config.ring3):
                adapter.setState('CALL_3', true, true);
                adapter.getState('detour3', function (err, state) {
                    if (state.val) { client.write(Netstring.write('{"command":"dial","params":"' + adapter.config.number3b + '"}')) }
                    else { client.write(Netstring.write('{"command":"dial","params":"' + adapter.config.number3 + '"}')) };
                });
                break;
            case (adapter.config.ring4):
                adapter.setState('CALL_4', true, true);
                adapter.getState('detour4', function (err, state) {
                    if (state.val) { client.write(Netstring.write('{"command":"dial","params":"' + adapter.config.number4b + '"}')) }
                    else { client.write(Netstring.write('{"command":"dial","params":"' + adapter.config.number4 + '"}')) };
                });
                break;
        }
    }

    (function _constructor(config) {
        client = new net.Socket();
        client.connect(config.port, config.url, () => { });
        client.setKeepAlive(true, 30000);
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

        client.on('data', function (data) {
            try {
                adapter.log.debug(data);
                adapter.log.debug('Netstring : ' + Netstring.read(data));
                const jsonContent = JSON.parse(Netstring.read(data));
                let ch = jsonContent.param;
                switch (jsonContent.type) {
                    case ('REGISTER_OK'):
                        adapter.setState('REGISTER_OK', true, true);
                        break;
                    case ('REGISTER_FAIL'):
                        adapter.setState('REGISTER_OK', false, true);
                        break;
                    case ('CALL_DTMF_END'):
                        adapter.log.debug('CALL_DTMF_END');
                        break;
                    case ('CALL_DTMF_START'):
                        if (dtmf.length == 0) {
                            tout_dtmf = setTimeout(() => {
                                tout_dtmf = null;
                                dtmf = '';
                                adapter.log.debug('DTMF Timeout');
                            }, 5000);
                        }
                        ch = ch.toString('utf8');
                        if (ch != '\u0004') dtmf = dtmf + ch;
                        adapter.log.debug('CALL_DTMF_START : ' + dtmf);
                        if (dtmf == adapter.config.dtmf1) {
                            adapter.setForeignState(adapter.config.out1, true);
                            adapter.setState('DTMF_1', true, true);
                            clearTimeout(tout);
                            tout = setTimeout(() => {
                                tout = null;
                                adapter.setForeignState(adapter.config.out1, false, true);
                                adapter.setState('DTMF_1', false, true);
                            }, adapter.config.time1 * 1000);
                        } else if (dtmf == adapter.config.dtmf2) {
                            adapter.setForeignState(adapter.config.out2, true);
                            adapter.setState('DTMF_2', true, true);
                            clearTimeout(tout);
                            tout = setTimeout(() => {
                                tout = null;
                                adapter.setForeignState(adapter.config.out2, false, true);
                                adapter.setState('DTMF_2', false, true);
                            }, adapter.config.time2 * 1000);
                        } else if (dtmf == adapter.config.dtmf3) {
                            adapter.setForeignState(adapter.config.out3, true);
                            adapter.setState('DTMF_3', true, true);
                            clearTimeout(tout);
                            tout = setTimeout(() => {
                                tout = null;
                                adapter.setForeignState(adapter.config.out3, false, true);
                                adapter.setState('DTMF_3', false, true);
                            }, adapter.config.time3 * 1000);
                        } else if (dtmf == adapter.config.dtmf4) {
                            adapter.setForeignState(adapter.config.out4, true);
                            adapter.setState('DTMF_4', true, true);
                            clearTimeout(tout);
                            tout = setTimeout(() => {
                                tout = null;
                                adapter.setForeignState(adapter.config.out4, false, true);
                                adapter.setState('DTMF_4', false, true);
                            }, adapter.config.time4 * 1000);
                        }
                        break;
                    case ('CALL_ESTABLISHED'):
                        adapter.setForeignState(adapter.config.call_active, true, true);
                        adapter.setState('CALL_ACTIVE', true, true);
                        adapter.setForeignState(adapter.config.call_established, true, true);
                        adapter.setState('CALL_ESTABLISHED', true, true);
                        adapter.log.debug('CALL_ESTABLISHED');
                        clearTimeout(tout1);
                        tout1 = setTimeout(() => {
                            tout1 = null;
                            adapter.setForeignState(adapter.config.call_established, false, true);
                            adapter.setState('CALL_ESTABLISHED', false, true);
                        }, 1000);
                        break;
                    case ('CALL_CLOSED'):
                        dtmf = '';
                        adapter.setState('CALL_1', false, true);
                        adapter.setState('CALL_2', false, true);
                        adapter.setState('CALL_3', false, true);
                        adapter.setState('CALL_4', false, true);
                        adapter.setForeignState(adapter.config.call_active, false, true);
                        adapter.setState('CALL_ACTIVE', false, true);
                        adapter.setForeignState(adapter.config.call_closed, true, true);
                        adapter.setState('CALL_CLOSED', true, true);
                        adapter.setState('CALLING_NUMBER', 'none', true);
                        adapter.log.debug('CALL_CLOSED');
                        clearTimeout(tout2);
                        tout2 = setTimeout(() => {
                            tout2 = null;
                            adapter.setForeignState(adapter.config.call_closed, false, true);
                            adapter.setState('CALL_CLOSED', false, true);
                        }, 1000);
                        break;
                    case ('CALL_INCOMING'):
                        let callerID = jsonContent.peeruri;
                        var pos = callerID.indexOf(":");
                        if (pos >= 0){
                            callerID = callerID.substring(pos + 1);
                        }
                        pos = callerID.indexOf("@");
                        if (pos >= 0){
                            callerID = callerID.substring(0, pos - 1);
                        }
                        adapter.log.debug('incoming call from:' + callerID);
                        adapter.setStateAsync('CALLING_NUMBER', callerID, true);
                        //let inWL = adapter.getStateAsync('whitelist.EVERY_NUMBER');
                        //adapter.log.debug('Answer every call:' + inWL);

                        adapter.getState('whitelist.EVERY_NUMBER', function (err, state) {
                            let inWL = state.val;
                            adapter.log.debug('Answer every call:' + inWL);
                            if (inWL){
                                adapter.log.debug('picking up call');
                                //client.write(Netstring.write('{"command":"accept","params":""}'));
                            }else{
                                adapter.getState('whitelist.NUMBER_1', function (err, state) {
                                    let stateswl = state.val;
                                    const statee = await this.getStateAsync('CALLING_NUMBER');
                                    var callerID = statee.val;

                                    if (callerID.indexOf(stateswl) >= 0) {
                                        adapter.log.debug('picking up call');
                                        //client.write(Netstring.write('{"command":"accept","params":""}'));
                                    }else{
                                        adapter.log.debug('ignoring call');
                                    };
                                });
                            }


                        });
                      //  adapter.log.debug('Answer every call:' + inWL);
/*
                        var stateswl = "";
                        adapter.getState('whitelist.NUMBER_1', function (err, state) {
                            stateswl = state.val;
                        });
                        if (callerID.indexOf(stateswl) >= 0) {
                          inWL = true;
                        }

                        let stateswl = adapter.getStateAsync('whitelist.NUMBER_1').val;
                        if (callerID.indexOf(stateswl) >= 0) {
                          inWL = true;
                        }
                        stateswl = adapter.getStateAsync('whitelist.NUMBER_2').val;
                        if (callerID.indexOf(stateswl) >= 0) {
                          inWL = true;
                        }
                        stateswl = adapter.getStateAsync('whitelist.NUMBER_3').val;
                        if (callerID.indexOf(stateswl) >= 0) {
                          inWL = true;
                        }
                        stateswl = adapter.getStateAsync('whitelist.NUMBER_4').val;
                        if (callerID.indexOf(stateswl) >= 0) {
                          inWL = true;
                        }

                        if (inWL){
                            adapter.log.debug('picking up call');
                          //client.write(Netstring.write('{"command":"","params":"''"}'}'));
                        }else{
                            adapter.log.debug('ignoring call');
                        }
*/
                      break;
                }
            } catch (err) {
                adapter.log.debug(err);
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
            tout_error = setTimeout(() => {
                tout_error = null;
                _constructor(config);
            }, 10000);
        });

        client.on('close', () => {
            if (connected) {
                adapter.log.info('Disconnected from ' + config.url);
                connected = false;
                adapter.setState('info.connection', connected, true);
                tout_close = setTimeout(() => {
                    tout_close = null;
                    _constructor(config);
                }, 10000);
            }
        });
    })(adapter.config);

    process.on('uncaughtException', err => adapter.log.error('uncaughtException: ' + err));

    return this;
}

module.exports = BaresipClient;
