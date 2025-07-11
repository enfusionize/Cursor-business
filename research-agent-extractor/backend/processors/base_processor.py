"""
Base Processor
Abstract base class for all content processors
"""

import asyncio
import logging
from abc import ABC, abstractmethod
from typing import List, Dict, Any
from backend.models.content import ContentItem

class BaseProcessor(ABC):
    """Abstract base class for content processors"""
    
    def __init__(self):
        self.logger = logging.getLogger(self.__class__.__name__)
        
    @abstractmethod
    async def process_content(self, content_items: List[ContentItem]) -> List[ContentItem]:
        """Process content items and return modified versions"""
        pass
        
    async def process_single(self, content_item: ContentItem) -> ContentItem:
        """Process a single content item"""
        result = await self.process_content([content_item])
        return result[0] if result else content_item
        
    def _extract_keywords(self, text: str, max_keywords: int = 10) -> List[str]:
        """Extract keywords from text"""
        # Simple keyword extraction - can be enhanced with NLP
        words = text.lower().split()
        # Filter out common words and short words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'}
        
        keywords = [word for word in words if len(word) > 3 and word not in stop_words]
        
        # Count frequency and return most common
        word_freq = {}
        for word in keywords:
            word_freq[word] = word_freq.get(word, 0) + 1
            
        sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        return [word for word, freq in sorted_words[:max_keywords]]
        
    def _calculate_reading_time(self, text: str, words_per_minute: int = 200) -> int:
        """Calculate estimated reading time in minutes"""
        word_count = len(text.split())
        reading_time = max(1, word_count // words_per_minute)
        return reading_time
        
    def _extract_emotions(self, text: str) -> List[str]:
        """Extract emotional indicators from text"""
        emotion_keywords = {
            'positive': ['good', 'great', 'amazing', 'excellent', 'wonderful', 'fantastic', 'love', 'like', 'enjoy', 'happy', 'excited'],
            'negative': ['bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'frustrated', 'disappointed', 'sad'],
            'neutral': ['okay', 'fine', 'normal', 'standard', 'regular']
        }
        
        text_lower = text.lower()
        detected_emotions = []
        
        for emotion, keywords in emotion_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                detected_emotions.append(emotion)
                
        return detected_emotions or ['neutral']