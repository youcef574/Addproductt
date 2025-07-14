// ===== GLOBAL VARIABLES =====
let currentLanguage = localStorage.getItem('language') || 'fr';
let formData = {
    mainImage: null,
    galleryImages: [],
    variants: []
};
let validationRules = {};
let progressPercentage = 0;
let autoSaveInterval;
let variantCounter = 0;

// ===== LANGUAGE SYSTEM =====
const translations = {
    fr: {
        // Header & Navigation
        'dashboard': 'Tableau de bord',
        'settings': 'Paramètres',
        'logout': 'Déconnexion',
        
        // Page Title
        'add_new_product': 'Ajouter un nouveau produit',
        'fill_product_info': 'Remplissez les informations ci-dessous pour ajouter votre produit',
        'form_progress': 'Progression du formulaire',
        'progress': 'Progression',
        
        // Form Sections
        'basic_information': 'Informations de base',
        'essential_product_details': 'Détails essentiels du produit',
        'product_description': 'Description du produit',
        'describe_product_detail': 'Décrivez votre produit en détail',
        'product_images': 'Images du produit',
        'add_attractive_images': 'Ajoutez des images attrayantes',
        'product_variants': 'Variantes du produit',
        'add_options_color_size': 'Ajoutez des options comme la couleur, la taille',
        'additional_options': 'Options supplémentaires',
        'advanced_product_settings': 'Paramètres avancés du produit',
        
        // Form Fields
        'product_name': 'Nom du produit',
        'price_dzd': 'Prix (DZD)',
        'quantity_optional': 'Quantité (optionnel)',
        'short_description': 'Description courte',
        'detailed_description': 'Description détaillée',
        'main_image': 'Image principale',
        'image_gallery': 'Galerie d\'images',
        'variant_name': 'Nom de la variante',
        'variant_value': 'Valeur de la variante',
        'store_visibility': 'Visibilité dans la boutique',
        'visible': 'Visible',
        'hidden': 'Caché',
        
        // Buttons
        'save_product': 'Enregistrer le produit',
        'reset': 'Réinitialiser',
        'preview': 'Aperçu',
        'save_as_draft': 'Enregistrer comme brouillon',
        'add_variant': 'Ajouter une variante',
        'add_value': 'Ajouter',
        'remove': 'Supprimer',
        'ok': 'OK',
        'cancel': 'Annuler',
        
        // Dropzone
        'drop_main_image_here': 'Glissez votre image principale ici',
        'or_click_to_select': 'ou cliquez pour sélectionner',
        'png_jpg_webp_5mb': 'PNG, JPG, WEBP jusqu\'à 5MB',
        'add_additional_images': 'Ajoutez des images supplémentaires',
        'up_to_5_images': 'Jusqu\'à 5 images',
        'png_jpg_webp_5mb_each': 'PNG, JPG, WEBP jusqu\'à 5MB chacune',
        
        // Variants
        'variant': 'Variante',
        'enter_variant_name': 'Entrez le nom de la variante (ex: Couleur, Taille)',
        'enter_variant_value': 'Entrez une valeur et appuyez sur Entrée',
        
        // Validation Messages
        'field_required': 'Ce champ est requis',
        'min_length': 'Minimum {min} caractères requis',
        'max_length': 'Maximum {max} caractères autorisés',
        'invalid_price': 'Veuillez entrer un prix valide',
        'invalid_quantity': 'Veuillez entrer une quantité valide',
        'invalid_file_format': 'Format de fichier non supporté',
        'file_too_large': 'Fichier trop volumineux (max {size}MB)',
        'max_images_reached': 'Maximum {max} images autorisées',
        'duplicate_value': 'Cette valeur existe déjà',
        'max_values_reached': 'Maximum {max} valeurs autorisées',
        'variant_name_required': 'Le nom de la variante est requis',
        'variant_values_required': 'Au moins une valeur est requise',
        
        // Success Messages
        'product_saved': 'Produit enregistré avec succès',
        'draft_saved': 'Brouillon enregistré',
        'form_reset': 'Formulaire réinitialisé',
        'variant_added': 'Variante ajoutée',
        'variant_removed': 'Variante supprimée',
        'value_added': 'Valeur ajoutée',
        'value_removed': 'Valeur supprimée',
        'auto_save_restored': 'Données sauvegardées automatiquement restaurées',
        
        // Error Messages
        'save_error': 'Erreur lors de l\'enregistrement du produit',
        'network_error': 'Erreur réseau',
        'validation_error': 'Veuillez corriger les erreurs dans le formulaire',
        'load_error': 'Erreur lors du chargement des données',
        
        // Modal
        'success': 'Succès',
        'error': 'Erreur',
        'warning': 'Avertissement',
        'confirm': 'Confirmation',
        'info': 'Information',
        
        // Loading
        'saving': 'Enregistrement en cours...',
        'loading': 'Chargement en cours...',
        'processing': 'Traitement en cours...',
        
        // Other
        'confirm_action': 'Êtes-vous sûr de vouloir effectuer cette action?',
        'unsaved_changes': 'Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter?'
    },
    en: {
        // Header & Navigation
        'dashboard': 'Dashboard',
        'settings': 'Settings',
        'logout': 'Logout',
        
        // Page Title
        'add_new_product': 'Add New Product',
        'fill_product_info': 'Fill in the information below to add your product',
        'form_progress': 'Form Progress',
        'progress': 'Progress',
        
        // Form Sections
        'basic_information': 'Basic Information',
        'essential_product_details': 'Essential product details',
        'product_description': 'Product Description',
        'describe_product_detail': 'Describe your product in detail',
        'product_images': 'Product Images',
        'add_attractive_images': 'Add attractive images',
        'product_variants': 'Product Variants',
        'add_options_color_size': 'Add options like color, size, etc.',
        'additional_options': 'Additional Options',
        'advanced_product_settings': 'Advanced product settings',
        
        // Form Fields
        'product_name': 'Product Name',
        'price_dzd': 'Price (DZD)',
        'quantity_optional': 'Quantity (optional)',
        'short_description': 'Short Description',
        'detailed_description': 'Detailed Description',
        'main_image': 'Main Image',
        'image_gallery': 'Image Gallery',
        'variant_name': 'Variant Name',
        'variant_value': 'Variant Value',
        'store_visibility': 'Store Visibility',
        'visible': 'Visible',
        'hidden': 'Hidden',
        
        // Buttons
        'save_product': 'Save Product',
        'reset': 'Reset',
        'preview': 'Preview',
        'save_as_draft': 'Save as Draft',
        'add_variant': 'Add Variant',
        'add_value': 'Add',
        'remove': 'Remove',
        'ok': 'OK',
        'cancel': 'Cancel',
        
        // Dropzone
        'drop_main_image_here': 'Drop your main image here',
        'or_click_to_select': 'or click to select',
        'png_jpg_webp_5mb': 'PNG, JPG, WEBP up to 5MB',
        'add_additional_images': 'Add additional images',
        'up_to_5_images': 'Up to 5 images',
        'png_jpg_webp_5mb_each': 'PNG, JPG, WEBP up to 5MB each',
        
        // Variants
        'variant': 'Variant',
        'enter_variant_name': 'Enter variant name (e.g. Color, Size)',
        'enter_variant_value': 'Enter a value and press Enter',
        
        // Validation Messages
        'field_required': 'This field is required',
        'min_length': 'Minimum {min} characters required',
        'max_length': 'Maximum {max} characters allowed',
        'invalid_price': 'Please enter a valid price',
        'invalid_quantity': 'Please enter a valid quantity',
        'invalid_file_format': 'Unsupported file format',
        'file_too_large': 'File too large (max {size}MB)',
        'max_images_reached': 'Maximum {max} images allowed',
        'duplicate_value': 'This value already exists',
        'max_values_reached': 'Maximum {max} values allowed',
        'variant_name_required': 'Variant name is required',
        'variant_values_required': 'At least one value is required',
        
        // Success Messages
        'product_saved': 'Product saved successfully',
        'draft_saved': 'Draft saved',
        'form_reset': 'Form reset',
        'variant_added': 'Variant added',
        'variant_removed': 'Variant removed',
        'value_added': 'Value added',
        'value_removed': 'Value removed',
        'auto_save_restored': 'Auto-saved data restored',
        
        // Error Messages
        'save_error': 'Error saving product',
        'network_error': 'Network error',
        'validation_error': 'Please fix errors in the form',
        'load_error': 'Error loading data',
        
        // Modal
        'success': 'Success',
        'error': 'Error',
        'warning': 'Warning',
        'confirm': 'Confirmation',
        'info': 'Information',
        
        // Loading
        'saving': 'Saving...',
        'loading': 'Loading...',
        'processing': 'Processing...',
        
        // Other
        'confirm_action': 'Are you sure you want to perform this action?',
        'unsaved_changes': 'You have unsaved changes. Do you really want to leave?'
    }
};

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function generateId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// ===== LANGUAGE FUNCTIONS =====
function translate(key, params = {}) {
    let text = translations[currentLanguage][key] || key;
    
    // Replace parameters in text
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
}

function updateLanguage() {
    // Update all elements with data-key attributes
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        const text = translate(key);
        
        if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'number')) {
            element.placeholder = text;
        } else {
            element.textContent = text;
        }
    });
    
    // Update language toggle button
    const langText = document.getElementById('langText');
    if (langText) {
        langText.textContent = currentLanguage === 'fr' ? 'Français' : 'English';
    }
    
    // Update HTML direction
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = currentLanguage;
    
    // Update progress text
    updateProgressText();
    
    // Save language preference
    localStorage.setItem('language', currentLanguage);
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'fr' ? 'en' : 'fr';
    updateLanguage();
}

// ===== VALIDATION SYSTEM =====
function initValidationRules() {
    validationRules = {
        productName: {
            required: true,
            minLength: 3,
            maxLength: 100
        },
        productPrice: {
            required: true,
            type: 'number',
            min: 0
        },
        productQuantity: {
            type: 'number',
            min: 0
        },
        shortDescription: {
            required: true,
            minLength: 10,
            maxLength: 200
        },
        detailedDescription: {
            required: true,
            minLength: 30,
            maxLength: 2000
        }
    };
}

function validateField(fieldName, value, showError = true) {
    const rules = validationRules[fieldName];
    if (!rules) return true;
    
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + 'Error');
    
    // Clear previous validation state
    if (field) {
        field.classList.remove('valid', 'invalid');
    }
    if (errorElement) {
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }
    
    // Required validation
    if (rules.required && (!value || value.toString().trim() === '')) {
        if (showError) {
            showFieldError(fieldName, translate('field_required'));
        }
        return false;
    }
    
    // Skip other validations if field is empty and not required
    if (!value || value.toString().trim() === '') {
        if (field) field.classList.add('valid');
        return true;
    }
    
    // Type validation
    if (rules.type === 'number') {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            if (showError) {
                showFieldError(fieldName, fieldName.includes('price') ? translate('invalid_price') : translate('invalid_quantity'));
            }
            return false;
        }
        
        // Min value validation
        if (rules.min !== undefined && numValue < rules.min) {
            if (showError) {
                showFieldError(fieldName, fieldName.includes('price') ? translate('invalid_price') : translate('invalid_quantity'));
            }
            return false;
        }
    }
    
    // Length validation
    if (rules.minLength && value.length < rules.minLength) {
        if (showError) {
            showFieldError(fieldName, translate('min_length', { min: rules.minLength }));
        }
        return false;
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
        if (showError) {
            showFieldError(fieldName, translate('max_length', { max: rules.maxLength }));
        }
        return false;
    }
    
    // Field is valid
    if (field) {
        field.classList.add('valid');
    }
    
    return true;
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + 'Error');
    
    if (field) {
        field.classList.add('invalid');
        field.classList.remove('valid');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function validateForm() {
    let isValid = true;
    
    // Validate basic fields
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        const value = field ? field.value : '';
        
        if (!validateField(fieldName, value, true)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// ===== PROGRESS BAR =====
function calculateProgress() {
    const fields = [
        { id: 'productName', weight: 20 },
        { id: 'productPrice', weight: 20 },
        { id: 'productQuantity', weight: 5 },
        { id: 'shortDescription', weight: 15 },
        { id: 'detailedDescription', weight: 20 },
        { id: 'mainImage', weight: 15, isFile: true },
        { id: 'variants', weight: 5, isVariants: true }
    ];
    
    let totalProgress = 0;
    
    fields.forEach(field => {
        let isCompleted = false;
        
        if (field.isFile) {
            isCompleted = formData.mainImage !== null;
        } else if (field.isVariants) {
            isCompleted = formData.variants.length > 0;
        } else {
            const element = document.getElementById(field.id);
            if (element) {
                const value = element.value.trim();
                isCompleted = value.length > 0;
            }
        }
        
        if (isCompleted) {
            totalProgress += field.weight;
        }
    });
    
    progressPercentage = Math.min(totalProgress, 100);
    updateProgressBar();
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressPercentageEl = document.getElementById('progressPercentage');
    
    if (progressFill) {
        progressFill.style.width = progressPercentage + '%';
    }
    
    if (progressPercentageEl) {
        progressPercentageEl.textContent = Math.round(progressPercentage) + '%';
    }
    
    updateProgressText();
}

function updateProgressText() {
    const progressText = document.getElementById('progressText');
    if (progressText) {
        progressText.textContent = translate('progress') + ': ' + Math.round(progressPercentage) + '%';
    }
}

// ===== DROPZONE SETUP =====
function initDropzones() {
    const mainImageDropzone = document.getElementById('mainImageDropzone');
    const galleryDropzone = document.getElementById('imageGalleryDropzone');
    const mainImageInput = document.getElementById('mainImage');
    const galleryInput = document.getElementById('imageGallery');
    
    if (mainImageDropzone && mainImageInput) {
        setupDropzone(mainImageDropzone, mainImageInput, false);
    }
    
    if (galleryDropzone && galleryInput) {
        setupDropzone(galleryDropzone, galleryInput, true);
    }
}

function setupDropzone(dropzone, input, isMultiple) {
    // Click to select
    dropzone.addEventListener('click', () => {
        input.click();
    });
    
    // Drag and drop
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });
    
    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });
    
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        handleFileSelection(files, isMultiple);
    });
    
    // File input change
    input.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFileSelection(files, isMultiple);
    });
}

function handleFileSelection(files, isMultiple) {
    if (!isMultiple && files.length > 0) {
        // Main image
        const file = files[0];
        if (validateFile(file)) {
            formData.mainImage = file;
            displaySelectedFile(file, 'mainImageDropzone');
            calculateProgress();
            autoSaveForm();
        }
    } else if (isMultiple) {
        // Gallery images
        const validFiles = files.filter(validateFile);
        if (validFiles.length > 0) {
            formData.galleryImages = [...formData.galleryImages, ...validFiles].slice(0, 5);
            displaySelectedFiles(formData.galleryImages, 'imageGalleryDropzone');
            calculateProgress();
            autoSaveForm();
        }
    }
}

function validateFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
        showToast('error', translate('error'), translate('invalid_file_format'));
        return false;
    }
    
    if (file.size > maxSize) {
        showToast('error', translate('error'), translate('file_too_large', { size: 5 }));
        return false;
    }
    
    return true;
}

function displaySelectedFile(file, dropzoneId) {
    const dropzone = document.getElementById(dropzoneId);
    if (!dropzone) return;
    
    const content = dropzone.querySelector('.dropzone-content');
    content.innerHTML = `
        <div class="selected-file">
            <i class="fas fa-image"></i>
            <span>${file.name}</span>
            <button type="button" class="remove-file" onclick="removeMainImage()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

function displaySelectedFiles(files, dropzoneId) {
    const dropzone = document.getElementById(dropzoneId);
    if (!dropzone) return;
    
    const content = dropzone.querySelector('.dropzone-content');
    content.innerHTML = `
        <div cl