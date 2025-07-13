
// Internationalization (i18n) Integration
class I18nManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = {
  "en": {
    "common": {
      "loading": "Loading...",
      "error": "Error",
      "success": "Success",
      "warning": "Warning",
      "info": "Information",
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete",
      "edit": "Edit",
      "add": "Add",
      "remove": "Remove",
      "close": "Close",
      "open": "Open",
      "yes": "Yes",
      "no": "No",
      "confirm": "Confirm",
      "search": "Search",
      "filter": "Filter",
      "sort": "Sort",
      "refresh": "Refresh",
      "export": "Export",
      "import": "Import",
      "download": "Download",
      "upload": "Upload",
      "copy": "Copy",
      "paste": "Paste",
      "cut": "Cut",
      "undo": "Undo",
      "redo": "Redo",
      "settings": "Settings",
      "help": "Help",
      "about": "About",
      "logout": "Logout",
      "login": "Login",
      "register": "Register",
      "profile": "Profile",
      "dashboard": "Dashboard",
      "menu": "Menu",
      "home": "Home",
      "back": "Back",
      "next": "Next",
      "previous": "Previous",
      "first": "First",
      "last": "Last",
      "page": "Page",
      "of": "of",
      "showing": "Showing",
      "results": "results",
      "total": "Total",
      "all": "All",
      "none": "None",
      "other": "Other"
    },
    "dashboard": {
      "title": "Vibe Marketing Automation Platform",
      "subtitle": "AI-Powered Marketing Solutions",
      "welcome": "Welcome to your dashboard",
      "overview": "Overview",
      "analytics": "Analytics",
      "campaigns": "Campaigns",
      "leads": "Leads",
      "contacts": "Contacts",
      "reports": "Reports",
      "integrations": "Integrations",
      "automations": "Automations",
      "tools": "Tools",
      "admin": "Admin",
      "users": "Users",
      "permissions": "Permissions",
      "apiKeys": "API Keys",
      "logs": "Logs",
      "system": "System",
      "health": "Health",
      "monitoring": "Monitoring",
      "backup": "Backup",
      "restore": "Restore",
      "maintenance": "Maintenance"
    },
    "guidance": {
      "beginner": "Beginner Level: Basic features and simple operations",
      "intermediate": "Intermediate Level: Advanced features and integrations",
      "advanced": "Advanced Level: Complex automations and custom solutions",
      "tooltip_beginner": "AI Guidance: Beginner Level - Basic chat and code completion",
      "tooltip_intermediate": "AI Guidance: Intermediate Level - MCP integrations and workflows",
      "tooltip_advanced": "AI Guidance: Advanced Level - Complex automations and custom development"
    },
    "mcp": {
      "title": "MCP Integrations",
      "description": "Model Context Protocol integrations for enhanced functionality",
      "status": "Status",
      "connected": "Connected",
      "disconnected": "Disconnected",
      "connecting": "Connecting",
      "error": "Error",
      "configure": "Configure",
      "test": "Test Connection",
      "enable": "Enable",
      "disable": "Disable",
      "restart": "Restart",
      "logs": "View Logs",
      "documentation": "Documentation"
    },
    "errors": {
      "generic": "An error occurred. Please try again.",
      "network": "Network error. Please check your connection.",
      "timeout": "Request timed out. Please try again.",
      "unauthorized": "Unauthorized access. Please login.",
      "forbidden": "Access forbidden. Insufficient permissions.",
      "notFound": "Resource not found.",
      "validation": "Validation error. Please check your input.",
      "server": "Server error. Please try again later.",
      "maintenance": "System under maintenance. Please try again later."
    },
    "success": {
      "saved": "Successfully saved",
      "deleted": "Successfully deleted",
      "updated": "Successfully updated",
      "created": "Successfully created",
      "imported": "Successfully imported",
      "exported": "Successfully exported",
      "connected": "Successfully connected",
      "disconnected": "Successfully disconnected",
      "configured": "Successfully configured",
      "deployed": "Successfully deployed"
    },
    "forms": {
      "name": "Name",
      "email": "Email",
      "password": "Password",
      "confirmPassword": "Confirm Password",
      "firstName": "First Name",
      "lastName": "Last Name",
      "company": "Company",
      "phone": "Phone",
      "address": "Address",
      "city": "City",
      "state": "State",
      "country": "Country",
      "zipCode": "ZIP Code",
      "website": "Website",
      "description": "Description",
      "notes": "Notes",
      "tags": "Tags",
      "category": "Category",
      "priority": "Priority",
      "status": "Status",
      "type": "Type",
      "value": "Value",
      "amount": "Amount",
      "quantity": "Quantity",
      "price": "Price",
      "date": "Date",
      "time": "Time",
      "duration": "Duration",
      "location": "Location",
      "url": "URL",
      "apiKey": "API Key",
      "token": "Token",
      "secret": "Secret",
      "username": "Username",
      "title": "Title",
      "subject": "Subject",
      "message": "Message",
      "content": "Content",
      "template": "Template",
      "language": "Language",
      "timezone": "Timezone",
      "currency": "Currency",
      "format": "Format",
      "size": "Size",
      "color": "Color",
      "image": "Image",
      "file": "File",
      "folder": "Folder",
      "path": "Path",
      "version": "Version",
      "build": "Build",
      "environment": "Environment",
      "configuration": "Configuration",
      "enabled": "Enabled",
      "disabled": "Disabled",
      "active": "Active",
      "inactive": "Inactive",
      "public": "Public",
      "private": "Private",
      "required": "Required",
      "optional": "Optional",
      "placeholder": {
        "search": "Search...",
        "email": "Enter your email",
        "password": "Enter your password",
        "name": "Enter name",
        "description": "Enter description",
        "url": "Enter URL",
        "select": "Select an option",
        "choose": "Choose...",
        "upload": "Click to upload or drag and drop"
      }
    },
    "datetime": {
      "now": "Now",
      "today": "Today",
      "yesterday": "Yesterday",
      "tomorrow": "Tomorrow",
      "thisWeek": "This week",
      "lastWeek": "Last week",
      "nextWeek": "Next week",
      "thisMonth": "This month",
      "lastMonth": "Last month",
      "nextMonth": "Next month",
      "thisYear": "This year",
      "lastYear": "Last year",
      "nextYear": "Next year",
      "ago": "ago",
      "from_now": "from now",
      "just_now": "just now",
      "minutes": "minutes",
      "hours": "hours",
      "days": "days",
      "weeks": "weeks",
      "months": "months",
      "years": "years"
    },
    "legal": {
      "terms": "Terms of Service",
      "privacy": "Privacy Policy",
      "cookies": "Cookie Policy",
      "gdpr": "GDPR Compliance",
      "accept": "I accept the terms and conditions",
      "agree": "I agree to the privacy policy",
      "consent": "I consent to data processing",
      "copyright": "Copyright",
      "license": "License",
      "disclaimer": "Disclaimer"
    }
  },
  "es": {
    "common": {
      "loading": "Cargando...",
      "error": "Error",
      "success": "Éxito",
      "warning": "Advertencia",
      "info": "Información",
      "save": "Guardar",
      "cancel": "Cancelar",
      "delete": "Eliminar",
      "edit": "Editar",
      "add": "Agregar",
      "remove": "Quitar",
      "close": "Cerrar",
      "open": "Abrir",
      "yes": "Sí",
      "no": "No",
      "confirm": "Confirmar",
      "search": "Buscar",
      "filter": "Filter",
      "sort": "Sort",
      "refresh": "Refresh",
      "export": "Export",
      "import": "Import",
      "download": "Download",
      "upload": "Upload",
      "copy": "Copy",
      "paste": "Paste",
      "cut": "Cut",
      "undo": "Undo",
      "redo": "Redo",
      "settings": "Configuración",
      "help": "Ayuda",
      "about": "About",
      "logout": "Cerrar Sesión",
      "login": "Iniciar Sesión",
      "register": "Register",
      "profile": "Profile",
      "dashboard": "Panel de Control",
      "menu": "Menu",
      "home": "Home",
      "back": "Back",
      "next": "Next",
      "previous": "Previous",
      "first": "First",
      "last": "Last",
      "page": "Page",
      "of": "of",
      "showing": "Showing",
      "results": "results",
      "total": "Total",
      "all": "All",
      "none": "None",
      "other": "Other"
    },
    "dashboard": {
      "title": "Vibe Marketing Automation Platform",
      "subtitle": "AI-Powered Marketing Solutions",
      "welcome": "Welcome to your dashboard",
      "overview": "Overview",
      "analytics": "Analytics",
      "campaigns": "Campaigns",
      "leads": "Leads",
      "contacts": "Contacts",
      "reports": "Reports",
      "integrations": "Integrations",
      "automations": "Automations",
      "tools": "Tools",
      "admin": "Admin",
      "users": "Users",
      "permissions": "Permissions",
      "apiKeys": "API Keys",
      "logs": "Logs",
      "system": "System",
      "health": "Health",
      "monitoring": "Monitoring",
      "backup": "Backup",
      "restore": "Restore",
      "maintenance": "Maintenance"
    },
    "guidance": {
      "beginner": "Beginner Level: Basic features and simple operations",
      "intermediate": "Intermediate Level: Advanced features and integrations",
      "advanced": "Advanced Level: Complex automations and custom solutions",
      "tooltip_beginner": "AI Guidance: Beginner Level - Basic chat and code completion",
      "tooltip_intermediate": "AI Guidance: Intermediate Level - MCP integrations and workflows",
      "tooltip_advanced": "AI Guidance: Advanced Level - Complex automations and custom development"
    },
    "mcp": {
      "title": "MCP Integrations",
      "description": "Model Context Protocol integrations for enhanced functionality",
      "status": "Status",
      "connected": "Connected",
      "disconnected": "Disconnected",
      "connecting": "Connecting",
      "error": "Error",
      "configure": "Configure",
      "test": "Test Connection",
      "enable": "Enable",
      "disable": "Disable",
      "restart": "Restart",
      "logs": "View Logs",
      "documentation": "Documentation"
    },
    "errors": {
      "generic": "An error occurred. Please try again.",
      "network": "Network error. Please check your connection.",
      "timeout": "Request timed out. Please try again.",
      "unauthorized": "Unauthorized access. Please login.",
      "forbidden": "Access forbidden. Insufficient permissions.",
      "notFound": "Resource not found.",
      "validation": "Validation error. Please check your input.",
      "server": "Server error. Please try again later.",
      "maintenance": "System under maintenance. Please try again later."
    },
    "success": {
      "saved": "Successfully saved",
      "deleted": "Successfully deleted",
      "updated": "Successfully updated",
      "created": "Successfully created",
      "imported": "Successfully imported",
      "exported": "Successfully exported",
      "connected": "Successfully connected",
      "disconnected": "Successfully disconnected",
      "configured": "Successfully configured",
      "deployed": "Successfully deployed"
    },
    "forms": {
      "name": "Name",
      "email": "Email",
      "password": "Password",
      "confirmPassword": "Confirm Password",
      "firstName": "First Name",
      "lastName": "Last Name",
      "company": "Company",
      "phone": "Phone",
      "address": "Address",
      "city": "City",
      "state": "State",
      "country": "Country",
      "zipCode": "ZIP Code",
      "website": "Website",
      "description": "Description",
      "notes": "Notes",
      "tags": "Tags",
      "category": "Category",
      "priority": "Priority",
      "status": "Status",
      "type": "Type",
      "value": "Value",
      "amount": "Amount",
      "quantity": "Quantity",
      "price": "Price",
      "date": "Date",
      "time": "Time",
      "duration": "Duration",
      "location": "Location",
      "url": "URL",
      "apiKey": "API Key",
      "token": "Token",
      "secret": "Secret",
      "username": "Username",
      "title": "Title",
      "subject": "Subject",
      "message": "Message",
      "content": "Content",
      "template": "Template",
      "language": "Language",
      "timezone": "Timezone",
      "currency": "Currency",
      "format": "Format",
      "size": "Size",
      "color": "Color",
      "image": "Image",
      "file": "File",
      "folder": "Folder",
      "path": "Path",
      "version": "Version",
      "build": "Build",
      "environment": "Environment",
      "configuration": "Configuration",
      "enabled": "Enabled",
      "disabled": "Disabled",
      "active": "Active",
      "inactive": "Inactive",
      "public": "Public",
      "private": "Private",
      "required": "Required",
      "optional": "Optional",
      "placeholder": {
        "search": "Search...",
        "email": "Enter your email",
        "password": "Enter your password",
        "name": "Enter name",
        "description": "Enter description",
        "url": "Enter URL",
        "select": "Select an option",
        "choose": "Choose...",
        "upload": "Click to upload or drag and drop"
      }
    },
    "datetime": {
      "now": "Now",
      "today": "Today",
      "yesterday": "Yesterday",
      "tomorrow": "Tomorrow",
      "thisWeek": "This week",
      "lastWeek": "Last week",
      "nextWeek": "Next week",
      "thisMonth": "This month",
      "lastMonth": "Last month",
      "nextMonth": "Next month",
      "thisYear": "This year",
      "lastYear": "Last year",
      "nextYear": "Next year",
      "ago": "ago",
      "from_now": "from now",
      "just_now": "just now",
      "minutes": "minutes",
      "hours": "hours",
      "days": "days",
      "weeks": "weeks",
      "months": "months",
      "years": "years"
    },
    "legal": {
      "terms": "Terms of Service",
      "privacy": "Privacy Policy",
      "cookies": "Cookie Policy",
      "gdpr": "GDPR Compliance",
      "accept": "I accept the terms and conditions",
      "agree": "I agree to the privacy policy",
      "consent": "I consent to data processing",
      "copyright": "Copyright",
      "license": "License",
      "disclaimer": "Disclaimer"
    }
  },
  "fr": {
    "common": {
      "loading": "Chargement...",
      "error": "Erreur",
      "success": "Succès",
      "warning": "Avertissement",
      "info": "Information",
      "save": "Enregistrer",
      "cancel": "Annuler",
      "delete": "Supprimer",
      "edit": "Modifier",
      "add": "Ajouter",
      "remove": "Supprimer",
      "close": "Fermer",
      "open": "Ouvrir",
      "yes": "Oui",
      "no": "Non",
      "confirm": "Confirmer",
      "search": "Rechercher",
      "filter": "Filter",
      "sort": "Sort",
      "refresh": "Refresh",
      "export": "Export",
      "import": "Import",
      "download": "Download",
      "upload": "Upload",
      "copy": "Copy",
      "paste": "Paste",
      "cut": "Cut",
      "undo": "Undo",
      "redo": "Redo",
      "settings": "Paramètres",
      "help": "Aide",
      "about": "About",
      "logout": "Déconnexion",
      "login": "Connexion",
      "register": "Register",
      "profile": "Profile",
      "dashboard": "Tableau de Bord",
      "menu": "Menu",
      "home": "Home",
      "back": "Back",
      "next": "Next",
      "previous": "Previous",
      "first": "First",
      "last": "Last",
      "page": "Page",
      "of": "of",
      "showing": "Showing",
      "results": "results",
      "total": "Total",
      "all": "All",
      "none": "None",
      "other": "Other"
    },
    "dashboard": {
      "title": "Vibe Marketing Automation Platform",
      "subtitle": "AI-Powered Marketing Solutions",
      "welcome": "Welcome to your dashboard",
      "overview": "Overview",
      "analytics": "Analytics",
      "campaigns": "Campaigns",
      "leads": "Leads",
      "contacts": "Contacts",
      "reports": "Reports",
      "integrations": "Integrations",
      "automations": "Automations",
      "tools": "Tools",
      "admin": "Admin",
      "users": "Users",
      "permissions": "Permissions",
      "apiKeys": "API Keys",
      "logs": "Logs",
      "system": "System",
      "health": "Health",
      "monitoring": "Monitoring",
      "backup": "Backup",
      "restore": "Restore",
      "maintenance": "Maintenance"
    },
    "guidance": {
      "beginner": "Beginner Level: Basic features and simple operations",
      "intermediate": "Intermediate Level: Advanced features and integrations",
      "advanced": "Advanced Level: Complex automations and custom solutions",
      "tooltip_beginner": "AI Guidance: Beginner Level - Basic chat and code completion",
      "tooltip_intermediate": "AI Guidance: Intermediate Level - MCP integrations and workflows",
      "tooltip_advanced": "AI Guidance: Advanced Level - Complex automations and custom development"
    },
    "mcp": {
      "title": "MCP Integrations",
      "description": "Model Context Protocol integrations for enhanced functionality",
      "status": "Status",
      "connected": "Connected",
      "disconnected": "Disconnected",
      "connecting": "Connecting",
      "error": "Erreur",
      "configure": "Configure",
      "test": "Test Connection",
      "enable": "Enable",
      "disable": "Disable",
      "restart": "Restart",
      "logs": "View Logs",
      "documentation": "Documentation"
    },
    "errors": {
      "generic": "An error occurred. Please try again.",
      "network": "Network error. Please check your connection.",
      "timeout": "Request timed out. Please try again.",
      "unauthorized": "Unauthorized access. Please login.",
      "forbidden": "Access forbidden. Insufficient permissions.",
      "notFound": "Resource not found.",
      "validation": "Validation error. Please check your input.",
      "server": "Server error. Please try again later.",
      "maintenance": "System under maintenance. Please try again later."
    },
    "success": {
      "saved": "Successfully saved",
      "deleted": "Successfully deleted",
      "updated": "Successfully updated",
      "created": "Successfully created",
      "imported": "Successfully imported",
      "exported": "Successfully exported",
      "connected": "Successfully connected",
      "disconnected": "Successfully disconnected",
      "configured": "Successfully configured",
      "deployed": "Successfully deployed"
    },
    "forms": {
      "name": "Name",
      "email": "Email",
      "password": "Password",
      "confirmPassword": "Confirm Password",
      "firstName": "First Name",
      "lastName": "Last Name",
      "company": "Company",
      "phone": "Phone",
      "address": "Address",
      "city": "City",
      "state": "State",
      "country": "Country",
      "zipCode": "ZIP Code",
      "website": "Website",
      "description": "Description",
      "notes": "Notes",
      "tags": "Tags",
      "category": "Category",
      "priority": "Priority",
      "status": "Status",
      "type": "Type",
      "value": "Value",
      "amount": "Amount",
      "quantity": "Quantity",
      "price": "Price",
      "date": "Date",
      "time": "Time",
      "duration": "Duration",
      "location": "Location",
      "url": "URL",
      "apiKey": "API Key",
      "token": "Token",
      "secret": "Secret",
      "username": "Username",
      "title": "Title",
      "subject": "Subject",
      "message": "Message",
      "content": "Content",
      "template": "Template",
      "language": "Language",
      "timezone": "Timezone",
      "currency": "Currency",
      "format": "Format",
      "size": "Size",
      "color": "Color",
      "image": "Image",
      "file": "File",
      "folder": "Folder",
      "path": "Path",
      "version": "Version",
      "build": "Build",
      "environment": "Environment",
      "configuration": "Configuration",
      "enabled": "Enabled",
      "disabled": "Disabled",
      "active": "Active",
      "inactive": "Inactive",
      "public": "Public",
      "private": "Private",
      "required": "Required",
      "optional": "Optional",
      "placeholder": {
        "search": "Search...",
        "email": "Enter your email",
        "password": "Enter your password",
        "name": "Enter name",
        "description": "Enter description",
        "url": "Enter URL",
        "select": "Select an option",
        "choose": "Choose...",
        "upload": "Click to upload or drag and drop"
      }
    },
    "datetime": {
      "now": "Now",
      "today": "Today",
      "yesterday": "Yesterday",
      "tomorrow": "Tomorrow",
      "thisWeek": "This week",
      "lastWeek": "Last week",
      "nextWeek": "Next week",
      "thisMonth": "This month",
      "lastMonth": "Last month",
      "nextMonth": "Next month",
      "thisYear": "This year",
      "lastYear": "Last year",
      "nextYear": "Next year",
      "ago": "ago",
      "from_now": "from now",
      "just_now": "just now",
      "minutes": "minutes",
      "hours": "hours",
      "days": "days",
      "weeks": "weeks",
      "months": "months",
      "years": "years"
    },
    "legal": {
      "terms": "Terms of Service",
      "privacy": "Privacy Policy",
      "cookies": "Cookie Policy",
      "gdpr": "GDPR Compliance",
      "accept": "I accept the terms and conditions",
      "agree": "I agree to the privacy policy",
      "consent": "I consent to data processing",
      "copyright": "Copyright",
      "license": "License",
      "disclaimer": "Disclaimer"
    }
  },
  "de": {
    "common": {
      "loading": "Laden...",
      "error": "Fehler",
      "success": "Erfolg",
      "warning": "Warnung",
      "info": "Information",
      "save": "Speichern",
      "cancel": "Abbrechen",
      "delete": "Löschen",
      "edit": "Bearbeiten",
      "add": "Hinzufügen",
      "remove": "Entfernen",
      "close": "Schließen",
      "open": "Öffnen",
      "yes": "Ja",
      "no": "Nein",
      "confirm": "Bestätigen",
      "search": "Suchen",
      "filter": "Filter",
      "sort": "Sort",
      "refresh": "Refresh",
      "export": "Export",
      "import": "Import",
      "download": "Download",
      "upload": "Upload",
      "copy": "Copy",
      "paste": "Paste",
      "cut": "Cut",
      "undo": "Undo",
      "redo": "Redo",
      "settings": "Einstellungen",
      "help": "Hilfe",
      "about": "About",
      "logout": "Abmelden",
      "login": "Anmelden",
      "register": "Register",
      "profile": "Profile",
      "dashboard": "Dashboard",
      "menu": "Menu",
      "home": "Home",
      "back": "Back",
      "next": "Next",
      "previous": "Previous",
      "first": "First",
      "last": "Last",
      "page": "Page",
      "of": "of",
      "showing": "Showing",
      "results": "results",
      "total": "Total",
      "all": "All",
      "none": "None",
      "other": "Other"
    },
    "dashboard": {
      "title": "Vibe Marketing Automation Platform",
      "subtitle": "AI-Powered Marketing Solutions",
      "welcome": "Welcome to your dashboard",
      "overview": "Overview",
      "analytics": "Analytics",
      "campaigns": "Campaigns",
      "leads": "Leads",
      "contacts": "Contacts",
      "reports": "Reports",
      "integrations": "Integrations",
      "automations": "Automations",
      "tools": "Tools",
      "admin": "Admin",
      "users": "Users",
      "permissions": "Permissions",
      "apiKeys": "API Keys",
      "logs": "Logs",
      "system": "System",
      "health": "Health",
      "monitoring": "Monitoring",
      "backup": "Backup",
      "restore": "Restore",
      "maintenance": "Maintenance"
    },
    "guidance": {
      "beginner": "Beginner Level: Basic features and simple operations",
      "intermediate": "Intermediate Level: Advanced features and integrations",
      "advanced": "Advanced Level: Complex automations and custom solutions",
      "tooltip_beginner": "AI Guidance: Beginner Level - Basic chat and code completion",
      "tooltip_intermediate": "AI Guidance: Intermediate Level - MCP integrations and workflows",
      "tooltip_advanced": "AI Guidance: Advanced Level - Complex automations and custom development"
    },
    "mcp": {
      "title": "MCP Integrations",
      "description": "Model Context Protocol integrations for enhanced functionality",
      "status": "Status",
      "connected": "Connected",
      "disconnected": "Disconnected",
      "connecting": "Connecting",
      "error": "Fehler",
      "configure": "Configure",
      "test": "Test Connection",
      "enable": "Enable",
      "disable": "Disable",
      "restart": "Restart",
      "logs": "View Logs",
      "documentation": "Documentation"
    },
    "errors": {
      "generic": "An error occurred. Please try again.",
      "network": "Network error. Please check your connection.",
      "timeout": "Request timed out. Please try again.",
      "unauthorized": "Unauthorized access. Please login.",
      "forbidden": "Access forbidden. Insufficient permissions.",
      "notFound": "Resource not found.",
      "validation": "Validation error. Please check your input.",
      "server": "Server error. Please try again later.",
      "maintenance": "System under maintenance. Please try again later."
    },
    "success": {
      "saved": "Successfully saved",
      "deleted": "Successfully deleted",
      "updated": "Successfully updated",
      "created": "Successfully created",
      "imported": "Successfully imported",
      "exported": "Successfully exported",
      "connected": "Successfully connected",
      "disconnected": "Successfully disconnected",
      "configured": "Successfully configured",
      "deployed": "Successfully deployed"
    },
    "forms": {
      "name": "Name",
      "email": "Email",
      "password": "Password",
      "confirmPassword": "Confirm Password",
      "firstName": "First Name",
      "lastName": "Last Name",
      "company": "Company",
      "phone": "Phone",
      "address": "Address",
      "city": "City",
      "state": "State",
      "country": "Country",
      "zipCode": "ZIP Code",
      "website": "Website",
      "description": "Description",
      "notes": "Notes",
      "tags": "Tags",
      "category": "Category",
      "priority": "Priority",
      "status": "Status",
      "type": "Type",
      "value": "Value",
      "amount": "Amount",
      "quantity": "Quantity",
      "price": "Price",
      "date": "Date",
      "time": "Time",
      "duration": "Duration",
      "location": "Location",
      "url": "URL",
      "apiKey": "API Key",
      "token": "Token",
      "secret": "Secret",
      "username": "Username",
      "title": "Title",
      "subject": "Subject",
      "message": "Message",
      "content": "Content",
      "template": "Template",
      "language": "Language",
      "timezone": "Timezone",
      "currency": "Currency",
      "format": "Format",
      "size": "Size",
      "color": "Color",
      "image": "Image",
      "file": "File",
      "folder": "Folder",
      "path": "Path",
      "version": "Version",
      "build": "Build",
      "environment": "Environment",
      "configuration": "Configuration",
      "enabled": "Enabled",
      "disabled": "Disabled",
      "active": "Active",
      "inactive": "Inactive",
      "public": "Public",
      "private": "Private",
      "required": "Required",
      "optional": "Optional",
      "placeholder": {
        "search": "Search...",
        "email": "Enter your email",
        "password": "Enter your password",
        "name": "Enter name",
        "description": "Enter description",
        "url": "Enter URL",
        "select": "Select an option",
        "choose": "Choose...",
        "upload": "Click to upload or drag and drop"
      }
    },
    "datetime": {
      "now": "Now",
      "today": "Today",
      "yesterday": "Yesterday",
      "tomorrow": "Tomorrow",
      "thisWeek": "This week",
      "lastWeek": "Last week",
      "nextWeek": "Next week",
      "thisMonth": "This month",
      "lastMonth": "Last month",
      "nextMonth": "Next month",
      "thisYear": "This year",
      "lastYear": "Last year",
      "nextYear": "Next year",
      "ago": "ago",
      "from_now": "from now",
      "just_now": "just now",
      "minutes": "minutes",
      "hours": "hours",
      "days": "days",
      "weeks": "weeks",
      "months": "months",
      "years": "years"
    },
    "legal": {
      "terms": "Terms of Service",
      "privacy": "Privacy Policy",
      "cookies": "Cookie Policy",
      "gdpr": "GDPR Compliance",
      "accept": "I accept the terms and conditions",
      "agree": "I agree to the privacy policy",
      "consent": "I consent to data processing",
      "copyright": "Copyright",
      "license": "License",
      "disclaimer": "Disclaimer"
    }
  }
};
        this.fallbackLanguage = 'en';
        
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
            result = result.replace(new RegExp(`{{\s*${param}\s*}}`, 'g'), params[param]);
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
            
            
            const optionEN = document.createElement('option');
            optionEN.value = 'en';
            optionEN.textContent = 'English';
            if ('en' === this.currentLanguage) optionEN.selected = true;
            switcher.appendChild(optionEN);
            
            const optionES = document.createElement('option');
            optionES.value = 'es';
            optionES.textContent = 'Español';
            if ('es' === this.currentLanguage) optionES.selected = true;
            switcher.appendChild(optionES);
            
            const optionFR = document.createElement('option');
            optionFR.value = 'fr';
            optionFR.textContent = 'Français';
            if ('fr' === this.currentLanguage) optionFR.selected = true;
            switcher.appendChild(optionFR);
            
            const optionDE = document.createElement('option');
            optionDE.value = 'de';
            optionDE.textContent = 'Deutsch';
            if ('de' === this.currentLanguage) optionDE.selected = true;
            switcher.appendChild(optionDE);
            
            const optionIT = document.createElement('option');
            optionIT.value = 'it';
            optionIT.textContent = 'Italiano';
            if ('it' === this.currentLanguage) optionIT.selected = true;
            switcher.appendChild(optionIT);
            
            const optionPT = document.createElement('option');
            optionPT.value = 'pt';
            optionPT.textContent = 'Português';
            if ('pt' === this.currentLanguage) optionPT.selected = true;
            switcher.appendChild(optionPT);
            
            const optionZH = document.createElement('option');
            optionZH.value = 'zh';
            optionZH.textContent = '中文';
            if ('zh' === this.currentLanguage) optionZH.selected = true;
            switcher.appendChild(optionZH);
            
            const optionJA = document.createElement('option');
            optionJA.value = 'ja';
            optionJA.textContent = '日本語';
            if ('ja' === this.currentLanguage) optionJA.selected = true;
            switcher.appendChild(optionJA);
            
            const optionKO = document.createElement('option');
            optionKO.value = 'ko';
            optionKO.textContent = '한국어';
            if ('ko' === this.currentLanguage) optionKO.selected = true;
            switcher.appendChild(optionKO);
            
            const optionAR = document.createElement('option');
            optionAR.value = 'ar';
            optionAR.textContent = 'العربية';
            if ('ar' === this.currentLanguage) optionAR.selected = true;
            switcher.appendChild(optionAR);
            
            
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
        return ["en","es","fr","de","it","pt","zh","ja","ko","ar"];
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
