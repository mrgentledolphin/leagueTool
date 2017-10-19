const express = require('express')
const request = require('request')
const GoogleImages = require('google-images')

const google = new GoogleImages('000402205720418894190:gkqwcqc1lau', 'AIzaSyDbUxf_K0K0Q0aDWq9iLHYH0LflJu7SaDs')
const api = 'api_key=RGAPI-b5526745-c829-4869-9103-67d73c5043fb'
let champions 

request('https://euw1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/20673206?' + api + '', function(error, response, body) {
    champions = body
})

express()
    .use(express.static(__dirname + '/views'))
    .set('view engine', 'hjs')

    .get('/', (req, res) => {
        res.render('index')
    })

    .post('/res', (req, res, next) => {
        let name = req.params.name
        let go = 0
        

        request('https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' +name+ '?' + api + '', function(error, response, body) {
            console.log(body)
            
            let player = JSON.parse(body)
            console.log(name)
            res.render('result', {
                player,
                title: 'profile',
                id: player.accountId
            })

        })


    })

    .get('/img/:src', (req, res) => {
        let image = req.params.src
        google.search(image+'square')
            .then((img) => {
                res.send(img)
                if(img[0].width == 120){
                    console.log('ok')
                }
            })
    })

    .get('/match/:id', (req, res) => {
        let playerId = req.params.id

        request('https://euw1.api.riotgames.com/lol/match/v3/matchlists/by-account/' + playerId + '?' + api, function(error, response, body){
            let parsed = JSON.parse(body)
            console.log(parsed.matches)
            let match = parsed.matches
            res.render('match', {
                match
            })
        })
    })

    .get('/gameInfo/:gameId', (req, res) => {
        let gameId = req.params.gameId

        request('https://euw1.api.riotgames.com/lol/match/v3/matches/'+ gameId + '?' + api, function(error, response,body){
            let parsed = JSON.parse(body)
            let teams = parsed.teams
            res.render('game', {
                parsed,
                teams
            })
        })
    })

    .listen(3300)