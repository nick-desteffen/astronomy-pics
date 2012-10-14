from bottle import TEMPLATE_PATH, route, static_file, template, install
from models import Apod

TEMPLATE_PATH.append("./app/templates")

@route('/')
def index():
  return template('index.tpl')

@route('/apod/:date')
def apod(date):
  apod = Apod(date)
  return {"title": apod.title}

@route('/assets/<filepath:path>')
def server_asset(filepath):
  return static_file(filepath, root='./assets')
