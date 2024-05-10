#!/usr/bin/python3
""" task 0"""
BaseCaching = __import__("base_caching").BaseCaching


class BasicCache(BaseCaching):
    """class ingerting from BaseCashing"""

    def put(self, key, item):
        """putting data"""
        if key and item:
            self.cache_data[key] = item

    def get(self, key):
        """getting data"""
        return self.cache_data.get(key)
