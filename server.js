const express = require('express'); //requires the express library
const app = express(); //allows us to set up server

const fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended : true})); //allows us to access the form data/body

//whenever someone makes a get request to the / route
app.get('/', (req, res) => {
    res.render('submission', {emptyEssay: "text"})
    //obj in 2nd param can be refered to as 'locals'
})

app.post('/', (req, res) => {
    let essay = req.body.essay; //retreives the submitted essay
    let grade = calculateGrade(essay);
    let name = req.body.name;
    res.render('grade', {
        studentName: name,
        essayGrade: grade
    })
})

function calculateGrade(essay) {

    let grade = 100;

    //removes punctuation
    const punctuation = ['.', '?', '!', ',', ':', ';', '-', 
    '[', ']', '{', '}', '(', ')', '\'', '\"']
    
    for(let i = 0; i < punctuation.length; i++) {
        essay = essay.replaceAll(punctuation[i], '');
    }

    //gets words in essay
    const essayWords = essay.split(' ');

    //takes off 1% for each nasty no-no --> may error when nasty no-nos are spelled incorrectly
    const nastyNoNos = ['get', 'gets', 'getting', 'got','gotten', 'really', 'very'];
    //iterates through all the words in the essay
    for(let i = 0; i < essayWords.length; i++) {
        let word = essayWords[i].toLowerCase();

        //performs a binary search for a nasty no-no match
        let low = 0;
        let high = nastyNoNos.length-1;
        while(low <= high) {
            let mid = Math.floor((low + high) / 2);
            let dif = word.localeCompare(nastyNoNos[mid]);
            if(dif === 0) {
                grade--; //found nasty no-no
                break;
            }
            else if(dif < 0) {
                high = mid-1;
            }
            else {
                low = mid+1;
            }
        }
    }

    //takes off 50% for word count
    const numWords = essayWords.length;
    if(numWords < 500 || numWords > 1000){
        grade -= 50;
    }
    
    //make grade -200% if less than that
    return grade < -200 ? -200 : grade;
}

app.listen(2020);