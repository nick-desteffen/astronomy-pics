import os
import sys
import bottle
from app import views

sys.path.append('/var/www/apps/astronomy-pics')

os.environ['PYTHON_EGG_CACHE'] = '/var/www/apps/astronomy-pics/.python-egg'

application = bottle.default_app()
