from urllib.parse import urlparse, urlunparse

def strip(url_str: str) -> str:
  url = urlparse(url_str)
  return f'{url.netloc}{url.path}'
