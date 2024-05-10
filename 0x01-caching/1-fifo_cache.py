#!/usr/bin/python3
""" task 1"""
BaseCaching = __import__("base_caching").BaseCaching


class FIFOCache(BaseCaching):
    """doc doc doc"""

    def __init__(self):
        """consturcture"""
        super().__init__()

    def put(self, key, item):
        """put method"""
        if key and item:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                removed = next(iter(self.cache_data))
                self.cache_data.pop(removed)
                print("DISCARD: {}".format(removed))
            self.cache_data[key] = item

    def get(self, key):
        """getting data"""
        return self.cache_data.get(key)
