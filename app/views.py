import os
from bottle import TEMPLATE_PATH, route, static_file, template, install, request
from apod import Apod

BASE_PATH = os.path.dirname(os.path.abspath(__file__))

TEMPLATE_PATH.append(BASE_PATH + "/templates")

@route('/', method='GET')
def index():
  return template('index.tpl')

@route('/about', method='GET')
def about():
  return template('about.tpl')

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
  return static_file(filepath, root=BASE_PATH + '/../assets')

@route('/apod/:date/vote', method='POST')
def vote(date):
  vote = request.POST.get('vote')
  apod = Apod(date)
  apod.vote(vote)
  return None
