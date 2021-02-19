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
    changePrice: [
        [kb.subs.name_change],
        [kb.subs.cancel]
    ],
    action_add: [
        kb.action.add
    ],
    action_remove: [
        kb.action.remove
    ],
    menu_sub: [
        [kb.menu.stat],
        [kb.back]
    ]
}