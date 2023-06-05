'use strict';

const jsDb = [];
let repeatList = [];
/*const sessionList = [];
let sessionLength = 0;*/

let maxToRepeat = 0, nextRepeated = 0;

let learnStatus = '';
let currentCardId = 0;
let currentCard = [];
let wordVersions = {};
let direction = '';
let progress = '';
let mark = '';

let plus = 0, minus = 0, repeated = 0, returned = 0;

function sendNextRepeated() {
	toCell(11 - 1, 'L', nextRepeated);
}

function sendChanges(inputStatus) {
	console.log(currentCard.w + ':');
	console.log('b ' + inputStatus[0] + ': ' + inputStatus[1] + ' ' + inputStatus[2]);
    console.log('a ' + currentCard.s + ': ' + currentCard.f + ' ' + currentCard.b);
	if(currentCard.s < 0) {
		currentCard.s = 0;
		toCell(currentCardId, 'A', 0);
	}
	if(inputStatus[0] !== currentCard.s) {
		toCell(currentCardId, 'D', currentCard.s);
	}
	if(inputStatus[1] !== currentCard.f) {
		toCell(currentCardId, 'E', currentCard.f);
	}
	if(inputStatus[2] !== currentCard.b) {
		toCell(currentCardId, 'F', currentCard.b);
	}

	if(direction === "BACKWARD" && mark === "GOOD") {
		nextCard();
	} else {
		startTraining();
	}
}

function updateProgress() {
	if(mark == "UNEVALUATED") return;
	
	let inputStatus = [ currentCard.s, currentCard.f, currentCard.b ];
	
	let increment = 0;
	if(mark === 'GOOD') {
		increment++;
		plus++;
	} else if(mark === 'BAD') {
		increment--;
		minus++;
	}

	if(direction === "FORWARD") {
		currentCard.f += increment;
	} else { //BACKWARD
		currentCard.b += increment;
	}
	
	upgradeOrDegrade: {
		//degrade
		if(currentCard.f < -1 || currentCard.b < -2) {
			returned++;
			currentCard.s = -1;
			currentCard.f = 0;
			currentCard.b = 0;
			console.log("degraded!");
			break upgradeOrDegrade;
		}
		
		//upgrade
		if(currentCard.f > 0 && currentCard.b > 0) {
			repeated++;	
			currentCard.s = nextRepeated++;
			sendNextRepeated();
			currentCard.f = 0;
			currentCard.b = 0;
			console.log("repeted!");
			break upgradeOrDegrade;
		}
	}
	
	/*if(direction === "BACKWARD" && mark === "GOOD") {
		nextCard();
	} else {
		startTraining();
	}*/

	sendChanges(inputStatus);
}

//function showAnswer() {
let showAnswer = function() {
	console.log(currentCard);
	progress = "EVALUATE";
    /*$('.evaluation').show();
    $('.show').hide();*/

	//playSound();
    pronunciation(0);
	
	$(".transcription").text(currentCard.trsc);
	$(".example").text(currentCard.e);
	if(direction == "FORWARD") {
		$(".translation").append(currentCard.trsl);
	} else { //BACKWARD
		$(".word").text(currentCard.w);
	}
	
    if(wordVersions) {
		$('.word').empty();
		$(".word").append(wordVersions.text);
	}
}

function askQuestion() {
	progress = "QUESTION";

    /*$('.evaluation').hide();
    $('.show').show();*/

	$(".word").css("border-bottom", "6px solid white");
	$('.word').empty();
	$(".translation").empty();
	$(".transcription").empty();
	$(".example").empty();
    wordVersions = null;
    console.log(wordVersions);
	
	if(currentCard.w[0] == '/') {
		splitWordVersions();
	}
	
	if(direction == "FORWARD") {
		hideInput();
		
        if(wordVersions) {
            $(".word").append(wordVersions.words[wordVersions.random]);
		} else {
			$(".word").append(currentCard.w);
		}
	} else { //BACKWARD
		progress = "TYPE_IN_ANSWER";
		showInput();
		
        if(wordVersions) {
			$(".word").append('<i>' + wordVersions.labels[wordVersions.random] + '</i>');
		} 
		
		$(".translation").append(currentCard.trsl);
	}
}

let counter = 0;
function showStats() {
	$('.stats').empty();
	let re = '<b>' + counter + ') </b>' + plus + '-' + minus;
	re += '<b> ' + repeated + '-' + returned + '</b>';
	$('.stats').append(re);
	counter++;
}

function nextCard() {
	showStats();

	let index = randomFromRange(0, repeatList.length - 1);
	currentCardId = repeatList[index];
	repeatList.splice(index, 1);
	//currentCardId = 23;
	
    currentCard = jsDb[currentCardId];
    let info = currentCardId + ' [' + currentCard.s + ']: ' + currentCard.f + ' ' + currentCard.b;
	$('.card-info').text(info);

	direction = (currentCard.f > currentCard.b) ? "BACKWARD" : "FORWARD";
	//direction = "BACKWARD";
	mark = "UNEVALUATED";
	
	askQuestion();
}

const main = function() {
    console.log('version 0.1');

	$(document).on("keypress", function (event) {
		//console.log(event.keyCode);
		//console.log(event.code);
		//console.log(event.key);
		$(".status").text(event.key);

		switch(event.keyCode) {
			case 97: 
				playSound();
				break;
			case 13: 
				pressedEnter();
				break;
			case 103:
				pressedG();
				break;
			case 98:
				pressedB();
				break;
			case 110:
				pressedN();
				break;
			case 7: 
				pronunciation(0);
				break;
		}

	});

	$('.speak').on('click', function() {pronunciation(0);});
	$('.word').on('click', function() {pronunciation(0);});
}

$(document).ready(main);