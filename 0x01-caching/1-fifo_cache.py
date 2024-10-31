#!/usr/bin/env python3
"""
Module for a First-In First-Out (FIFO) caching system.
"""

from collections import OrderedDict
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """A cache that stores items with a First-In First-Out
      (FIFO) eviction policy. Items are removed in the order
      they were added when the cache limit is reached.
    """

    def __init__(self):
        """Sets up the cache using an ordered dictionary.
        """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """Stores an item in the cache. Removes the oldest
           item if the cache is full.
        """
        if key and item:
            self.cache_data[key] = item
        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            # Remove the first-added item
            first_key, _ = self.cache_data.popitem(False)
            print("DISCARD:", first_key)

    def get(self, key):
        """Returns the item associated with the specified key.
        """
        return self.cache_data.get(key, None)
