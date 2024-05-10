#!/usr/bin/python3
""" doc doc doc """
BaseCaching = __import__("base_caching").BaseCaching


class MRUCache(BaseCaching):
    """doc doc doc"""

    def __init__(self):
        """doc doc doc"""
        super().__init__()
        self.order = []

    def put(self, key, item):
        """dput method"""
        if key and item:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                removed = self.order.pop()
                self.cache_data.pop(removed)
                print("DISCARD: {}".format(removed))
            self.cache_data[key] = item
            self.order.append(key)

    def get(self, key):
        """get method"""
        if key in self.cache_data:
            self.order.remove(key)
            self.order.append(key)
            return self.cache_data.get(key)
