const project   = require('./project');
const KeyChain  = require('./key-chain');
const openpgp   = require('openpgp');
const api       = require('./api.js');

const blockchain = new api();

function getProject(processAddress, myPrivateKey) {

    const process = new blockchain.Process(processAddress);
    const keychain = new KeyChain();
    let scenario;

    return Promise.all([

        process.getKeys()
            .then(keys => keys.forEach(key => {
                keychain.add(cert);
            })),
        process.getEvents(),
        process.getScenario().then(addr => new blockchain.Scenario(addr)).then(fetched => scenario = fetched)
    ])
        .then(results => {

            const decodedEvents = [];

            results[1].forEach(function(item){
                decodedEvents.push(JSON.parse(item));
            });

            return { events: decodedEvents, keys: keychain, scenario: results[2] };
    })
        .then(results => {
            return project(results.events, results.scenario, encrypted => decrypt(encrypted, keychain));
        });
}


getProject('0x252fcbb7229f4f546d62460b35de3cbf0c2ac4e2', 'my-key').catch(err => console.error(err));

//const process = new blockchain.Process('0x252fcbb7229f4f546d62460b35de3cbf0c2ac4e2');
//process.addKey(test_key_string).then(results => console.log(results));
// events.forEach(item => {
//     console.log(process.addEvent(JSON.stringify(item)));
// });


//blockchain.createScenarioContract('Inbeslagname Auto 23-10:18').then(address => console.log(address));
//const scenarioContract = new blockchain.Scenario('0x7354b8c86558b914445f7bca34a01166536f7479');
//scenarioContract.newVersion(20170101, JSON.stringify(scenario));
//blockchain.createProcessContract('0x7354b8c86558b914445f7bca34a01166536f7479').then(address => console.log('process',address));

