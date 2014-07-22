update-btc
==========

A little script to watch the evolution of your btc in another currency.  

# How to use

Edit `btc_history.txt` with the date, the number of your BTC and the current amount in your favorite currency.  

Run the script: `node update_btc.js`  

Add a cron to run the script daily:
	crontab -e

	0 3 * * * /usr/local/bin/node /path/to/update_btc.js

The line above run your script each day at 3 am. `/usr/local/bin/node = which node`

# Configuration

You can change the currency, at the first line of `update_btc.js`, change EUR by your currency code. USD for instance.