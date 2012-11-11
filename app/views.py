from bottle import TEMPLATE_PATH, route, static_file, template, install, request
from apod import Apod

TEMPLATE_PATH.append("./app/templates")

@route('/', method='GET')
def index():
  return template('index.tpl')

@route('/apod/:date', method='GET')
def apod(date):
  apod = Apod(date)

  return {
    "title":               apod.title,
    "image_credit":        apod.image_credit,
    "low_res_image_path":  apod.low_res_image_path,
    "high_res_image_path": apod.high_res_image_path,
    "explanation":         apod.explanation,
    "date":                apod.date,
    "slug":                apod.slug,
    "votes":               apod.votes,
    "type":                apod.type
  }

@route('/assets/<filepath:path>', method='GET')
def server_asset(filepath):
  return static_file(filepath, root='./assets')

@route('/apod/:date/vote', method='GET')
def vote(date):
  vote = request.GET.get('rating_number')
  apod = Apod(date)
  apod.vote(vote)
  return None
