'use strict';
const net = require('net');
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
		adapter.log.debug('stateChange ' + id + ': ' + JSON.stringify(state));
		switch (id) {
			case (adapter.config.ring1):
				adapter.setState('CALL_1', true, true);
				client.write(Netstring.write('{"command":"dial","params":"' + adapter.config.number1 + '"}'));
				call = '1';
				break;
			case (adapter.config.ring2):
				adapter.setState('CALL_2', true, true);
				client.write(Netstring.write('{"command":"dial","params":"' + adapter.config.number2 + '"}'));
				call = '2';
				break;
			case (adapter.config.ring3):
				adapter.setState('CALL_3', true, true);
				client.write(Netstring.write('{"command":"dial","params":"' + adapter.config.number3 + '"}'));
				call = '3';
				break;
			case (adapter.config.ring4):
				adapter.setState('CALL_4', true, true);
				client.write(Netstring.write('{"command":"dial","params":"' + adapter.config.number4 + '"}'));
				call = '4';
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
				var jsonContent = JSON.parse(Netstring.read(data));
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
							const timeout = setTimeout(() => {
								dtmf = "";
								adapter.log.debug('DTMF Timeout');
							}, 5000);
						}
						var ch = jsonContent.param;
						ch = ch.toString('utf8');
						if (ch != "\u0004") dtmf = dtmf + ch;
						adapter.log.debug('CALL_DTMF_START : ' + dtmf);
						switch (call) {
							case '1':
								if (dtmf == adapter.config.dtmf11) {
									adapter.setForeignState(adapter.config.out11, true);
									adapter.setState('DTMF_1_1', true, true);
									const out11 = setTimeout(() => {
										adapter.setForeignState(adapter.config.out11, false);
										adapter.setState('DTMF_1_1', false, true);
									}, adapter.config.time11 * 1000);
								} else if (dtmf == adapter.config.dtmf12) {
									adapter.setForeignState(adapter.config.out12, true);
									adapter.setState('DTMF_1_2', true, true);
									const out12 = setTimeout(() => {
										adapter.setForeignState(adapter.config.out12, false);
										adapter.setState('DTMF_1_2', false, true);
									}, adapter.config.time12 * 1000);
								} else if (dtmf == adapter.config.dtmf13) {
									adapter.setForeignState(adapter.config.out13, true);
									adapter.setState('DTMF_1_3', true, true);
									const out13 = setTimeout(() => {
										adapter.setForeignState(adapter.config.out13, false);
										adapter.setState('DTMF_1_3', false, true);
									}, adapter.config.time13 * 1000);
								} else if (dtmf == adapter.config.dtmf14) {
									adapter.setForeignState(adapter.config.out14, true);
									adapter.setState('DTMF_1_4', true, true);
									const out14 = setTimeout(() => {
										adapter.setForeignState(adapter.config.out14, false);
										adapter.setState('DTMF_1_4', false, true);
									}, adapter.config.time14 * 1000);
								}
								break;
							case '2':
								if (dtmf == adapter.config.dtmf21) {
									adapter.setForeignState(adapter.config.out21, true);
									adapter.setState('DTMF_2_1', true, true);
									const out21 = setTimeout(() => {
										adapter.setForeignState(adapter.config.out21, false);
										adapter.setState('DTMF_2_1', false, true);
									}, adapter.config.time21 * 1000);
								} else if (dtmf == adapter.config.dtmf22) {
									adapter.setForeignState(adapter.config.out22, true);
									adapter.setState('DTMF_2_2', true, true);
									const out22 = setTimeout(() => {
										adapter.setForeignState(adapter.config.out22, false);
										adapter.setState('DTMF_2_2', false, true);
									}, adapter.config.time22 * 1000);
								} else if (dtmf == adapter.config.dtmf23) {
									adapter.setForeignState(adapter.config.out23, true);
									adapter.setState('DTMF_2_3', true, true);
									const out23 = setTimeout(() => {
										adapter.setForeignState(adapter.config.out23, false);
										adapter.setState('DTMF_2_3', false, true);
									}, adapter.config.time23 * 1000);
								} else if (dtmf == adapter.config.dtmf24) {
									adapter.setForeignState(adapter.config.out24, true);
									adapter.setState('DTMF_2_4', true, true);
									const out24 = setTimeout(() => {
										adapter.setForeignState(adapter.config.out24, false);
										adapter.setState('DTMF_2_4', false, true);
									}, adapter.config.time24 * 1000);
								}
								break;
							case '3':
								if (dtmf == adapter.config.dtmf31) {
									adapter.setForeignState(adapter.config.out31, true);
									adapter.setState('DTMF_3_1', true, true);
									const out31 = setTimeout(() => {
										adapter.setForeignState(adapter.config.out31, false);
										adapter.setState('DTMF_3_1', false, true);
									}, adapter.config.time31 * 1000);
								} else if (dtmf == adapter.config.dtmf32) {
									adapter.setForeignState(adapter.config.out32, true);
									adapter.setState('DTMF_3_2', true, true);
									const out32 = setTimeout(() => {
										adapter.setForeignState(adapter.config.out32, false);
										adapter.setState('DTMF_3_2', false, true);
									}, adapter.config.time32 * 1000);
								} else if (dtmf == adapter.config.dtmf33) {
									adapter.setForeignState(adapter.config.out33, true);
									adapter.setState('DTMF_3_3', true, true);
									const out33 = setTimeout(() => {
										adapter.setForeignState(adapter.config.out33, false);
										adapter.setState('DTMF_3_3', false, true);
									}, adapter.config.time33 * 1000);
								} else if (dtmf == adapter.config.dtmf34) {
									adapter.setForeignState(adapter.config.out34, true);
									adapter.setState('DTMF_3_4', true, true);
									const out34 = setTimeout(() => {
										adapter.setForeignState(adapter.config.out34, false);
										adapter.setState('DTMF_3_4', false, true);
									}, adapter.config.time34 * 1000);
								}
								break;
							case '4':
								if (dtmf == adapter.config.dtmf41) {
									adapter.setForeignState(adapter.config.out41, true);
									adapter.setState('DTMF_4_1', true, true);
									const out41 = setTimeout(() => {
										adapter.setForeignState(adapter.config.out41, false);
										adapter.setState('DTMF_4_1', false, true);
									}, adapter.config.time41 * 1000);
								} else if (dtmf == adapter.config.dtmf42) {
									adapter.setForeignState(adapter.config.out42, true);
									adapter.setState('DTMF_4_2', true, true);
									const out42 = setTimeout(() => {
										adapter.setForeignState(adapter.config.out42, false);
										adapter.setState('DTMF_4_2', false, true);
									}, adapter.config.time42 * 1000);
								} else if (dtmf == adapter.config.dtmf43) {
									adapter.setForeignState(adapter.config.out43, true);
									adapter.setState('DTMF_4_3', true, true);
									const out43 = setTimeout(() => {
										adapter.setForeignState(adapter.config.out43, false);
										adapter.setState('DTMF_4_3', false, true);
									}, adapter.config.time43 * 1000);
								} else if (dtmf == adapter.config.dtmf44) {
									adapter.setForeignState(adapter.config.out44, true);
									adapter.setState('DTMF_4_4', true, true);
									const out44 = setTimeout(() => {
										adapter.setForeignState(adapter.config.out44, false);
										adapter.setState('DTMF_4_4', false, true);
									}, adapter.config.time44 * 1000);
								}
								break;
						}
						break;
					case ('CALL_ESTABLISHED'):
						adapter.setState('CALL_ACTIVE', true, true);
						adapter.log.debug('CALL_ESTABLISHED');
						break;
					case ('CALL_CLOSED'):
						dtmf = '';
						adapter.setState('CALL_1', false, true);
						adapter.setState('CALL_2', false, true);
						adapter.setState('CALL_3', false, true);
						adapter.setState('CALL_4', false, true);
						adapter.setState('CALL_ACTIVE', false, true);
						adapter.log.debug('CALL_CLOSED');
						break;
				}
			} catch (e) {
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
			const reconnect0 = setTimeout(() => { _constructor(config) }, 10000);
		});

		client.on('close', err => {
			if (connected) {
				adapter.log.info('Disconnected from ' + config.url);
				connected = false;
				adapter.setState('info.connection', connected, true);
				const reconnect1 = setTimeout(() => { _constructor(config) }, 10000);
			}
		});
	})(adapter.config);

	process.on('uncaughtException', err => adapter.log.error('uncaughtException: ' + err));

	return this;
}

module.exports = BaresipClient;
