const project   = require('./project');
const KeyChain  = require('./key-chain');
const openpgp   = require('openpgp');
const api       = require('./api.js');

const blockchain = new api();

// const scenario = {
//     "title": "Inbeslagname",
//     "actors": {
//         "politie": {
//             "title": "Politie"
//         },
//         "forensisch_opsporingsteam": {
//             "title": "Forensisch opsporingsteam"
//         },
//         "officier_van_justitie": {
//             "title": "Officier van Justitie"
//         },
//         "beslag_coordinator": {
//             "title": "Beslag coördinator (OM)"
//         },
//         "bewaarder": {
//             "title": "Bewaarder"
//         },
//         "digi": {
//             "title": "Digi"
//         },
//         "beslagene": {
//             "title": "Beslagene"
//         },
//         "ketenbeslaghuis": {
//             "title": "Ketenbeslaghuis"
//         }
//     },
//     "start": "registratie",
//     "actions": {
//         "registratie": {
//             "definition": "registration",
//             "title": "Registratie van beslag",
//             "actor": "politie",
//             "responses": {
//                 "ok": {
//                     "transition": "bewaarder_transport",
//                     "update": "item"
//                 }
//             }
//         },
//         "bewaarder_transport": {
//             "definition": "acknowlegde",
//             "title": "De bewaarder heeft het object is ontvangen",
//             "actor": "bewaarder",
//             "responses": {
//                 "ok": {
//                     "transition": "ketenbeslaghuis_ontvangst"
//                 }
//             }
//         },
//         "ketenbeslaghuis_ontvangst": {
//             "definition": "acknowlegde",
//             "title": "Het ketenhuis heeft het object ontvangen",
//             "actor": "ketenbeslaghuis",
//             "responses": {
//                 "ok": {
//                     "label": "Ontvangen",
//                     "transition": "ketenbeslaghuis_onderzoeksresultaten"
//                 }
//             }
//         },
//         "ketenbeslaghuis_onderzoeksresultaten": {
//             "definition": "document",
//             "title": "Onderzoek ketenbeslaghuis",
//             "actor": "ketenbeslaghuis",
//             "responses": {
//                 "ok": {
//                     "transition": "besluit_openbaar_ministerie",
//                     "update": "onderzoeksresultaten.ketenbeslaghuis"
//                 },
//                 "error": {
//                     "transition": ":failed"
//                 }
//             }
//         },
//         "forensisch_opsporingsteam_ontvangst": {
//             "definition": "acknowledge",
//             "title": "Het forensisch opsporingsteam heeft het object ontvangen",
//             "actor": "forensisch_opsporingsteam",
//             "responses": {
//                 "ok": {
//                     "transition": "forensisch_onderzoeksresultaten"
//                 }
//             }
//         },
//         "forensisch_onderzoeksresultaten": {
//             "definition": "document",
//             "title": "Forensisch onderzoek",
//             "actor": "forensisch_opsporingsteam",
//             "responses": {
//                 "ok": {
//                     "transition": "besluit_officier_van_justitie",
//                     "update": "onderzoeksresultaten.forensisch_opsporingsteam"
//                 }
//             }
//         },
//         "besluit_officier_van_justitie": {
//             "definition": "choice",
//             "title": "De officier van justitie maakt een besluit tot gevolgen met betrekking tot goed",
//             "actor": "officier_van_justitie",
//             "responses": {
//                 "ok": {
//                     "transition": "trigger_response_main_process",
//                     "update": "besluit"
//                 },
//                 "onttrekking": {
//                     "transition": "onttrekking_ontvangst",
//                     "update": "besluit"
//                 },
//                 "research": {
//                     "transition": "digi_ontvangst",
//                     "update": "besluit"
//                 }
//             }
//         },
//         "digi_ontvangst": {
//             "definition": "acknowledge",
//             "description": "Digi heeft het object ontvangen",
//             "actor": "ketenbeslaghuis",
//             "responses": {
//                 "ok": {
//                     "transition": "digi_voltooid"
//                 }
//             }
//         },
//         "digi_voltooid": {
//             "definition": "acknowledge",
//             "title": "Digi procedure",
//             "description": "Digi procedure is voltooid",
//             "actor": "digi",
//             "responses": {
//                 "ok": {
//                     "transition": "besluit_officier_van_justitie"
//                 }
//             }
//         },
//         "onttrekking_ontvangst": {
//             "definition": "acknowledge",
//             "title": "Bevestig ontvangst door Officier van Justitie",
//             "actor": "forensisch_opsporingsteam",
//             "responses": {
//                 "ok": {
//                     "transition": "onttrekking"
//                 }
//             }
//         },
//         "onttrekking": {
//             "definition": "acknowledge",
//             "title": "Het object is vernietigd",
//             "actor": "forensisch_opsporingsteam",
//             "responses": {
//                 "ok": {
//                     "transition": ":success"
//                 }
//             }
//         },
//         "besluit_openbaar_ministerie": {
//             "definition": "choice",
//             "title": "Het openbaar ministerie maakt een besluit tot gevolgen met betrekking tot goed",
//             "actor": "beslag_coordinator",
//             "responses": {
//                 "ok": {
//                     "transition": "teruggave",
//                     "update": "besluit"
//                 },
//                 "vervreemden": {
//                     "transition": "berricht_vervreemden",
//                     "update": "besluit"
//                 }
//             },
//             "display": true
//         },
//         "berricht_vervreemden": {
//             "title": "De beslagene is bericht van vervreemding",
//             "responses": {
//                 "ok": {
//                     "transition": "taxatie"
//                 }
//             },
//             "display": true
//         },
//         "taxatie": {
//             "definition": "document",
//             "title": "Taxatie",
//             "actor": "bewaarder",
//             "responses": {
//                 "ok": {
//                     "transition": "mogelijkheid_terugkoop",
//                     "update": {
//                         "select": "taxatie"
//                     }
//                 }
//             }
//         },
//         "mogelijkheid_terugkoop": {
//             "definition": "choice",
//             "title": "De beslagene krijg de mogelijkheid het goed terug te kopen voor de taxatiewaarde",
//             "actor": "beslagene",
//             "timeout": "14d",
//             "responses": {
//                 "ok": {
//                     "transition": "betaling_terugkoop"
//                 },
//                 "veilen": {
//                     "transition": "veilen"
//                 },
//                 "time": {
//                     "transition": "veilen"
//                 }
//             }
//         },
//         "betaling_terugkoop": {
//             "definition": "payment",
//             "title": "De beslagene heeft betaald voor terugkoop",
//             "actor": "beslagene",
//             "timeout": "3d",
//             "responses": {
//                 "ok": {
//                     "transition": "teruggave",
//                     "update": "verkoop"
//                 },
//                 "timeout": {
//                     "transition": "veilen"
//                 }
//             }
//         },
//         "teruggave": {
//             "definition": "acknowledge",
//             "title": "Ontvangst teruggave",
//             "description": "Bevestiging van ontvangst van goed door beslagene",
//             "internal_description": "Bevestig dat u het goed heeft ontvangen",
//             "actor": "beslagene",
//             "responses": {
//                 "ok": {
//                     "label": "Bevestigen",
//                     "transition": ":success"
//                 }
//             },
//             "display": true
//         },
//         "veilen": {
//             "definition": "document",
//             "title": "Veiling van het goed",
//             "actor": "bewaarder",
//             "responses": {
//                 "ok": {
//                     "transition": "overdracht",
//                     "update": {
//                         "select": "veiling"
//                     }
//                 },
//                 "error": {
//                     "transition": ":failed"
//                 }
//             }
//         },
//         "overdracht": {
//             "definition": "acknowledge",
//             "title": "Bevestiging van overdracht van goed",
//             "actor": "bewaarder",
//             "responses": {
//                 "ok": {
//                     "label": "Bevestigen",
//                     "transition": ":success"
//                 }
//             }
//         }
//     }
// }
// const events = [
//     {
//         action: "registratie",
//         response: "ok",
//         data: {
//             beslagene: {
//                 naam: "Arnold Daniels",
//                 geboortedatum: "1981-08-22"
//             },
//             inbeslagname: {
//                 type: "auto",
//                 kenteken: "40-XPH-4"
//             }
//         },
//         signature: null,
//         version: "20170101"
//     },
//     {
//         action: "veiling",
//         response: "ok",
//         data: {
//             opbrengst: 800
//         },
//         signature: null,
//         version: "20170101"
//     },
//     {
//         action: "rechtzaak",
//         response: "schuldig",
//         data: {
//             uitleg: "op heterdaad betraps",
//             boete: 1000
//         },
//         signature: null,
//         version: "20170101"
//     },
//     {
//         action: "boete",
//         response: "betaald",
//         data: {
//             bedrag: 200
//         },
//         signature: null,
//         version: "20170101"
//     },
//     {
//         action: "betaling_ontvangen",
//         response: "ok",
//         data: {
//             bedrag: 200
//         },
//         signature: null,
//         version: "20170101"
//     }
// ];

// var pubkey = '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
//     'Version: BCPG C# v1.6.1.0\n' +
//     '\n' +
//     'mQENBFnGDPEBCACGKtAs3UEg8/3e8uKNhSU3w9PlZtU9xmkFPvLqBNATkQWMZ7GN\n' +
//     '99wctMIooMnvjJPzF2MHBh6DaO/WzT550V1uiTFn825miU0Sl57cGLMlFLG1X3QW\n' +
//     '8Y5h1IbQ/5HfZ8CKzvOhpK9SC0l3y60wnNl8XCFv3wtu3DuelR8E7xi0yge9u1T9\n' +
//     '1S6rinJ3t28xTT+lMYp8jdSeUrlVuEPlu6TytSbn2DYX3onPnMtRqXwxiSPthfvE\n' +
//     '+JB3rNwvchSoDCdggdqn1lAe6S6DBRf2qBJSeeykiKZJZ0ZXu/vUyJ7YGZNAe+Qe\n' +
//     'kXkL1k/Ly/UUxGoJPQ5XwU2WlORC08+x1b3XABEBAAG0AIkBHAQQAQIABgUCWcYM\n' +
//     '8QAKCRCFnsdjZtfA3u36B/9DjIvne/ZB+8juvEY7UOh4xSSrTy6O9CEm6QG4Ccdp\n' +
//     'pVvVuk4LwE+96V0fiPosK0bmVYxn+elpOrUszTPVeREb2733XgcuBXyEz3ZGAgQ5\n' +
//     '2uHjP2Pxil8TT5BSomigIt18vZ/HBvVZsAPDHkhsfNBovhcg+aevrgsfsoArJfss\n' +
//     'OHaMbJog+YamyYh9/o6z250f0RlUeqLz4dR16rAaDtpLLRvMAIjZBOae7welVwTM\n' +
//     'fmJruToDsjSWYJwZToVXoVh++7TP0pl1ylVgO19Ck46/duKrBujvhG8gZADXs4z1\n' +
//     'Ini5NzC6Yyxmzg18I0hw1l+5y2LUO5Z/esn6TsCS57II\n' +
//     '=KV9B\n' +
//     '-----END PGP PUBLIC KEY BLOCK-----';
// var privkey = '-----BEGIN PGP PRIVATE KEY BLOCK-----\n' +
//     'Version: BCPG C# v1.6.1.0\n' +
//     '\n' +
//     'lQOsBFnGDPEBCACGKtAs3UEg8/3e8uKNhSU3w9PlZtU9xmkFPvLqBNATkQWMZ7GN\n' +
//     '99wctMIooMnvjJPzF2MHBh6DaO/WzT550V1uiTFn825miU0Sl57cGLMlFLG1X3QW\n' +
//     '8Y5h1IbQ/5HfZ8CKzvOhpK9SC0l3y60wnNl8XCFv3wtu3DuelR8E7xi0yge9u1T9\n' +
//     '1S6rinJ3t28xTT+lMYp8jdSeUrlVuEPlu6TytSbn2DYX3onPnMtRqXwxiSPthfvE\n' +
//     '+JB3rNwvchSoDCdggdqn1lAe6S6DBRf2qBJSeeykiKZJZ0ZXu/vUyJ7YGZNAe+Qe\n' +
//     'kXkL1k/Ly/UUxGoJPQ5XwU2WlORC08+x1b3XABEBAAH/AwMC+SXiipDqfNhgNkyW\n' +
//     'DLDTNCEevZfy3k0VuL/OXpVj5sxUC6frRWo62yi4EvTtzjJSVpKKBxM8ROJCT1Cj\n' +
//     'ZPNwyy5GDVESoe92fxCLfd1ic10ZCn+eflsZtEK8f2rK7w3pzPTv6KmeattwTHFR\n' +
//     '6jSO6OtfnLR7rydq3ibpv4PuSUxsqBIPKMEHTTPYlU/ihRT+X36mvkX0Zoc6y+Pk\n' +
//     'Rk9TTqm1mkvC2U2cx7ngO99ujfCfwvpOZY3+oZkD8liVWfRBYKD0zHLa7iQE9mCv\n' +
//     '1kEfkxDtb6sQBMHIaK8m7KsyDcwiqsemKfTiHIad7J09WKFyBU5T1zsnrNNYyLaJ\n' +
//     'OWYKdKbR4UGNr9WP7ZCE2tAB2g+uZzxCSvJ5aPdE4IJJ1UIqpKUaWGQaciYYlVSs\n' +
//     'vWEf5+TMHrydYbrM2BR0SlptJdJa8HeFMQJKCOPCjF16GdT2wqgYua53lmfz7uiG\n' +
//     'BzJi3qj1uvkCJ3Fa2Qc3rZg0PQivUa98HA5Gs/fsK0MlZL6cTdlNfW29q3H+pQf7\n' +
//     'lSgMhsLRd9+EfspJRjc8Wp9L4KEIXPGsbaAIjQ4Y4+fuxxMdE9DmrsGbbnhucDRM\n' +
//     'd930ZI48zLRcUfICD1PL4pz0qAZgWJzPlcBcs2YZL0X+dxS68h4oe9kWaHVdK0Xx\n' +
//     'WP1pF3XaYTpjtWM0pSXVLTig45iyzVzSymG2dTf98FKM1LbLRyJRXWzLPw57vjT5\n' +
//     'Q3KAoJo/xj33Pdti0cKJYiShYBCKS05CF8xYcvme+i8KkTK9u/W+lcnd7a92HsNy\n' +
//     '4/an5eu5cYo+zugVKtK7uKLFgr453V4Hu1hCjw/laSFd30MiXplD8HfAl6ZpQlGg\n' +
//     '6NhtCuwRrSPV80GKmMuoWixnG8k3hTEMCpR8WVGKTbQAiQEcBBABAgAGBQJZxgzx\n' +
//     'AAoJEIWex2Nm18De7foH/0OMi+d79kH7yO68RjtQ6HjFJKtPLo70ISbpAbgJx2ml\n' +
//     'W9W6TgvAT73pXR+I+iwrRuZVjGf56Wk6tSzNM9V5ERvbvfdeBy4FfITPdkYCBDna\n' +
//     '4eM/Y/GKXxNPkFKiaKAi3Xy9n8cG9VmwA8MeSGx80Gi+FyD5p6+uCx+ygCsl+yw4\n' +
//     'doxsmiD5hqbJiH3+jrPbnR/RGVR6ovPh1HXqsBoO2kstG8wAiNkE5p7vB6VXBMx+\n' +
//     'Ymu5OgOyNJZgnBlOhVehWH77tM/SmXXKVWA7X0KTjr924qsG6O+EbyBkANezjPUi\n' +
//     'eLk3MLpjLGbODXwjSHDWX7nLYtQ7ln96yfpOwJLnsgg=\n' +
//     '=RchF\n' +
//     '-----END PGP PRIVATE KEY BLOCK-----';
//
// var passphrase = 'secret passphrase'; //what the privKey is encrypted with
//
// var privKeyObj = openpgp.key.readArmored(privkey).keys[0];
// privKeyObj.decrypt(passphrase);
//
//
// function decryptJson(key, encryptedContent) {
//
//     try {
//         return key.decrypt(encryptedContent, 'json');
//     } catch (err) {
//         return null;
//     }
// }
//
// function decrypt(encryptedContent, keys) {
//
//     console.log(encryptedContent);
//     if(!Array.isArray(keys)) {
//         keys = [keys];
//     }
//     var decrypted = [];
//
//     keys.forEach(function(key, content){
//
//         // decrypted[key] = openpgp.decrypt({
//         //     data: content,
//         //     privateKeys: privKeyObj
//         // });
//     });
//
//     return Promise.all(decrypted);
//
//     return keys.reduce((decrypted, key) => decrypted || decryptJson(key, encryptedContent), null);
// }

function getProject(processAddress, myPrivateKey) {

    const process = new blockchain.Process(processAddress);
    const keychain = new KeyChain();
    let scenario;

    return Promise.all([

        process.getKeys()
            .then(keys => keys.forEach(key => {
                // decrypt(key, myPrivateKey).then(function(cert) {
                //     if (cert) {
                //         keychain.add(cert);
                //     }
                // });

            })),
        process.getEvents(),
        process.getScenario().then(addr => new blockchain.Scenario(addr)).then(fetched => scenario = fetched)
    ])
        .then(results => {

            //const encryptedEvents = results[1];
            //const events = encryptedEvents.map(encryptedEvent => decrypt(encryptedEvent, keychain));
            const decodedEvents = [];
            results[1].forEach(function(item){
                decodedEvents.push(JSON.parse(item));
            });

            return { events: decodedEvents, keys: keychain, scenario: results[2] };
    })
        .then(results => {

            //return console.log(results.events, results.scenario, results.keys);
        //console.log(results.events);
            return project(results.events, results.scenario, encrypted => decrypt(encrypted, keychain));
        });
}

// options = {
//     data: 'contract-key-string',                      // input as String (or Uint8Array)
//     publicKeys: openpgp.key.readArmored(pubkey).keys,  // for encryption
// };

// openpgp.encrypt(options).then(function(ciphertext) {
//     //console.log(ciphertext.data); // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
//     const process = new blockchain.Process('0xf1d3c12c9d4a83829fefd23a7dea8b105cca4f13');
//     process.addKey(ciphertext.data).then(results => console.log(results));
//     console.log(ciphertext.data);
// }).catch(function(error) {
//     console.error(error);
// });

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

