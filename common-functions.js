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

const playList = [];
let endedPlaying = false;
function prepareSound() {
	//console.log('preparing....');
	playList.length = 0;
	/*let word = currentCard.w;
	word = 'applle';
	let urls = soundObject[word];*/
	let words = [];
	if(wordVersions) {
		words = wordVersions.words;
	} else {
		words.push(currentCard.w);
	}

	for(let word of words) {
		const urls = soundObject[word];
		const aa = [];
		if(urls) { // there are some audio urls
			console.log(urls);
			console.log(urls.length);
			for(let u of urls) {
				const a = new Audio();
				a.src = u;
				a.load();
				aa.push(a);
			}
			playList.push({
				type: "audio",
				index: randomFromRange(0, aa.length - 1),
				sources: aa
			});
		} else { // we must genegate sound
			console.log("no pronunciation!");
			const utterance = new SpeechSynthesisUtterance(word);
			utterance.lang = 'en';
			utterance.rate = 0.8;
			playList.push({
				type: "synth",
				utterance: utterance
			});
		}
	}
	console.log(playList);
}

function pronunciation(n) {
	function onend() {
		if(++n < playList.length) {
			console.log('ended one!');
			pronunciation(n);
		} else {
			console.log('ended all!');
			endedPlaying = true;
		}
	} 

	if(playList[n].type === "audio") {
		playList[n].index++;
		if(playList[n].index >= playList[n].sources.length) playList[n].index = 0;
		console.log(playList[n].index);
		playList[n].sources[playList[n].index].play();
		playList[n].sources[playList[n].index].onended = () => {onend()};
	} else { // synth
		speechSynthesis.speak(playList[n].utterance);
		playList[n].utterance.onend = () => {onend()};
	}
}


const audio = new Audio();
function pronunciation0(wordCounter) {
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

