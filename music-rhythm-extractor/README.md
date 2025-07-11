# Music Rhythm Extractor

Music creation and audio content optimization

## Domain: Music

### Features

- **Specialized Extractors**: 6 domain-specific extractors
- **Custom Processors**: 4 tailored content processors  
- **Content Categories**: 6 specialized categories
- **Optimized Workflows**: Domain-specific lifestyle path generation

### Content Categories


#### Composition
- **Description**: Music composition and songwriting
- **Keywords**: compose, songwriting, melody, harmony
- **Color**: #E91E63


#### Production
- **Description**: Audio production and mixing
- **Keywords**: production, mixing, mastering, daw
- **Color**: #9C27B0


#### Theory
- **Description**: Music theory and analysis
- **Keywords**: theory, scales, chords, progression
- **Color**: #3F51B5


#### Inspiration
- **Description**: Musical inspiration and creativity
- **Keywords**: inspiration, creativity, artistic
- **Color**: #FF5722


#### Performance
- **Description**: Live performance and technique
- **Keywords**: performance, technique, practice
- **Color**: #FF9800


#### Collaboration
- **Description**: Musical collaboration and networking
- **Keywords**: collaboration, band, network
- **Color**: #4CAF50


### Quick Start

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Run the Application**:
   ```bash
   python backend/main.py
   ```

4. **Access the API**:
   - API Documentation: http://localhost:8000/docs
   - Domain Info: http://localhost:8000/domain/info

### API Endpoints

- `/extract/track` - Domain-specific endpoint
- `/extract/playlist` - Domain-specific endpoint
- `/analyze/audio` - Domain-specific endpoint
- `/generate/progression` - Domain-specific endpoint
- `/paths/creative` - Domain-specific endpoint
- `/collaboration/find` - Domain-specific endpoint

### Docker Deployment

```bash
docker-compose up -d
```

### Kubernetes Deployment

```bash
kubectl apply -f k8s-deployment.yaml
```

### Configuration

The domain configuration is stored in `config/domain.yaml`. You can customize:

- Extractors and their settings
- Content processors and priorities  
- UI themes and colors
- Lifestyle path preferences

### Contributing

This is a specialized version of the Content Rhythm Extractor. 
See the main project for contribution guidelines.

### License

Same as the main Content Rhythm Extractor project.
