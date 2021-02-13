const kb = require('./keybord-buttons')

module.exports = {
    home: [
        [kb.home.subsAdd],
        [kb.home.favourite]
    ],
    films: [
        [kb.film.random],
        [kb.film.action, kb.film.comedy],
        [kb.back]
    ],
    subs: [
        [kb.subs.mysub],
        [kb.back]
    ],
    mysubs: [
        [kb.subs.create],
        [kb.subs.cancel]
    ],
    action_add: [
        kb.action.add
    ],
    action_remove: [
        kb.action.remove
    ]
}