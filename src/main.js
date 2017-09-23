const project   = require('./project');
const KeyChain  = require('./key-chain');
const NodeRSA   = require('node-rsa');
const api       = require('./api.js');

const blockchain = new api();

const events = [
    {
        action: "inbeslagname",
        response: "ok",
        data: {
            beslagene: {
                naam: "Arnold Daniels",
                geboortedatum: "1981-08-22"
            },
            inbeslagname: {
                type: "auto",
                kenteken: "40-XPH-4"
            }
        },
        signature: null,
        scenarioVersion: "20170101"
    },
    {
        action: "veiling",
        response: "ok",
        data: {
            opbrengst: 800
        },
        signature: null,
        scenarioVersion: "20170101"
    },
    {
        action: "rechtzaak",
        response: "schuldig",
        data: {
            uitleg: "op heterdaad betraps",
            boete: 1000
        },
        signature: null,
        scenarioVersion: "20170101"
    },
    {
        action: "boete",
        response: "betaald",
        data: {
            bedrag: 200
        },
        signature: null,
        scenarioVersion: "20170101"
    },
    {
        action: "betaling_ontvangen",
        response: "ok",
        data: {
            bedrag: 200
        },
        signature: null,
        scenarioVersion: "20170101"
    }
];

var test_key_string = '-----BEGIN RSA PRIVATE KEY-----\n'+
    'MIIBOQIBAAJAVY6quuzCwyOWzymJ7C4zXjeV/232wt2ZgJZ1kHzjI73wnhQ3WQcL\n'+
    'DFCSoi2lPUW8/zspk0qWvPdtp6Jg5Lu7hwIDAQABAkBEws9mQahZ6r1mq2zEm3D/\n'+
    'VM9BpV//xtd6p/G+eRCYBT2qshGx42ucdgZCYJptFoW+HEx/jtzWe74yK6jGIkWJ\n'+
    'AiEAoNAMsPqwWwTyjDZCo9iKvfIQvd3MWnmtFmjiHoPtjx0CIQCIMypAEEkZuQUi\n'+
    'pMoreJrOlLJWdc0bfhzNAJjxsTv/8wIgQG0ZqI3GubBxu9rBOAM5EoA4VNjXVigJ\n'+
    'QEEk1jTkp8ECIQCHhsoq90mWM/p9L5cQzLDWkTYoPI49Ji+Iemi2T5MRqwIgQl07\n'+
    'Es+KCn25OKXR/FJ5fu6A6A+MptABL3r8SEjlpLc=\n'+
    '-----END RSA PRIVATE KEY-----';

var test_key = new NodeRSA(test_key_string);
console.log(test_key.generateKeyPair());

function decryptJson(key, encryptedContent) {

    try {
        return key.decrypt(encryptedContent, 'json');
    } catch (err) {
        return null;
    }
}

function decrypt(encryptedContent, keys) {

    if(!Array.isArray(keys)) {
        keys = [keys];
    }
    var decrypted = [];

    return keys.reduce((decrypted, key) => decrypted || decryptJson(key, encryptedContent), null);
}

function getProject(processAddress, myPrivateKey) {

    const process = new blockchain.Process(processAddress);
    const keychain = new KeyChain();

    return Promise.all([

        process.getKeys()
            .then(keys => keys.forEach(key => {
                const cert = decrypt(key, myPrivateKey);
                if (cert) {
                    keychain.add(cert);
                }
            })),
        process.getEvents(),
        process.getScenario().then(addr => new blockchain.Scenario(addr)).then(fetched => scenario = fetched)
    ])
        .then(results => {

            const encryptedEvents = results[1];
            const events = encryptedEvents.map(encryptedEvent => decrypt(encryptedEvent, keychain));

            return { events, keys: keychain, scenario: results[2] };
    })
        .then(results => {

            console.log(results, keychain);

            //return project(results.events, results.scenario, encrypted => decrypt(encrypted, keychain));
        });
}

getProject('0xf1d3c12c9d4a83829fefd23a7dea8b105cca4f13', test_key).catch(err => console.error(err))

//const process = new blockchain.Process('0xf1d3c12c9d4a83829fefd23a7dea8b105cca4f13');
//process.addKey(test_key_string).then(results => console.log(results));
// events.forEach(item => {
//     process.addEvent(test_key.encrypt(item, 'base64'), test_key);
// });


//blockchain.createScenarioContract('Inbeslagname Auto 21:11').then(address => console.log(address));
//blockchain.createProcessContract('0x48237acca13d0069a78f567aeb35e029e29d2108').then(address => console.log('process',address));

