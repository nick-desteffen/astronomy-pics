from bottle import TEMPLATE_PATH, route, static_file, template, install
from apod import Apod

TEMPLATE_PATH.append("./app/templates")

@route('/')
def index():
  return template('index.tpl')

@route('/apod/:date')
def apod(date):
  apod = Apod(date)
  
  return {
    "title":               apod.title, 
    "image_credit":        apod.image_credit,
    "low_res_image_path":  apod.low_res_image_path, 
    "high_res_image_path": apod.high_res_image_path, 
    "explanation":         apod.explanation, 
    "date":                apod.date
  }

@route('/assets/<filepath:path>')
def server_asset(filepath):
  return static_file(filepath, root='./assets')
