#!/usr/bin/env node

/**
 * SOP Versioning System
 * Automated versioning and updating for the Full-Stack Cursor Integration SOP
 * Tracks changes, updates version numbers, and maintains documentation
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const semver = require('semver');

class SOPVersioningSystem {
    constructor() {
        this.sopPath = path.join(__dirname, '../docs/FULL_STACK_CURSOR_INTEGRATION_SOP.md');
        this.versionFile = path.join(__dirname, '../docs/sop-version.json');
        this.changelogPath = path.join(__dirname, '../docs/SOP_CHANGELOG.md');
        this.backupDir = path.join(__dirname, '../docs/sop-backups');
        
        this.initializeVersioning();
    }

    initializeVersioning() {
        // Ensure backup directory exists
        fs.ensureDirSync(this.backupDir);
        
        // Initialize version file if it doesn't exist
        if (!fs.existsSync(this.versionFile)) {
            const initialVersion = {
                version: '1.0.0',
                lastUpdated: new Date().toISOString(),
                changes: [],
                nextReview: this.getNextReviewDate(),
                status: 'Active Implementation'
            };
            fs.writeJsonSync(this.versionFile, initialVersion, { spaces: 2 });
        }
        
        // Initialize changelog if it doesn't exist
        if (!fs.existsSync(this.changelogPath)) {
            this.initializeChangelog();
        }
    }

    initializeChangelog() {
        const changelogContent = `# SOP Changelog

## Version 1.0.0 - ${new Date().toISOString().split('T')[0]}

### Added
- Initial comprehensive SOP for Full-Stack Cursor Integration
- Complete system overview with all 25+ MCP integrations
- Detailed implementation checklist with 6 phases
- Exhaustive addendum with code, process, and function enhancements
- Automated versioning system

### Infrastructure
- Core platform components documentation
- Dashboard integration procedures
- Backend and MCP server setup
- Testing and deployment guidelines
- Training center integration
- Maintenance and optimization protocols

### Security & Compliance
- Legal protections and terms
- API key management
- Data privacy considerations
- Incident response procedures

---

*This changelog is automatically maintained by the SOP Versioning System*
`;
        fs.writeFileSync(this.changelogPath, changelogContent);
    }

    getNextReviewDate() {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth.toISOString().split('T')[0];
    }

    getCurrentVersion() {
        const versionData = fs.readJsonSync(this.versionFile);
        return versionData.version;
    }

    updateVersion(type = 'patch') {
        const versionData = fs.readJsonSync(this.versionFile);
        const currentVersion = versionData.version;
        const newVersion = semver.inc(currentVersion, type);
        
        console.log(chalk.blue(`Updating SOP version from ${currentVersion} to ${newVersion}`));
        
        // Create backup of current version
        this.createBackup(currentVersion);
        
        // Update version data
        versionData.version = newVersion;
        versionData.lastUpdated = new Date().toISOString();
        versionData.nextReview = this.getNextReviewDate();
        
        // Update the SOP document
        this.updateSOPDocument(newVersion);
        
        // Save version data
        fs.writeJsonSync(this.versionFile, versionData, { spaces: 2 });
        
        console.log(chalk.green(`✅ SOP updated to version ${newVersion}`));
        return newVersion;
    }

    createBackup(version) {
        const backupPath = path.join(this.backupDir, `sop-v${version}-${Date.now()}.md`);
        fs.copySync(this.sopPath, backupPath);
        console.log(chalk.yellow(`📄 Backup created: ${backupPath}`));
    }

    updateSOPDocument(newVersion) {
        let sopContent = fs.readFileSync(this.sopPath, 'utf8');
        
        // Update version in metadata
        sopContent = sopContent.replace(
            /- \*\*Version\*\*: \d+\.\d+\.\d+/,
            `- **Version**: ${newVersion}`
        );
        
        // Update last updated date
        const currentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        sopContent = sopContent.replace(
            /- \*\*Date Created\*\*: .+/,
            `- **Date Created**: ${currentDate}`
        );
        
        // Update footer version info
        sopContent = sopContent.replace(
            /\*\*Document Version\*\*: \d+\.\d+\.\d+/,
            `**Document Version**: ${newVersion}`
        );
        
        sopContent = sopContent.replace(
            /\*\*Last Updated\*\*: .+/,
            `**Last Updated**: ${currentDate}`
        );
        
        const nextReview = this.getNextReviewDate();
        sopContent = sopContent.replace(
            /\*\*Next Review\*\*: .+/,
            `**Next Review**: ${nextReview}`
        );
        
        fs.writeFileSync(this.sopPath, sopContent);
    }

    addChange(change) {
        const versionData = fs.readJsonSync(this.versionFile);
        const changeEntry = {
            timestamp: new Date().toISOString(),
            description: change.description,
            type: change.type || 'update',
            files: change.files || [],
            author: change.author || 'System'
        };
        
        versionData.changes.push(changeEntry);
        fs.writeJsonSync(this.versionFile, versionData, { spaces: 2 });
        
        this.updateChangelog(changeEntry);
        console.log(chalk.green(`✅ Change logged: ${change.description}`));
    }

    updateChangelog(change) {
        let changelogContent = fs.readFileSync(this.changelogPath, 'utf8');
        const currentVersion = this.getCurrentVersion();
        const date = new Date().toISOString().split('T')[0];
        
        // Check if current version section exists
        const versionHeader = `## Version ${currentVersion}`;
        if (!changelogContent.includes(versionHeader)) {
            // Add new version section
            const newVersionSection = `
## Version ${currentVersion} - ${date}

### ${this.getChangeTypeSection(change.type)}
- ${change.description}

---

`;
            changelogContent = changelogContent.replace(
                '---\n\n*This changelog',
                newVersionSection + '---\n\n*This changelog'
            );
        } else {
            // Add to existing version section
            const typeSection = `### ${this.getChangeTypeSection(change.type)}`;
            if (changelogContent.includes(typeSection)) {
                // Add to existing type section
                const regex = new RegExp(`(${typeSection}[\\s\\S]*?)\\n\\n`);
                changelogContent = changelogContent.replace(
                    regex,
                    `$1\n- ${change.description}\n\n`
                );
            } else {
                // Add new type section
                const versionRegex = new RegExp(`(${versionHeader}[\\s\\S]*?)\\n\\n###`);
                changelogContent = changelogContent.replace(
                    versionRegex,
                    `$1\n\n### ${this.getChangeTypeSection(change.type)}\n- ${change.description}\n\n###`
                );
            }
        }
        
        fs.writeFileSync(this.changelogPath, changelogContent);
    }

    getChangeTypeSection(type) {
        const typeMap = {
            'added': 'Added',
            'changed': 'Changed',
            'deprecated': 'Deprecated',
            'removed': 'Removed',
            'fixed': 'Fixed',
            'security': 'Security',
            'update': 'Updated'
        };
        return typeMap[type] || 'Updated';
    }

    scanForChanges() {
        console.log(chalk.blue('🔍 Scanning for changes...'));
        
        try {
            // Get git changes
            const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
            const changes = gitStatus.split('\n').filter(line => line.trim());
            
            if (changes.length === 0) {
                console.log(chalk.green('✅ No changes detected'));
                return;
            }
            
            console.log(chalk.yellow(`📝 Found ${changes.length} changes`));
            
            // Categorize changes
            const categorizedChanges = this.categorizeChanges(changes);
            
            // Log changes
            categorizedChanges.forEach(change => {
                this.addChange(change);
            });
            
            // Auto-increment version based on change types
            const hasBreaking = categorizedChanges.some(c => c.type === 'removed' || c.type === 'security');
            const hasFeatures = categorizedChanges.some(c => c.type === 'added');
            
            if (hasBreaking) {
                this.updateVersion('major');
            } else if (hasFeatures) {
                this.updateVersion('minor');
            } else {
                this.updateVersion('patch');
            }
            
        } catch (error) {
            console.error(chalk.red('❌ Error scanning changes:'), error.message);
        }
    }

    categorizeChanges(gitChanges) {
        const changes = [];
        
        gitChanges.forEach(change => {
            const [status, file] = change.trim().split(/\s+/);
            let type = 'update';
            let description = `Updated ${file}`;
            
            // Categorize based on file type and status
            if (status === 'A') {
                type = 'added';
                description = `Added ${file}`;
            } else if (status === 'D') {
                type = 'removed';
                description = `Removed ${file}`;
            } else if (status === 'M') {
                type = 'changed';
                description = `Modified ${file}`;
            }
            
            // Special handling for specific files
            if (file.includes('security') || file.includes('auth')) {
                type = 'security';
            } else if (file.includes('fix') || file.includes('bug')) {
                type = 'fixed';
            } else if (file.includes('mcp') || file.includes('integration')) {
                type = 'added';
                description = `Enhanced MCP integration in ${file}`;
            } else if (file.includes('dashboard')) {
                type = 'changed';
                description = `Updated dashboard component: ${file}`;
            }
            
            changes.push({
                description,
                type,
                files: [file],
                author: 'Auto-Detection'
            });
        });
        
        return changes;
    }

    generateReport() {
        const versionData = fs.readJsonSync(this.versionFile);
        
        console.log(chalk.blue('\n📊 SOP Version Report'));
        console.log(chalk.blue('===================='));
        console.log(`Current Version: ${chalk.green(versionData.version)}`);
        console.log(`Last Updated: ${chalk.yellow(versionData.lastUpdated)}`);
        console.log(`Next Review: ${chalk.yellow(versionData.nextReview)}`);
        console.log(`Status: ${chalk.green(versionData.status)}`);
        console.log(`Total Changes: ${chalk.cyan(versionData.changes.length)}`);
        
        if (versionData.changes.length > 0) {
            console.log('\nRecent Changes:');
            versionData.changes.slice(-5).forEach(change => {
                console.log(`  • ${change.description} (${change.type})`);
            });
        }
        
        console.log(`\nBackups: ${chalk.cyan(fs.readdirSync(this.backupDir).length)} files`);
        console.log(`Changelog: ${this.changelogPath}`);
    }

    autoUpdate() {
        console.log(chalk.blue('🔄 Running auto-update...'));
        
        // Scan for changes
        this.scanForChanges();
        
        // Check if review is due
        const versionData = fs.readJsonSync(this.versionFile);
        const nextReview = new Date(versionData.nextReview);
        const now = new Date();
        
        if (now >= nextReview) {
            console.log(chalk.yellow('📅 SOP review is due!'));
            this.addChange({
                description: 'SOP review due - scheduled maintenance check',
                type: 'update',
                author: 'System'
            });
        }
        
        // Generate report
        this.generateReport();
    }

    setupGitHooks() {
        const hookPath = path.join(__dirname, '../.git/hooks/pre-commit');
        const hookContent = `#!/bin/bash
# SOP Auto-versioning hook
node scripts/sop-versioning-system.js auto-update
`;
        
        fs.writeFileSync(hookPath, hookContent);
        fs.chmodSync(hookPath, '755');
        
        console.log(chalk.green('✅ Git hooks configured for auto-versioning'));
    }

    exportVersion() {
        const versionData = fs.readJsonSync(this.versionFile);
        const exportPath = path.join(__dirname, '../docs/sop-version-export.json');
        
        const exportData = {
            ...versionData,
            exportDate: new Date().toISOString(),
            sopPath: this.sopPath,
            changelogPath: this.changelogPath
        };
        
        fs.writeJsonSync(exportPath, exportData, { spaces: 2 });
        console.log(chalk.green(`✅ Version data exported to ${exportPath}`));
    }
}

// CLI Interface
if (require.main === module) {
    const sop = new SOPVersioningSystem();
    const command = process.argv[2];
    
    switch (command) {
        case 'update':
            const versionType = process.argv[3] || 'patch';
            sop.updateVersion(versionType);
            break;
        case 'add-change':
            const description = process.argv[3];
            const type = process.argv[4] || 'update';
            if (description) {
                sop.addChange({ description, type });
            } else {
                console.error('Usage: node sop-versioning-system.js add-change "description" [type]');
            }
            break;
        case 'scan':
            sop.scanForChanges();
            break;
        case 'report':
            sop.generateReport();
            break;
        case 'auto-update':
            sop.autoUpdate();
            break;
        case 'setup-hooks':
            sop.setupGitHooks();
            break;
        case 'export':
            sop.exportVersion();
            break;
        default:
            console.log(chalk.blue('SOP Versioning System'));
            console.log('Usage: node sop-versioning-system.js [command]');
            console.log('');
            console.log('Commands:');
            console.log('  update [patch|minor|major]  - Update version');
            console.log('  add-change "desc" [type]    - Add change entry');
            console.log('  scan                        - Scan for changes');
            console.log('  report                      - Generate version report');
            console.log('  auto-update                 - Run full auto-update');
            console.log('  setup-hooks                 - Configure git hooks');
            console.log('  export                      - Export version data');
    }
}

module.exports = SOPVersioningSystem;