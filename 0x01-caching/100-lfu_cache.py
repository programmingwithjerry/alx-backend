#!/usr/bin/env python3
"""
Module for a Least Frequently Used (LFU) caching system.
"""

from collections import OrderedDict
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """A cache that implements a Least Frequently Used (LFU) eviction strategy.
    When the cache exceeds its limit, it removes the item with the lowest access frequency.
    """

    def __init__(self):
        """Sets up the cache with an ordered dictionary to store items and a frequency list.
        """
        super().__init__()
        self.cache_data = OrderedDict()
        self.keys_freq = []

    def __reorder_items(self, mru_key):
        """Reorganizes items in the cache based on frequency, promoting the most recently used item.
        """
        max_positions = []
        mru_freq = 0
        mru_pos = 0
        ins_pos = 0

        for i, key_freq in enumerate(self.keys_freq):
            if key_freq[0] == mru_key:
                mru_freq = key_freq[1] + 1  # Increment the frequency for the accessed item
                mru_pos = i
                break
            elif len(max_positions) == 0:
                max_positions.append(i)
            elif key_freq[1] < self.keys_freq[max_positions[-1]][1]:
                max_positions.append(i)

        max_positions.reverse()
        for pos in max_positions:
            if self.keys_freq[pos][1] >= mru_freq:
                break
            ins_pos = pos

        self.keys_freq.pop(mru_pos)
        self.keys_freq.insert(ins_pos, [mru_key, mru_freq])

    def put(self, key, item):
        """Adds an item to the cache. If the cache is full, evicts the least frequently used item.
        """
        if key is None or item is None:
            return

        if key not in self.cache_data:
            if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
                lfu_key, _ = self.keys_freq[-1]  # Identify and remove the least frequently used item
                self.cache_data.pop(lfu_key)
                self.keys_freq.pop()
                print("DISCARD:", lfu_key)

            self.cache_data[key] = item
            ins_index = len(self.keys_freq)
            for i, key_freq in enumerate(self.keys_freq):
                if key_freq[1] == 0:  # Position the new item based on frequency
                    ins_index = i
                    break
            self.keys_freq.insert(ins_index, [key, 0])
        else:
            self.cache_data[key] = item
            self.__reorder_items(key)

    def get(self, key):
        """Fetches an item by key, updating its access frequency.
        """
        if key is not None and key in self.cache_data:
            self.__reorder_items(key)
        return self.cache_data.get(key, None)