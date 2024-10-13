import db

cur = db.conn.cursor()

cur.execute('''
  create table news (
    id text primary key, -- (over)cleaned url
    url text not null,
    title text,
    imported_at text not null,
    alignment real,
    alignment_justification text,
    summary text,
    summarized_at text
  ) without rowid, strict
''')

cur.execute('''
  create table tapes (
    id text primary key,
    context text not null,
    created_at text not null
  )
''')

cur.execute('''
  create table hydrations (
    news_id text references news (id) on delete cascade,
    tape_id text references tapes (id) on delete cascade,
    alignment real not null,
    alignment_justification text,
    hydrated_at text not null,
    primary key (news_id, tape_id)
  )
''')

cur.execute('''
  create table sessions (
    id text primary key,
    tape_id text references tapes (id) on delete cascade,
    at text not null,
    at_news_id text not null
  ) without rowid, strict
''')
