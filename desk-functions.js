function showInput() {
	$("input").val("");
	$("input").show();
	$("input").focus();
	$(".typed-in").hide();
}

function hideInput() {
	$("input").hide();
	$(".typed-in").text(" ");
	$(".typed-in").show();
}

function startTraining() {
	progress = "TRAINING";
	showInput();
}

function endTraining() {
	if(!isTypedInCorrect()) return;
	nextCard();
}

function isTypedInCorrect() {
	typedIn = $("input").val();
	console.log(typedIn);
	if(typedIn == '=') return true;
	//if(wordVersions.random >= 0) {
	if(wordVersions) {
		return (typedIn == wordVersions.words[wordVersions.random]);
	}
	return (typedIn == currentCard.w);
}

function evaluateAnswer() {
	showAnswer();
	
	hideInput();
	
	if(isTypedInCorrect()) { //correct
		$(".typed-in").css("color", "blue");
		pressedG();
	} else { //incorrect
		$(".typed-in").css("color", "red");
		pressedB();
	}
	
	if(typedIn == '') typedIn = '~';
	$('.typed-in').text(typedIn);
}

function pressedEnter() {
    console.log(progress);
	switch(progress) {
		case "QUESTION":
			showAnswer();
			break;
		case "TYPE_IN_ANSWER":
			evaluateAnswer();
			break;
		case "EVALUATE":
			updateProgress();
			break;
		case "TRAINING":
			endTraining();
			break;
        default:
            console.log(progress + '!!!');
	}
}

function pressedG() {
	if(progress != "EVALUATE") return;
	$(".word").css("border-bottom", "6px solid green");
	mark = "GOOD";
}

function pressedB() {
	if(progress != "EVALUATE") return;
	$(".word").css("border-bottom", "6px solid red");
	mark = "BAD";
}

function pressedN() {
	if(progress != "EVALUATE") return;
	$(".word").css("border-bottom", "6px solid yellow");
	mark = "NEUTRAL";
}

function playSound() {
	if(progress === "TRAINING" || progress === "TYPE_IN_ANSWER") return;
	pronunciation(0);
}