import os
from fabric.api import *

env.user = os.environ['USER']
env.hosts = ['astronomypics.net']
env.key_filename = [os.environ['HOME'] + "/.ssh/id_rsa"]

def deploy():
  path = '/var/www/apps/astronomy-pics'
  run('cd %(path)s; git checkout master' % {'path' : path})
  run('cd %(path)s; git pull' % {'path' : path})
  run('cd %(path)s; touch tmp/restart.txt' % {'path' : path})
