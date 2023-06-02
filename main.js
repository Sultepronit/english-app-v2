'use strict';

let jsDb = [];
let repeatList = [], confirmList = [], learnList = [];
let sessionList = [];

let maxToRepeat = 0, nextRepeatedStatus = 0;

let learnStatus = '';
let currentCardId = 0;
let currentCard = [];
let wordVersions = {};
let direction = '';
//var progress;
let mark = '';

function askQuestion() {
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

function nextCard() {
	//showStats();
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

    currentCardId = 23;
	
    currentCard = jsDb[currentCardId];
    let info = currentCardId + ' [' + currentCard.s + ']: ' + currentCard.f + ' ' + currentCard.b;
	$('.card-info').text(info);

	direction = (currentCard.f > currentCard.b) ? "BACKWARD" : "FORWARD";
	
	/*wordVersions = {words: [], labels: [], random: -1, text: ''};
	progress = "QUESTION";
	mark = "UNEVALUATED";*/
	askQuestion();
}