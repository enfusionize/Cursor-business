#!/usr/bin/env node

/**
 * EnfusionAIze Gamification Manager
 * Comprehensive system for tracking achievements, challenges, team engagement, and tool utilization
 * Seamlessly integrated throughout the entire dashboard ecosystem
 */

const { EventEmitter } = require('events');
const fs = require('fs').promises;
const path = require('path');

class GamificationManager extends EventEmitter {
    constructor() {
        super();
        this.userProfiles = new Map();
        this.achievements = new Map();
        this.challenges = new Map();
        this.teams = new Map();
        this.leaderboards = new Map();
        this.toolMetrics = new Map();
        this.dailyStreaks = new Map();
        this.seasonalEvents = new Map();
        this.rewardSystems = new Map();
        
        this.initializeSystem();
    }

    async initializeSystem() {
        console.log('🎮 Initializing EnfusionAIze Gamification Manager...');
        
        try {
            await this.loadAchievementDefinitions();
            await this.loadChallengeTemplates();
            await this.loadTeamConfigurations();
            await this.initializeToolTracking();
            await this.setupRewardSystems();
            await this.loadUserProfiles();
            
            this.startBackgroundProcesses();
            
            console.log('✅ Gamification Manager ready');
            this.emit('system-ready');
        } catch (error) {
            console.error('❌ Failed to initialize gamification manager:', error);
            this.emit('system-error', error);
        }
    }

    // ===== ACHIEVEMENT SYSTEM =====
    async loadAchievementDefinitions() {
        console.log('🏆 Loading achievement definitions...');

        const achievementCategories = {
            beginner: {
                'first-steps': {
                    name: 'First Steps',
                    description: 'Complete your first action in the platform',
                    icon: '👶',
                    xpReward: 25,
                    tier: 'bronze',
                    requirements: { anyAction: 1 },
                    unlockMessage: 'Welcome to EnfusionAIze! Your journey begins now.'
                },
                'first-prompt': {
                    name: 'Prompt Pioneer',
                    description: 'Create your first Layer Prompt',
                    icon: '🎯',
                    xpReward: 100,
                    tier: 'bronze',
                    requirements: { layerPromptsCreated: 1 },
                    unlockMessage: 'You\'ve mastered the basics of Layer Prompting!'
                },
                'platform-explorer': {
                    name: 'Platform Explorer',
                    description: 'Visit all main platform sections',
                    icon: '🗺️',
                    xpReward: 150,
                    tier: 'bronze',
                    requirements: { sectionsVisited: 5 },
                    unlockMessage: 'You\'ve explored every corner of EnfusionAIze!'
                }
            },

            layerPrompting: {
                'layer-master': {
                    name: 'Layer Master',
                    description: 'Successfully use all 7 layers in a single prompt',
                    icon: '🧠',
                    xpReward: 200,
                    tier: 'silver',
                    requirements: { completeLayerPrompts: 1 },
                    unlockMessage: 'You\'ve mastered the 7-layer methodology!'
                },
                'prompt-perfectionist': {
                    name: 'Prompt Perfectionist',
                    description: 'Create 50 high-quality Layer Prompts',
                    icon: '✨',
                    xpReward: 500,
                    tier: 'gold',
                    requirements: { layerPromptsCreated: 50, avgQualityScore: 4.5 },
                    unlockMessage: 'Your prompting skills are exceptional!'
                },
                'methodology-guru': {
                    name: 'Methodology Guru',
                    description: 'Teach Layer Prompting to 10 team members',
                    icon: '🎓',
                    xpReward: 750,
                    tier: 'platinum',
                    requirements: { membersHelped: 10, teachingSessions: 5 },
                    unlockMessage: 'You\'ve become a true Layer Prompting mentor!'
                }
            },

            toolMastery: {
                'cursor-champion': {
                    name: 'Cursor Champion',
                    description: 'Complete 25 projects using Cursor Build Stack',
                    icon: '💻',
                    xpReward: 300,
                    tier: 'silver',
                    requirements: { cursorProjects: 25 },
                    unlockMessage: 'You\'ve mastered the Cursor Build Stack!'
                },
                'analytics-ace': {
                    name: 'Analytics Ace',
                    description: 'Generate 100 analytics insights',
                    icon: '📊',
                    xpReward: 400,
                    tier: 'gold',
                    requirements: { analyticsInsights: 100 },
                    unlockMessage: 'Data flows through you like water!'
                },
                'deployment-dynamo': {
                    name: 'Deployment Dynamo',
                    description: 'Deploy 50 client applications',
                    icon: '🚀',
                    xpReward: 600,
                    tier: 'gold',
                    requirements: { clientDeployments: 50 },
                    unlockMessage: 'You\'re a deployment machine!'
                },
                'automation-architect': {
                    name: 'Automation Architect',
                    description: 'Create 20 automated workflows',
                    icon: '⚙️',
                    xpReward: 450,
                    tier: 'gold',
                    requirements: { automatedWorkflows: 20 },
                    unlockMessage: 'You\'ve automated your way to excellence!'
                }
            },

            collaboration: {
                'team-player': {
                    name: 'Team Player',
                    description: 'Help 5 team members with their work',
                    icon: '🤝',
                    xpReward: 200,
                    tier: 'bronze',
                    requirements: { membersHelped: 5 },
                    unlockMessage: 'Collaboration is your superpower!'
                },
                'mentor': {
                    name: 'Mentor',
                    description: 'Help 50 team members achieve their goals',
                    icon: '👨‍🏫',
                    xpReward: 1000,
                    tier: 'platinum',
                    requirements: { membersHelped: 50, mentoringSessions: 20 },
                    unlockMessage: 'You\'ve become a true leader and mentor!'
                },
                'community-champion': {
                    name: 'Community Champion',
                    description: 'Contribute to team success for 30 consecutive days',
                    icon: '🏆',
                    xpReward: 800,
                    tier: 'platinum',
                    requirements: { teamContributionStreak: 30 },
                    unlockMessage: 'Your dedication to the team is unmatched!'
                }
            },

            consistency: {
                'streak-starter': {
                    name: 'Streak Starter',
                    description: 'Maintain a 7-day daily activity streak',
                    icon: '🔥',
                    xpReward: 150,
                    tier: 'bronze',
                    requirements: { dailyStreak: 7 },
                    unlockMessage: 'Consistency is key - keep going!'
                },
                'streak-warrior': {
                    name: 'Streak Warrior',
                    description: 'Maintain a 30-day daily activity streak',
                    icon: '⚔️',
                    xpReward: 500,
                    tier: 'gold',
                    requirements: { dailyStreak: 30 },
                    unlockMessage: 'Your dedication is truly inspiring!'
                },
                'streak-legend': {
                    name: 'Streak Legend',
                    description: 'Maintain a 100-day daily activity streak',
                    icon: '👑',
                    xpReward: 1500,
                    tier: 'diamond',
                    requirements: { dailyStreak: 100 },
                    unlockMessage: 'You are a true EnfusionAIze legend!'
                }
            },

            business: {
                'revenue-generator': {
                    name: 'Revenue Generator',
                    description: 'Generate $10K+ in client value',
                    icon: '💰',
                    xpReward: 1000,
                    tier: 'platinum',
                    requirements: { clientRevenue: 10000 },
                    unlockMessage: 'You\'re driving real business impact!'
                },
                'efficiency-expert': {
                    name: 'Efficiency Expert',
                    description: 'Achieve 500%+ productivity improvement',
                    icon: '⚡',
                    xpReward: 750,
                    tier: 'gold',
                    requirements: { productivityGain: 500 },
                    unlockMessage: 'Efficiency is your middle name!'
                },
                'innovation-catalyst': {
                    name: 'Innovation Catalyst',
                    description: 'Introduce 5 new methodologies to the platform',
                    icon: '💡',
                    xpReward: 1200,
                    tier: 'diamond',
                    requirements: { innovationsIntroduced: 5 },
                    unlockMessage: 'You\'re pushing the boundaries of what\'s possible!'
                }
            },

            special: {
                'early-adopter': {
                    name: 'Early Adopter',
                    description: 'Be among the first 100 users',
                    icon: '🌟',
                    xpReward: 2000,
                    tier: 'legendary',
                    requirements: { userRank: 100 },
                    unlockMessage: 'You believed in EnfusionAIze from the beginning!'
                },
                'platform-contributor': {
                    name: 'Platform Contributor',
                    description: 'Contribute code or features to the platform',
                    icon: '🛠️',
                    xpReward: 1500,
                    tier: 'diamond',
                    requirements: { codeContributions: 1 },
                    unlockMessage: 'You\'ve helped build the future of AI!'
                },
                'unicorn': {
                    name: 'Unicorn',
                    description: 'Achieve the impossible - max out all metrics',
                    icon: '🦄',
                    xpReward: 5000,
                    tier: 'mythical',
                    requirements: { perfectScore: true },
                    unlockMessage: 'You are truly one in a million!'
                }
            }
        };

        // Flatten achievements into single map
        Object.entries(achievementCategories).forEach(([category, achievements]) => {
            Object.entries(achievements).forEach(([id, achievement]) => {
                achievement.category = category;
                achievement.id = id;
                this.achievements.set(id, achievement);
            });
        });

        console.log(`  ✅ Loaded ${this.achievements.size} achievements across ${Object.keys(achievementCategories).length} categories`);
    }

    // ===== CHALLENGE SYSTEM =====
    async loadChallengeTemplates() {
        console.log('🎯 Loading challenge templates...');

        const challengeTypes = {
            daily: {
                'morning-prompt': {
                    name: 'Morning Layer Prompt',
                    description: 'Create your first Layer Prompt of the day using all 7 layers',
                    icon: '🌅',
                    xpReward: 50,
                    difficulty: 'beginner',
                    timeLimit: 900, // 15 minutes
                    requirements: { layerPromptsCreated: 1 },
                    category: 'layer-prompting',
                    resetDaily: true
                },
                'tool-explorer': {
                    name: 'Tool Explorer',
                    description: 'Use 3 different platform tools today',
                    icon: '🔧',
                    xpReward: 30,
                    difficulty: 'beginner',
                    timeLimit: 600, // 10 minutes
                    requirements: { toolsUsed: 3 },
                    category: 'exploration',
                    resetDaily: true
                },
                'team-helper': {
                    name: 'Team Helper',
                    description: 'Help a team member with their work',
                    icon: '🤲',
                    xpReward: 75,
                    difficulty: 'intermediate',
                    timeLimit: 1200, // 20 minutes
                    requirements: { teamHelp: 1 },
                    category: 'collaboration',
                    resetDaily: true
                },
                'quality-focus': {
                    name: 'Quality Focus',
                    description: 'Achieve a quality score of 4.5+ on any prompt',
                    icon: '⭐',
                    xpReward: 100,
                    difficulty: 'intermediate',
                    timeLimit: 1800, // 30 minutes
                    requirements: { qualityScore: 4.5 },
                    category: 'excellence',
                    resetDaily: true
                }
            },

            weekly: {
                'layer-marathon': {
                    name: 'Layer Prompting Marathon',
                    description: 'Create 15 high-quality Layer Prompts this week',
                    icon: '🏃‍♂️',
                    xpReward: 500,
                    difficulty: 'advanced',
                    timeLimit: 604800, // 7 days
                    requirements: { layerPromptsCreated: 15, avgQualityScore: 4.0 },
                    category: 'endurance',
                    resetWeekly: true
                },
                'tool-mastery': {
                    name: 'Tool Mastery Challenge',
                    description: 'Use every platform tool at least once this week',
                    icon: '🎯',
                    xpReward: 300,
                    difficulty: 'intermediate',
                    timeLimit: 604800, // 7 days
                    requirements: { allToolsUsed: true },
                    category: 'mastery',
                    resetWeekly: true
                },
                'collaboration-champion': {
                    name: 'Collaboration Champion',
                    description: 'Help 10 different team members this week',
                    icon: '👥',
                    xpReward: 400,
                    difficulty: 'advanced',
                    timeLimit: 604800, // 7 days
                    requirements: { uniqueMembersHelped: 10 },
                    category: 'leadership',
                    resetWeekly: true
                },
                'innovation-week': {
                    name: 'Innovation Week',
                    description: 'Introduce 3 new methodologies or improvements',
                    icon: '💫',
                    xpReward: 750,
                    difficulty: 'expert',
                    timeLimit: 604800, // 7 days
                    requirements: { innovationsIntroduced: 3 },
                    category: 'innovation',
                    resetWeekly: true
                }
            },

            monthly: {
                'monthly-legend': {
                    name: 'Monthly Legend',
                    description: 'Complete all daily and weekly challenges this month',
                    icon: '🌟',
                    xpReward: 2000,
                    difficulty: 'legendary',
                    timeLimit: 2592000, // 30 days
                    requirements: { allChallengesCompleted: true },
                    category: 'excellence',
                    resetMonthly: true
                },
                'mentorship-master': {
                    name: 'Mentorship Master',
                    description: 'Conduct 20 mentoring sessions this month',
                    icon: '🎓',
                    xpReward: 1500,
                    difficulty: 'expert',
                    timeLimit: 2592000, // 30 days
                    requirements: { mentoringSessions: 20 },
                    category: 'leadership',
                    resetMonthly: true
                }
            },

            epic: {
                'platform-architect': {
                    name: 'Platform Architect',
                    description: 'Build and deploy a complete solution using all platform tools',
                    icon: '🏗️',
                    xpReward: 3000,
                    difficulty: 'legendary',
                    timeLimit: 1209600, // 14 days
                    requirements: { 
                        layerPromptsCreated: 20,
                        cursorProjects: 5,
                        clientDeployments: 3,
                        analyticsInsights: 50
                    },
                    category: 'mastery',
                    resetNever: true
                },
                'community-builder': {
                    name: 'Community Builder',
                    description: 'Help 100 team members and build a thriving community',
                    icon: '🏘️',
                    xpReward: 5000,
                    difficulty: 'mythical',
                    timeLimit: 7776000, // 90 days
                    requirements: { 
                        membersHelped: 100,
                        mentoringSessions: 50,
                        teamContributionStreak: 60
                    },
                    category: 'leadership',
                    resetNever: true
                }
            },

            team: {
                'team-synergy': {
                    name: 'Team Synergy',
                    description: 'Achieve 1000 team points this week',
                    icon: '⚡',
                    xpReward: 200,
                    difficulty: 'intermediate',
                    timeLimit: 604800, // 7 days
                    requirements: { teamPoints: 1000 },
                    category: 'teamwork',
                    resetWeekly: true,
                    teamChallenge: true
                },
                'collective-genius': {
                    name: 'Collective Genius',
                    description: 'Team completes 100 Layer Prompts together',
                    icon: '🧩',
                    xpReward: 500,
                    difficulty: 'advanced',
                    timeLimit: 1209600, // 14 days
                    requirements: { teamLayerPrompts: 100 },
                    category: 'teamwork',
                    resetBiweekly: true,
                    teamChallenge: true
                }
            },

            seasonal: {
                'new-year-revolution': {
                    name: 'New Year Revolution',
                    description: 'Complete 365 actions in the first month of the year',
                    icon: '🎊',
                    xpReward: 2024,
                    difficulty: 'legendary',
                    timeLimit: 2678400, // 31 days
                    requirements: { totalActions: 365 },
                    category: 'seasonal',
                    seasonal: true,
                    startDate: 'January 1',
                    endDate: 'January 31'
                },
                'summer-sprint': {
                    name: 'Summer Sprint',
                    description: 'Double your productivity during summer months',
                    icon: '☀️',
                    xpReward: 1500,
                    difficulty: 'expert',
                    timeLimit: 7776000, // 90 days
                    requirements: { productivityMultiplier: 2.0 },
                    category: 'seasonal',
                    seasonal: true,
                    startDate: 'June 21',
                    endDate: 'September 21'
                }
            }
        };

        // Flatten challenges into single map
        Object.entries(challengeTypes).forEach(([type, challenges]) => {
            Object.entries(challenges).forEach(([id, challenge]) => {
                challenge.type = type;
                challenge.id = id;
                this.challenges.set(id, challenge);
            });
        });

        console.log(`  ✅ Loaded ${this.challenges.size} challenge templates across ${Object.keys(challengeTypes).length} types`);
    }

    // ===== TEAM SYSTEM =====
    async loadTeamConfigurations() {
        console.log('👥 Loading team configurations...');

        const teamTypes = {
            'startup': {
                name: 'Startup Squad',
                description: 'Agile teams focused on rapid iteration and innovation',
                maxMembers: 5,
                specialization: 'innovation',
                bonusMultiplier: 1.2,
                icon: '🚀'
            },
            'enterprise': {
                name: 'Enterprise Guild',
                description: 'Large teams focused on scalability and best practices',
                maxMembers: 15,
                specialization: 'scalability',
                bonusMultiplier: 1.1,
                icon: '🏢'
            },
            'creative': {
                name: 'Creative Collective',
                description: 'Teams focused on creative solutions and design thinking',
                maxMembers: 8,
                specialization: 'creativity',
                bonusMultiplier: 1.15,
                icon: '🎨'
            },
            'technical': {
                name: 'Tech Titans',
                description: 'Highly technical teams focused on complex implementations',
                maxMembers: 10,
                specialization: 'technical',
                bonusMultiplier: 1.25,
                icon: '⚙️'
            }
        };

        Object.entries(teamTypes).forEach(([id, config]) => {
            config.id = id;
            this.teams.set(id, config);
        });

        console.log(`  ✅ Loaded ${this.teams.size} team configurations`);
    }

    // ===== TOOL TRACKING SYSTEM =====
    async initializeToolTracking() {
        console.log('🔧 Initializing tool tracking system...');

        const platformTools = {
            'layer-prompter': {
                name: 'Layer Prompter',
                category: 'core',
                icon: '🤖',
                description: 'Create and manage Layer Prompts',
                xpPerUse: 5,
                masteryThresholds: [10, 25, 50, 100, 250],
                masteryRewards: [50, 100, 200, 500, 1000]
            },
            'cursor-build': {
                name: 'Cursor Build Stack',
                category: 'development',
                icon: '💻',
                description: '6 AI models for development workflows',
                xpPerUse: 8,
                masteryThresholds: [5, 15, 30, 60, 120],
                masteryRewards: [75, 150, 300, 600, 1200]
            },
            'analytics-dashboard': {
                name: 'Analytics Dashboard',
                category: 'analytics',
                icon: '📊',
                description: 'Comprehensive business analytics',
                xpPerUse: 6,
                masteryThresholds: [20, 50, 100, 200, 500],
                masteryRewards: [60, 120, 240, 480, 1200]
            },
            'client-deployment': {
                name: 'Client Deployment',
                category: 'deployment',
                icon: '🚀',
                description: 'One-click client dashboard deployment',
                xpPerUse: 10,
                masteryThresholds: [3, 10, 25, 50, 100],
                masteryRewards: [100, 200, 400, 800, 1600]
            },
            'course-platform': {
                name: 'Course Platform',
                category: 'education',
                icon: '🎓',
                description: 'Interactive learning and course management',
                xpPerUse: 4,
                masteryThresholds: [10, 30, 75, 150, 300],
                masteryRewards: [40, 80, 160, 320, 800]
            },
            'mcp-integrations': {
                name: 'MCP Integrations',
                category: 'integration',
                icon: '🔗',
                description: 'Business tool integrations (Xero, Playwright, etc.)',
                xpPerUse: 7,
                masteryThresholds: [5, 15, 35, 70, 140],
                masteryRewards: [70, 140, 280, 560, 1120]
            },
            'automation-engine': {
                name: 'Automation Engine',
                category: 'automation',
                icon: '⚙️',
                description: 'Business process automation',
                xpPerUse: 12,
                masteryThresholds: [2, 8, 20, 40, 80],
                masteryRewards: [120, 240, 480, 960, 1920]
            },
            'team-collaboration': {
                name: 'Team Collaboration',
                category: 'social',
                icon: '👥',
                description: 'Team communication and project management',
                xpPerUse: 3,
                masteryThresholds: [25, 75, 150, 300, 600],
                masteryRewards: [30, 60, 120, 240, 600]
            },
            'quality-assurance': {
                name: 'Quality Assurance',
                category: 'quality',
                icon: '✅',
                description: 'Automated testing and quality validation',
                xpPerUse: 9,
                masteryThresholds: [5, 20, 50, 100, 200],
                masteryRewards: [90, 180, 360, 720, 1440]
            },
            'ai-orchestration': {
                name: 'AI Orchestration',
                category: 'ai',
                icon: '🧠',
                description: 'Multi-model AI workflow coordination',
                xpPerUse: 15,
                masteryThresholds: [1, 5, 15, 30, 60],
                masteryRewards: [150, 300, 600, 1200, 2400]
            }
        };

        Object.entries(platformTools).forEach(([id, tool]) => {
            tool.id = id;
            this.toolMetrics.set(id, {
                ...tool,
                usageCount: 0,
                usageHistory: [],
                masteryLevel: 0,
                lastUsed: null,
                userStats: new Map() // userId -> stats
            });
        });

        console.log(`  ✅ Initialized tracking for ${this.toolMetrics.size} platform tools`);
    }

    // ===== USER MANAGEMENT =====
    async loadUserProfiles() {
        try {
            const profilesPath = path.join(__dirname, '../data/user-profiles.json');
            const data = await fs.readFile(profilesPath, 'utf8');
            const profiles = JSON.parse(data);
            
            Object.entries(profiles).forEach(([userId, profile]) => {
                this.userProfiles.set(userId, {
                    ...profile,
                    lastActive: new Date(profile.lastActive),
                    joinDate: new Date(profile.joinDate)
                });
            });
            
            console.log(`  ✅ Loaded ${this.userProfiles.size} user profiles`);
        } catch (error) {
            console.log('  ℹ️ No existing user profiles found, starting fresh');
        }
    }

    createUserProfile(userId, userData = {}) {
        const profile = {
            id: userId,
            name: userData.name || `User ${userId}`,
            email: userData.email || null,
            avatar: userData.avatar || this.generateAvatar(userId),
            level: 1,
            xp: 0,
            xpToNextLevel: 1000,
            totalXP: 0,
            
            // Statistics
            stats: {
                totalActions: 0,
                layerPromptsCreated: 0,
                toolsUsed: 0,
                dailyStreak: 0,
                longestStreak: 0,
                teamContributions: 0,
                mentoringSessions: 0,
                membersHelped: 0,
                qualityScoreAvg: 0,
                productivityGain: 0,
                clientRevenue: 0,
                innovationsIntroduced: 0
            },
            
            // Achievements
            achievements: {
                unlocked: [],
                progress: new Map(),
                totalEarned: 0,
                categories: {
                    beginner: 0,
                    layerPrompting: 0,
                    toolMastery: 0,
                    collaboration: 0,
                    consistency: 0,
                    business: 0,
                    special: 0
                }
            },
            
            // Challenges
            challenges: {
                active: [],
                completed: [],
                failed: [],
                totalCompleted: 0,
                streakCount: 0
            },
            
            // Team information
            team: {
                id: null,
                role: 'member',
                joinDate: null,
                contributions: 0,
                rank: null
            },
            
            // Tool usage
            toolUsage: new Map(),
            
            // Preferences
            preferences: {
                notifications: true,
                publicProfile: true,
                shareAchievements: true,
                difficultyPreference: 'adaptive',
                challengeTypes: ['daily', 'weekly'],
                teamCollaboration: true
            },
            
            // Metadata
            joinDate: new Date(),
            lastActive: new Date(),
            timezone: userData.timezone || 'UTC'
        };

        this.userProfiles.set(userId, profile);
        this.emit('user-created', { userId, profile });
        
        return profile;
    }

    // ===== ACTION TRACKING =====
    async trackUserAction(userId, action, metadata = {}) {
        let profile = this.userProfiles.get(userId);
        if (!profile) {
            profile = this.createUserProfile(userId);
        }

        // Update last active
        profile.lastActive = new Date();
        profile.stats.totalActions++;

        // Track specific action types
        switch (action.type) {
            case 'layer-prompt-created':
                profile.stats.layerPromptsCreated++;
                this.awardXP(userId, 25);
                this.updateChallengeProgress(userId, 'layerPromptsCreated', 1);
                break;

            case 'tool-used':
                this.trackToolUsage(userId, action.tool, metadata);
                break;

            case 'team-help':
                profile.stats.membersHelped++;
                profile.stats.teamContributions++;
                this.awardXP(userId, 15);
                this.updateChallengeProgress(userId, 'membersHelped', 1);
                break;

            case 'mentoring-session':
                profile.stats.mentoringSessions++;
                this.awardXP(userId, 50);
                this.updateChallengeProgress(userId, 'mentoringSessions', 1);
                break;

            case 'quality-achievement':
                if (metadata.score > profile.stats.qualityScoreAvg) {
                    profile.stats.qualityScoreAvg = (profile.stats.qualityScoreAvg + metadata.score) / 2;
                }
                this.updateChallengeProgress(userId, 'qualityScore', metadata.score);
                break;

            case 'client-deployment':
                profile.stats.clientRevenue += metadata.value || 0;
                this.awardXP(userId, 100);
                this.updateChallengeProgress(userId, 'clientDeployments', 1);
                break;

            case 'innovation-introduced':
                profile.stats.innovationsIntroduced++;
                this.awardXP(userId, 200);
                this.updateChallengeProgress(userId, 'innovationsIntroduced', 1);
                break;
        }

        // Update daily streak
        this.updateDailyStreak(userId);

        // Check for achievement unlocks
        this.checkAchievementProgress(userId);

        // Save profile changes
        await this.saveUserProfile(userId);

        this.emit('action-tracked', { userId, action, metadata, profile });
    }

    trackToolUsage(userId, toolId, metadata = {}) {
        const profile = this.userProfiles.get(userId);
        const tool = this.toolMetrics.get(toolId);
        
        if (!profile || !tool) return;

        // Update user tool usage
        if (!profile.toolUsage.has(toolId)) {
            profile.toolUsage.set(toolId, {
                count: 0,
                firstUsed: new Date(),
                lastUsed: null,
                masteryLevel: 0,
                sessionsToday: 0,
                totalTimeSpent: 0
            });
            profile.stats.toolsUsed++;
        }

        const userTool = profile.toolUsage.get(toolId);
        userTool.count++;
        userTool.lastUsed = new Date();
        userTool.totalTimeSpent += metadata.timeSpent || 0;

        // Update global tool metrics
        const toolStats = tool.userStats.get(userId) || {
            count: 0,
            masteryLevel: 0,
            lastUsed: null
        };
        
        toolStats.count++;
        toolStats.lastUsed = new Date();
        tool.userStats.set(userId, toolStats);

        // Award XP
        this.awardXP(userId, tool.xpPerUse);

        // Check for tool mastery
        this.checkToolMastery(userId, toolId);

        // Update challenge progress
        this.updateChallengeProgress(userId, 'toolsUsed', Array.from(profile.toolUsage.keys()).length);

        this.emit('tool-used', { userId, toolId, metadata, userTool, toolStats });
    }

    checkToolMastery(userId, toolId) {
        const profile = this.userProfiles.get(userId);
        const tool = this.toolMetrics.get(toolId);
        const userTool = profile.toolUsage.get(toolId);
        
        if (!userTool || !tool) return;

        const currentLevel = userTool.masteryLevel;
        const newLevel = tool.masteryThresholds.findIndex(threshold => userTool.count < threshold);
        const actualNewLevel = newLevel === -1 ? tool.masteryThresholds.length : newLevel;

        if (actualNewLevel > currentLevel) {
            userTool.masteryLevel = actualNewLevel;
            
            // Award mastery bonus
            const bonusXP = tool.masteryRewards[actualNewLevel - 1] || 0;
            this.awardXP(userId, bonusXP);
            
            this.emit('tool-mastery-achieved', {
                userId,
                toolId,
                level: actualNewLevel,
                bonusXP,
                toolName: tool.name
            });
        }
    }

    // ===== XP AND LEVELING =====
    awardXP(userId, amount, source = 'general') {
        const profile = this.userProfiles.get(userId);
        if (!profile) return;

        const oldLevel = profile.level;
        profile.xp += amount;
        profile.totalXP += amount;

        // Check for level up
        while (profile.xp >= profile.xpToNextLevel) {
            profile.xp -= profile.xpToNextLevel;
            profile.level++;
            profile.xpToNextLevel = this.calculateXPForLevel(profile.level + 1);
            
            this.emit('level-up', {
                userId,
                newLevel: profile.level,
                oldLevel,
                bonusXP: profile.level * 50 // Level up bonus
            });

            // Award level up bonus
            profile.xp += profile.level * 50;
        }

        this.emit('xp-awarded', { userId, amount, source, newXP: profile.xp, level: profile.level });
    }

    calculateXPForLevel(level) {
        return Math.floor(1000 * Math.pow(1.15, level - 1));
    }

    // ===== ACHIEVEMENT SYSTEM =====
    checkAchievementProgress(userId) {
        const profile = this.userProfiles.get(userId);
        if (!profile) return;

        this.achievements.forEach((achievement, achievementId) => {
            // Skip if already unlocked
            if (profile.achievements.unlocked.includes(achievementId)) return;

            // Check if requirements are met
            const meetsRequirements = this.checkAchievementRequirements(profile, achievement.requirements);
            
            if (meetsRequirements) {
                this.unlockAchievement(userId, achievementId);
            } else {
                // Update progress tracking
                const progress = this.calculateAchievementProgress(profile, achievement.requirements);
                profile.achievements.progress.set(achievementId, progress);
            }
        });
    }

    checkAchievementRequirements(profile, requirements) {
        return Object.entries(requirements).every(([requirement, value]) => {
            switch (requirement) {
                case 'anyAction':
                    return profile.stats.totalActions >= value;
                case 'layerPromptsCreated':
                    return profile.stats.layerPromptsCreated >= value;
                case 'completeLayerPrompts':
                    return profile.stats.layerPromptsCreated >= value; // Simplified
                case 'sectionsVisited':
                    return profile.stats.toolsUsed >= value;
                case 'avgQualityScore':
                    return profile.stats.qualityScoreAvg >= value;
                case 'membersHelped':
                    return profile.stats.membersHelped >= value;
                case 'dailyStreak':
                    return profile.stats.dailyStreak >= value;
                case 'cursorProjects':
                    return profile.toolUsage.get('cursor-build')?.count >= value || false;
                case 'analyticsInsights':
                    return profile.toolUsage.get('analytics-dashboard')?.count >= value || false;
                case 'clientDeployments':
                    return profile.toolUsage.get('client-deployment')?.count >= value || false;
                case 'automatedWorkflows':
                    return profile.toolUsage.get('automation-engine')?.count >= value || false;
                case 'mentoringSessions':
                    return profile.stats.mentoringSessions >= value;
                case 'teamContributionStreak':
                    return profile.stats.dailyStreak >= value; // Simplified
                case 'clientRevenue':
                    return profile.stats.clientRevenue >= value;
                case 'productivityGain':
                    return profile.stats.productivityGain >= value;
                case 'innovationsIntroduced':
                    return profile.stats.innovationsIntroduced >= value;
                case 'teachingSessions':
                    return profile.stats.mentoringSessions >= value;
                case 'userRank':
                    return this.getUserRank(profile.id) <= value;
                case 'codeContributions':
                    return profile.stats.innovationsIntroduced >= value; // Simplified
                case 'perfectScore':
                    return this.checkPerfectScore(profile);
                default:
                    return false;
            }
        });
    }

    calculateAchievementProgress(profile, requirements) {
        const progress = {};
        
        Object.entries(requirements).forEach(([requirement, value]) => {
            let current = 0;
            
            switch (requirement) {
                case 'anyAction':
                    current = profile.stats.totalActions;
                    break;
                case 'layerPromptsCreated':
                    current = profile.stats.layerPromptsCreated;
                    break;
                case 'membersHelped':
                    current = profile.stats.membersHelped;
                    break;
                case 'dailyStreak':
                    current = profile.stats.dailyStreak;
                    break;
                // Add more cases as needed
            }
            
            progress[requirement] = {
                current,
                target: value,
                percentage: Math.min((current / value) * 100, 100)
            };
        });
        
        return progress;
    }

    unlockAchievement(userId, achievementId) {
        const profile = this.userProfiles.get(userId);
        const achievement = this.achievements.get(achievementId);
        
        if (!profile || !achievement) return;

        // Add to unlocked achievements
        profile.achievements.unlocked.push(achievementId);
        profile.achievements.totalEarned++;
        profile.achievements.categories[achievement.category]++;

        // Award XP
        this.awardXP(userId, achievement.xpReward, 'achievement');

        // Remove from progress tracking
        profile.achievements.progress.delete(achievementId);

        this.emit('achievement-unlocked', {
            userId,
            achievementId,
            achievement,
            profile
        });

        console.log(`🏆 ${profile.name} unlocked achievement: ${achievement.name}`);
    }

    // ===== CHALLENGE SYSTEM =====
    async setupRewardSystems() {
        console.log('🎁 Setting up reward systems...');

        const rewardTypes = {
            xp: {
                name: 'Experience Points',
                description: 'Points that contribute to leveling up',
                icon: '⭐',
                stackable: true
            },
            badge: {
                name: 'Achievement Badge',
                description: 'Special recognition for accomplishments',
                icon: '🏆',
                stackable: false
            },
            title: {
                name: 'Special Title',
                description: 'Unique titles to display expertise',
                icon: '👑',
                stackable: false
            },
            bonus: {
                name: 'XP Multiplier',
                description: 'Temporary boost to XP earning',
                icon: '⚡',
                stackable: true,
                duration: 24 * 60 * 60 * 1000 // 24 hours
            },
            access: {
                name: 'Premium Access',
                description: 'Early access to new features',
                icon: '🌟',
                stackable: false
            }
        };

        Object.entries(rewardTypes).forEach(([id, reward]) => {
            reward.id = id;
            this.rewardSystems.set(id, reward);
        });

        console.log(`  ✅ Configured ${this.rewardSystems.size} reward systems`);
    }

    startChallenge(userId, challengeId) {
        const profile = this.userProfiles.get(userId);
        const challenge = this.challenges.get(challengeId);
        
        if (!profile || !challenge) return false;

        // Check if already active
        if (profile.challenges.active.some(c => c.id === challengeId)) {
            return false;
        }

        const activeChallenge = {
            id: challengeId,
            startTime: Date.now(),
            progress: {},
            status: 'active'
        };

        profile.challenges.active.push(activeChallenge);

        this.emit('challenge-started', { userId, challengeId, challenge });
        return true;
    }

    updateChallengeProgress(userId, metric, value) {
        const profile = this.userProfiles.get(userId);
        if (!profile) return;

        profile.challenges.active.forEach(activeChallenge => {
            const challenge = this.challenges.get(activeChallenge.id);
            if (!challenge || !challenge.requirements[metric]) return;

            // Update progress
            activeChallenge.progress[metric] = (activeChallenge.progress[metric] || 0) + value;

            // Check if challenge is completed
            const isCompleted = Object.entries(challenge.requirements).every(([req, target]) => {
                return (activeChallenge.progress[req] || 0) >= target;
            });

            if (isCompleted) {
                this.completeChallenge(userId, activeChallenge.id);
            }
        });
    }

    completeChallenge(userId, challengeId) {
        const profile = this.userProfiles.get(userId);
        const challenge = this.challenges.get(challengeId);
        
        if (!profile || !challenge) return;

        // Remove from active challenges
        const challengeIndex = profile.challenges.active.findIndex(c => c.id === challengeId);
        if (challengeIndex === -1) return;

        const completedChallenge = profile.challenges.active.splice(challengeIndex, 1)[0];
        completedChallenge.completedAt = Date.now();
        completedChallenge.status = 'completed';

        // Add to completed challenges
        profile.challenges.completed.push(completedChallenge);
        profile.challenges.totalCompleted++;

        // Award rewards
        this.awardXP(userId, challenge.xpReward, 'challenge');

        this.emit('challenge-completed', {
            userId,
            challengeId,
            challenge,
            completedChallenge
        });

        console.log(`🎯 ${profile.name} completed challenge: ${challenge.name}`);
    }

    // ===== DAILY STREAK SYSTEM =====
    updateDailyStreak(userId) {
        const profile = this.userProfiles.get(userId);
        if (!profile) return;

        const today = new Date().toDateString();
        const lastActive = profile.lastActive.toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (lastActive === today) {
            // Already active today, no change needed
            return;
        } else if (lastActive === yesterdayStr) {
            // Continued streak
            profile.stats.dailyStreak++;
        } else {
            // Streak broken, reset
            profile.stats.dailyStreak = 1;
        }

        // Update longest streak
        if (profile.stats.dailyStreak > profile.stats.longestStreak) {
            profile.stats.longestStreak = profile.stats.dailyStreak;
        }

        this.emit('streak-updated', {
            userId,
            currentStreak: profile.stats.dailyStreak,
            longestStreak: profile.stats.longestStreak
        });
    }

    // ===== LEADERBOARD SYSTEM =====
    generateLeaderboard(type = 'xp', limit = 10) {
        const users = Array.from(this.userProfiles.values());
        
        let sortedUsers;
        switch (type) {
            case 'xp':
                sortedUsers = users.sort((a, b) => b.totalXP - a.totalXP);
                break;
            case 'level':
                sortedUsers = users.sort((a, b) => {
                    if (b.level !== a.level) return b.level - a.level;
                    return b.xp - a.xp;
                });
                break;
            case 'achievements':
                sortedUsers = users.sort((a, b) => b.achievements.totalEarned - a.achievements.totalEarned);
                break;
            case 'streak':
                sortedUsers = users.sort((a, b) => b.stats.dailyStreak - a.stats.dailyStreak);
                break;
            case 'layer-prompts':
                sortedUsers = users.sort((a, b) => b.stats.layerPromptsCreated - a.stats.layerPromptsCreated);
                break;
            default:
                sortedUsers = users.sort((a, b) => b.totalXP - a.totalXP);
        }

        return sortedUsers.slice(0, limit).map((user, index) => ({
            rank: index + 1,
            userId: user.id,
            name: user.name,
            avatar: user.avatar,
            level: user.level,
            xp: user.xp,
            totalXP: user.totalXP,
            value: this.getLeaderboardValue(user, type),
            achievements: user.achievements.totalEarned,
            streak: user.stats.dailyStreak
        }));
    }

    getLeaderboardValue(user, type) {
        switch (type) {
            case 'xp':
                return user.totalXP;
            case 'level':
                return user.level;
            case 'achievements':
                return user.achievements.totalEarned;
            case 'streak':
                return user.stats.dailyStreak;
            case 'layer-prompts':
                return user.stats.layerPromptsCreated;
            default:
                return user.totalXP;
        }
    }

    getUserRank(userId) {
        const leaderboard = this.generateLeaderboard('xp', 1000);
        const userEntry = leaderboard.find(entry => entry.userId === userId);
        return userEntry ? userEntry.rank : 999;
    }

    // ===== UTILITY FUNCTIONS =====
    checkPerfectScore(profile) {
        // Define what constitutes a "perfect score" - max level in multiple areas
        return profile.level >= 50 &&
               profile.achievements.totalEarned >= 50 &&
               profile.stats.layerPromptsCreated >= 1000 &&
               profile.stats.membersHelped >= 100 &&
               profile.stats.dailyStreak >= 100;
    }

    generateAvatar(userId) {
        // Generate a simple avatar based on user ID
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB6C1'];
        const colorIndex = userId.charCodeAt(0) % colors.length;
        return {
            backgroundColor: colors[colorIndex],
            initials: userId.substring(0, 2).toUpperCase()
        };
    }

    async saveUserProfile(userId) {
        try {
            const profilesPath = path.join(__dirname, '../data/user-profiles.json');
            
            // Ensure directory exists
            await fs.mkdir(path.dirname(profilesPath), { recursive: true });
            
            // Convert Map to Object for JSON serialization
            const profilesObj = {};
            this.userProfiles.forEach((profile, id) => {
                profilesObj[id] = {
                    ...profile,
                    toolUsage: Object.fromEntries(profile.toolUsage),
                    achievements: {
                        ...profile.achievements,
                        progress: Object.fromEntries(profile.achievements.progress)
                    }
                };
            });
            
            await fs.writeFile(profilesPath, JSON.stringify(profilesObj, null, 2));
        } catch (error) {
            console.error('Failed to save user profiles:', error);
        }
    }

    // ===== BACKGROUND PROCESSES =====
    startBackgroundProcesses() {
        // Reset daily challenges at midnight
        this.scheduleResets();
        
        // Periodic data persistence
        setInterval(async () => {
            for (const userId of this.userProfiles.keys()) {
                await this.saveUserProfile(userId);
            }
        }, 5 * 60 * 1000); // Save every 5 minutes

        // Check for expired challenges
        setInterval(() => {
            this.checkExpiredChallenges();
        }, 60 * 1000); // Check every minute

        console.log('🔄 Background processes started');
    }

    scheduleResets() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const msUntilMidnight = tomorrow.getTime() - now.getTime();

        setTimeout(() => {
            this.resetDailyChallenges();
            setInterval(() => this.resetDailyChallenges(), 24 * 60 * 60 * 1000);
        }, msUntilMidnight);
    }

    resetDailyChallenges() {
        this.userProfiles.forEach((profile, userId) => {
            // Reset daily challenges
            profile.challenges.active = profile.challenges.active.filter(challenge => {
                const challengeData = this.challenges.get(challenge.id);
                return !challengeData?.resetDaily;
            });
        });

        console.log('🌅 Daily challenges reset for all users');
        this.emit('daily-reset');
    }

    checkExpiredChallenges() {
        const now = Date.now();
        
        this.userProfiles.forEach((profile, userId) => {
            profile.challenges.active = profile.challenges.active.filter(activeChallenge => {
                const challenge = this.challenges.get(activeChallenge.id);
                if (!challenge) return false;

                const timeElapsed = now - activeChallenge.startTime;
                if (timeElapsed > challenge.timeLimit * 1000) {
                    // Challenge expired
                    activeChallenge.status = 'expired';
                    profile.challenges.failed.push(activeChallenge);
                    
                    this.emit('challenge-expired', { userId, challengeId: activeChallenge.id });
                    return false;
                }
                
                return true;
            });
        });
    }

    // ===== API METHODS =====
    getUserProfile(userId) {
        return this.userProfiles.get(userId);
    }

    getUserStats(userId) {
        const profile = this.userProfiles.get(userId);
        if (!profile) return null;

        return {
            level: profile.level,
            xp: profile.xp,
            totalXP: profile.totalXP,
            achievements: profile.achievements.totalEarned,
            streak: profile.stats.dailyStreak,
            rank: this.getUserRank(userId),
            stats: profile.stats
        };
    }

    getActiveUserChallenges(userId) {
        const profile = this.userProfiles.get(userId);
        if (!profile) return [];

        return profile.challenges.active.map(activeChallenge => {
            const challenge = this.challenges.get(activeChallenge.id);
            return {
                ...challenge,
                progress: activeChallenge.progress,
                startTime: activeChallenge.startTime,
                timeRemaining: challenge.timeLimit * 1000 - (Date.now() - activeChallenge.startTime)
            };
        });
    }

    getAvailableChallenges(userId) {
        const profile = this.userProfiles.get(userId);
        if (!profile) return [];

        const activeChallengeIds = profile.challenges.active.map(c => c.id);
        
        return Array.from(this.challenges.values()).filter(challenge => {
            return !activeChallengeIds.includes(challenge.id) &&
                   this.checkChallengeAvailability(profile, challenge);
        });
    }

    checkChallengeAvailability(profile, challenge) {
        // Add logic for challenge prerequisites, level requirements, etc.
        if (challenge.difficulty === 'expert' && profile.level < 10) return false;
        if (challenge.difficulty === 'legendary' && profile.level < 25) return false;
        
        return true;
    }

    generateGamificationReport() {
        const totalUsers = this.userProfiles.size;
        const totalAchievements = this.achievements.size;
        const totalChallenges = this.challenges.size;
        
        const userStats = Array.from(this.userProfiles.values());
        const avgLevel = userStats.reduce((sum, user) => sum + user.level, 0) / totalUsers;
        const totalXP = userStats.reduce((sum, user) => sum + user.totalXP, 0);
        const totalAchievementsEarned = userStats.reduce((sum, user) => sum + user.achievements.totalEarned, 0);
        const totalChallengesCompleted = userStats.reduce((sum, user) => sum + user.challenges.totalCompleted, 0);

        return {
            timestamp: new Date().toISOString(),
            overview: {
                totalUsers,
                totalAchievements,
                totalChallenges,
                avgLevel: Math.round(avgLevel * 100) / 100,
                totalXP,
                totalAchievementsEarned,
                totalChallengesCompleted
            },
            engagement: {
                dailyActiveUsers: userStats.filter(u => this.isActiveToday(u)).length,
                weeklyActiveUsers: userStats.filter(u => this.isActiveThisWeek(u)).length,
                streakDistribution: this.getStreakDistribution(userStats),
                levelDistribution: this.getLevelDistribution(userStats)
            },
            leaderboards: {
                topXP: this.generateLeaderboard('xp', 5),
                topLevel: this.generateLeaderboard('level', 5),
                topAchievements: this.generateLeaderboard('achievements', 5),
                topStreak: this.generateLeaderboard('streak', 5)
            },
            tools: this.generateToolUsageReport()
        };
    }

    isActiveToday(user) {
        const today = new Date().toDateString();
        return user.lastActive.toDateString() === today;
    }

    isActiveThisWeek(user) {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return user.lastActive > weekAgo;
    }

    getStreakDistribution(users) {
        const distribution = { '0': 0, '1-7': 0, '8-30': 0, '31-100': 0, '100+': 0 };
        
        users.forEach(user => {
            const streak = user.stats.dailyStreak;
            if (streak === 0) distribution['0']++;
            else if (streak <= 7) distribution['1-7']++;
            else if (streak <= 30) distribution['8-30']++;
            else if (streak <= 100) distribution['31-100']++;
            else distribution['100+']++;
        });
        
        return distribution;
    }

    getLevelDistribution(users) {
        const distribution = { '1-5': 0, '6-15': 0, '16-30': 0, '31-50': 0, '50+': 0 };
        
        users.forEach(user => {
            const level = user.level;
            if (level <= 5) distribution['1-5']++;
            else if (level <= 15) distribution['6-15']++;
            else if (level <= 30) distribution['16-30']++;
            else if (level <= 50) distribution['31-50']++;
            else distribution['50+']++;
        });
        
        return distribution;
    }

    generateToolUsageReport() {
        const report = {};
        
        this.toolMetrics.forEach((tool, toolId) => {
            const totalUsage = Array.from(tool.userStats.values())
                .reduce((sum, stats) => sum + stats.count, 0);
            
            const activeUsers = tool.userStats.size;
            
            report[toolId] = {
                name: tool.name,
                category: tool.category,
                totalUsage,
                activeUsers,
                avgUsagePerUser: activeUsers > 0 ? Math.round(totalUsage / activeUsers * 100) / 100 : 0
            };
        });
        
        return report;
    }
}

// ===== CLI INTERFACE =====

if (require.main === module) {
    const manager = new GamificationManager();

    const command = process.argv[2];
    const args = process.argv.slice(3);

    manager.on('system-ready', async () => {
        try {
            switch (command) {
                case 'create-user':
                    const userId = args[0];
                    const userData = args[1] ? JSON.parse(args[1]) : {};
                    if (!userId) {
                        console.error('❌ User ID required');
                        process.exit(1);
                    }
                    const profile = manager.createUserProfile(userId, userData);
                    console.log('\n👤 User Profile Created:', JSON.stringify(profile, null, 2));
                    break;

                case 'track-action':
                    const actionUserId = args[0];
                    const action = args[1] ? JSON.parse(args[1]) : {};
                    const metadata = args[2] ? JSON.parse(args[2]) : {};
                    if (!actionUserId || !action.type) {
                        console.error('❌ User ID and action type required');
                        process.exit(1);
                    }
                    await manager.trackUserAction(actionUserId, action, metadata);
                    console.log(`\n📊 Action tracked for user ${actionUserId}:`, action);
                    break;

                case 'award-xp':
                    const xpUserId = args[0];
                    const xpAmount = parseInt(args[1]);
                    const source = args[2] || 'manual';
                    if (!xpUserId || !xpAmount) {
                        console.error('❌ User ID and XP amount required');
                        process.exit(1);
                    }
                    manager.awardXP(xpUserId, xpAmount, source);
                    console.log(`\n⭐ Awarded ${xpAmount} XP to user ${xpUserId}`);
                    break;

                case 'start-challenge':
                    const challengeUserId = args[0];
                    const challengeId = args[1];
                    if (!challengeUserId || !challengeId) {
                        console.error('❌ User ID and challenge ID required');
                        process.exit(1);
                    }
                    const started = manager.startChallenge(challengeUserId, challengeId);
                    console.log(`\n🎯 Challenge ${challengeId} ${started ? 'started' : 'failed to start'} for user ${challengeUserId}`);
                    break;

                case 'user-stats':
                    const statsUserId = args[0];
                    if (!statsUserId) {
                        console.error('❌ User ID required');
                        process.exit(1);
                    }
                    const stats = manager.getUserStats(statsUserId);
                    console.log('\n📈 User Stats:', JSON.stringify(stats, null, 2));
                    break;

                case 'leaderboard':
                    const type = args[0] || 'xp';
                    const limit = parseInt(args[1]) || 10;
                    const leaderboard = manager.generateLeaderboard(type, limit);
                    console.log(`\n🏆 ${type.toUpperCase()} Leaderboard (Top ${limit}):`);
                    leaderboard.forEach((entry, index) => {
                        console.log(`${index + 1}. ${entry.name} - ${entry.value} ${type}`);
                    });
                    break;

                case 'report':
                    const report = manager.generateGamificationReport();
                    console.log('\n📊 Gamification Report:', JSON.stringify(report, null, 2));
                    break;

                case 'challenges':
                    const challengesUserId = args[0];
                    if (!challengesUserId) {
                        console.error('❌ User ID required');
                        process.exit(1);
                    }
                    const activeChallenges = manager.getActiveUserChallenges(challengesUserId);
                    const availableChallenges = manager.getAvailableChallenges(challengesUserId);
                    console.log('\n🎯 Active Challenges:', activeChallenges);
                    console.log('\n📋 Available Challenges:', availableChallenges.map(c => ({ id: c.id, name: c.name, difficulty: c.difficulty })));
                    break;

                default:
                    console.log(`
🎮 EnfusionAIze Gamification Manager

Available commands:
  create-user <userId> [userData]     - Create a new user profile
  track-action <userId> <action> [metadata] - Track user action
  award-xp <userId> <amount> [source] - Award XP to user
  start-challenge <userId> <challengeId> - Start a challenge for user
  user-stats <userId>                - Get user statistics
  leaderboard [type] [limit]         - Generate leaderboard (xp, level, achievements, streak)
  challenges <userId>                - Get user's challenges
  report                             - Generate full gamification report

Examples:
  node gamification-manager.js create-user "user123" '{"name": "John Doe", "email": "john@example.com"}'
  node gamification-manager.js track-action "user123" '{"type": "layer-prompt-created"}' '{"quality": 4.5}'
  node gamification-manager.js award-xp "user123" 100 "manual-bonus"
  node gamification-manager.js start-challenge "user123" "morning-prompt"
  node gamification-manager.js leaderboard "xp" 5
  node gamification-manager.js report
`);
            }

            process.exit(0);
        } catch (error) {
            console.error('❌ Command failed:', error);
            process.exit(1);
        }
    });

    manager.on('system-error', (error) => {
        console.error('❌ System initialization failed:', error);
        process.exit(1);
    });
}

module.exports = GamificationManager;