import pymongo
from pymongo import MongoClient
from bs4 import BeautifulSoup
import requests
import re
import datetime

class Apod:

  def __init__(self, date):
    apod_collection = self.collection()
    apod = apod_collection.find_one({"date": date})
    if apod is None:
      id = apod_collection.insert(self.scrape_apod(date))
      apod = apod_collection.find_one({"_id": id})

    self.id = apod['_id']
    self.title = apod['title']
    self.image_credit = apod['image_credit']
    self.high_res_image_path = apod['high_res_image_path']
    self.low_res_image_path = apod['low_res_image_path']
    self.explanation = apod['explanation']
    self.date = apod['date']
    self.created_at = apod['created_at']
    self.votes = apod['votes']
    self.slug = apod['slug']
    self.type = apod['type']

  def vote(self, vote):
    apod_collection = self.collection()
    votes = self.votes
    votes.append(int(vote))

    apod_collection.update(
      {'_id': self.id},
      {"$set": {'votes': votes}}
    )

  def scrape_apod(self, date):
    url = "http://apod.nasa.gov/apod/ap%s.html" % (date)
    page = requests.get(url)
    html = page.content.decode('utf-8')

    ## Repair markup
    start_indexes = []
    index = 0
    for p in re.finditer('<p>', html):
      index = index + 1
      if index % 2 == 0:
        start_indexes.append(p.start())

    for index in start_indexes:
      html = html[:(index + 2)] + "/" + html[(index + 2):]

    ## Parse HTML and break out pieces
    soup = BeautifulSoup(html, features="html.parser")
    centers = soup.find_all('center')
    paragraphs = soup.find_all('p')

    ## Find the image or video paths
    base_image_url = "//apod.nasa.gov/apod/"
    if len(centers[0].find_all("img")) > 0:
      high_res_image_path = base_image_url + centers[0].find_all("a")[1].get("href")
      low_res_image_path = base_image_url + centers[0].img.get("src")
      type = 'image'
    elif len(centers[0].find_all("iframe")) > 0:
      low_res_image_path = centers[0].iframe.get("src")
      high_res_image_path = centers[0].iframe.get("src")
      type = 'video'
    elif len(centers[0].find_all("object")) > 0:
      low_res_image_path = centers[0].object.get("data")
      high_res_image_path = centers[0].object.get("data")
      type = 'flash'
    else:
      high_res_image_path = base_image_url + soup.find_all("a")[1].get("href")
      low_res_image_path = base_image_url + soup.find_all('img')[0].get("src")
      type = 'image'

    ## Find the title
    title = centers[1].find_all("b")[0].text.strip()

    ## Find the image credit and cleanup
    centers[1].b.extract() ## Remove Title
    if not centers[1].b == None:
      centers[1].b.unwrap() ## Remove other bold tags

    image_credit = centers[1].renderContents().decode('utf-8', 'ignore')
    image_credit = re.sub("<br>", "", image_credit) ## Remove line breaks
    image_credit = re.sub("</br>", "", image_credit)

    ## Find the explanation and cleanup
    paragraphs[2].b.extract()
    explanation = paragraphs[2].renderContents().strip()

    ## Build the slug
    slug = re.sub(r'([^\s\w]|_)+', '', title)
    slug = slug.lower().replace(" ", "-")

    apod = {
      "title":               title,
      "image_credit":        image_credit,
      "high_res_image_path": high_res_image_path,
      "low_res_image_path":  low_res_image_path,
      "explanation":         explanation,
      "date":                date,
      "created_at":          datetime.datetime.utcnow(),
      "slug":                slug,
      "type":                type,
      "votes":               []
    }
    return apod

  def collection(self):
    connection = MongoClient('localhost', 27017)

    database = connection.astronomy_pics
    apod_collection = database.apod
    return apod_collection
