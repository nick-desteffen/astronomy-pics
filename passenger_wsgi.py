import os, sys, bottle

nginx_configuration = os.path.dirname(__file__)
project = os.path.dirname(nginx_configuration)
workspace = os.path.dirname(project)
sys.path.append(workspace) 

from app import views

def application(environment, response): 
  return bottle.default_app().wsgi(environment, response) 

