#!/usr/bin/env python3
"""
Module for a Least Recently Used (LRU) caching system.
"""

from collections import OrderedDict
from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """A cache implementing a Least Recently Used (LRU) eviction policy.
    Items are removed based on their usage, with the least recently accessed
    item being removed first when the cache limit is exceeded.
    """

    def __init__(self):
        """Sets up the cache using an ordered dictionary.
        """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """Stores an item in the cache. If the cache is full, removes the
           least recently used item.
        """
        if key is None or item is None:
            return
        if key not in self.cache_data:
            if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
                # Discard the least recently used item
                lru_key, _ = self.cache_data.popitem(True)
                print("DISCARD:", lru_key)
            self.cache_data[key] = item
            # Place the new item at the start
            self.cache_data.move_to_end(key, last=False)
        else:
            self.cache_data[key] = item

    def get(self, key):
        """Returns the item associated with the specified key
           and marks it as recently used.
        """
        if key is not None and key in self.cache_data:
            self.cache_data.move_to_end(key, last=False)  # Mark as recently used
        return self.cache_data.get(key, None)
