#!/usr/bin/env python3
"""This module provides a helper function for pagination.
"""
import csv
import math
from typing import Dict, List, Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """Calculate the start and end index for pagination.
    """
    start_index = (page - 1) * page_size
    end_index = page * page_size
    return (start_index, end_index)


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
        """Retrieves a specified page of data from the dataset.
        """
        assert type(page) == int and type(page_size) == int
        assert page > 0 and page_size > 0
        start_idx, end_idx = index_range(page, page_size)
        full_data = self.dataset()
        if start_idx > len(full_data):
            return []
        return full_data[start_idx:end_idx]

    def get_hyper(self, page: int = 1, page_size: int = 10) -> Dict:
        """Retrieves information about a specific page.
        """
        full_data = self.get_page(page, page_size)
        start_idx, end_idx = index_range(page, page_size)
        total_num_of_pages = math.ceil(len(self.__dataset) / page_size)
        return {
            'page_size': len(full_data),
            'page': page,
            'data': full_data,
            'next_page': page + 1 if end_idx < len(self.__dataset) else None,
            'prev_page': page - 1 if start_idx > 0 else None,
            'total_pages': total_num_of_pages
        }
