const signs = require('./handspeak.json')

for (let i = 0;i < signs.length;i++) {
    if(!signs[i].word) console.log(signs[i-1])
}