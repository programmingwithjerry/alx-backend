#!/usr/bin/env python3
"""
Module for a Most Recently Used (MRU) caching system.
"""

from collections import OrderedDict
from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """A cache implementing a Most Recently Used (MRU) eviction policy.
      When the cache reaches its limit, the most recently accessed item
      is removed first.
    """

    def __init__(self):
        """Sets up the cache with an ordered dictionary.
        """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """Stores an item in the cache. Evicts the most recently
           used item if the cache limit is exceeded.
        """
        if key is None or item is None:
            return
        if key not in self.cache_data:
            if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
                mru_key, _ = self.cache_data.popitem(False)
                print("DISCARD:", mru_key)
            self.cache_data[key] = item
            self.cache_data.move_to_end(key, last=False)
        else:
            self.cache_data[key] = item

    def get(self, key):
        """Fetches the item associated with the key and marks it
           as most recently used.
        """
        if key is not None and key in self.cache_data:
            self.cache_data.move_to_end(key, last=False)  # Update access order
        return self.cache_data.get(key, None)
