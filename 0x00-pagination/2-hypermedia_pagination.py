#!/usr/bin/env python3
"""task 2"""
import math
from typing import List, Tuple
import csv

class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        Return the appropriate page of the dataset.
        """
        assert isinstance(page, int) and page > 0
        assert isinstance(page_size, int) and page_size > 0
        dataset = self.dataset()
        start, end = index_range(page, page_size)
        if start >= len(dataset):
            return []

        return dataset[start:end]

    def get_hyper(self, page: int = 1, page_size: int = 10) -> dict:
        """
        Return a dictionary containing information about the dataset page
        based on the pagination parameters.
        """
        dataset_page = self.get_page(page, page_size)
        total_pages = math.ceil(len(self.dataset()) / page_size)
        next_page = page + 1 if page < total_pages else None
        prev_page = page - 1 if page > 1 else None

        return {
            'page_size': len(dataset_page),
            'page': page,
            'data': dataset_page,
            'next_page': next_page,
            'prev_page': prev_page,
            'total_pages': total_pages
        }

