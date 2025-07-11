"""
Base Extractor
Abstract base class for all content extractors
"""

import asyncio
import logging
from abc import ABC, abstractmethod
from typing import List, Dict, Any
from backend.models.content import ContentItem

class BaseExtractor(ABC):
    """Abstract base class for content extractors"""
    
    def __init__(self):
        self.logger = logging.getLogger(self.__class__.__name__)
        
    @abstractmethod
    def can_extract(self, url: str) -> bool:
        """Check if this extractor can handle the given URL"""
        pass
        
    @abstractmethod
    async def extract_content(self, url: str) -> List[ContentItem]:
        """Extract content from the given URL"""
        pass
        
    async def batch_extract(self, urls: List[str]) -> List[ContentItem]:
        """Extract content from multiple URLs"""
        all_content = []
        
        for url in urls:
            if self.can_extract(url):
                try:
                    content_items = await self.extract_content(url)
                    all_content.extend(content_items)
                except Exception as e:
                    self.logger.error(f"Failed to extract from {url}: {e}")
                    
        return all_content
        
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text content"""
        if not text:
            return ""
            
        # Remove extra whitespace
        text = " ".join(text.split())
        
        # Remove non-printable characters
        text = "".join(char for char in text if char.isprintable() or char.isspace())
        
        return text.strip()
        
    def _truncate_text(self, text: str, max_length: int = 1000) -> str:
        """Truncate text to maximum length"""
        if len(text) <= max_length:
            return text
            
        return text[:max_length - 3] + "..."