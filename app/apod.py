import pymongo
from pymongo import Connection
from bs4 import BeautifulSoup
import urllib
import re
import datetime

class Apod:

  def __init__(self, date):
    self.find_or_create(date)

  def find_or_create(self, date):
    apod_collection = self.collection()
    apod = apod_collection.find_one({"date": date})
    if apod is None:
      id = apod_collection.insert(self.scrape_apod(date))
      apod = apod_collection.find_one({"_id": id})

    self.title = apod['title']
    self.image_credit = apod['image_credit']
    self.high_res_image_path = apod['high_res_image_path']
    self.low_res_image_path = apod['low_res_image_path']
    self.explanation = apod['explanation']
    self.date = apod['date']
    self.created_at = apod['created_at']

  def scrape_apod(self, date):
    url = "http://apod.nasa.gov/apod/ap%s.html" % (date)
    page = urllib.urlopen(url)
    html = page.read()

    ## Repair markup
    start_indexes = []
    index = 0
    for m in re.finditer('<p>', html):
      index = index + 1
      if index % 2 == 0:
        start_indexes.append(m.start())
      
    for index in start_indexes:
      html = html[:(index + 2)] + "/" + html[(index + 2):]

    ## Parse HTML and break out pieces
    soup = BeautifulSoup(html)
    centers = soup.find_all('center')
    paragraphs = soup.find_all('p')

    ## Find the image paths
    base_image_url = "http://apod.nasa.gov/apod/"
    high_res_image_path = centers[0].find_all("a")[1].get("href")
    image_path = centers[0].img.get("src")

    ## Find the title
    title = centers[1].find_all("b")[0].text.strip()

    ## Find the image credit and cleanup
    centers[1].b.extract() ## Remove Title
    centers[1].b.unwrap() ## Remove other bold tags
    image_credit = centers[1].renderContents()
    image_credit = re.sub("<br>", "", image_credit) ## Remove line breaks
    image_credit = re.sub("</br>", "", image_credit)

    ## Find the explanation and cleanup
    paragraphs[2].b.extract()
    explanation = paragraphs[2].renderContents()
    
    apod = {
      "title":               title,
      "image_credit":        image_credit.encode('utf-8'),
      "high_res_image_path": base_image_url + high_res_image_path,
      "low_res_image_path":  base_image_url + image_path,
      "explanation":         explanation,
      "date":                date,
      "created_at":          datetime.datetime.utcnow()
    }
    return apod

  def collection(self):
    connection = Connection('localhost', 27017)

    database = connection.astronomy_pics
    apod_collection = database.apod
    return apod_collection
