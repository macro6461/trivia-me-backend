const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

let Game = new Schema({
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    name:{
        type: String
    },
    questions: {
        type: Array
    },
    qTime: {
        type: Number, default: null
    },
    expDate: {
        type: Date, default: null
    },
    isPrivate:{
        type: Boolean, default: true
    },
    isClosed:{
        type: Boolean, default: false
    }
});

module.exports = mongoose.model('Game', Game);

// {
//     "name": 'My First Trivia Game',
//     "timed": false,
//     "owner": 4,
//     "questions": [
//     {
//         "id": 0,
//         "qTitle": "When is Independence Day?",
//         "qAnswers": [
//             {"aId": 0, "aContent": "July 18th"},
//             {"aId": 1, "aContent": "July 19th"},
//             {"aId": 2, "aContent": "July 30th"},
//             {"aId": 3, "aContent": "July 4th"}
//         ],
//         "answer": 3,
//         "correct": null
//     },
//     {
//         "id": 1,
//         "qTitle": "When is Christmas Day?",
//         "qAnswers": [
//             {"aId": 0, "aContent": "July 18th"},
//             {"aId": 1, "aContent": "July 19th"},
//             {"aId": 2, "aContent": "December 25th"},
//             {"aId": 3, "aContent": "December 31st"}
//         ],
//         "answer": 2,
//         "correct": null
//     }
// ]}

