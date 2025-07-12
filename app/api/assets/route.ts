import { NextRequest, NextResponse } from 'next/server';

// Mock database for assets
const mockAssets = [
  {
    id: '1',
    name: 'Modern UI Kit',
    type: 'design',
    url: '/api/assets/1',
    thumbnail: '/thumbnails/ui-kit.png',
    creator: 'Design Team',
    created: '2024-01-15T10:30:00Z',
    tags: ['ui', 'kit', 'modern', 'components'],
    description: 'Complete UI kit with modern components for web and mobile applications',
    likes: 245,
    downloads: 1200,
    remixes: 45,
    aiGenerated: false,
    sourceFiles: ['ui-kit.fig', 'ui-kit.sketch', 'ui-kit.psd'],
    metadata: {
      width: 1920,
      height: 1080,
      format: 'Multi-format',
      size: 15728640,
      tools: ['Figma', 'Sketch', 'Photoshop']
    }
  },
  {
    id: '2',
    name: 'AI Brand Identity',
    type: 'image',
    url: '/api/assets/2',
    thumbnail: '/thumbnails/brand-identity.png',
    creator: 'AI Assistant',
    created: '2024-01-14T15:45:00Z',
    tags: ['branding', 'logo', 'identity', 'ai-generated'],
    description: 'AI-generated brand identity system with logos, colors, and typography',
    likes: 189,
    downloads: 856,
    remixes: 78,
    aiGenerated: true,
    sourceFiles: ['brand-identity.ai', 'brand-identity.svg', 'brand-identity.png'],
    metadata: {
      width: 2048,
      height: 1536,
      format: 'PNG',
      size: 5242880,
      tools: ['Midjourney', 'Illustrator']
    }
  },
  {
    id: '3',
    name: 'Motion Graphics Pack',
    type: 'video',
    url: '/api/assets/3',
    thumbnail: '/thumbnails/motion-graphics.png',
    creator: 'Animation Studio',
    created: '2024-01-13T09:15:00Z',
    tags: ['motion', 'graphics', 'animation', 'pack'],
    description: 'Professional motion graphics elements for video production',
    likes: 312,
    downloads: 1456,
    remixes: 23,
    aiGenerated: false,
    sourceFiles: ['motion-pack.aep', 'motion-pack.mov', 'motion-pack.mp4'],
    metadata: {
      width: 1920,
      height: 1080,
      format: 'MP4',
      size: 104857600,
      tools: ['After Effects', 'Cinema 4D']
    }
  },
  {
    id: '4',
    name: 'AI Website Template',
    type: 'design',
    url: '/api/assets/4',
    thumbnail: '/thumbnails/website-template.png',
    creator: 'AI Designer',
    created: '2024-01-12T14:20:00Z',
    tags: ['website', 'template', 'ai-generated', 'responsive'],
    description: 'Responsive website template generated with AI assistance',
    likes: 167,
    downloads: 543,
    remixes: 34,
    aiGenerated: true,
    sourceFiles: ['website-template.fig', 'website-template.html', 'website-template.css'],
    metadata: {
      width: 1440,
      height: 7200,
      format: 'HTML/CSS',
      size: 2097152,
      tools: ['Figma', 'OpenAI', 'Claude']
    }
  },
  {
    id: '5',
    name: 'Icon Library',
    type: 'design',
    url: '/api/assets/5',
    thumbnail: '/thumbnails/icon-library.png',
    creator: 'Icon Designer',
    created: '2024-01-11T11:30:00Z',
    tags: ['icons', 'library', 'ui', 'symbols'],
    description: 'Comprehensive icon library with 500+ icons in multiple styles',
    likes: 428,
    downloads: 2134,
    remixes: 89,
    aiGenerated: false,
    sourceFiles: ['icons.sketch', 'icons.svg', 'icons.png'],
    metadata: {
      format: 'SVG',
      size: 8388608,
      tools: ['Sketch', 'Illustrator']
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const creator = searchParams.get('creator');
    const tags = searchParams.get('tags');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredAssets = [...mockAssets];

    // Filter by type
    if (type && type !== 'all') {
      filteredAssets = filteredAssets.filter(asset => asset.type === type);
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredAssets = filteredAssets.filter(asset => 
        asset.name.toLowerCase().includes(searchLower) ||
        asset.description.toLowerCase().includes(searchLower) ||
        asset.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter by creator
    if (creator) {
      filteredAssets = filteredAssets.filter(asset => 
        asset.creator.toLowerCase().includes(creator.toLowerCase())
      );
    }

    // Filter by tags
    if (tags) {
      const tagList = tags.split(',').map(tag => tag.trim().toLowerCase());
      filteredAssets = filteredAssets.filter(asset => 
        tagList.some(tag => asset.tags.some(assetTag => assetTag.toLowerCase().includes(tag)))
      );
    }

    // Pagination
    const paginatedAssets = filteredAssets.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedAssets,
      meta: {
        total: filteredAssets.length,
        offset,
        limit,
        hasMore: offset + limit < filteredAssets.length
      }
    });

  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, description, tags, metadata } = body;

    // Validate required fields
    if (!name || !type || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new asset
    const newAsset = {
      id: Date.now().toString(),
      name,
      type,
      url: `/api/assets/${Date.now()}`,
      thumbnail: `/thumbnails/${Date.now()}.png`,
      creator: 'Current User', // In real app, get from auth
      created: new Date().toISOString(),
      tags: tags || [],
      description,
      likes: 0,
      downloads: 0,
      remixes: 0,
      aiGenerated: false,
      sourceFiles: [],
      metadata: metadata || {}
    };

    // In real app, save to database
    mockAssets.push(newAsset);

    return NextResponse.json({
      success: true,
      data: newAsset
    });

  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create asset' },
      { status: 500 }
    );
  }
}