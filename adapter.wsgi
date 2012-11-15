import sys, os, bottle

sys.path = ['/var/www/apps/astronomy-pics/'] + sys.path
os.chdir(os.path.dirname(__file__))

from app import views

application = bottle.default_app()
