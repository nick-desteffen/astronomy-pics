from bottle import TEMPLATE_PATH, route, static_file, template, install
from bottle_mongo import MongoPlugin
from models import *

TEMPLATE_PATH.append("./app/templates")

plugin = MongoPlugin(uri="mongodb://localhost:27020", db="astronomy_pics", json_mongo=True)
install(plugin)

@route('/')
def index():
  return template('index.tpl')

@route('/assets/<filepath:path>')
def server_asset(filepath):
  return static_file(filepath, root='./assets')