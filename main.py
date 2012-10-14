import sys
import bottle
from app import views

if len(sys.argv) > 1 and sys.argv[1] == 'dev':
  bottle.debug(True)
  bottle.run(reloader=True, host='127.0.0.1')
else:
  bottle.run(host='0.0.0.0')
