from typing import Self

import csv
from itertools import islice

import db
from url import strip
from ..classes import IndexSource

class HackerNews(IndexSource):
  def __init__(self: Self) -> None: ...

  def sync(self: Self) -> None:
    cur = db.conn.cursor()
    data = []
    with open('assets/HackerNewsV4-12.csv', 'r', newline='') as f:
      r = csv.reader(f, delimiter=',', quotechar='"')
      for x in islice(r, 1, None):
        data.append((strip(x[2]), x[2], x[1]))
    cur.executemany("insert into news values (?, ?, ?, datetime('subsec'), null, null, null, null) on conflict do nothing", data)
    db.conn.commit()
