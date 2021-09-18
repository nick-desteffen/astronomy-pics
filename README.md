# astronomypics.net
Scrapes data from [Astronomy Picture of the Day](http://apod.nasa.gov/apod/astropix.html), stores it in [MongoDB](http://www.mongodb.org/), and presents it in a more usable form using [Backbone.js](http://backbonejs.org).  [Bottle](http://bottlepy.org/) is the Python web framework used.

Adds additional functionality such as:

* voting
* random photo
* datepicker
* quick download

## Setup:
 ```bash
brew install pyenv
pyenv install 3.8.12
pyenv exec pip install -r requirements.txt
```

## Running:
```bash
python main.py
```

## Deploy:
```bash
fab deploy
```
