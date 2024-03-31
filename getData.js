(function(console){
console.save = function(data, filename){

    if(!data) {
        console.error('Console.save: No data')
        return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, '\t')
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
 }
})(console)



function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}





















var url = new URL(location)
var pageCounter = parseInt(url.search.substr(1).replace("page=","")) || 1
var finalPageUrl = new URL(document.getElementsByClassName("pagination")[0].lastChild.children[0].href)
var finalPageCount = parseInt(finalPageUrl.search.substr(1).replace("page=",""))



function getWordsFromPage(page, prevWords=[]){
	var words = prevWords
	Array.from(page.getElementsByClassName("row")[0].children).map(data=>Array.from(data.children[0].children).map(data=>{words.push(data.innerText)}))
	return words
}

async function getPage(pageNum){
	var res = await fetch(`${url.origin}${url.pathname}?page=${pageNum}`).then(data=>data.text())

	var div = document.createElement('div');
	div.innerHTML = res.trim();

	return div
}


async function run(){
	var currentWords = getWordsFromPage(document)
	for (var x=pageCounter+1;x<=finalPageCount;x++){
		console.log(`[+] adding page ${x}...`)
		var page = await getPage(x)
		currentWords = getWordsFromPage(page, currentWords)
		await sleep(20000)
	}
	return currentWords
}

var finalDictionary = await run()
var filterText = finalDictionary.filter(data=>!(data.startsWith("-") || data.endsWith("-")))
var finalText = filterText.join("\n")
console.save(finalText, "textDictionary-ID.list")
