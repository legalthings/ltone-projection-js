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
        signature: null
    },
    {
        action: "veiling",
        response: "ok",
        data: {
            opbrengst: 800
        },
        signature: null
    },
    {
        action: "rechtzaak",
        response: "schuldig",
        data: {
            uitleg: "op heterdaad betraps",
            boete: 1000
        },
        signature: null
    },
    {
        action: "boete",
        response: "betaald",
        data: {
            bedrag: 200
        },
        signature: null
    },
    {
        action: "betaling_ontvangen",
        response: "ok",
        data: {
            bedrag: 200
        },
        signature: null
    }
];

const scenarioVersion = {
    actors: {
        politie: {},
        domeinen: {},
        justitie: {},
        beslagene: {}
    },
    actions: {
        inbeslagname: {
            titel: "Inbeslagname",
            actor: "politie",
            responses: {
                ok: {
                    update: {
                        "beslagene.naam": "actors.beslagene.naam",
                        "beslagene.geboortedatum": "actors.beslagene.geboortedatum",
                        "inbeslagname": "inbeslagname"
                    },
                    transition: "veiling"
                }
            }
        },
        veiling: {
            actor: "domeinen",
            responses: {
                ok: {
                    update: {
                        "opbrengst": "saldo"
                    },
                    transition: "veiling"
                }
            }
        },
        rechtzaak: {
            actor: "justitie",
            responses: {
                schuldig: {
                    update: {
                        "boete": "saldo"
                    },
                    transition: "boete"
                },
                onschuldig: {
                    transition: ":success"
                }
            }
        },
        boete: {
            actor: "beslagene",
            responses: {
                betaald: {
                    transition: "betaling_ontvangen"
                }
            }
        },
        betaling_ontvangen: {
            actor: "justitie",
            responses: {
                ok: {
                    update: {
                        "bedrag": "saldo"
                    },
                    transition: ":success"
                }
            }
        }
    }
};

const scenario = {
    getVersion: () => Promise.resolve(scenarioVersion)
};

// ----

const project = require('./project');

project(events, scenario, x => Promise.resolve(x))
    .then(projection => console.log(projection))
    .catch(err => console.log(err));
