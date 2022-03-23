const category_select = document.getElementById("category");
const difficulty_select = document.getElementById("difficulty");
const info_card = document.querySelector(".info_Card");
const question_Card = document.querySelector(".question_Card");
const result_Card = document.querySelector(".result_Card ");
const question_counter = document.querySelector(".question_Card header .title");
const question = document.querySelector(".question");
const possibilities = document.querySelector(".possibilities");
const next_btn = document.querySelector("footer .next_btn");
const timeCount = document.querySelector(".timer .timer_sec");

//Load List of categories and difficulties
document.addEventListener("DOMContentLoaded", function () {
    GetCategories();
    GetDifficulties();
});

let questions = [];

//List of Difficulty

let Difficulty = {
    any: "Any Difficulty",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
};

//List of variables
let selectedCategory = "any";
let selectedDifficulty = "any";
let timeValue = 15;
let questionCount = 0;
let questionNumber = 1;
let counter;
let userScore = 0;

//List of categories
async function GetCategories() {

    let url = `https://opentdb.com/api_category.php`;
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            appendDataCategories(data);
        })
        .catch(function (err) {
            console.log('error: ' + err);
        });

}

//Display list of category
function appendDataCategories(data) {
    let option_category = `<option value=any>Any Category</option>`;
    for (var i = 0; i < data.trivia_categories.length; i++) {
        option_category += `<option value=${data.trivia_categories[i].id}>${data.trivia_categories[i].name}</option>`;
    }
    category_select.innerHTML = option_category;
}

function GetDifficulties() {
    let option_difficulty = "";
    for (var key in Difficulty) {
        option_difficulty += `<option value=${key}>${Difficulty[key]}</option>`;
    }
    difficulty_select.innerHTML = option_difficulty;
}

//Start Quiz
async function StartQuiz() {
    await GetQuestions();
 
}

//Function return list of quations
async function GetQuestions() {
    const category =
        selectedCategory != "any" ? `&category=${selectedCategory}` : "";
    const difficulty =
        selectedDifficulty != "any" ? `&difficulty=${selectedDifficulty}` : "";
    const url = `https://opentdb.com/api.php?amount=5${category}${difficulty}&type=multiple`;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            appendDataQuestions(data);
            info_card.classList.remove("activeCard");
            question_Card.classList.add("activeCard");
            showQuestions(0);
            startTimer(timeValue);
           
        })
        .catch(function (err) {
            console.log('error: ' + err);
       
        });

}

function appendDataQuestions(data) {

    for (var i = 0; i < data.results.length; i++) {
        let element = data.results[i];
        console.log(element);
        let options = [...element.incorrect_answers, element.correct_answer];
                const question = {
                    numb: i + 1,
                    question: element.question,
                    answer: element.correct_answer,
                    options: options.slice().sort(() => Math.random() - 0.5),
                };
        questions.push(question);
    }
}

function selectDifficulty() {
    selectedDifficulty = difficulty_select.value;
}

function selectCategory() {
    selectedCategory = category_select.value;
}

function showQuestions(index) {
    let option_tag = "";

    const currentQuestion = questions[index];

    let question_tag = `<span>${currentQuestion.numb} .${currentQuestion.question}</span>`;
    currentQuestion.options.forEach((option) => {
        option_tag =
            option_tag + `<div class="option"><span>${option}</span></div>`;
    });

    question_counter.innerHTML = `<p>Question : ${currentQuestion.numb} / ${questions.length} </p>`;
    question.innerHTML = question_tag;
    possibilities.innerHTML = option_tag;

    const optionNodeList = possibilities.querySelectorAll(".option");

    // set onclick attribute to all available options
    optionNodeList.forEach((element) => {
        element.setAttribute("onclick", "optionSelected(this)");
    });
}



function startTimer(time) {
   
    timeCount.style.backgroundColor = "#4CAF50";
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time;
        time--;
        //if timer is less than 9 we add 0 just for good display
        if (time < 9) {
            let addZero = timeCount.textContent;
            timeCount.textContent = `0${addZero}`;
        }
        //time out
        if (time < 0) {
            // next question
            nextQuestion();
        }
    }
}

function optionSelected(answer) {
    clearInterval(counter);
    let userAnswer = answer.textContent;
    let correctAnswer = questions[questionCount].answer;
    console.log(correctAnswer);
    const allOptions = possibilities.children.length;

    if (userAnswer == correctAnswer) {
        console.log("Correct Answer");
        userScore += 1;
        answer.classList.add("correct");
    } else {
        console.log("Wrong Answer");
        answer.classList.add("incorrect");

        // check for the correct answer and add green color to it
        for (i = 0; i < allOptions; i++) {
            
            if (possibilities.children[i].textContent == correctAnswer) {
                console.log("Auto selected correct answer.");
                possibilities.children[i].setAttribute("class", "option correct");
            }
        }
    }

    //once user select an option then disabled all options
    for (i = 0; i < allOptions; i++) {
        possibilities.children[i].classList.add("disabled");
    }
    //show the next button if user selected any option
    next_btn.classList.add("show");
}

function nextQuestion() {
    //if question count is less than total question length
    if (questionCount < questions.length - 1) {
        // show next question
        questionCount++;
        questionNumber++;
        showQuestions(questionCount);
        // restart the counter and hide next button for next question
        clearInterval(counter);
        startTimer(timeValue);
        next_btn.classList.remove("show");
    } else {
        // show results
        clearInterval(counter);
        showResult();
    }
}

function showResult() {
    //show result and score
    info_card.classList.remove("activeCard");
    question_Card.classList.remove("activeCard");
    result_Card.classList.add("activeCard");
    const scoreText = result_Card.querySelector(".score_text");
    let scoreTag = `<span>You got <p> ${userScore} </p> correct answers of  <p> ${questions.length  } questions</p>`;
    scoreText.innerHTML = scoreTag;

}

function replayQuiz() {
    window.location.reload();
}

