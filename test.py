import os
from app import models
from app.apod import Apod

apod = Apod('991204')
#apod.vote(5)

print apod.id
print apod.title
print apod.type
print apod.low_res_image_path
print apod.high_res_image_path
print apod.date
print apod.created_at
print apod.slug
print apod.votes
print apod.image_credit
print apod.explanation

