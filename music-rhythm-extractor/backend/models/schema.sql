-- Extension of existing Daily Rhythm Multiplier schema
-- This adds content extraction and organization tables

-- Content sources table
CREATE TABLE content_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL UNIQUE,
    platform TEXT NOT NULL CHECK (platform IN ('twitter', 'youtube', 'article', 'podcast')),
    author TEXT,
    title TEXT,
    posted_at TIMESTAMPTZ,
    extracted_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Extracted content table
CREATE TABLE extracted_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES content_sources(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('text', 'transcript', 'summary', 'thread')),
    raw_content TEXT,
    processed_content TEXT,
    summary TEXT,
    key_insights JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content categories
CREATE TABLE content_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color_hex TEXT,
    icon TEXT,
    parent_id UUID REFERENCES content_categories(id)
);

-- Content categorization (many-to-many)
CREATE TABLE content_categorization (
    content_id UUID REFERENCES extracted_content(id) ON DELETE CASCADE,
    category_id UUID REFERENCES content_categories(id) ON DELETE CASCADE,
    confidence DECIMAL(3,2) DEFAULT 1.0,
    PRIMARY KEY (content_id, category_id)
);

-- Lifestyle paths - connecting content to life patterns
CREATE TABLE lifestyle_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    path_type TEXT CHECK (path_type IN ('routine', 'goal', 'learning', 'transformation')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content to lifestyle path mapping
CREATE TABLE content_path_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES extracted_content(id) ON DELETE CASCADE,
    path_id UUID REFERENCES lifestyle_paths(id) ON DELETE CASCADE,
    relevance_score DECIMAL(3,2) DEFAULT 1.0,
    integration_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content documents - organized outputs
CREATE TABLE content_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    document_type TEXT CHECK (document_type IN ('summary', 'guide', 'checklist', 'routine')),
    content JSONB NOT NULL,
    category_id UUID REFERENCES content_categories(id),
    path_id UUID REFERENCES lifestyle_paths(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content rhythm integration - when to consume content
CREATE TABLE content_rhythm_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES extracted_content(id),
    document_id UUID REFERENCES content_documents(id),
    scheduled_date DATE,
    ultradian_block INTEGER CHECK (ultradian_block BETWEEN 1 AND 8),
    consumed BOOLEAN DEFAULT FALSE,
    consumed_at TIMESTAMPTZ,
    notes TEXT
);

-- Content insights tracking
CREATE TABLE content_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES extracted_content(id),
    insight_type TEXT CHECK (insight_type IN ('action', 'reflection', 'connection', 'question')),
    insight_text TEXT NOT NULL,
    applied BOOLEAN DEFAULT FALSE,
    impact_score INTEGER CHECK (impact_score BETWEEN 1 AND 10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_content_sources_platform ON content_sources(platform);
CREATE INDEX idx_content_sources_posted_at ON content_sources(posted_at DESC);
CREATE INDEX idx_extracted_content_source ON extracted_content(source_id);
CREATE INDEX idx_content_categorization_content ON content_categorization(content_id);
CREATE INDEX idx_content_categorization_category ON content_categorization(category_id);
CREATE INDEX idx_content_path_mapping_content ON content_path_mapping(content_id);
CREATE INDEX idx_content_path_mapping_path ON content_path_mapping(path_id);
CREATE INDEX idx_content_rhythm_schedule_date ON content_rhythm_schedule(scheduled_date);
CREATE INDEX idx_content_rhythm_schedule_consumed ON content_rhythm_schedule(consumed);

-- Views for easy querying
CREATE VIEW content_overview AS
SELECT 
    cs.id as source_id,
    cs.url,
    cs.platform,
    cs.author,
    cs.title,
    cs.posted_at,
    ec.id as content_id,
    ec.content_type,
    ec.summary,
    ec.key_insights,
    ARRAY_AGG(DISTINCT cc.name) as categories,
    ARRAY_AGG(DISTINCT lp.name) as lifestyle_paths
FROM content_sources cs
LEFT JOIN extracted_content ec ON cs.id = ec.source_id
LEFT JOIN content_categorization ccat ON ec.id = ccat.content_id
LEFT JOIN content_categories cc ON ccat.category_id = cc.id
LEFT JOIN content_path_mapping cpm ON ec.id = cpm.content_id
LEFT JOIN lifestyle_paths lp ON cpm.path_id = lp.id
GROUP BY cs.id, cs.url, cs.platform, cs.author, cs.title, cs.posted_at, 
         ec.id, ec.content_type, ec.summary, ec.key_insights;

-- Seed initial categories
INSERT INTO content_categories (name, description, color_hex, icon) VALUES
('Fitness', 'Physical training and exercise content', '#FF6B6B', 'dumbbell'),
('Nutrition', 'Diet, supplements, and nutritional advice', '#4ECDC4', 'apple'),
('Mindset', 'Mental health, meditation, and psychology', '#7B68EE', 'brain'),
('Business', 'Entrepreneurship and business strategies', '#FFD93D', 'briefcase'),
('Productivity', 'Time management and efficiency tips', '#95E1D3', 'clock'),
('Biohacking', 'Optimization of body and mind', '#F38181', 'dna'),
('Recovery', 'Rest, sleep, and recovery techniques', '#AA96DA', 'bed'),
('Lifestyle', 'General lifestyle and daily routine content', '#C7CEEA', 'home');