#!/usr/bin/env python3
"""
This module provides a helper function for pagination.

The `index_range` function calculates the start and end indexes for items on
a specific page of data, based on the page number and page size. This is useful
for paginating large datasets, where data is shown in chunks rather than all
at once.
"""

from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    Calculate the start and end index for pagination.

    This function takes a page number and page size as arguments and returns
    a tuple containing the start and end indexes for the items on that page.
    The indexes are calculated based on a 1-indexed page system, meaning that
    the first page is considered to be page 1.

    Parameters:
    - page (int): The current page number (1-indexed).
    - page_size (int): The number of items per page.

    Returns:
    - Tuple[int, int]: A tuple containing the start and end indexes for the 
      items on the current page.
    """
    start_index = (page - 1) * page_size
    end_index = page * page_size
    return start_index, end_index
