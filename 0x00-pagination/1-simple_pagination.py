#!/usr/bin/env python3
"""This module provides a helper function for pagination.
"""
import csv
import math
from typing import List, Tuple


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
    
        """
        Retrieves a specified page of data from the dataset.
        """
        # Validate that page and page_size are positive integers.
        assert isinstance(page, int) and isinstance(page_size, int),
        assert page > 0 and page_size > 0, "Page and page_size must be positive values."

        # Calculate the start and end indices for the specified page.
        start_idx, end_idx = index_range(page, page_size)

        # Retrieve the complete dataset.
        full_data = self.dataset()

        # If start index exceeds the dataset size, return an empty list (page out of range).
        if start_idx >= len(full_data):
            return []

        # Return the subset of data between the calculated start and end indices.
        return full_data[start_idx:end_idx]
