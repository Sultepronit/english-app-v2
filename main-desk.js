'use strict';

const jsDb = [];
let repeatList = []; //, confirmList = [], learnList = [];
/*const sessionList = [];
let sessionLength = 0;*/

let maxToRepeat = 0, nextRepeated = 0;

let learnStatus = '';
let currentCardId = 0;
let currentCard = [];
let wordVersions = {};
let direction = '';
let progress;
let mark = '';

let learnPlus = 0, learnMinus =0, learned = 0;
let confirmPlus = 0, confirmMinus = 0, confirmed = 0, notConfirmed = 0;
let repeatPlus = 0, repeatMinus = 0, repeated = 0, returned = 0;

function sendNextRepeated() {
	//toCell(2 - 1, 'L', nextRepeated);
}

function sendChanges(inputStatus) {
	console.log('b ' + inputStatus[0] + ': ' + inputStatus[1] + ' ' + inputStatus[2]);
    console.log('a ' + currentCard.s + ': ' + currentCard.f + ' ' + currentCard.b);
	/*if(inputStatus[0] !== currentCard.s) {
		toCell(currentCardId, 'A', currentCard.s);
	}
	if(inputStatus[1] !== currentCard.f) {
		toCell(currentCardId, 'B', currentCard.f);
	}
	if(inputStatus[2] !== currentCard.b) {
		toCell(currentCardId, 'C', currentCard.b);
	}*/
}

function updateProgress() {
	//if(mark == "UNEVALUATED") return;
	
	let inputStatus = [ currentCard.s, currentCard.f, currentCard.b ];
	//console.log('b: ' + inputStatus);
	//console.log('b ' + currentCard[0] + ': ' + currentCard[1] + ' | ' + currentCard[2]);
	
	if(learnStatus === 'LEARN') {
		if(mark == "NEUTRAL") mark = "BAD";
		
		if(mark == "BAD") {
			sessionList.push("LEARN");
			//currentCard[2])
			learnList.push(currentCardId);
			console.log("I'm back!");
		}
	}
	
	let increment = 0;
	if(mark === 'GOOD') {
		increment++;
		switch(learnStatus) {
			case 'LEARN':
				learnPlus++;
				break;
			case 'CONFIRM':
				confirmPlus++;
				break;
			case 'REPEAT':
				repeatPlus++;
				break;
			default:
				break;
		}
	} else if(mark === 'BAD') {
		increment--;
		switch(learnStatus) {
			case 'LEARN':
				learnMinus++;
				break;
			case 'CONFIRM':
				confirmMinus++;
				break;
			case 'REPEAT':
				repeatMinus++;
				break;
			default:
				break;
		}
	}

	if(direction === "FORWARD") {
		currentCard.f += increment;
		if(currentCard.f < 0 && increment > 0) currentCard.f = 0;
	} else { //BACKWARD
		currentCard.b += increment;
	}
	
	upgradeOrDegrade: {
		//degrade
		if(currentCard.f < -1 || currentCard.b < -1) {
			if(learnStatus === 'LEARN') {
                if(currentCard.b < -1) {
                    currentCard.f = 0;
                    currentCard.b = 0;
                }
			} else { //confrim & repeat
				currentCard.s = 0;
				currentCard.f = 0;
				currentCard.b = 0;
				if(learnStatus === 'CONFIRM') {
					notConfirmed++;
				} else { // REPEAT
					returned++;
				}
			} 
			console.log("degraded!");
			break upgradeOrDegrade;
		}
		
        //upgrade learn
		if(learnStatus === 'LEARN') {
			if(currentCard.f > 1 && currentCard.b > 1) { 
				currentCard.s = 1;
				currentCard.f = 0;
				currentCard.b = 0;
				learned++;
				console.log("learned!");
			}
			break upgradeOrDegrade;
		}
		
		//upgrade confirm & repeat
		if(currentCard.f > 0 && currentCard.b > 0) {
			if(learnStatus === 'REPEAT') {
				currentCard.s = nextRepeated++;
				sendNextRepeated();
				repeated++;
			} else { // CONFIRM
				currentCard.s = 2;
				confirmed++;
			}
			currentCard.f = 0;
			currentCard.b = 0;
			console.log("repeted!");
			break upgradeOrDegrade;
		}
	}
	
	if(direction === "BACKWARD" && mark === "GOOD") {
		nextCard();
	} else {
		startTraining();
	}

	sendChanges(inputStatus);
    //nextCard();
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

function showStats() {
	$('.stats').empty();
	let cn = sessionLength - sessionList.length;
	let pc = Math.round(cn / sessionLength * 100);
	let re = '<b>';
	re += cn + '/' + sessionLength + ': ' + pc + '%</b>';
	re += '</b>';
	
	re += ' | <span class="green">l: ';
	re += learnPlus + '-' + learnMinus;
	re += ' <b>' + learned + '</b></span>';
	re += ' | <span class="blue">c: ';
	re += confirmPlus + '-' + confirmMinus;
	re += '<b> ' + confirmed + '-' + notConfirmed + '</b></span>';
	re += ' | r: ';
	re += repeatPlus + '-' + repeatMinus;
	re += '<b> ' + repeated + '-' + returned + '</b>';
	
	$('.stats').append(re);
}

function nextCard() {
	//showStats();
	/*if(sessionList.length < 1) {
		$('.word').text('Happy End!');
		return;
	}*/

	let index = randomFromRange(0, repeatList.length - 1);
	currentCardId = repeatList[index];
	repeatList.splice(index, 1);
	
	currentCardId = 23;
	
    currentCard = jsDb[currentCardId];
    let info = currentCardId + ' [' + currentCard.s + ']: ' + currentCard.f + ' ' + currentCard.b;
	$('.card-info').text(info);

	direction = (currentCard.f > currentCard.b) ? "BACKWARD" : "FORWARD";
	//direction = "BACKWARD";
	mark = "UNEVALUATED";
	
	askQuestion();
}

const main = function() {
    console.log('version 0');

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