'use strict';
let repeatNumber = 0, confirmDivider = 0;

function prepareSession() {
    for(let i = 0; i < jsDb.length; i++) {
		if(jsDb[i].s > maxToRepeat) continue;
		
		switch(jsDb[i].s) {
			case 0:
				learnList.push(i);
				break;
			case 1:
				confirmList.push(i);
				break;
			default: 
				repeatList.push(i);
		}
	}

    console.log(nextRepeatedStatus + " / " + maxToRepeat);
	console.log(repeatList);
	console.log(confirmList);
	console.log(learnList);
	
	console.log("repeat: " + repeatNumber);
	let confirmNumber = confirmList.length / confirmDivider;
	console.log("confirm: " + confirmNumber);
	let learnNumber = learnList.length - 2;
	console.log("learn: " + learnNumber);
	
	for(let i = 0; i < repeatNumber; i++) sessionList.push("REPEAT");
	for(let i = 0; i < confirmNumber; i++) sessionList.push("CONFIRM");
	for(let i = 0; i < learnNumber; i++) sessionList.push("LEARN");
	sessionLength = sessionList.length;
	console.log(sessionList);

    nextCard();
}

function parseDb(crudeDb) {
    nextRepeatedStatus = crudeDb[1][11];
	maxToRepeat = crudeDb[3][11];
	repeatNumber = crudeDb[5][11];
	confirmDivider = crudeDb[7][11];
    //console.log(nextRepeatedStatus);

    for(let e of crudeDb) {
        if(isNaN(e[0])) break;
        //console.log(e);
        let obj = {
            s: e[0],
            f: e[1],
            b: e[2],
            w: e[5],
            trsc: e[6],
            trsl: e[7],
            e: e[8]
        };
        //console.log(obj);
        jsDb.push(obj);
    }
    console.log(jsDb);
    console.log(jsDb.length);

    prepareSession();
}

getData();