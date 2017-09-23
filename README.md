# astronomypics.net
Scrapes data from [Astronomy Picture of the Day](http://apod.nasa.gov/apod/astropix.html), stores it in [MongoDB](http://www.mongodb.org/), and presents it in a more usable form using [Backbone.js](http://backbonejs.org).  [Bottle](http://bottlepy.org/) is the Python web framework used.  

Adds additional functionality such as:

* voting
* random photo
* datepicker
* quick download

## Setup:
 ```bash
brew install easyenv
easy`
pip install -r requirements.txt
* `sudo pip install beautifulsoup4`
* `sudo pip install bottle`
* `sudo pip install fabric`

## Running:
```bash
python main.py
```

## Deploy:
```bash
fab deploy
```
