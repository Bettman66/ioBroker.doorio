const expect = require('chai').expect;
const setup  = require('./lib/setup');

let objects = null;
let states  = null;
let onStateChanged = null;
const onObjectChanged = null;
const hostname = require('os').hostname();

function checkConnectionOfAdapter(cb, counter) {
    counter = counter || 0;
    if (counter > 20) {
        cb && cb('Cannot check connection');
        return;
    }

    states.getState('system.adapter.doorio.0.alive', (err, state) => {
        if (err) console.error(err);
        if (state && state.val) {
            cb && cb();
        } else {
            setTimeout(() => checkConnectionOfAdapter(cb, counter + 1), 1000);
        }
    });
}

function checkValueOfState(id, value, cb, counter) {
    counter = counter || 0;
    if (counter > 20) {
        cb && cb('Cannot check value Of State ' + id);
        return;
    }

    states.getState(id, (err, state) => {
        if (err) console.error(err);
        if (value === null && !state) {
            cb && cb();
        } else
        if (state && (value === undefined || state.val === value)) {
            cb && cb();
        } else {
            setTimeout(() => checkValueOfState(id, value, cb, counter + 1), 500);
        }
    });
}

describe('Test DoorIO', function () {
    before('Test DoorIO: Start js-controller', function (_done) {
        this.timeout(600000); // because of first install from npm

        setup.setupController(() => {
            const config = setup.getAdapterConfig();
            // enable adapter
            config.common.enabled  = true;
            config.common.loglevel = 'debug';

            config.native.devices = [
                {
                    name: 'localhost',
                    ip:   '127.0.0.1',
                    room: ''
                }
            ];

            setup.setAdapterConfig(config.common, config.native);

            setup.startController(
                true,
                (id, obj) => onObjectChanged && onObjectChanged(id, obj),
                (id, state) => onStateChanged && onStateChanged(id, state),
            (_objects, _states) => {
                objects = _objects;
                states  = _states;
                states.subscribe('*');
                _done();
            });
        });
    });

    it('Test DoorIO: Check if adapter started', done => {
        checkConnectionOfAdapter(done);
    }).timeout(5000);

    after('Test DoorIO: Stop js-controller', function (done) {
        this.timeout(6000);

        setup.stopController(normalTerminated => {
            console.log('Adapter normal terminated: ' + normalTerminated);
            done();
        });
    });
});
