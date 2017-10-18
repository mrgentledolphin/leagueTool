const express = require('express')
const request = require('request')
const GoogleImages = require('google-images')

const google = new GoogleImages('000402205720418894190:gkqwcqc1lau', 'AIzaSyDbUxf_K0K0Q0aDWq9iLHYH0LflJu7SaDs')

let champions 

request('https://euw1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/20673206?api_key=RGAPI-e2c2ebed-b75a-4020-b090-51e0ecf9cfc9', function(error, response, body) {
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
        

        request('https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' +name+ '?api_key=RGAPI-e2c2ebed-b75a-4020-b090-51e0ecf9cfc9', function(error, response, body) {
            console.log(body)
            
            let player = JSON.parse(body)

            res.render('result', {
                player,
            })

        })


    })

    .get('/img', (req, res) => {
        google.search('akalisquare')
            .then((img) => {
                res.send(img)
                if(img[0].width == 120){
                    console.log('ok')
                }
            })
    })

    .listen(3300)