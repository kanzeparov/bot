const TelegramBot = require('node-telegram-bot-api')
const config = require('./config')
const mongoose = require('mongoose')
const helper = require('./helper')
const kb = require('./keybord-buttons')
const keyboard = require('./keyboard')
const database = require('../database.json')

mongoose.connect(config.DB_URL, {
    useMongoClient: true
})
    .then(() => console.log("Mongo connected"))
    .catch((err) => console.log(err))


require('./model/subs-general')
require('./model/user')
require('./model/sub')
const SubsGeneral = mongoose.model('subgen')
const Subs = mongoose.model('sub')
const User = mongoose.model('users')

const ACTION_TYPE = {
    TOGGLE_SUB: 'ts',
    TOGGLE_RM: 'rm',
    CHANGE_PRICE: 'cp',
    NAME: 'n'
}

var newSubs = {
    name: "",
    price: 0,
    uid: "",
    category: "",
    url: "",
    date: '01.01.1990'
}

var namebool = false
var pricebool = false
var categorybool = false
var urlbool = false
var datebool = false

var changebool = false

//new Subs(newSubs).save()

//
// database.subsGeneral.forEach(f => new SubsGeneral(f).save())

helper.logStart()






//--------------------

const TOKEN = '1612733052:AAHU4wSZgX43loljo-E_4zDY_WxIIgb6nG0'

const bot = new TelegramBot(TOKEN, {
    polling: true
})

bot.on('message', (msg) => {
    //console.log(msg)
    const chatId= helper.getChatId(msg)
    console.log(newSubs)


    if(namebool) {
        console.log(msg.text)
        newSubs.name = msg.text
        namebool = false
    }

    if(pricebool) {
        console.log(msg.text)
        newSubs.price = msg.text
        pricebool = false
    }

    if(urlbool) {
        console.log(msg.text)
        newSubs.url = msg.text
        urlbool = false
    }

    if(categorybool) {
        console.log(msg.text)
        newSubs.category = msg.text
        categorybool = false
    }

    if(datebool) {
        console.log(msg.text)
        newSubs.date = msg.text
        datebool = false
    }

    if(changebool) {
        console.log(msg.text)
        try {
            newSubs.price = msg.text
        } catch (e) {
            console.log(e)
        }
        changebool = false
    }



    switch (msg.text) {
        case kb.menu.stat:
            showStatistic(chatId, msg.from.id)
            break
        case kb.home.favourite:
            showFavouriteSubs(chatId, msg.from.id)
            break
        case kb.subs.mysub:
            bot.sendMessage(chatId, 'Чтобы создать подписку необходимо:\n1. Ввести название подписки (обязательное поле) - /name' +
                '\n2. Стоимость подписки - /price\n3. Дату списания /date\n4. Категорию /category\n5. Ссылку на подписку /url', {
                reply_markup: {keyboard: keyboard.mysubs}
            })
            break
        case kb.home.subsAdd:
            bot.sendMessage(chatId, 'Выберите готовую подписку или создайте свою')

            sendFilmsByQuery(chatId, {})
            break
        case kb.film.action:

            break
        case kb.film.random:
            sendFilmsByQuery(chatId, {})
            break
        case kb.film.comedy:
            sendFilmsByQuery(chatId, {})
            break
        case kb.back:
            bot.sendMessage(chatId, 'Посчитаем подписки?', {
                reply_markup: {keyboard: keyboard.home}
            })
            break
        case kb.subs.cancel:
            bot.sendMessage(chatId, 'Посчитаем подписки', {
                reply_markup: {keyboard: keyboard.home}
            })

            setTimeout(() => {

                bot.sendMessage(chatId, 'Посчитаем подписки', {
                    reply_markup: {keyboard: keyboard.home}
                })
                newSubs.name = ""
                newSubs.price = 0
                newSubs.category = ""
                newSubs.url = ""
                newSubs.date = '01.01.1990'
                newSubs.uid = ""
            }, 3000)
            break
        case kb.subs.create:
            if (newSubs.name !== "") {


                var newsub = new Subs(newSubs).save().then(_ => {
                    console.log("Ok")
                    console.log(newsub)


                }).catch(err => console.log(err))

                let userPromise


                User.findOne({telegramId: msg.from.id})
                    .then(user => {
                        if(user) {
                            {
                                console.log(newsub)
                                user.mysubs.push(newSubs.name)
                            }
                            userPromise = user
                        } else {
                            userPromise = new User({
                                telegramId: msg.from.id,
                                mysubs: [newSubs.name]
                            })
                        }


                        userPromise.save().then(_ => {
                            console.log("ok")
                        }).catch(err => console.log(err))
                    }).catch(err => console.log(err))

                setTimeout(() => {

                    bot.sendMessage(chatId, 'Посчитаем подписки', {
                        reply_markup: {keyboard: keyboard.home}
                    })
                    newSubs.name = ""
                    newSubs.price = 0
                    newSubs.category = ""
                    newSubs.url = ""
                    newSubs.date = '01.01.1990'
                    newSubs.uid = ""
                }, 3000)





            } else {
                bot.sendMessage(chatId, 'Название не введено')
            }

            break
        case kb.subs.name_change:
            if (newSubs.price !== 0) {


                var newsub = new Subs(newSubs).save().then(_ => {
                    console.log("Ok")
                    console.log(newsub)


                }).catch(err => console.log(err))

                let userPromise


                User.findOne({telegramId: msg.from.id})
                    .then(user => {
                        if(user) {
                            {
                                console.log(newsub)
                                user.mysubs.push(newSubs.name)
                            }
                            userPromise = user
                        } else {
                            userPromise = new User({
                                telegramId: msg.from.id,
                                mysubs: [newSubs.name]
                            })
                        }


                        userPromise.save().then(_ => {
                            console.log("ok")
                        }).catch(err => console.log(err))
                    }).catch(err => console.log(err))

                setTimeout(() => {

                    bot.sendMessage(chatId, 'Посчитаем подписки', {
                        reply_markup: {keyboard: keyboard.home}
                    })
                    newSubs.name = ""
                    newSubs.price = 0
                    newSubs.category = ""
                    newSubs.url = ""
                    newSubs.date = '01.01.1990'
                    newSubs.uid = ""
                }, 3000)





            } else {
                bot.sendMessage(chatId, 'Цена не введена')
            }

            break
    }
})
//
 bot.onText(/\/name/,msg => {
     const text = `Введите название подписки`
     console.log(keyboard.home)
     bot.sendMessage(helper.getChatId(msg), text, {
         reply_markup: {keyboard: keyboard.mysubs}
     })
     namebool = true
     console.log(namebool)
 })

 bot.onText(/\/price/,msg => {
     const text = `Введите цену подписки`
     console.log(keyboard.home)
     bot.sendMessage(helper.getChatId(msg), text, {
         reply_markup: {keyboard: keyboard.mysubs}
     })
     pricebool = true
 })
 bot.onText(/\/date/,msg => {
     const text = `Введите дату последнего списания у подписки`
     console.log(keyboard.home)
     bot.sendMessage(helper.getChatId(msg), text, {
         reply_markup: {keyboard: keyboard.mysubs}
     })
     datebool = true
 })

 bot.onText(/\/category/,msg => {
     const text = `Введите категорию подписки`
     console.log(keyboard.home)
     bot.sendMessage(helper.getChatId(msg), text, {
         reply_markup: {keyboard: keyboard.mysubs}
     })
     categorybool = true
 })

 bot.onText(/\/url/,msg => {
     const text = `Введите ссылку на подписку`
     console.log(keyboard.home)
     bot.sendMessage(helper.getChatId(msg), text, {
         reply_markup: {keyboard: keyboard.mysubs}
     })
     urlbool = true
 })

bot.onText(/\/start/,msg => {
    const text = `Здравствйте, ${msg.from.first_name}\nВыберите команду для начала работы`
    console.log(keyboard.home)
    bot.sendMessage(helper.getChatId(msg), text, {
        reply_markup: {
            keyboard: keyboard.home
        }
    })
})

bot.onText(/\/s(.+)/, (msg, [source, match]) => {

    const sub_id = helper.getItem_id(source)
    const chatId = helper.getChatId(msg)

    console.log(sub_id)
    if(sub_id === 'tart') {
        return
    }

    Promise.all([
        SubsGeneral.findOne(({_id: sub_id})),
        Subs.findOne(({_id: sub_id})),
        User.findOne({telegramId: msg.from.id})
    ]).then(([sub,mysub, user]) => {

        let isFav = false



        if(user) {
            if (mysub) {
                console.log(user.mysubs.indexOf(mysub._id))
            }
            if (sub) {
                isFav = user.subs.indexOf(sub._id) !== -1
            }
        }

        if(mysub) {
            const caption = `Название: ${mysub.name}\nЦена: ${mysub.price}\nКатегория: ${mysub.category}\n`

            bot.sendMessage(chatId, caption, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Удалить',
                                callback_data: JSON.stringify({
                                    type: ACTION_TYPE.TOGGLE_RM,
                                    sub_id: mysub._id
                                })
                            }
                        ]
                    ]
                }
            })
        }

        const favText = isFav ? 'Удалить из подписок' : 'Добавить подписку'

        console.log(sub)
        if(sub) {

            const caption = `Название: ${sub.name}\nЦена: ${sub.price}\nКатегория: ${sub.category}\n`

            bot.sendPhoto(chatId, sub.url, {
                caption: caption,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: favText,
                                callback_data: JSON.stringify({
                                    type: ACTION_TYPE.TOGGLE_SUB,
                                    sub_id: sub._id,
                                    isFav: isFav
                                })
                            },
                            {
                                text: `Изменить цену - ${sub.name}`,
                                // url добавить ниже
                                callback_data: JSON.stringify({
                                    type: ACTION_TYPE.CHANGE_PRICE,
                                    sub_id: sub._id
                                })
                            }
                        ]
                    ]
                }
            })
        }
    })

})

bot.on('callback_query', query => {
    const userId = query.from.id
    let data

    try {
        data = JSON.parse(query.data)
    } catch (e) {
        throw new Error('Data is not an object')
    }

    const { type } = data
    if (type === ACTION_TYPE.TOGGLE_SUB) {
        toggleFavouriteSub(userId, query.id, data)
    }

    if (type === ACTION_TYPE.CHANGE_PRICE) {
        console.log("change price")
        changePriceSub(userId, query.id, data)
    }

    if (type === ACTION_TYPE.TOGGLE_RM) {
        toggleDelete(userId, query.id, data)
    }

    console.log(query.data)
})

bot.on('inline_query', query => {
    SubsGeneral.find({}).then(subs => {
        const results = subs.map(s => {
            const caption = `Название: ${s.name}\nЦена: ${s.price}\nКатегория: ${s.category}\n@rtref_bot`

            return {
                id: s._id,
                type: 'photo',
                photo_url: s.url,
                thumb_url: s.url,
                // type: 'article',
                // title: s.name,
                // input_message_content: {
                //     message_text: s.name + '\n@rtref_bot'
                // },
                caption: caption,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: `Ссылка на отписаться`,
                                callback_data: s.unsub
                            }
                        ]
                    ]
                }
            }
        })

        bot.answerInlineQuery(query.id, results, {
            cache_time: 0
        })
    })
})

function sendFilmsByQuery(chatId, query) {
    SubsGeneral.find(query).then(subs => {
        console.log(subs)

        const html = subs.map((s, i) => {
            return `<b>${i + 1}</b> ${s.name} - /s${s._id}`
        }).join('\n')

        //html += 'Создать свою подписку - /newsubscription'

        sendHTML(chatId, html, 'subs')
    })
}

function sendHTML(chatId, html, kbName = null) {
    const options = {
        parse_mode: 'HTML'
    }

    if (kbName) {
        options['reply_markup'] = {
            keyboard: keyboard[kbName]
        }
    }

    bot.sendMessage(chatId, html, options)
}

function changePriceSub(userId, queryId, {sub_id}) {
    let userPromise

    console.log(sub_id)

    sendHTML(userId, 'Введите цену в рублях', 'changePrice')
    changebool = true


    Promise.all([
        User.findOne({telegramId: userId})
        ,
        SubsGeneral.findOne(({_id: sub_id}))
    ])
        .then(([user, sub])=> {

            console.log(user)
            console.log(sub)

            newSubs.name = sub.name
            newSubs.category = sub.category
            newSubs.date = sub.date

            if(newSubs.price !== 0) {
                console.log(newSubs.price)

                var newsub = new Subs(newSubs).save().then(_ => {
                    console.log("Ok")
                    console.log(newsub)


                }).catch(err => console.log(err))


                if (user) {
                    {
                        console.log(newsub)
                        user.mysubs.push(newSubs.name)
                    }
                    userPromise = user
                } else {
                    userPromise = new User({
                        telegramId: msg.from.id,
                        mysubs: [newSubs.name]
                    })
                }


                userPromise.save().then(_ => {
                    console.log("ok")
                }).catch(err => console.log(err))


                setTimeout(() => {

                    bot.sendMessage(user, 'Посчитаем подписки', {
                        reply_markup: {keyboard: keyboard.home}
                    })
                    newSubs.name = ""
                    newSubs.price = 0
                    newSubs.category = ""
                    newSubs.url = ""
                    newSubs.date = '01.01.1990'
                    newSubs.uid = ""
                    changebool = false
                }, 3000)
            }
        }).catch(err => console.log(err))

}

function toggleFavouriteSub(userId, queryId, {sub_id, isFav}) {
    let userPromise

    User.findOne({telegramId: userId})
        .then(user => {
            if(user) {
                if(isFav) {
                    user.subs = user.subs.filter(sUuid => sUuid !== sub_id)
                } else {
                    user.subs.push(sub_id)
                }
                userPromise = user
            } else {
                userPromise = new User({
                    telegramId: userId,
                    subs: [sub_id]
                })
            }

            const  answerText = isFav ? 'Удалено' : 'Добавлено'

            userPromise.save().then(_ => {
                bot.answerCallbackQuery({
                    callback_query_id: queryId,
                    text: answerText
                })
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
}

function showStatistic(chatId, telegramId) {
    console.log("statistic")
    User.findOne({telegramId})
        .then(user => {
            console.log(user)
            if(user) {
                Promise.all([
                    SubsGeneral.find(({_id: {'$in': user.subs}}))
                    ,
                    Subs.find(({name: {'$in': user.mysubs}}))
                ])
                    .then(([subgeneral, sub])=> {
                        console.log(subgeneral.length)
                        console.log(sub.length)
                        let html = ''
                        let sumgen = 0;
                        let summy = 0;
                        let sum = 0;

                        if (subgeneral.length) {
                            html += 'Общие подписки: \n'
                            html += subgeneral.map((s, i) => {
                                return `<b>${i+1}</b> ${s.name} - <b>${s.price}</b> (/s${s._id})`
                            }).join('\n')
                            html += '\n'
                            sumgen = subgeneral.reduce((acc, val) => {
                                return acc + val.price
                            },0)
                            html += 'Сумма общих подписок - ' + sumgen + '\n\n'
                            console.log(sumgen)
                            sum += sumgen
                        }
                        if (sub.length) {
                            html += 'Мои подписки: \n'
                            html += sub.map((s, i) => {
                                return `<b>${i+1}</b> ${s.name} - <b>${s.price}</b> (/s${s._id})`
                            }).join('\n')
                            summy = sub.reduce((acc, val) => {
                                return acc + val.price
                            },0)
                            html += '\nСумма моих подписок - ' + summy + '\n'
                            console.log(summy)
                            sum += summy
                        }

                        if (sum !== 0) {
                            html += '\nОбщая ежемесячная сумма подписок: ' + sum + '\n'
                        }

                        // if(sub.length) {
                        //     html += sub.map((s, i) => {
                        //         return `<b>${i+1}</b> ${s.name} - <b>${s.price}</b> (/s${s._id})`
                        //     }).join('\n')
                        // }
                        if(sub.length === 0 && subgeneral.length === 0) {
                            html = 'Вы пока ничего не добавили!'
                        }

                        sendHTML(chatId, html, 'menu_sub')
                    }).catch(e => console.log(e))
            } else {
                sendHTML(chatId, 'Вы пока ничего не добавили!!', 'menu_sub')
            }
        }).catch(e => console.log(e))
}

function showFavouriteSubs(chatId, telegramId) {
    console.log("favourite")
    User.findOne({telegramId})
        .then(user => {
            console.log(user)
            if(user) {
                 Promise.all([
                    SubsGeneral.find(({_id: {'$in': user.subs}}))
                        ,
                     Subs.find(({name: {'$in': user.mysubs}}))
                ])
            .then(([subgeneral, sub])=> {
                    console.log(subgeneral.length)
                    console.log(sub.length)
                    let html = ''

                    if (subgeneral.length) {
                        html += 'Общие подписки: \n'
                        html += subgeneral.map((s, i) => {
                            return `<b>${i+1}</b> ${s.name} - <b>${s.price}</b> (/s${s._id})`
                        }).join('\n')
                        html += '\n'
                    }
                    if (sub.length) {
                        html += 'Мои подписки: \n'
                        html += sub.map((s, i) => {
                            return `<b>${i+1}</b> ${s.name} - <b>${s.price}</b> (/s${s._id})`
                        }).join('\n')
                    }
                    // if(sub.length) {
                    //     html += sub.map((s, i) => {
                    //         return `<b>${i+1}</b> ${s.name} - <b>${s.price}</b> (/s${s._id})`
                    //     }).join('\n')
                    // }
                    if(sub.length === 0 && subgeneral.length === 0) {
                        html = 'Вы пока ничего не добавили!'
                    }

                    sendHTML(chatId, html, 'menu_sub')
                }).catch(e => console.log(e))
            } else {
                sendHTML(chatId, 'Вы пока ничего не добавили!!', 'menu_sub')
            }
        }).catch(e => console.log(e))
}

function toggleDelete(userId, queryId, {sub_id}) {
    let userPromise

    Promise.all([
        User.findOne({telegramId: userId})
        ,
        Subs.findOne(({_id: sub_id}))
    ])
        .then(([user, sub])=> {

                user.mysubs = user.mysubs.filter(sUuid => sUuid !== sub.name)
                userPromise = user




            const  answerText = 'Удалено'

            userPromise.save().then(_ => {
                bot.answerCallbackQuery({
                    callback_query_id: queryId,
                    text: answerText
                })
            }).catch(err => console.log(err))

            Subs.findOneAndRemove({_id: sub_id}, function(err){ console.log(err)});
        }).catch(err => console.log(err))


}
