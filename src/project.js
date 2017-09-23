var KeyChain = require('./key-chain');
var dottie = require('dottie');

function project(events, scenario, decrypt, notify = () => {}) {
    const projection = {};
    let signatureKeys;
    
    function loadActors() {
        return scenario.getVersion(events[events.length - 1].version)
            .then(scenarioVersion => {
                projection.actors = scenarioVersion.actors;
            })
            .then(() => { signatureKeys = loadSignatureKeys(); });
    }
    
    function applyEvents() {
        projection.events = events;
        
        return events.reduce((previous, event) => {
            return previous
                .then(() => projectEvent(event))
                .then(() => notify(projection))
        }, Promise.resolve());
    }
    
    function calculateCurrent() {
        projection.current = {};
    }
    
    function projectEvent(event) {
        let action; 
        
        return getAction(event)
            .then(found => {
                if (!found) {
                    return Promise.reject(`Action not found ${event.action}`)
                }
                action = found;
            })
            .then(() => signatureKeys.get(action.actor.signature))
            .then(signatureCert => verifySignature(event.signature, signatureCert))
            .then(() => decrypt(event.data))
            .then(data => {
                data && updateProjection(action.responses[event.response].update, data);
                event.data = data;
            })
    }
    
    function getAction(event) {
        return scenario.getVersion(event.version)
            .then(scenario => {
                return scenario.actions[event.action]
            })
            .then(action => {
                if (action) {
                    action.actor = projection.actors[action.actor];
                }
                
                return action;
            });
    }
    
    function verifySignature(signature, signatureCert) {
        
    }
    
    function updateProjection(update, data) {
        if (typeof update === 'string') {
            dottie.set(projection, update, value);
        } else if (typeof update === 'object') {
            for (const from in update) {
                const to = update[from];
                const value = dottie.get(data, from);

                dottie.set(projection, to, value);
            }
        }
    }

    function loadSignatureKeys() {
        const chain = new KeyChain();
        
        /*for (const key in projection.actors) {
            const signatureUri = projection.actors[key].signature;
            
            if (signatureUri) {
                chain.addByUri(signatureUri);
            }
        }*/
        
        return chain;
    }
    
    return loadActors()
        .then(applyEvents)
        .then(calculateCurrent)
        .then(() => projection);
}

module.exports = project;
