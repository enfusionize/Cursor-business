# Research Agent Extractor

AI agent research and academic content optimization

## Domain: Research

### Features

- **Specialized Extractors**: 6 domain-specific extractors
- **Custom Processors**: 4 tailored content processors  
- **Content Categories**: 8 specialized categories
- **Optimized Workflows**: Domain-specific lifestyle path generation

### Content Categories


#### Foundation
- **Description**: Foundational AI and ML concepts
- **Keywords**: foundation, basics, introduction, overview
- **Color**: #2196F3


#### Architectures
- **Description**: Neural network architectures
- **Keywords**: architecture, network, model, design
- **Color**: #9C27B0


#### Training
- **Description**: Training methodologies and optimization
- **Keywords**: training, optimization, learning, gradient
- **Color**: #FF5722


#### Applications
- **Description**: Real-world applications and use cases
- **Keywords**: application, use case, deployment, production
- **Color**: #4CAF50


#### Datasets
- **Description**: Datasets and data processing
- **Keywords**: dataset, data, preprocessing, cleaning
- **Color**: #FF9800


#### Evaluation
- **Description**: Evaluation metrics and benchmarks
- **Keywords**: evaluation, metric, benchmark, testing
- **Color**: #795548


#### Agents
- **Description**: AI agents and autonomous systems
- **Keywords**: agent, autonomous, planning, reasoning
- **Color**: #E91E63


#### Multimodal
- **Description**: Multimodal AI and cross-domain learning
- **Keywords**: multimodal, vision, language, audio
- **Color**: #607D8B


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

- `/extract/paper` - Domain-specific endpoint
- `/extract/dataset` - Domain-specific endpoint
- `/analyze/methodology` - Domain-specific endpoint
- `/paths/research` - Domain-specific endpoint
- `/citations/analyze` - Domain-specific endpoint
- `/agents/track` - Domain-specific endpoint

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
