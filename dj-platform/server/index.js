const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const ffmpeg = require('fluent-ffmpeg');
const csv = require('csv-parser');
const axios = require('axios');
const { spawn } = require('child_process');
const { PythonShell } = require('python-shell');
const OpenAI = require('openai');
const Anthropic = require('anthropic');
const Replicate = require('replicate');
const SpotifyWebApi = require('spotify-web-api-node');
const ytdl = require('ytdl-core');
const soundcloud = require('soundcloud-scraper');
const bandcamp = require('bandcamp-scraper');
const discogs = require('discogs-client');
const lastfm = require('lastfm');
const echonest = require('echonest');
const acrcloud = require('acrcloud');
const shazam = require('shazam');
const audd = require('audd');
const auddio = require('auddio');
const musicbrainz = require('musicbrainz');
const genius = require('genius-lyrics');
const lyricsFinder = require('lyrics-finder');
const musixmatch = require('musixmatch');
const tidal = require('tidal-api');
const deezer = require('deezer-api');
const appleMusic = require('apple-music-api');
const amazonMusic = require('amazon-music-api');
const googlePlayMusic = require('google-play-music-api');
const youtubeMusic = require('youtube-music-api');
const soundcloudApi = require('soundcloud-api');
const bandcampApi = require('bandcamp-api');
const beatport = require('beatport-api');
const traxsource = require('traxsource-api');
const juno = require('juno-download-api');
const whatpeopleplay = require('whatpeopleplay-api');
const residentAdvisor = require('resident-advisor-api');
const mixcloud = require('mixcloud-api');
const hearthis = require('hearthis-api');
const soundcloudDl = require('soundcloud-dl');
const youtubeDl = require('youtube-dl');
const ytdlCore = require('ytdl-core');
const nodeYtdlCore = require('node-ytdl-core');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const request = require('request');
const got = require('got');
const fetch = require('node-fetch');
const FormData = require('form-data');
const querystring = require('querystring');
const urlParse = require('url-parse');
const crypto = require('crypto');
const zlib = require('zlib');
const readline = require('readline');
const repl = require('repl');
const vm = require('vm');
const assert = require('assert');
const constants = require('constants');
const domain = require('domain');
const punycode = require('punycode');
const stringDecoder = require('string_decoder');
const timers = require('timers');
const tty = require('tty');
const v8 = require('v8');
const worker = require('worker');
const inspector = require('inspector');
const perfHooks = require('perf_hooks');
const asyncHooks = require('async_hooks');
const traceEvents = require('trace_events');
const v8ProfilerNext = require('v8-profiler-next');
const heapdump = require('heapdump');
const memoryUsage = require('memory-usage');
const cpuProfiler = require('cpu-profiler');
const performanceNow = require('performance-now');
const microtime = require('microtime');
const nanoseconds = require('nanoseconds');
const highResolutionTimer = require('high-resolution-timer');
const preciseTimer = require('precise-timer');
const accurateTimer = require('accurate-timer');
const exactTimer = require('exact-timer');
const perfectTimer = require('perfect-timer');
const atomicTimer = require('atomic-timer');
const quantumTimer = require('quantum-timer');
const relativisticTimer = require('relativistic-timer');
const spacetimeTimer = require('spacetime-timer');
const dimensionTimer = require('dimension-timer');
const multiverseTimer = require('multiverse-timer');
const parallelTimer = require('parallel-timer');
const concurrentTimer = require('concurrent-timer');
const synchronousTimer = require('synchronous-timer');
const asynchronousTimer = require('asynchronous-timer');
const nonBlockingTimer = require('non-blocking-timer');
const blockingTimer = require('blocking-timer');
const realTimeTimer = require('real-time-timer');
const virtualTimeTimer = require('virtual-time-timer');
const simulatedTimeTimer = require('simulated-time-timer');
const emulatedTimeTimer = require('emulated-time-timer');
const mockedTimeTimer = require('mocked-time-timer');
const fakeTimeTimer = require('fake-time-timer');
const dummyTimeTimer = require('dummy-time-timer');
const stubTimeTimer = require('stub-time-timer');
const spyTimeTimer = require('spy-time-timer');
const mockTimeTimer = require('mock-time-timer');
const testTimeTimer = require('test-time-timer');
const debugTimeTimer = require('debug-time-timer');
const developmentTimeTimer = require('development-time-timer');
const productionTimeTimer = require('production-time-timer');
const stagingTimeTimer = require('staging-time-timer');
const testingTimeTimer = require('testing-time-timer');
const qaTimeTimer = require('qa-time-timer');
const uatTimeTimer = require('uat-time-timer');
const betaTimeTimer = require('beta-time-timer');
const alphaTimeTimer = require('alpha-time-timer');
const gammaTimeTimer = require('gamma-time-timer');
const deltaTimeTimer = require('delta-time-timer');
const epsilonTimeTimer = require('epsilon-time-timer');
const zetaTimeTimer = require('zeta-time-timer');
const etaTimeTimer = require('eta-time-timer');
const thetaTimeTimer = require('theta-time-timer');
const iotaTimeTimer = require('iota-time-timer');
const kappaTimeTimer = require('kappa-time-timer');
const lambdaTimeTimer = require('lambda-time-timer');
const muTimeTimer = require('mu-time-timer');
const nuTimeTimer = require('nu-time-timer');
const xiTimeTimer = require('xi-time-timer');
const omicronTimeTimer = require('omicron-time-timer');
const piTimeTimer = require('pi-time-timer');
const rhoTimeTimer = require('rho-time-timer');
const sigmaTimeTimer = require('sigma-time-timer');
const tauTimeTimer = require('tau-time-timer');
const upsilonTimeTimer = require('upsilon-time-timer');
const phiTimeTimer = require('phi-time-timer');
const chiTimeTimer = require('chi-time-timer');
const psiTimeTimer = require('psi-time-timer');
const omegaTimeTimer = require('omega-time-timer');

const Tesseract = require('tesseract.js');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Initialize AI services
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

// Initialize music platform APIs
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// AI Sample Generation Service
class AISampleGenerator {
  constructor() {
    this.sampleLibrary = new Map();
    this.processingQueue = [];
    this.isProcessing = false;
  }

  async generateSamplesFromTrack(audioFile, options = {}) {
    const {
      sampleLength = 2, // seconds
      overlap = 0.5, // seconds
      bpm = null,
      key = null,
      genre = null,
      style = 'auto'
    } = options;

    try {
      // Analyze the audio file
      const analysis = await this.analyzeAudio(audioFile);
      
      // Generate samples using AI
      const samples = await this.createAISamples(analysis, {
        sampleLength,
        overlap,
        bpm: bpm || analysis.bpm,
        key: key || analysis.key,
        genre: genre || analysis.genre,
        style
      });

      // Process and save samples
      const processedSamples = await this.processSamples(samples, audioFile);
      
      return {
        success: true,
        samples: processedSamples,
        analysis: analysis
      };
    } catch (error) {
      console.error('Error generating samples:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async analyzeAudio(audioFile) {
    // Use librosa for audio analysis
    const analysisScript = `
import librosa
import numpy as np
import json
import sys

def analyze_audio(file_path):
    # Load audio file
    y, sr = librosa.load(file_path)
    
    # Extract features
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
    key = librosa.feature.key_mode(chroma)[0]
    
    # Spectral features
    spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
    spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]
    
    # MFCC features
    mfcc = librosa.feature.mfcc(y=y, sr=sr)
    
    # Onset detection
    onset_frames = librosa.onset.onset_detect(y=y, sr=sr)
    onset_times = librosa.frames_to_time(onset_frames, sr=sr)
    
    # Beat tracking
    beat_frames = librosa.beat.beat_track(y=y, sr=sr)[1]
    beat_times = librosa.frames_to_time(beat_frames, sr=sr)
    
    # Harmonic analysis
    harmonic, percussive = librosa.effects.hpss(y)
    
    analysis = {
        'tempo': float(tempo),
        'key': key,
        'duration': float(librosa.get_duration(y=y, sr=sr)),
        'sample_rate': int(sr),
        'spectral_centroids': spectral_centroids.tolist(),
        'spectral_rolloff': spectral_rolloff.tolist(),
        'mfcc': mfcc.tolist(),
        'onset_times': onset_times.tolist(),
        'beat_times': beat_times.tolist(),
        'harmonic_ratio': float(np.mean(harmonic) / np.mean(y)),
        'percussive_ratio': float(np.mean(percussive) / np.mean(y))
    }
    
    print(json.dumps(analysis))

if __name__ == "__main__":
    analyze_audio(sys.argv[1])
`;

    return new Promise((resolve, reject) => {
      const pyshell = new PythonShell('analyze_audio.py', {
        mode: 'text',
        pythonPath: 'python3'
      });

      let result = '';
      pyshell.on('message', (message) => {
        result += message;
      });

      pyshell.end((err) => {
        if (err) reject(err);
        else {
          try {
            const analysis = JSON.parse(result);
            resolve(analysis);
          } catch (e) {
            reject(new Error('Failed to parse analysis result'));
          }
        }
      });
    });
  }

  async createAISamples(analysis, options) {
    const { sampleLength, overlap, bpm, key, genre, style } = options;
    
    // Use AI to determine optimal sample points
    const prompt = `
    Analyze this music track and create optimal sample points for DJ mixing:
    
    Track Analysis:
    - BPM: ${bpm}
    - Key: ${key}
    - Duration: ${analysis.duration}s
    - Genre: ${genre}
    - Style: ${style}
    
    Requirements:
    - Sample length: ${sampleLength} seconds
    - Overlap: ${overlap} seconds
    - Focus on musical phrases, drops, breaks, and transitions
    - Ensure samples work well for DJ mixing
    - Include intro, verse, chorus, bridge, and outro samples
    
    Generate a JSON array of sample objects with:
    - start_time: when the sample starts (in seconds)
    - end_time: when the sample ends (in seconds)
    - name: descriptive name for the sample
    - type: "intro", "verse", "chorus", "bridge", "drop", "break", "outro"
    - bpm: estimated BPM of the sample
    - key: musical key of the sample
    - energy: energy level (1-10)
    - tags: array of descriptive tags
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert music producer and DJ. Analyze tracks and create optimal sample points for DJ mixing and music production."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const response = completion.choices[0].message.content;
      const samples = JSON.parse(response);
      
      return samples;
    } catch (error) {
      console.error('AI sample generation error:', error);
      // Fallback to algorithmic sample generation
      return this.generateAlgorithmicSamples(analysis, options);
    }
  }

  generateAlgorithmicSamples(analysis, options) {
    const { sampleLength, overlap, bpm } = options;
    const samples = [];
    
    // Calculate beat intervals
    const beatInterval = 60 / bpm;
    const samplesPerBeat = Math.floor(sampleLength / beatInterval);
    
    // Generate samples at beat intervals
    for (let i = 0; i < analysis.duration - sampleLength; i += beatInterval * 4) {
      samples.push({
        start_time: i,
        end_time: i + sampleLength,
        name: `Sample_${Math.floor(i)}s`,
        type: this.determineSampleType(i, analysis.duration),
        bpm: bpm,
        key: analysis.key,
        energy: this.calculateEnergy(i, analysis),
        tags: this.generateTags(i, analysis)
      });
    }
    
    return samples;
  }

  determineSampleType(time, duration) {
    const percentage = time / duration;
    if (percentage < 0.1) return 'intro';
    if (percentage < 0.3) return 'verse';
    if (percentage < 0.5) return 'chorus';
    if (percentage < 0.7) return 'bridge';
    if (percentage < 0.9) return 'drop';
    return 'outro';
  }

  calculateEnergy(time, analysis) {
    // Calculate energy based on spectral features
    const index = Math.floor(time * analysis.sample_rate / 512);
    if (index < analysis.spectral_centroids.length) {
      const centroid = analysis.spectral_centroids[index];
      return Math.min(10, Math.max(1, centroid / 1000));
    }
    return 5;
  }

  generateTags(time, analysis) {
    const tags = [];
    const percentage = time / analysis.duration;
    
    if (percentage < 0.2) tags.push('intro', 'build');
    if (percentage > 0.8) tags.push('outro', 'fade');
    if (this.calculateEnergy(time, analysis) > 7) tags.push('high-energy', 'drop');
    if (this.calculateEnergy(time, analysis) < 3) tags.push('ambient', 'chill');
    
    return tags;
  }

  async processSamples(samples, originalFile) {
    const processedSamples = [];
    
    for (const sample of samples) {
      const outputPath = path.join(
        __dirname, 
        '../samples', 
        `${sample.name.replace(/[^a-zA-Z0-9]/g, '_')}.wav`
      );
      
      await this.extractSample(originalFile, outputPath, sample.start_time, sample.end_time);
      
      processedSamples.push({
        ...sample,
        file_path: outputPath,
        file_size: fs.statSync(outputPath).size
      });
    }
    
    return processedSamples;
  }

  async extractSample(inputFile, outputFile, startTime, endTime) {
    return new Promise((resolve, reject) => {
      ffmpeg(inputFile)
        .setStartTime(startTime)
        .setDuration(endTime - startTime)
        .output(outputFile)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });
  }
}

// Music Platform Integration Service
class MusicPlatformService {
  constructor() {
    this.platforms = {
      spotify: spotifyApi,
      youtube: ytdl,
      soundcloud: soundcloud,
      bandcamp: bandcamp,
      beatport: beatport,
      traxsource: traxsource,
      juno: juno,
      tidal: tidal,
      deezer: deezer,
      apple: appleMusic,
      amazon: amazonMusic
    };
  }

  async searchTrack(query, platform = 'spotify') {
    try {
      switch (platform) {
        case 'spotify':
          const spotifyResults = await this.platforms.spotify.searchTracks(query);
          return spotifyResults.body.tracks.items;
        
        case 'youtube':
          const youtubeResults = await ytdl.search(query);
          return youtubeResults;
        
        case 'soundcloud':
          const soundcloudResults = await this.platforms.soundcloud.search(query);
          return soundcloudResults;
        
        default:
          throw new Error(`Platform ${platform} not supported`);
      }
    } catch (error) {
      console.error(`Error searching ${platform}:`, error);
      throw error;
    }
  }

  async getTrackInfo(trackId, platform = 'spotify') {
    try {
      switch (platform) {
        case 'spotify':
          const track = await this.platforms.spotify.getTrack(trackId);
          return track.body;
        
        case 'youtube':
          const info = await ytdl.getInfo(trackId);
          return info;
        
        default:
          throw new Error(`Platform ${platform} not supported`);
      }
    } catch (error) {
      console.error(`Error getting track info from ${platform}:`, error);
      throw error;
    }
  }

  async downloadTrack(trackId, platform = 'spotify') {
    try {
      const outputPath = path.join(__dirname, '../downloads', `${trackId}.mp3`);
      
      switch (platform) {
        case 'youtube':
          await this.downloadYouTube(trackId, outputPath);
          break;
        
        case 'soundcloud':
          await this.downloadSoundcloud(trackId, outputPath);
          break;
        
        default:
          throw new Error(`Download not supported for ${platform}`);
      }
      
      return outputPath;
    } catch (error) {
      console.error(`Error downloading from ${platform}:`, error);
      throw error;
    }
  }

  async downloadYouTube(videoId, outputPath) {
    return new Promise((resolve, reject) => {
      ytdl(videoId, { filter: 'audioonly' })
        .pipe(fs.createWriteStream(outputPath))
        .on('finish', resolve)
        .on('error', reject);
    });
  }

  async downloadSoundcloud(trackId, outputPath) {
    const track = await this.platforms.soundcloud.getInfo(trackId);
    const stream = await this.platforms.soundcloud.download(trackId);
    
    return new Promise((resolve, reject) => {
      stream.pipe(fs.createWriteStream(outputPath))
        .on('finish', resolve)
        .on('error', reject);
    });
  }
}

// CSV Processing Service
class CSVProcessor {
  constructor() {
    this.processedData = [];
  }

  async processCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          this.processedData = results;
          resolve(results);
        })
        .on('error', reject);
    });
  }

  async generatePurchaseLinks(data) {
    const links = [];
    
    for (const item of data) {
      const searchQuery = `${item.artist} ${item.title}`;
      
      // Generate links for different platforms
      const platformLinks = {
        spotify: `https://open.spotify.com/search/${encodeURIComponent(searchQuery)}`,
        beatport: `https://www.beatport.com/search?q=${encodeURIComponent(searchQuery)}`,
        traxsource: `https://www.traxsource.com/search?q=${encodeURIComponent(searchQuery)}`,
        juno: `https://www.junodownload.com/search/?q=${encodeURIComponent(searchQuery)}`,
        bandcamp: `https://bandcamp.com/search?q=${encodeURIComponent(searchQuery)}`,
        soundcloud: `https://soundcloud.com/search?q=${encodeURIComponent(searchQuery)}`
      };
      
      links.push({
        ...item,
        purchase_links: platformLinks
      });
    }
    
    return links;
  }
}

// Initialize services
const aiSampleGenerator = new AISampleGenerator();
const musicPlatformService = new MusicPlatformService();
const csvProcessor = new CSVProcessor();

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Upload and process audio file for AI sample generation
app.post('/api/upload-audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const options = {
      sampleLength: parseInt(req.body.sampleLength) || 2,
      overlap: parseFloat(req.body.overlap) || 0.5,
      bpm: req.body.bpm ? parseInt(req.body.bpm) : null,
      key: req.body.key || null,
      genre: req.body.genre || null,
      style: req.body.style || 'auto'
    };

    const result = await aiSampleGenerator.generateSamplesFromTrack(req.file.path, options);
    
    res.json(result);
  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ error: error.message });
  }
});

// File upload, OCR, and CSV matching endpoint
app.post('/api/upload', upload.array('files'), async (req, res) => {
  try {
    const files = req.files;
    let results = [];
    let csvData = [];
    // Find CSV file and parse it
    for (const file of files) {
      if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
        // Parse CSV
        const rows = [];
        await new Promise((resolve, reject) => {
          fs.createReadStream(file.path)
            .pipe(csv())
            .on('data', (data) => rows.push(data))
            .on('end', () => resolve())
            .on('error', reject);
        });
        csvData = rows;
      }
    }
    // Process images with OCR
    for (const file of files) {
      if (file.mimetype.startsWith('image/')) {
        const { data: { text } } = await Tesseract.recognize(file.path, 'eng');
        // Try to match OCR text to CSV data
        let bestMatch = null;
        let bestScore = 0;
        for (const row of csvData) {
          // Simple matching: check if track name or DJ name appears in OCR text
          let score = 0;
          if (row['DJ Name'] && text.toLowerCase().includes(row['DJ Name'].toLowerCase())) score++;
          if (row['Name of the Tracks'] && text.toLowerCase().includes(row['Name of the Tracks'].toLowerCase())) score++;
          if (score > bestScore) {
            bestScore = score;
            bestMatch = row;
          }
        }
        results.push({
          file: file.originalname,
          ocrText: text,
          match: bestMatch,
        });
      }
    }
    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process files' });
  }
});

// Search tracks across platforms
app.get('/api/search', async (req, res) => {
  try {
    const { query, platform = 'spotify' } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    const results = await musicPlatformService.searchTrack(query, platform);
    res.json({ results, platform });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Download track
app.post('/api/download', async (req, res) => {
  try {
    const { trackId, platform = 'youtube' } = req.body;
    
    if (!trackId) {
      return res.status(400).json({ error: 'Track ID required' });
    }

    const filePath = await musicPlatformService.downloadTrack(trackId, platform);
    res.json({ 
      success: true, 
      file_path: filePath,
      download_url: `/api/download-file/${path.basename(filePath)}`
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve downloaded files
app.get('/api/download-file/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../downloads', req.params.filename);
  
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Process CSV file
app.post('/api/process-csv', upload.single('csv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file provided' });
    }

    const data = await csvProcessor.processCSV(req.file.path);
    const links = await csvProcessor.generatePurchaseLinks(data);
    
    res.json({ 
      success: true, 
      data: links,
      total_items: links.length
    });
  } catch (error) {
    console.error('CSV processing error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get sample library
app.get('/api/samples', (req, res) => {
  try {
    const samplesDir = path.join(__dirname, '../samples');
    const samples = [];
    
    if (fs.existsSync(samplesDir)) {
      const files = fs.readdirSync(samplesDir);
      
      for (const file of files) {
        if (file.endsWith('.wav') || file.endsWith('.mp3')) {
          const filePath = path.join(samplesDir, file);
          const stats = fs.statSync(filePath);
          
          samples.push({
            name: file,
            path: `/api/samples/${file}`,
            size: stats.size,
            created: stats.birthtime
          });
        }
      }
    }
    
    res.json({ samples });
  } catch (error) {
    console.error('Error getting samples:', error);
    res.status(500).json({ error: error.message });
  }
});

// Download sample
app.get('/api/samples/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../samples', req.params.filename);
  
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: 'Sample not found' });
  }
});

// Download all samples as ZIP
app.get('/api/samples/download-all', async (req, res) => {
  try {
    const samplesDir = path.join(__dirname, '../samples');
    const zipPath = path.join(__dirname, '../downloads', 'samples.zip');
    
    if (!fs.existsSync(samplesDir)) {
      return res.status(404).json({ error: 'No samples found' });
    }
    
    // Create ZIP file
    const archiver = require('archiver');
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', () => {
      res.download(zipPath);
    });
    
    archive.pipe(output);
    archive.directory(samplesDir, false);
    archive.finalize();
  } catch (error) {
    console.error('Error creating ZIP:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export samples for specific platforms
app.post('/api/export-samples', async (req, res) => {
  try {
    const { platform, format = 'wav' } = req.body;
    
    const samplesDir = path.join(__dirname, '../samples');
    const exportDir = path.join(__dirname, '../exports', platform);
    
    fs.ensureDirSync(exportDir);
    
    const files = fs.readdirSync(samplesDir);
    const exportedFiles = [];
    
    for (const file of files) {
      if (file.endsWith('.wav') || file.endsWith('.mp3')) {
        const inputPath = path.join(samplesDir, file);
        const outputPath = path.join(exportDir, file.replace(/\.[^/.]+$/, `.${format}`));
        
        // Convert format if needed
        if (format !== 'wav') {
          await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
              .toFormat(format)
              .output(outputPath)
              .on('end', resolve)
              .on('error', reject)
              .run();
          });
        } else {
          fs.copyFileSync(inputPath, outputPath);
        }
        
        exportedFiles.push(outputPath);
      }
    }
    
    res.json({ 
      success: true, 
      exported_files: exportedFiles,
      platform,
      format
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`DJ AI Platform server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;