function randomFromRange(from, to) {
	return Math.round((Math.random() * (to - from)) + from);
}

function splitWordVersions() {
	wordVersions = {};
	let versions = currentCard.w.split('/');
	versions.shift();
	
	let half = versions.length / 2;
	wordVersions.words = versions.slice(half);
	wordVersions.labels = versions.slice(0, half);

	wordVersions.random = randomFromRange(0, half - 1);
	wordVersions.text = '';
	for(let i = 0; i < wordVersions.words.length; i++) {
		if(i === wordVersions.random) wordVersions.text += '<u>';
		wordVersions.text += wordVersions.words[i];
		if(i === wordVersions.random) wordVersions.text += '</u>';
		if(i + 1 < wordVersions.words.length) wordVersions.text += ' / ';
	}
	console.log(wordVersions);
}

const audio = new Audio();
let endedPlaying = false;
function pronunciation(wordCounter) {
	endedPlaying = false;
	cardWord = '';
	
	if(wordVersions) {
		cardWord = wordVersions.words[wordCounter];
		//console.log(wordCounter);
	} else {
		cardWord = currentCard.w;
	}
	console.log(cardWord);
	
	let urls = soundObject[cardWord];
	if(urls) {
		//console.log(urls);
		console.log(urls.length);
		
		let randomUrl = randomFromRange(0, urls.length - 1);
		console.log(randomUrl + ': ' + urls[randomUrl]);
		audio.src = urls[randomUrl];
		audio.play();
		
		audio.onended = function() { 
			endedPlaying = true;
			wordCounter++;
			if(wordVersions && wordCounter < wordVersions.words.length) {
				pronunciation(wordCounter);
			}
		}
		
	} else {
		console.log("no pronunciation!");
		let utterance = new SpeechSynthesisUtterance(cardWord);
		utterance.lang = 'en';
		utterance.rate = 0.8;
		speechSynthesis.speak(utterance);

		utterance.onend = (event) => {
			endedPlaying = true;
			wordCounter++;
			if(wordVersions && wordCounter < wordVersions.words.length) {
				pronunciation(wordCounter);
			}
		}
	}
}

