"""
Content Models
Defines the data structures for different types of content
"""

from enum import Enum
from typing import Dict, List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field

class ContentType(Enum):
    """Enum for different types of content"""
    TWEET = "tweet"
    VIDEO = "video"
    ARTICLE = "article"
    PODCAST = "podcast"
    MUSIC = "music"
    RESEARCH = "research"

class ContentItem(BaseModel):
    """Base model for content items"""
    id: str
    url: str
    content_type: ContentType
    title: str
    description: str = ""
    author: str = ""
    created_at: str = ""
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        use_enum_values = True

class ExtractedContent(BaseModel):
    """Model for extracted content with processing metadata"""
    content: ContentItem
    extracted_at: datetime
    extractor_used: str
    processing_status: str = "pending"
    ai_summary: str = ""
    categories: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    
class ProcessingResult(BaseModel):
    """Result of content processing"""
    content_id: str
    processor: str
    status: str
    result: Dict[str, Any] = Field(default_factory=dict)
    error_message: Optional[str] = None
    processed_at: datetime