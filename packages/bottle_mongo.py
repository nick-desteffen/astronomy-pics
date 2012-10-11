from bottle import PluginError, response
from pymongo import Connection
from pymongo.cursor import Cursor

import bson.json_util
from bottle import JSONPlugin
try:
 from json import dumps as json_dumps
except ImportError:
 from simplejson import dumps as json_dumps
import inspect

class MongoPlugin(object):
    """
    Mongo Plugin for Bottle
    Connect to a mongodb instance, and  add a DB in a Bottle callback
    Sample : 
    
    app = bottle.Bottle()
    plugin = bottle.ext.mongo.MongoPlugin(uri="...", db="mydb", json_mongo=True)
    app.install(plugin)

    @app.route('/show/:item')
    def show(item, mongodb):
        doc = mongodb['items'].find({item:"item")})
        return doc
    """
    api  = 2
    
    mongo_db = None
    def get_mongo(self):
        "Retrieve the mongo instance from the environment"
        if self.mongo_db: 
            return self.mongo_db
        connection = Connection(self.uri, **self.kwargs)
        self.mongo_db = connection[self.db]
        return connection[self.db]

    def __init__(self, uri, db, keyword='mongodb', json_mongo=False,  **kwargs):
        """
        uri : MongoDB hostname or uri
        db : Database 
        json_mongo : Override Bottle serializer using Mongo one
        keyword : Override parameter name in Bottle function.
        This constructor any optional parameter of the pymongo.Connection constructor.  
        """
        self.uri = uri
        self.db = db 
        self.keyword = keyword
        self.json_mongo = json_mongo
        self.kwargs = kwargs

    def normalize_object(self, obj):
        "Normalize mongo object for json serialization"
        if isinstance(obj, dict):
            if "_id" in obj: 
                obj["id"] = str(obj["_id"])
                del obj["_id"]
        if isinstance(obj, list):
            for a in obj: 
                self.normalize_object(a)



    def setup(self,app):
        for other in app.plugins:
            if not isinstance(other,MongoPlugin): continue
            if other.keyword == self.keyword:
                raise PluginError("Found another redis plugin with "\
                        "conflicting settings (non-unique keyword).")
                        
        # Remove builtin JSON Plugin
        if self.json_mongo:
            for other in app.plugins:
                if isinstance(other, JSONPlugin): 
                    app.uninstall(other)
                    return                         

    def apply(self, callback, context):
        dumps = json_dumps
        if not dumps: return callback
        
        args = inspect.getargspec(context.callback)[0]        
        
        def wrapper(*a, **ka):
            if self.keyword in args:
                ka[self.keyword] = self.get_mongo()
            rv = callback(*a, **ka)
            if self.json_mongo:  # Override builtin bottle JSON->String serializer  
                if isinstance(rv, Cursor):
                    rv = [record for record in rv]

                if isinstance(rv, dict) or isinstance(rv, list):
                    self.normalize_object(rv)
                    json_response = dumps(rv, default=bson.json_util.default)
                    response.content_type = 'application/json'
                    return json_response

            return rv
        return wrapper
