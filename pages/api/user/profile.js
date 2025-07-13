// User Profile API for millionaire investors
export default function handler(req, res) {
  const { method } = req;

  // Mock user data - in production, use proper authentication and database
  const userProfile = {
    id: 'user_123',
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    joinDate: '2024-01-15',
    netWorth: 2500000,
    investmentExperience: 'Intermediate',
    riskTolerance: 'Medium',
    investmentGoals: [
      'Wealth Preservation',
      'Sustainable Growth',
      'Positive Impact',
      'Diversification'
    ],
    consciousInvestingPreferences: {
      priorityAreas: [
        'Climate Change',
        'Social Justice',
        'Healthcare Innovation',
        'Education Access'
      ],
      excludedIndustries: [
        'Tobacco',
        'Weapons',
        'Fossil Fuels',
        'Gambling'
      ],
      impactGoals: {
        carbonNeutral: true,
        socialImpactTarget: 25, // percentage
        sustainabilityRating: 'A+',
        philanthropicAllocation: 5 // percentage
      }
    },
    preferences: {
      notifications: {
        portfolioUpdates: true,
        marketInsights: true,
        impactReports: true,
        rebalanceAlerts: true
      },
      dashboard: {
        defaultView: 'comprehensive',
        chartPreferences: ['performance', 'impact', 'allocation'],
        updateFrequency: 'daily'
      }
    },
    achievements: [
      {
        id: 1,
        name: 'Conscious Investor',
        description: 'Achieved 65%+ ESG allocation',
        earnedDate: '2024-03-01',
        icon: '🌱'
      },
      {
        id: 2,
        name: 'Impact Champion',
        description: 'Funded 20+ sustainable projects',
        earnedDate: '2024-05-15',
        icon: '🏆'
      },
      {
        id: 3,
        name: 'Carbon Neutral Portfolio',
        description: 'Achieved net-zero carbon footprint',
        earnedDate: '2024-06-01',
        icon: '🌍'
      }
    ]
  };

  switch (method) {
    case 'GET':
      res.status(200).json(userProfile);
      break;

    case 'PUT':
      // Update user profile
      const updatedProfile = {
        ...userProfile,
        ...req.body,
        lastUpdated: new Date()
      };
      res.status(200).json(updatedProfile);
      break;

    case 'POST':
      // Create new user profile
      const newProfile = {
        id: Date.now().toString(),
        ...req.body,
        joinDate: new Date().toISOString(),
        achievements: []
      };
      res.status(201).json(newProfile);
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}