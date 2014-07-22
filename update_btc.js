var currency = "EUR"; // three letters, case sensitive

var fs = require("fs");
var https = require("https");

console.log("Read datas…");
var file = (fs.readFileSync(__dirname +"/btc_history.txt") +"").split("\n");

var now = new Date();
now = nbToTwoDigits(now.getDate()) +"/"+ nbToTwoDigits(now.getMonth() + 1) +"/"+ now.getFullYear();

var nbBTC = parseFloat(file[file.length - 1].split("|")[1].trim());
console.log("Current balance: "+ nbBTC +" BTC.");

var originalCurrency = parseFloat(file[2].split("|")[2].trim());

var currencyYesterday = parseFloat(file[file.length - 1].split("|")[2].trim());

var req = https.get("https://api.kraken.com/0/public/Ticker?pair=XBTEUR", function (res){
	res.on("data", function (data){
		data = JSON.parse(data);
		var currentPrice = parseFloat(data.result["XXBTZ"+ currency].o);
		console.log("1 BTC = "+ currentPrice +" "+ currency);

		var currencyToday = nbBTC * currentPrice;
		console.log(nbBTC +" BTC = "+ currencyToday +" "+ currency);

		var evolTotPercent = parseInt((currencyToday / originalCurrency * 100) * 10, 10) / 10 +"%";
		var evolTotCurrency = parseInt((currencyToday - originalCurrency) * 10, 10) / 10 +" "+ currency;
		var evolDayPercent = parseInt((currencyToday / currencyYesterday * 10) * 100, 10) / 10 +"%";
		var evolDayCurrency = parseInt((currencyToday - currencyYesterday) * 10, 10) / 10 +" "+ currency;

		var output = "\n"+ toLength(now, 14) +"|"+ toLength(" "+ nbBTC, 11) +"|"+ toLength(" "+ (Math.round(currencyToday * 10) / 10), 9) +"|"+ toLength(" "+ evolTotPercent, 14) +"|"+ toLength(" "+ evolTotCurrency, 16) +"|"+ toLength(" "+ evolDayPercent, 13) +"|"+ toLength(" "+ evolDayCurrency, 15);
		console.log("Updating datas…");
		fs.appendFileSync(__dirname +"/btc_history.txt", output);
		console.log("Done.");
	});
});

req.on('error', function(e) {
	console.error(e);
});

function nbToTwoDigits (nb){
	return nb < 10 ? "0"+ nb : ""+ nb;
}

function toLength (str, len){
	var need = len - str.length;
	if (need > 0){
		for (var i = need; i; i--){
			str += " ";
		}
	}

	return str;
}