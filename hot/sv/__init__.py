from typing import Any

import sqlite3
import json

from flask import Flask

from hydration import hydrate_news

app = Flask(__name__)

@app.route('/session/<session_id>/read', methods=['POST'])
def read_tape(session_id: str) -> tuple[str, int, dict[str, str]]:
  conn = sqlite3.connect('hot.db')
  cur = conn.cursor()

  news_raw = cur.execute('''
    select n.id, n.url, n.title, n.summarized_at, n.alignment, n.summary from news n
    where n.summarized_at is not null and (
      case when (select count(*) from sessions s where s.id = ?) = 0 then
        true
      else
        case when n.summarized_at = (select s.at from sessions s where s.id = ?) then
          n.id > (select s.at_news_id from sessions s where s.id = ?)
        else
          n.summarized_at > (select s.at from sessions s where s.id = ?)
        end
      end
    )
    order by summarized_at, id
    limit 100
  ''', (session_id,session_id,session_id,session_id)).fetchmany()
  news: list[dict[str, Any]] = [dict(id=n[0], url=n[1], title=n[2], summarized_at=n[3], alignment=n[4], summary=n[5]) for n in news_raw]

  if news != []:
    last_news = news[len(news) - 1]
    cur.execute('''
      insert into sessions values (?, null, ?, ?)
      on conflict (id) do update set
        at = excluded.at,
        at_news_id = excluded.at_news_id
      where (
        case when excluded.at = sessions.at then
          excluded.at_news_id > sessions.at_news_id
        else
          excluded.at > sessions.at
        end
      )''', (session_id, last_news['summarized_at'], last_news['id']))
    conn.commit()

  return json.dumps(dict(news=news)), 200, {'content-type': 'application/json'}
