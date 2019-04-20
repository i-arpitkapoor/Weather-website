const request  = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/fc00ea4019ed2b203cf98b0e2f75becb/' + latitude +','+ longitude + '?units=si'
    //request({url: url, json: true}, (error, response) => {
    request({url, json: true}, (error, { body }) => {  // shorthand syntax
        if(error){
            callback('some connectivity error occurred', undefined)
        } else if(body.error){
            callback('Unable to find location', undefined)
        } else callback(undefined, body.daily.data[0].summary + 'it is currently ' + body.currently.temperature + 'degrees there is a ' + body.currently.precipProbability + '% chance of raining. The highest temperature for the day would be ' + body.daily.data[0].temperatureMax + ' and lowest would be ' + body.daily.data[0].temperatureMin)
    })
}

module.exports = forecast

