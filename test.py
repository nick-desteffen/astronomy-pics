from app import models
from app.models import Apod

apod = Apod('121009')

print apod.title
print apod.explanation
print apod.high_res_image_path