from app import models
from app.apod import Apod

apod = Apod('120922')
apod.vote(5)

# print apod.title
# print apod.explanation
# print apod.high_res_image_path