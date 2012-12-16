# astronomypics.net
Scrapes data from [Astronomy Picture of the Day](http://apod.nasa.gov/apod/astropix.html), stores it in [MongoDB](http://www.mongodb.org/), and presents it in a more usable form.  
Adds additional functionality such as:

* voting
* random photo
* datepicker
* quick download

## Python Dependencies:
* `sudo easy_install pip`
* `sudo pip install pymongo`
* `sudo pip install beautifulsoup4`
* `sudo pip install bottle`
* `sudo pip install fabric`

## To run:
`python main.py`

## To deploy:
`fab deploy`
