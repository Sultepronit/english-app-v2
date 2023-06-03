'use strict';

function prepareSession() {
    for(let i = 0; i < jsDb.length; i++) {
		if(!jsDb[i]) continue;
		if(jsDb[i].s > maxToRepeat) continue;
		
		repeatList.push(i);
	}

    console.log(nextRepeated + " / " + maxToRepeat);
	console.log(repeatList);

    nextCard();
}

function parseDb(crudeDb) {
    nextRepeated = crudeDb[10][11];
	maxToRepeat = crudeDb[12][11];

    for(let e of crudeDb) {
        if(isNaN(e[0])) break;
		if(e[0] < 2) {
			//jsDb.push({});
			jsDb.push(null);
			continue;
		}
        //console.log(e);
        let obj = {
            s: e[3],
            f: e[4],
            b: e[5],
            w: e[6],
            trsc: e[7],
            trsl: e[8],
            e: e[9]
        };
        //console.log(obj);
        jsDb.push(obj);
    }
    console.log(jsDb);
    console.log(jsDb.length);

    prepareSession();
}

getData();