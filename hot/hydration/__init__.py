from datetime import datetime

from openai import OpenAI
from firecrawl import FirecrawlApp  # type: ignore

# TODO refactor
oai = OpenAI()
fc = FirecrawlApp()

import db

def gpt4o(prompt: str) -> str:
  res = oai.chat.completions.create(model='gpt-4o', messages=[
    {'role': 'user', 'content': prompt},
  ]).choices[0].message.content
  if res is None:
    raise RuntimeError('[hydration.gpt4o] content is None')

  return res

def hydrate_news(news_id: str) -> None:
  cur = db.conn.cursor()
  news = cur.execute('select url from news where id = ?', (news_id,)).fetchone()
  url = news[0]

  md = fc.scrape_url(url, params={'formats': ['markdown']})['markdown']
  print(f'[hydration.hydrate_news] got {len(md)} characters of news from {url}')

  oai = OpenAI()
  summary = gpt4o(f'below is a web page scraped into markdown. read it and give a summary detailed enough to convince me that you deeply read the entire article.\n\n-------\n\n{md}').strip()
  alignment_full = gpt4o(f'below is a web page scraped into markdown. read it and tell me how well it aligns with the following criteria:\n  1. has enough content to be considered a full article\n  2. can be loosely classified as a tech news article\n  3. is "hot"\n  4. is recent (it is currently {datetime.now().isoformat()})\nafter you read the below markdown, format your response as a composite score from 0 to 10 in one line, and then your justification below your response\n\n-------\n\n{md}').strip()
  alignment, justification = alignment_full.split('\n', 1)

  cur.execute("update news set alignment = ?, alignment_justification = ?, summary = ?, summarized_at = datetime('subsec') where id = ?", (float(alignment) / 10, justification, summary, news_id))
  db.conn.commit()
