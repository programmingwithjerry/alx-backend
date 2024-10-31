#!/usr/bin/env python3
"""
Module for a Last-In First-Out (LIFO) caching system.
"""

from collections import OrderedDict
from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """A cache that stores items with a Last-In First-Out (LIFO)
       eviction policy. When the cache reaches its limit, the most
       recently added item is removed first.
    """

    def __init__(self):
        """Initializes the cache using an ordered dictionary.
        """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """Inserts an item into the cache. Evicts the newest
           item if the cache exceeds its limit.
        """
        if key is None or item is None:
            return
        if key not in self.cache_data:
            if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
                # Remove the most recent item
                last_key, _ = self.cache_data.popitem(True)
                print("DISCARD:", last_key)
        self.cache_data[key] = item
        # Ensure the new item is last in order
        self.cache_data.move_to_end(key, last=True)

    def get(self, key):
        """Returns the item associated with the
           specified key, if available.
        """
        return (self.cache_data.get(key, None))
