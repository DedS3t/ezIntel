from typing import Self

from abc import ABC
from abc import abstractmethod

class IndexSource(ABC):
  @abstractmethod
  def sync(self: Self) -> None: ...
