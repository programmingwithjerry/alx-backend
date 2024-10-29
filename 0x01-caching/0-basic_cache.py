#!/usr/bin/env python3
"""
Module implementing a basic caching mechanism.
"""

from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """A class for storing and retrieving items using a simple dictionary.
    """

    def put(self, key, item):
        """Stores an item in the cache using the specified key.
        """
        if key and item:
            self.cache_data[key] = item

    def get(self, key):
        """Fetches an item from the cache by its key.
        """
        return self.cache_data.get(key, None)
