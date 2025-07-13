#!/usr/bin/env node

/**
 * Internationalization (i18n) System
 * Multi-language support for the Vibe Marketing Automation Platform
 * Supports dynamic language switching and localized content
 */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

class InternationalizationSystem {
    constructor() {
        this.localesDir = path.join(__dirname, '../locales');
        this.supportedLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ar'];
        this.defaultLanguage = 'en';
        this.translations = {};
        
        this.initializeLocales();
    }

    async initializeLocales() {
        // Create locales directory
        await fs.ensureDir(this.localesDir);
        
        // Initialize translation files for each language
        for (const lang of this.supportedLanguages) {
            const langFile = path.join(this.localesDir, `${lang}.json`);
            if (!await fs.pathExists(langFile)) {
                await this.createLanguageFile(lang);
            }
        }
        
        // Load all translations
        await this.loadTranslations();
    }

    async createLanguageFile(lang) {
        const baseTranslations = {
            // Common UI Elements
            common: {
                loading: lang === 'en' ? 'Loading...' : this.getTranslation('Loading...', lang),
                error: lang === 'en' ? 'Error' : this.getTranslation('Error', lang),
                success: lang === 'en' ? 'Success' : this.getTranslation('Success', lang),
                warning: lang === 'en' ? 'Warning' : this.getTranslation('Warning', lang),
                info: lang === 'en' ? 'Information' : this.getTranslation('Information', lang),
                save: lang === 'en' ? 'Save' : this.getTranslation('Save', lang),
                cancel: lang === 'en' ? 'Cancel' : this.getTranslation('Cancel', lang),
                delete: lang === 'en' ? 'Delete' : this.getTranslation('Delete', lang),
                edit: lang === 'en' ? 'Edit' : this.getTranslation('Edit', lang),
                add: lang === 'en' ? 'Add' : this.getTranslation('Add', lang),
                remove: lang === 'en' ? 'Remove' : this.getTranslation('Remove', lang),
                close: lang === 'en' ? 'Close' : this.getTranslation('Close', lang),
                open: lang === 'en' ? 'Open' : this.getTranslation('Open', lang),
                yes: lang === 'en' ? 'Yes' : this.getTranslation('Yes', lang),
                no: lang === 'en' ? 'No' : this.getTranslation('No', lang),
                confirm: lang === 'en' ? 'Confirm' : this.getTranslation('Confirm', lang),
                search: lang === 'en' ? 'Search' : this.getTranslation('Search', lang),
                filter: lang === 'en' ? 'Filter' : this.getTranslation('Filter', lang),
                sort: lang === 'en' ? 'Sort' : this.getTranslation('Sort', lang),
                refresh: lang === 'en' ? 'Refresh' : this.getTranslation('Refresh', lang),
                export: lang === 'en' ? 'Export' : this.getTranslation('Export', lang),
                import: lang === 'en' ? 'Import' : this.getTranslation('Import', lang),
                download: lang === 'en' ? 'Download' : this.getTranslation('Download', lang),
                upload: lang === 'en' ? 'Upload' : this.getTranslation('Upload', lang),
                copy: lang === 'en' ? 'Copy' : this.getTranslation('Copy', lang),
                paste: lang === 'en' ? 'Paste' : this.getTranslation('Paste', lang),
                cut: lang === 'en' ? 'Cut' : this.getTranslation('Cut', lang),
                undo: lang === 'en' ? 'Undo' : this.getTranslation('Undo', lang),
                redo: lang === 'en' ? 'Redo' : this.getTranslation('Redo', lang),
                settings: lang === 'en' ? 'Settings' : this.getTranslation('Settings', lang),
                help: lang === 'en' ? 'Help' : this.getTranslation('Help', lang),
                about: lang === 'en' ? 'About' : this.getTranslation('About', lang),
                logout: lang === 'en' ? 'Logout' : this.getTranslation('Logout', lang),
                login: lang === 'en' ? 'Login' : this.getTranslation('Login', lang),
                register: lang === 'en' ? 'Register' : this.getTranslation('Register', lang),
                profile: lang === 'en' ? 'Profile' : this.getTranslation('Profile', lang),
                dashboard: lang === 'en' ? 'Dashboard' : this.getTranslation('Dashboard', lang),
                menu: lang === 'en' ? 'Menu' : this.getTranslation('Menu', lang),
                home: lang === 'en' ? 'Home' : this.getTranslation('Home', lang),
                back: lang === 'en' ? 'Back' : this.getTranslation('Back', lang),
                next: lang === 'en' ? 'Next' : this.getTranslation('Next', lang),
                previous: lang === 'en' ? 'Previous' : this.getTranslation('Previous', lang),
                first: lang === 'en' ? 'First' : this.getTranslation('First', lang),
                last: lang === 'en' ? 'Last' : this.getTranslation('Last', lang),
                page: lang === 'en' ? 'Page' : this.getTranslation('Page', lang),
                of: lang === 'en' ? 'of' : this.getTranslation('of', lang),
                showing: lang === 'en' ? 'Showing' : this.getTranslation('Showing', lang),
                results: lang === 'en' ? 'results' : this.getTranslation('results', lang),
                total: lang === 'en' ? 'Total' : this.getTranslation('Total', lang),
                all: lang === 'en' ? 'All' : this.getTranslation('All', lang),
                none: lang === 'en' ? 'None' : this.getTranslation('None', lang),
                other: lang === 'en' ? 'Other' : this.getTranslation('Other', lang)
            },

            // Dashboard specific
            dashboard: {
                title: lang === 'en' ? 'Vibe Marketing Automation Platform' : this.getTranslation('Vibe Marketing Automation Platform', lang),
                subtitle: lang === 'en' ? 'AI-Powered Marketing Solutions' : this.getTranslation('AI-Powered Marketing Solutions', lang),
                welcome: lang === 'en' ? 'Welcome to your dashboard' : this.getTranslation('Welcome to your dashboard', lang),
                overview: lang === 'en' ? 'Overview' : this.getTranslation('Overview', lang),
                analytics: lang === 'en' ? 'Analytics' : this.getTranslation('Analytics', lang),
                campaigns: lang === 'en' ? 'Campaigns' : this.getTranslation('Campaigns', lang),
                leads: lang === 'en' ? 'Leads' : this.getTranslation('Leads', lang),
                contacts: lang === 'en' ? 'Contacts' : this.getTranslation('Contacts', lang),
                reports: lang === 'en' ? 'Reports' : this.getTranslation('Reports', lang),
                integrations: lang === 'en' ? 'Integrations' : this.getTranslation('Integrations', lang),
                automations: lang === 'en' ? 'Automations' : this.getTranslation('Automations', lang),
                tools: lang === 'en' ? 'Tools' : this.getTranslation('Tools', lang),
                admin: lang === 'en' ? 'Admin' : this.getTranslation('Admin', lang),
                users: lang === 'en' ? 'Users' : this.getTranslation('Users', lang),
                permissions: lang === 'en' ? 'Permissions' : this.getTranslation('Permissions', lang),
                apiKeys: lang === 'en' ? 'API Keys' : this.getTranslation('API Keys', lang),
                logs: lang === 'en' ? 'Logs' : this.getTranslation('Logs', lang),
                system: lang === 'en' ? 'System' : this.getTranslation('System', lang),
                health: lang === 'en' ? 'Health' : this.getTranslation('Health', lang),
                monitoring: lang === 'en' ? 'Monitoring' : this.getTranslation('Monitoring', lang),
                backup: lang === 'en' ? 'Backup' : this.getTranslation('Backup', lang),
                restore: lang === 'en' ? 'Restore' : this.getTranslation('Restore', lang),
                maintenance: lang === 'en' ? 'Maintenance' : this.getTranslation('Maintenance', lang)
            },

            // AI Guidance tooltips
            guidance: {
                beginner: lang === 'en' ? 'Beginner Level: Basic features and simple operations' : this.getTranslation('Beginner Level: Basic features and simple operations', lang),
                intermediate: lang === 'en' ? 'Intermediate Level: Advanced features and integrations' : this.getTranslation('Intermediate Level: Advanced features and integrations', lang),
                advanced: lang === 'en' ? 'Advanced Level: Complex automations and custom solutions' : this.getTranslation('Advanced Level: Complex automations and custom solutions', lang),
                tooltip_beginner: lang === 'en' ? 'AI Guidance: Beginner Level - Basic chat and code completion' : this.getTranslation('AI Guidance: Beginner Level - Basic chat and code completion', lang),
                tooltip_intermediate: lang === 'en' ? 'AI Guidance: Intermediate Level - MCP integrations and workflows' : this.getTranslation('AI Guidance: Intermediate Level - MCP integrations and workflows', lang),
                tooltip_advanced: lang === 'en' ? 'AI Guidance: Advanced Level - Complex automations and custom development' : this.getTranslation('AI Guidance: Advanced Level - Complex automations and custom development', lang)
            },

            // MCP Integrations
            mcp: {
                title: lang === 'en' ? 'MCP Integrations' : this.getTranslation('MCP Integrations', lang),
                description: lang === 'en' ? 'Model Context Protocol integrations for enhanced functionality' : this.getTranslation('Model Context Protocol integrations for enhanced functionality', lang),
                status: lang === 'en' ? 'Status' : this.getTranslation('Status', lang),
                connected: lang === 'en' ? 'Connected' : this.getTranslation('Connected', lang),
                disconnected: lang === 'en' ? 'Disconnected' : this.getTranslation('Disconnected', lang),
                connecting: lang === 'en' ? 'Connecting' : this.getTranslation('Connecting', lang),
                error: lang === 'en' ? 'Error' : this.getTranslation('Error', lang),
                configure: lang === 'en' ? 'Configure' : this.getTranslation('Configure', lang),
                test: lang === 'en' ? 'Test Connection' : this.getTranslation('Test Connection', lang),
                enable: lang === 'en' ? 'Enable' : this.getTranslation('Enable', lang),
                disable: lang === 'en' ? 'Disable' : this.getTranslation('Disable', lang),
                restart: lang === 'en' ? 'Restart' : this.getTranslation('Restart', lang),
                logs: lang === 'en' ? 'View Logs' : this.getTranslation('View Logs', lang),
                documentation: lang === 'en' ? 'Documentation' : this.getTranslation('Documentation', lang)
            },

            // Error messages
            errors: {
                generic: lang === 'en' ? 'An error occurred. Please try again.' : this.getTranslation('An error occurred. Please try again.', lang),
                network: lang === 'en' ? 'Network error. Please check your connection.' : this.getTranslation('Network error. Please check your connection.', lang),
                timeout: lang === 'en' ? 'Request timed out. Please try again.' : this.getTranslation('Request timed out. Please try again.', lang),
                unauthorized: lang === 'en' ? 'Unauthorized access. Please login.' : this.getTranslation('Unauthorized access. Please login.', lang),
                forbidden: lang === 'en' ? 'Access forbidden. Insufficient permissions.' : this.getTranslation('Access forbidden. Insufficient permissions.', lang),
                notFound: lang === 'en' ? 'Resource not found.' : this.getTranslation('Resource not found.', lang),
                validation: lang === 'en' ? 'Validation error. Please check your input.' : this.getTranslation('Validation error. Please check your input.', lang),
                server: lang === 'en' ? 'Server error. Please try again later.' : this.getTranslation('Server error. Please try again later.', lang),
                maintenance: lang === 'en' ? 'System under maintenance. Please try again later.' : this.getTranslation('System under maintenance. Please try again later.', lang)
            },

            // Success messages
            success: {
                saved: lang === 'en' ? 'Successfully saved' : this.getTranslation('Successfully saved', lang),
                deleted: lang === 'en' ? 'Successfully deleted' : this.getTranslation('Successfully deleted', lang),
                updated: lang === 'en' ? 'Successfully updated' : this.getTranslation('Successfully updated', lang),
                created: lang === 'en' ? 'Successfully created' : this.getTranslation('Successfully created', lang),
                imported: lang === 'en' ? 'Successfully imported' : this.getTranslation('Successfully imported', lang),
                exported: lang === 'en' ? 'Successfully exported' : this.getTranslation('Successfully exported', lang),
                connected: lang === 'en' ? 'Successfully connected' : this.getTranslation('Successfully connected', lang),
                disconnected: lang === 'en' ? 'Successfully disconnected' : this.getTranslation('Successfully disconnected', lang),
                configured: lang === 'en' ? 'Successfully configured' : this.getTranslation('Successfully configured', lang),
                deployed: lang === 'en' ? 'Successfully deployed' : this.getTranslation('Successfully deployed', lang)
            },

            // Form labels and placeholders
            forms: {
                name: lang === 'en' ? 'Name' : this.getTranslation('Name', lang),
                email: lang === 'en' ? 'Email' : this.getTranslation('Email', lang),
                password: lang === 'en' ? 'Password' : this.getTranslation('Password', lang),
                confirmPassword: lang === 'en' ? 'Confirm Password' : this.getTranslation('Confirm Password', lang),
                firstName: lang === 'en' ? 'First Name' : this.getTranslation('First Name', lang),
                lastName: lang === 'en' ? 'Last Name' : this.getTranslation('Last Name', lang),
                company: lang === 'en' ? 'Company' : this.getTranslation('Company', lang),
                phone: lang === 'en' ? 'Phone' : this.getTranslation('Phone', lang),
                address: lang === 'en' ? 'Address' : this.getTranslation('Address', lang),
                city: lang === 'en' ? 'City' : this.getTranslation('City', lang),
                state: lang === 'en' ? 'State' : this.getTranslation('State', lang),
                country: lang === 'en' ? 'Country' : this.getTranslation('Country', lang),
                zipCode: lang === 'en' ? 'ZIP Code' : this.getTranslation('ZIP Code', lang),
                website: lang === 'en' ? 'Website' : this.getTranslation('Website', lang),
                description: lang === 'en' ? 'Description' : this.getTranslation('Description', lang),
                notes: lang === 'en' ? 'Notes' : this.getTranslation('Notes', lang),
                tags: lang === 'en' ? 'Tags' : this.getTranslation('Tags', lang),
                category: lang === 'en' ? 'Category' : this.getTranslation('Category', lang),
                priority: lang === 'en' ? 'Priority' : this.getTranslation('Priority', lang),
                status: lang === 'en' ? 'Status' : this.getTranslation('Status', lang),
                type: lang === 'en' ? 'Type' : this.getTranslation('Type', lang),
                value: lang === 'en' ? 'Value' : this.getTranslation('Value', lang),
                amount: lang === 'en' ? 'Amount' : this.getTranslation('Amount', lang),
                quantity: lang === 'en' ? 'Quantity' : this.getTranslation('Quantity', lang),
                price: lang === 'en' ? 'Price' : this.getTranslation('Price', lang),
                date: lang === 'en' ? 'Date' : this.getTranslation('Date', lang),
                time: lang === 'en' ? 'Time' : this.getTranslation('Time', lang),
                duration: lang === 'en' ? 'Duration' : this.getTranslation('Duration', lang),
                location: lang === 'en' ? 'Location' : this.getTranslation('Location', lang),
                url: lang === 'en' ? 'URL' : this.getTranslation('URL', lang),
                apiKey: lang === 'en' ? 'API Key' : this.getTranslation('API Key', lang),
                token: lang === 'en' ? 'Token' : this.getTranslation('Token', lang),
                secret: lang === 'en' ? 'Secret' : this.getTranslation('Secret', lang),
                username: lang === 'en' ? 'Username' : this.getTranslation('Username', lang),
                title: lang === 'en' ? 'Title' : this.getTranslation('Title', lang),
                subject: lang === 'en' ? 'Subject' : this.getTranslation('Subject', lang),
                message: lang === 'en' ? 'Message' : this.getTranslation('Message', lang),
                content: lang === 'en' ? 'Content' : this.getTranslation('Content', lang),
                template: lang === 'en' ? 'Template' : this.getTranslation('Template', lang),
                language: lang === 'en' ? 'Language' : this.getTranslation('Language', lang),
                timezone: lang === 'en' ? 'Timezone' : this.getTranslation('Timezone', lang),
                currency: lang === 'en' ? 'Currency' : this.getTranslation('Currency', lang),
                format: lang === 'en' ? 'Format' : this.getTranslation('Format', lang),
                size: lang === 'en' ? 'Size' : this.getTranslation('Size', lang),
                color: lang === 'en' ? 'Color' : this.getTranslation('Color', lang),
                image: lang === 'en' ? 'Image' : this.getTranslation('Image', lang),
                file: lang === 'en' ? 'File' : this.getTranslation('File', lang),
                folder: lang === 'en' ? 'Folder' : this.getTranslation('Folder', lang),
                path: lang === 'en' ? 'Path' : this.getTranslation('Path', lang),
                version: lang === 'en' ? 'Version' : this.getTranslation('Version', lang),
                build: lang === 'en' ? 'Build' : this.getTranslation('Build', lang),
                environment: lang === 'en' ? 'Environment' : this.getTranslation('Environment', lang),
                configuration: lang === 'en' ? 'Configuration' : this.getTranslation('Configuration', lang),
                enabled: lang === 'en' ? 'Enabled' : this.getTranslation('Enabled', lang),
                disabled: lang === 'en' ? 'Disabled' : this.getTranslation('Disabled', lang),
                active: lang === 'en' ? 'Active' : this.getTranslation('Active', lang),
                inactive: lang === 'en' ? 'Inactive' : this.getTranslation('Inactive', lang),
                public: lang === 'en' ? 'Public' : this.getTranslation('Public', lang),
                private: lang === 'en' ? 'Private' : this.getTranslation('Private', lang),
                required: lang === 'en' ? 'Required' : this.getTranslation('Required', lang),
                optional: lang === 'en' ? 'Optional' : this.getTranslation('Optional', lang),
                placeholder: {
                    search: lang === 'en' ? 'Search...' : this.getTranslation('Search...', lang),
                    email: lang === 'en' ? 'Enter your email' : this.getTranslation('Enter your email', lang),
                    password: lang === 'en' ? 'Enter your password' : this.getTranslation('Enter your password', lang),
                    name: lang === 'en' ? 'Enter name' : this.getTranslation('Enter name', lang),
                    description: lang === 'en' ? 'Enter description' : this.getTranslation('Enter description', lang),
                    url: lang === 'en' ? 'Enter URL' : this.getTranslation('Enter URL', lang),
                    select: lang === 'en' ? 'Select an option' : this.getTranslation('Select an option', lang),
                    choose: lang === 'en' ? 'Choose...' : this.getTranslation('Choose...', lang),
                    upload: lang === 'en' ? 'Click to upload or drag and drop' : this.getTranslation('Click to upload or drag and drop', lang)
                }
            },

            // Date and time
            datetime: {
                now: lang === 'en' ? 'Now' : this.getTranslation('Now', lang),
                today: lang === 'en' ? 'Today' : this.getTranslation('Today', lang),
                yesterday: lang === 'en' ? 'Yesterday' : this.getTranslation('Yesterday', lang),
                tomorrow: lang === 'en' ? 'Tomorrow' : this.getTranslation('Tomorrow', lang),
                thisWeek: lang === 'en' ? 'This week' : this.getTranslation('This week', lang),
                lastWeek: lang === 'en' ? 'Last week' : this.getTranslation('Last week', lang),
                nextWeek: lang === 'en' ? 'Next week' : this.getTranslation('Next week', lang),
                thisMonth: lang === 'en' ? 'This month' : this.getTranslation('This month', lang),
                lastMonth: lang === 'en' ? 'Last month' : this.getTranslation('Last month', lang),
                nextMonth: lang === 'en' ? 'Next month' : this.getTranslation('Next month', lang),
                thisYear: lang === 'en' ? 'This year' : this.getTranslation('This year', lang),
                lastYear: lang === 'en' ? 'Last year' : this.getTranslation('Last year', lang),
                nextYear: lang === 'en' ? 'Next year' : this.getTranslation('Next year', lang),
                ago: lang === 'en' ? 'ago' : this.getTranslation('ago', lang),
                from_now: lang === 'en' ? 'from now' : this.getTranslation('from now', lang),
                just_now: lang === 'en' ? 'just now' : this.getTranslation('just now', lang),
                minutes: lang === 'en' ? 'minutes' : this.getTranslation('minutes', lang),
                hours: lang === 'en' ? 'hours' : this.getTranslation('hours', lang),
                days: lang === 'en' ? 'days' : this.getTranslation('days', lang),
                weeks: lang === 'en' ? 'weeks' : this.getTranslation('weeks', lang),
                months: lang === 'en' ? 'months' : this.getTranslation('months', lang),
                years: lang === 'en' ? 'years' : this.getTranslation('years', lang)
            },

            // Legal and compliance
            legal: {
                terms: lang === 'en' ? 'Terms of Service' : this.getTranslation('Terms of Service', lang),
                privacy: lang === 'en' ? 'Privacy Policy' : this.getTranslation('Privacy Policy', lang),
                cookies: lang === 'en' ? 'Cookie Policy' : this.getTranslation('Cookie Policy', lang),
                gdpr: lang === 'en' ? 'GDPR Compliance' : this.getTranslation('GDPR Compliance', lang),
                accept: lang === 'en' ? 'I accept the terms and conditions' : this.getTranslation('I accept the terms and conditions', lang),
                agree: lang === 'en' ? 'I agree to the privacy policy' : this.getTranslation('I agree to the privacy policy', lang),
                consent: lang === 'en' ? 'I consent to data processing' : this.getTranslation('I consent to data processing', lang),
                copyright: lang === 'en' ? 'Copyright' : this.getTranslation('Copyright', lang),
                license: lang === 'en' ? 'License' : this.getTranslation('License', lang),
                disclaimer: lang === 'en' ? 'Disclaimer' : this.getTranslation('Disclaimer', lang)
            }
        };

        const langFile = path.join(this.localesDir, `${lang}.json`);
        await fs.writeJson(langFile, baseTranslations, { spaces: 2 });
        
        console.log(chalk.green(`✅ Created language file: ${lang}.json`));
    }

    // Simple translation mapping (in real implementation, use proper translation service)
    getTranslation(text, lang) {
        const translations = {
            'es': {
                'Loading...': 'Cargando...',
                'Error': 'Error',
                'Success': 'Éxito',
                'Warning': 'Advertencia',
                'Information': 'Información',
                'Save': 'Guardar',
                'Cancel': 'Cancelar',
                'Delete': 'Eliminar',
                'Edit': 'Editar',
                'Add': 'Agregar',
                'Remove': 'Quitar',
                'Close': 'Cerrar',
                'Open': 'Abrir',
                'Yes': 'Sí',
                'No': 'No',
                'Confirm': 'Confirmar',
                'Search': 'Buscar',
                'Dashboard': 'Panel de Control',
                'Settings': 'Configuración',
                'Help': 'Ayuda',
                'Logout': 'Cerrar Sesión',
                'Login': 'Iniciar Sesión'
            },
            'fr': {
                'Loading...': 'Chargement...',
                'Error': 'Erreur',
                'Success': 'Succès',
                'Warning': 'Avertissement',
                'Information': 'Information',
                'Save': 'Enregistrer',
                'Cancel': 'Annuler',
                'Delete': 'Supprimer',
                'Edit': 'Modifier',
                'Add': 'Ajouter',
                'Remove': 'Supprimer',
                'Close': 'Fermer',
                'Open': 'Ouvrir',
                'Yes': 'Oui',
                'No': 'Non',
                'Confirm': 'Confirmer',
                'Search': 'Rechercher',
                'Dashboard': 'Tableau de Bord',
                'Settings': 'Paramètres',
                'Help': 'Aide',
                'Logout': 'Déconnexion',
                'Login': 'Connexion'
            },
            'de': {
                'Loading...': 'Laden...',
                'Error': 'Fehler',
                'Success': 'Erfolg',
                'Warning': 'Warnung',
                'Information': 'Information',
                'Save': 'Speichern',
                'Cancel': 'Abbrechen',
                'Delete': 'Löschen',
                'Edit': 'Bearbeiten',
                'Add': 'Hinzufügen',
                'Remove': 'Entfernen',
                'Close': 'Schließen',
                'Open': 'Öffnen',
                'Yes': 'Ja',
                'No': 'Nein',
                'Confirm': 'Bestätigen',
                'Search': 'Suchen',
                'Dashboard': 'Dashboard',
                'Settings': 'Einstellungen',
                'Help': 'Hilfe',
                'Logout': 'Abmelden',
                'Login': 'Anmelden'
            }
        };

        return translations[lang]?.[text] || text;
    }

    async loadTranslations() {
        for (const lang of this.supportedLanguages) {
            const langFile = path.join(this.localesDir, `${lang}.json`);
            if (await fs.pathExists(langFile)) {
                this.translations[lang] = await fs.readJson(langFile);
            }
        }
        
        console.log(chalk.blue(`📚 Loaded translations for ${Object.keys(this.translations).length} languages`));
    }

    // Generate JavaScript i18n integration code
    generateI18nScript() {
        const script = `
// Internationalization (i18n) Integration
class I18nManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || '${this.defaultLanguage}';
        this.translations = ${JSON.stringify(this.translations, null, 2)};
        this.fallbackLanguage = '${this.defaultLanguage}';
        
        this.initializeI18n();
    }

    initializeI18n() {
        // Set up language detection
        this.detectLanguage();
        
        // Apply translations to existing elements
        this.applyTranslations();
        
        // Set up language switcher
        this.setupLanguageSwitcher();
        
        // Set up mutation observer for dynamic content
        this.setupMutationObserver();
    }

    detectLanguage() {
        // Try to detect language from various sources
        const urlLang = new URLSearchParams(window.location.search).get('lang');
        const browserLang = navigator.language.split('-')[0];
        const storedLang = localStorage.getItem('language');
        
        const detectedLang = urlLang || storedLang || browserLang || this.fallbackLanguage;
        
        if (this.translations[detectedLang]) {
            this.currentLanguage = detectedLang;
        } else {
            this.currentLanguage = this.fallbackLanguage;
        }
        
        localStorage.setItem('language', this.currentLanguage);
        document.documentElement.lang = this.currentLanguage;
    }

    translate(key, params = {}) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        // Navigate through nested keys
        for (const k of keys) {
            translation = translation?.[k];
        }
        
        // Fallback to default language if translation not found
        if (!translation && this.currentLanguage !== this.fallbackLanguage) {
            translation = this.translations[this.fallbackLanguage];
            for (const k of keys) {
                translation = translation?.[k];
            }
        }
        
        // Return key if no translation found
        if (!translation) {
            return key;
        }
        
        // Replace parameters in translation
        let result = translation;
        Object.keys(params).forEach(param => {
            result = result.replace(new RegExp(\`{{\\s*\${param}\\s*}}\`, 'g'), params[param]);
        });
        
        return result;
    }

    t(key, params = {}) {
        return this.translate(key, params);
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            document.documentElement.lang = lang;
            this.applyTranslations();
            
            // Trigger language change event
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
        }
    }

    applyTranslations() {
        // Apply translations to elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.type === 'submit' || element.type === 'button') {
                    element.value = translation;
                } else {
                    element.placeholder = translation;
                }
            } else {
                element.textContent = translation;
            }
        });

        // Apply translations to elements with data-i18n-title attribute
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.translate(key);
        });

        // Apply translations to elements with data-i18n-aria-label attribute
        document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria-label');
            element.setAttribute('aria-label', this.translate(key));
        });
    }

    setupLanguageSwitcher() {
        // Create language switcher if it doesn't exist
        if (!document.getElementById('language-switcher')) {
            const switcher = document.createElement('select');
            switcher.id = 'language-switcher';
            switcher.className = 'language-switcher';
            
            ${this.supportedLanguages.map(lang => `
            const option${lang.toUpperCase()} = document.createElement('option');
            option${lang.toUpperCase()}.value = '${lang}';
            option${lang.toUpperCase()}.textContent = '${this.getLanguageName(lang)}';
            if ('${lang}' === this.currentLanguage) option${lang.toUpperCase()}.selected = true;
            switcher.appendChild(option${lang.toUpperCase()});
            `).join('')}
            
            switcher.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
            
            // Add to header or navigation
            const header = document.querySelector('header') || document.querySelector('nav') || document.body;
            header.appendChild(switcher);
        }
    }

    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Apply translations to new elements
                            const i18nElements = node.querySelectorAll ? node.querySelectorAll('[data-i18n]') : [];
                            i18nElements.forEach(element => {
                                const key = element.getAttribute('data-i18n');
                                const translation = this.translate(key);
                                
                                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                                    if (element.type === 'submit' || element.type === 'button') {
                                        element.value = translation;
                                    } else {
                                        element.placeholder = translation;
                                    }
                                } else {
                                    element.textContent = translation;
                                }
                            });
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    formatDate(date, format = 'short') {
        const options = {
            short: { year: 'numeric', month: 'short', day: 'numeric' },
            long: { year: 'numeric', month: 'long', day: 'numeric' },
            time: { hour: '2-digit', minute: '2-digit' },
            datetime: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
        };

        return new Intl.DateTimeFormat(this.currentLanguage, options[format]).format(new Date(date));
    }

    formatNumber(number, options = {}) {
        return new Intl.NumberFormat(this.currentLanguage, options).format(number);
    }

    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat(this.currentLanguage, {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    getSupportedLanguages() {
        return ${JSON.stringify(this.supportedLanguages)};
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    isRTL() {
        const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
        return rtlLanguages.includes(this.currentLanguage);
    }
}

// Initialize i18n
const i18n = new I18nManager();

// Global functions for easy access
window.t = (key, params) => i18n.translate(key, params);
window.setLanguage = (lang) => i18n.setLanguage(lang);
window.getCurrentLanguage = () => i18n.getCurrentLanguage();
window.formatDate = (date, format) => i18n.formatDate(date, format);
window.formatNumber = (number, options) => i18n.formatNumber(number, options);
window.formatCurrency = (amount, currency) => i18n.formatCurrency(amount, currency);

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = i18n;
}
`;

        return script;
    }

    getLanguageName(lang) {
        const names = {
            'en': 'English',
            'es': 'Español',
            'fr': 'Français',
            'de': 'Deutsch',
            'it': 'Italiano',
            'pt': 'Português',
            'zh': '中文',
            'ja': '日本語',
            'ko': '한국어',
            'ar': 'العربية'
        };
        return names[lang] || lang.toUpperCase();
    }

    // Update HTML files with i18n attributes
    async updateHTMLFiles() {
        const htmlFiles = glob.sync(path.join(__dirname, '../**/*.html'));
        
        for (const file of htmlFiles) {
            let content = await fs.readFile(file, 'utf8');
            
            // Add i18n attributes to common elements
            content = content.replace(/<button([^>]*)>([^<]+)<\/button>/g, (match, attrs, text) => {
                const key = this.generateI18nKey(text);
                return `<button${attrs} data-i18n="${key}">${text}</button>`;
            });
            
            content = content.replace(/<label([^>]*)>([^<]+)<\/label>/g, (match, attrs, text) => {
                const key = this.generateI18nKey(text);
                return `<label${attrs} data-i18n="${key}">${text}</label>`;
            });
            
            content = content.replace(/<h([1-6])([^>]*)>([^<]+)<\/h[1-6]>/g, (match, level, attrs, text) => {
                const key = this.generateI18nKey(text);
                return `<h${level}${attrs} data-i18n="${key}">${text}</h${level}>`;
            });
            
            content = content.replace(/<p([^>]*)>([^<]+)<\/p>/g, (match, attrs, text) => {
                if (text.trim() && !text.includes('<')) {
                    const key = this.generateI18nKey(text);
                    return `<p${attrs} data-i18n="${key}">${text}</p>`;
                }
                return match;
            });
            
            // Add i18n script if not present
            if (!content.includes('i18n-integration.js')) {
                const scriptTag = '<script src="scripts/i18n-integration.js"></script>';
                content = content.replace('</body>', `${scriptTag}\n</body>`);
            }
            
            await fs.writeFile(file, content);
        }
        
        console.log(chalk.green(`✅ Updated ${htmlFiles.length} HTML files with i18n attributes`));
    }

    generateI18nKey(text) {
        return text.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '_')
            .substring(0, 50);
    }

    // Generate CSS for RTL support
    generateRTLCSS() {
        return `
/* RTL Support */
[dir="rtl"] {
    direction: rtl;
    text-align: right;
}

[dir="rtl"] .float-left {
    float: right;
}

[dir="rtl"] .float-right {
    float: left;
}

[dir="rtl"] .text-left {
    text-align: right;
}

[dir="rtl"] .text-right {
    text-align: left;
}

[dir="rtl"] .ml-1 { margin-left: 0; margin-right: 0.25rem; }
[dir="rtl"] .ml-2 { margin-left: 0; margin-right: 0.5rem; }
[dir="rtl"] .ml-3 { margin-left: 0; margin-right: 0.75rem; }
[dir="rtl"] .ml-4 { margin-left: 0; margin-right: 1rem; }

[dir="rtl"] .mr-1 { margin-right: 0; margin-left: 0.25rem; }
[dir="rtl"] .mr-2 { margin-right: 0; margin-left: 0.5rem; }
[dir="rtl"] .mr-3 { margin-right: 0; margin-left: 0.75rem; }
[dir="rtl"] .mr-4 { margin-right: 0; margin-left: 1rem; }

[dir="rtl"] .pl-1 { padding-left: 0; padding-right: 0.25rem; }
[dir="rtl"] .pl-2 { padding-left: 0; padding-right: 0.5rem; }
[dir="rtl"] .pl-3 { padding-left: 0; padding-right: 0.75rem; }
[dir="rtl"] .pl-4 { padding-left: 0; padding-right: 1rem; }

[dir="rtl"] .pr-1 { padding-right: 0; padding-left: 0.25rem; }
[dir="rtl"] .pr-2 { padding-right: 0; padding-left: 0.5rem; }
[dir="rtl"] .pr-3 { padding-right: 0; padding-left: 0.75rem; }
[dir="rtl"] .pr-4 { padding-right: 0; padding-left: 1rem; }

[dir="rtl"] .border-l { border-left: 0; border-right: 1px solid; }
[dir="rtl"] .border-r { border-right: 0; border-left: 1px solid; }

[dir="rtl"] .rounded-l { border-top-left-radius: 0; border-bottom-left-radius: 0; border-top-right-radius: 0.25rem; border-bottom-right-radius: 0.25rem; }
[dir="rtl"] .rounded-r { border-top-right-radius: 0; border-bottom-right-radius: 0; border-top-left-radius: 0.25rem; border-bottom-left-radius: 0.25rem; }

/* Language Switcher */
.language-switcher {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 5px 10px;
    font-size: 14px;
}

[dir="rtl"] .language-switcher {
    right: auto;
    left: 20px;
}

/* Loading states for translations */
.i18n-loading {
    opacity: 0.5;
    pointer-events: none;
}

.i18n-loading::after {
    content: "...";
    animation: loading 1s infinite;
}

@keyframes loading {
    0%, 33% { content: "..."; }
    34%, 66% { content: ".."; }
    67%, 100% { content: "."; }
}
`;
    }

    // Export all files
    async exportI18nFiles() {
        // Generate and save i18n integration script
        const script = this.generateI18nScript();
        await fs.writeFile(path.join(__dirname, '../scripts/i18n-integration.js'), script);
        
        // Generate and save RTL CSS
        const rtlCSS = this.generateRTLCSS();
        await fs.writeFile(path.join(__dirname, '../styles/rtl-support.css'), rtlCSS);
        
        // Update HTML files
        await this.updateHTMLFiles();
        
        console.log(chalk.green('✅ I18n system exported successfully'));
        console.log(chalk.blue('📁 Files created:'));
        console.log('   - scripts/i18n-integration.js');
        console.log('   - styles/rtl-support.css');
        console.log(`   - locales/ (${this.supportedLanguages.length} language files)`);
    }

    // Generate translation report
    generateReport() {
        const report = {
            supportedLanguages: this.supportedLanguages,
            defaultLanguage: this.defaultLanguage,
            translationStats: {},
            missingTranslations: {}
        };

        // Calculate translation statistics
        Object.keys(this.translations).forEach(lang => {
            const translations = this.translations[lang];
            const totalKeys = this.countKeys(translations);
            report.translationStats[lang] = {
                totalKeys,
                completeness: lang === this.defaultLanguage ? 100 : Math.round((totalKeys / this.countKeys(this.translations[this.defaultLanguage])) * 100)
            };
        });

        return report;
    }

    countKeys(obj, prefix = '') {
        let count = 0;
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                count += this.countKeys(obj[key], `${prefix}${key}.`);
            } else {
                count++;
            }
        });
        return count;
    }
}

// CLI interface
if (require.main === module) {
    const i18n = new InternationalizationSystem();
    const command = process.argv[2];
    
    switch (command) {
        case 'init':
            i18n.initializeLocales()
                .then(() => console.log(chalk.green('✅ I18n system initialized')))
                .catch(console.error);
            break;
        case 'export':
            i18n.exportI18nFiles()
                .then(() => console.log(chalk.green('✅ I18n files exported')))
                .catch(console.error);
            break;
        case 'report':
            console.log(JSON.stringify(i18n.generateReport(), null, 2));
            break;
        case 'update-html':
            i18n.updateHTMLFiles()
                .then(() => console.log(chalk.green('✅ HTML files updated')))
                .catch(console.error);
            break;
        default:
            console.log(chalk.blue('Internationalization System'));
            console.log('Usage: node internationalization-system.js [command]');
            console.log('Commands:');
            console.log('  init        - Initialize i18n system');
            console.log('  export      - Export all i18n files');
            console.log('  report      - Generate translation report');
            console.log('  update-html - Update HTML files with i18n attributes');
    }
}

module.exports = InternationalizationSystem;