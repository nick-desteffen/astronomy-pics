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

    self.source_html = apod['source_html']
    self.title = apod['title']
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

    ## Find the explanation
    explanation = paragraphs[2]
    
    apod = {
      "source_html": html.encode('utf-8'),
      "title": title,
      "high_res_image_path": base_image_url + high_res_image_path,
      "low_res_image_path": base_image_url + image_path,
      "explanation": explanation.encode('utf-8'),
      "date": date,
      "created_at": datetime.datetime.utcnow()
    }
    return apod

  def collection(self):
    connection = Connection('localhost', 27017)

    database = connection.astronomy_pics
    apod_collection = database.apod
    return apod_collection
