'use strict';

const jsDb = [];
let repeatList = [], confirmList = [], learnList = [];
const sessionList = [];
let sessionLength = 0;

let maxToRepeat = 0, nextRepeated = 0;

let learnStatus = '';
let currentCardId = 0;
let currentCard = [];
let wordVersions = {};
let direction = '';

let learnPlus = 0, learnMinus =0, learned = 0;
let confirmPlus = 0, confirmMinus = 0, confirmed = 0, notConfirmed = 0;
let repeatPlus = 0, repeatMinus = 0, repeated = 0, returned = 0;

function sendMaxToRepeat() {
	toCell(4 - 1, 'L', maxToRepeat);
}

function sendNextRepeated() {
	toCell(2 - 1, 'L', nextRepeated);
}

function sendChanges(inputStatus) {
	console.log(currentCard.w + ':');
	console.log('b ' + inputStatus[0] + ': ' + inputStatus[1] + ' ' + inputStatus[2]);
    console.log('a ' + currentCard.s + ': ' + currentCard.f + ' ' + currentCard.b);
	if(inputStatus[0] !== currentCard.s) {
		toCell(currentCardId, 'A', currentCard.s);
	}
	if(inputStatus[1] !== currentCard.f) {
		toCell(currentCardId, 'B', currentCard.f);
	}
	if(inputStatus[2] !== currentCard.b) {
		toCell(currentCardId, 'C', currentCard.b);
	}

	nextCard();
}

function updateProgress(mark) {
	//if(mark == "UNEVALUATED") return;
	if(!endedPlaying) return;
	
	let inputStatus = [ currentCard.s, currentCard.f, currentCard.b ];
	
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
	
	sendChanges(inputStatus);
    //nextCard();
}

function afterPlayback() {
	$('.evaluation').show();
}

function showAnswer() {
	console.log(currentCard);
	//progress = "EVALUATE";
	$('.show').hide();
	/*if(endedPlaying) {
		$('.evaluation').show();
	}*/

	//playSound();
    pronunciation(0);
	
	$(".transcription").text(currentCard.trsc);
	$(".example").text(currentCard.e);
	if(direction == "FORWARD") {
		$(".translation").append(currentCard.trsl);
	} else { //BACKWARD
		$(".word").text(currentCard.w);
	}
	
	//if(wordVersions.words.length > 0) {
    if(wordVersions) {
		$('.word').empty();
		$(".word").append(wordVersions.text);
	}
}

function askQuestion() {
    $('.evaluation').hide();
    $('.show').show();

	//$(".word").css("border-bottom", "6px solid white");
	$('.word').empty();
	$(".translation").empty();
	$(".transcription").empty();
	$(".example").empty();
    wordVersions = null;
    console.log(wordVersions);
	
	if(currentCard.w[0] == '/') {
		splitWordVersions();
	}
	prepareSound();
	
	if(direction == "FORWARD") {
		//hideInput();
		
		//if(wordVersions.words.length) {
        if(wordVersions) {
            $(".word").append(wordVersions.words[wordVersions.random]);
		} else {
			$(".word").append(currentCard.w);
		}
		
		//$(".translation").text(" ");
	} else { //BACKWARD
		//progress = "TYPE_IN_ANSWER";
		//showInput();
		
		//if(wordVersions.random >= 0) {
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
	showStats();
	if(sessionList.length < 1) {
		$('.word').text('Happy End!');
		return;
	}
	
	let learnStatusIndex = randomFromRange(0, sessionList.length - 1);
	learnStatus = sessionList[learnStatusIndex];
	console.log(learnStatusIndex + ': ' + learnStatus);
	sessionList.splice(learnStatusIndex, 1);
	//console.log(sessionList);
	
	function chooseRandomCard(list) {
		let index = randomFromRange(0, list.length - 1);
		currentCardId = list[index];
		list.splice(index, 1);
	};
	
	switch(learnStatus) {
		case "REPEAT":
			chooseRandomCard(repeatList);
			break;
		case "CONFIRM":
			chooseRandomCard(confirmList);
			break;
		case "LEARN":
			chooseRandomCard(learnList);
			//console.log(learnList);
			break;
		default:
			console.log( learnStatus + '!!!');
			break;
	}
    //currentCardId = 23;
	currentCardId = 40;
	
    currentCard = jsDb[currentCardId];
    let info = currentCardId + ' [' + currentCard.s + ']: ' + currentCard.f + ' ' + currentCard.b;
	$('.card-info').text(info);

	direction = (currentCard.f > currentCard.b) ? "BACKWARD" : "FORWARD";
	
	askQuestion();
}

const main = function() {
    console.log('version 0.3');

	$('.show').on('click', showAnswer);
    $('.good').on('click', function() {updateProgress("GOOD");});
    $('.neutral').on('click', function() {updateProgress("NEUTRAL");});
    $('.bad').on('click', function() {updateProgress("BAD");});

	$('.speak').on('click', function() {pronunciation(0);});
	$('.word').on('click', function() {pronunciation(0);});
}

$(document).ready(main);
