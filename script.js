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
        
        // Messages
        'product_saved': 'Produit enregistré avec succès',
        'draft_saved': 'Brouillon enregistré',
        'form_reset': 'Formulaire réinitialisé',
        'variant_added': 'Variante ajoutée',
        'variant_removed': 'Variante supprimée',
        'field_required': 'Ce champ est requis',
        'saving': 'Enregistrement en cours...',
        'success': 'Succès',
        'error': 'Erreur',
        'warning': 'Avertissement',
        'info': 'Information'
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
        
        // Messages
        'product_saved': 'Product saved successfully',
        'draft_saved': 'Draft saved',
        'form_reset': 'Form reset',
        'variant_added': 'Variant added',
        'variant_removed': 'Variant removed',
        'field_required': 'This field is required',
        'saving': 'Saving...',
        'success': 'Success',
        'error': 'Error',
        'warning': 'Warning',
        'info': 'Information'
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

// ===== DROPZONE FUNCTIONS =====
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
    dropzone.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        input.click();
    });
    
    // Drag and drop
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
    });
    
    dropzone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
    });
    
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        handleFileSelection(files, isMultiple);
    });
    
    // File input change
    input.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFileSelection(files, isMultiple);
        // Reset input value to allow selecting the same file again
        e.target.value = '';
    });
}

function handleFileSelection(files, isMultiple) {
    if (!isMultiple && files.length > 0) {
        // Main image
        const file = files[0];
        if (validateFile(file)) {
            formData.mainImage = file;
            displayMainImagePreview(file);
            calculateProgress();
            showToast('success', translate('success'), translate('success') + ': Image principale ajoutée');
        }
    } else if (isMultiple) {
        // Gallery images
        const validFiles = files.filter(validateFile);
        if (validFiles.length > 0) {
            // Limit to 5 total images
            const remainingSlots = 5 - formData.galleryImages.length;
            const filesToAdd = validFiles.slice(0, remainingSlots);
            formData.galleryImages = [...formData.galleryImages, ...filesToAdd];
            displayGalleryPreviews();
            calculateProgress();
            showToast('success', translate('success'), `${filesToAdd.length} image(s) ajoutée(s) à la galerie`);
            
            if (validFiles.length > remainingSlots) {
                showToast('warning', translate('warning'), `Seulement ${remainingSlots} image(s) ajoutée(s). Maximum 5 images autorisées.`);
            }
        }
    }
}

function validateFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
        showToast('error', translate('error'), 'Format de fichier non supporté. Utilisez JPG, PNG ou WebP.');
        return false;
    }
    
    if (file.size > maxSize) {
        showToast('error', translate('error'), 'Fichier trop volumineux. Taille maximum: 5MB');
        return false;
    }
    
    return true;
}

function displayMainImagePreview(file) {
    const dropzone = document.getElementById('mainImageDropzone');
    if (!dropzone) return;
    
    // Create image preview URL
    const imageUrl = URL.createObjectURL(file);
    
    const content = dropzone.querySelector('.dropzone-content');
    content.innerHTML = `
        <div class="image-preview">
            <img src="${imageUrl}" alt="Preview" class="preview-image">
            <div class="image-overlay">
                <div class="image-info">
                    <i class="fas fa-image"></i>
                    <span class="image-name">${file.name}</span>
                    <span class="image-size">${formatFileSize(file.size)}</span>
                </div>
                <button type="button" class="remove-image-btn" onclick="removeMainImage()">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

function displayGalleryPreviews() {
    const dropzone = document.getElementById('imageGalleryDropzone');
    if (!dropzone) return;
    
    const content = dropzone.querySelector('.dropzone-content');
    
    if (formData.galleryImages.length === 0) {
        content.innerHTML = `
            <i class="fas fa-images"></i>
            <h4 data-key="add_additional_images">Ajoutez des images supplémentaires</h4>
            <p data-key="up_to_5_images">Jusqu'à 5 images</p>
            <small data-key="png_jpg_webp_5mb_each">PNG, JPG, WEBP jusqu'à 5MB chacune</small>
        `;
        return;
    }
    
    const previewsHtml = formData.galleryImages.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return `
            <div class="gallery-preview">
                <img src="${imageUrl}" alt="Preview ${index + 1}" class="preview-image">
                <div class="image-overlay">
                    <div class="image-info">
                        <span class="image-name">${file.name}</span>
                        <span class="image-size">${formatFileSize(file.size)}</span>
                    </div>
                    <button type="button" class="remove-image-btn" onclick="removeGalleryImage(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    const addMoreButton = formData.galleryImages.length < 5 ? `
        <div class="add-more-images" onclick="document.getElementById('imageGallery').click()">
            <i class="fas fa-plus"></i>
            <span>Ajouter plus d'images</span>
            <small>${formData.galleryImages.length}/5</small>
        </div>
    ` : `
        <div class="gallery-limit-reached">
            <i class="fas fa-check-circle"></i>
            <span>Maximum d'images atteint (5/5)</span>
        </div>
    `;
    
    content.innerHTML = `
        <div class="gallery-previews">
            ${previewsHtml}
            ${addMoreButton}
        </div>
    `;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        <div class="selected-files">
            ${files.map((file, index) => `
                <div class="selected-file">
                    <i class="fas fa-image"></i>
                    <span>${file.name}</span>
                    <button type="button" class="remove-file" onclick="removeGalleryImage(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

function removeMainImage() {
    // Clean up object URL to prevent memory leaks
    if (formData.mainImage) {
        const existingImg = document.querySelector('#mainImageDropzone .preview-image');
        if (existingImg) {
            URL.revokeObjectURL(existingImg.src);
        }
    }
    
    formData.mainImage = null;
    const dropzone = document.getElementById('mainImageDropzone');
    if (dropzone) {
        const content = dropzone.querySelector('.dropzone-content');
        content.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <h4 data-key="drop_main_image_here">Glissez votre image principale ici</h4>
            <p data-key="or_click_to_select">ou cliquez pour sélectionner</p>
            <small data-key="png_jpg_webp_5mb">PNG, JPG, WEBP jusqu'à 5MB</small>
        `;
        updateLanguage(); // Re-apply translations
    }
    calculateProgress();
    showToast('info', translate('info'), 'Image principale supprimée');
}

function removeGalleryImage(index) {
    // Clean up object URL to prevent memory leaks
    if (formData.galleryImages[index]) {
        const existingImgs = document.querySelectorAll('#imageGalleryDropzone .preview-image');
        if (existingImgs[index]) {
            URL.revokeObjectURL(existingImgs[index].src);
        }
    }
    
    formData.galleryImages.splice(index, 1);
    displayGalleryPreviews();
    calculateProgress();
    showToast('info', translate('info'), 'Image supprimée de la galerie');
}

// ===== VARIANT FUNCTIONS =====
function addVariant() {
    const variantId = generateId();
    variantCounter++;
    
    const variant = {
        id: variantId,
        name: '',
        values: []
    };
    
    formData.variants.push(variant);
    
    const variantsContainer = document.getElementById('variantsContainer');
    const variantHtml = `
        <div class="variant-item" data-variant-id="${variantId}">
            <div class="variant-header">
                <h4 class="variant-title">${translate('variant')} ${variantCounter}</h4>
                <button type="button" class="variant-remove" onclick="removeVariant('${variantId}')">
                    <i class="fas fa-trash"></i>
                    <span>${translate('remove')}</span>
                </button>
            </div>
            
            <div class="variant-content">
                <div class="form-field variant-name-input">
                    <label>${translate('variant_name')}</label>
                    <div class="input-container">
                        <input type="text" placeholder="ex: Couleur, Taille" onchange="updateVariantName('${variantId}', this.value)">
                        <div class="input-icon">
                            <i class="fas fa-tag"></i>
                        </div>
                    </div>
                </div>
                
                <div class="form-field variant-values">
                    <label>${translate('variant_value')}</label>
                    <div class="values-input-container">
                        <input type="text" placeholder="Entrez une valeur" onkeypress="handleVariantValueKeyPress(event, '${variantId}')">
                        <button type="button" class="add-value-btn" onclick="addVariantValue('${variantId}')">
                            <i class="fas fa-plus"></i>
                            <span>${translate('add_value')}</span>
                        </button>
                    </div>
                    <div class="tags-display" id="tags-${variantId}"></div>
                </div>
            </div>
        </div>
    `;
    
    variantsContainer.insertAdjacentHTML('beforeend', variantHtml);
    calculateProgress();
    showToast('success', translate('success'), translate('variant_added'));
}

function removeVariant(variantId) {
    formData.variants = formData.variants.filter(v => v.id !== variantId);
    const variantElement = document.querySelector(`[data-variant-id="${variantId}"]`);
    if (variantElement) {
        variantElement.remove();
    }
    calculateProgress();
    showToast('info', translate('info'), translate('variant_removed'));
}

function updateVariantName(variantId, name) {
    const variant = formData.variants.find(v => v.id === variantId);
    if (variant) {
        variant.name = name;
        calculateProgress();
    }
}

function handleVariantValueKeyPress(event, variantId) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addVariantValue(variantId);
    }
}

function addVariantValue(variantId) {
    const variantElement = document.querySelector(`[data-variant-id="${variantId}"]`);
    const input = variantElement.querySelector('.values-input-container input');
    const value = input.value.trim();
    
    if (!value) return;
    
    const variant = formData.variants.find(v => v.id === variantId);
    if (variant) {
        if (!variant.values.includes(value)) {
            variant.values.push(value);
            input.value = '';
            updateVariantTags(variantId);
            calculateProgress();
            showToast('success', translate('success'), `Valeur "${value}" ajoutée`);
        } else {
            showToast('warning', translate('warning'), 'Cette valeur existe déjà');
        }
    }
}

function removeVariantValue(variantId, value) {
    const variant = formData.variants.find(v => v.id === variantId);
    if (variant) {
        variant.values = variant.values.filter(v => v !== value);
        updateVariantTags(variantId);
        calculateProgress();
        showToast('info', translate('info'), `Valeur "${value}" supprimée`);
    }
}

function updateVariantTags(variantId) {
    const tagsContainer = document.getElementById(`tags-${variantId}`);
    const variant = formData.variants.find(v => v.id === variantId);
    
    if (tagsContainer && variant) {
        tagsContainer.innerHTML = variant.values.map(value => `
            <span class="tag">
                ${value}
                <button type="button" class="tag-remove" onclick="removeVariantValue('${variantId}', '${value}')">
                    <i class="fas fa-times"></i>
                </button>
            </span>
        `).join('');
        
        if (variant.values.length > 0) {
            tagsContainer.classList.add('has-tags');
        } else {
            tagsContainer.classList.remove('has-tags');
        }
    }
}

// ===== FORM FUNCTIONS =====
function validateForm() {
    const productName = document.getElementById('productName').value.trim();
    const productPrice = document.getElementById('productPrice').value.trim();
    const shortDescription = document.getElementById('shortDescription').value.trim();
    const detailedDescription = document.getElementById('detailedDescription').value.trim();
    
    const errors = [];
    
    if (!productName) errors.push('Le nom du produit est requis');
    if (!productPrice) errors.push('Le prix est requis');
    if (!shortDescription) errors.push('La description courte est requise');
    if (!detailedDescription) errors.push('La description détaillée est requise');
    
    if (errors.length > 0) {
        showToast('error', translate('error'), errors.join('<br>'));
        return false;
    }
    
    return true;
}

function resetForm() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire?')) {
        document.getElementById('productForm').reset();
        formData = {
            mainImage: null,
            galleryImages: [],
            variants: []
        };
        document.getElementById('variantsContainer').innerHTML = '';
        variantCounter = 0;
        
        // Reset dropzones
        const mainDropzone = document.getElementById('mainImageDropzone');
        if (mainDropzone) {
            const content = mainDropzone.querySelector('.dropzone-content');
            content.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <h4 data-key="drop_main_image_here">Glissez votre image principale ici</h4>
                <p data-key="or_click_to_select">ou cliquez pour sélectionner</p>
                <small data-key="png_jpg_webp_5mb">PNG, JPG, WEBP jusqu'à 5MB</small>
            `;
        }
        
        const galleryDropzone = document.getElementById('imageGalleryDropzone');
        if (galleryDropzone) {
            const content = galleryDropzone.querySelector('.dropzone-content');
            content.innerHTML = `
                <i class="fas fa-images"></i>
                <h4 data-key="add_additional_images">Ajoutez des images supplémentaires</h4>
                <p data-key="up_to_5_images">Jusqu'à 5 images</p>
                <small data-key="png_jpg_webp_5mb_each">PNG, JPG, WEBP jusqu'à 5MB chacune</small>
            `;
        }
        
        calculateProgress();
        showToast('info', translate('info'), translate('form_reset'));
    }
}

function previewProduct() {
    showToast('info', translate('info'), 'Fonction d\'aperçu en cours de développement');
}

function saveDraft() {
    showLoadingOverlay();
    
    setTimeout(() => {
        hideLoadingOverlay();
        showToast('success', translate('success'), translate('draft_saved'));
    }, 1500);
}

function saveProduct() {
    if (!validateForm()) return;
    
    showLoadingOverlay();
    
    // Simulate API call
    setTimeout(() => {
        hideLoadingOverlay();
        showToast('success', translate('success'), translate('product_saved'));
        showModal(translate('success'), 'Produit enregistré avec succès dans la base de données!');
    }, 2000);
}

// ===== MODAL FUNCTIONS =====
function showModal(title, message) {
    const modal = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.add('show');
}

function hideModal() {
    const modal = document.getElementById('modalOverlay');
    modal.classList.remove('show');
}

// ===== LOADING OVERLAY =====
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('show');
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('show');
}

// ===== TOAST FUNCTIONS =====
function showToast(type, title, message) {
    const toastContainer = document.getElementById('toastContainer');
    const toastId = generateId();
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const toastHtml = `
        <div class="toast ${type}" id="toast-${toastId}">
            <div class="toast-icon">
                <i class="${icons[type]}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="hideToast('${toastId}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    const toastElement = document.getElementById(`toast-${toastId}`);
    setTimeout(() => {
        toastElement.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        hideToast(toastId);
    }, 5000);
}

function hideToast(toastId) {
    const toast = document.getElementById(`toast-${toastId}`);
    if (toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language
    updateLanguage();
    
    // Initialize dropzones
    initDropzones();
    
    // Initialize progress bar
    calculateProgress();
    
    // Set up event listeners
    setupEventListeners();
    
    // Auto-save every 30 seconds
    autoSaveInterval = setInterval(() => {
        const form = document.getElementById('productForm');
        if (form) {
            localStorage.setItem('productFormData', JSON.stringify(formData));
        }
    }, 30000);
});

function setupEventListeners() {
    // Language toggle
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }
    
    // User menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (menuToggle && dropdownMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdownMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                dropdownMenu.classList.remove('active');
            }
        });
    }
    
    // Form buttons
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetForm);
    }
    
    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) {
        previewBtn.addEventListener('click', previewProduct);
    }
    
    const draftBtn = document.getElementById('draftBtn');
    if (draftBtn) {
        draftBtn.addEventListener('click', saveDraft);
    }
    
    // Add variant button
    const addVariantBtn = document.getElementById('addVariantBtn');
    if (addVariantBtn) {
        addVariantBtn.addEventListener('click', addVariant);
    }
    
    // Form submission
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProduct();
        });
    }
    
    // Modal close
    const modalClose = document.getElementById('modalClose');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalOverlay = document.getElementById('modalOverlay');
    
    if (modalClose) {
        modalClose.addEventListener('click', hideModal);
    }
    
    if (modalConfirm) {
        modalConfirm.addEventListener('click', hideModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                hideModal();
            }
        });
    }
    
    // Form field change listeners for progress calculation
    const formFields = ['productName', 'productPrice', 'productQuantity', 'shortDescription', 'detailedDescription'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', debounce(calculateProgress, 300));
        }
    });
}

// ===== GLOBAL FUNCTIONS (for onclick handlers) =====
window.removeMainImage = removeMainImage;
window.removeGalleryImage = removeGalleryImage;
window.removeVariant = removeVariant;
window.updateVariantName = updateVariantName;
window.handleVariantValueKeyPress = handleVariantValueKeyPress;
window.addVariantValue = addVariantValue;
window.removeVariantValue = removeVariantValue;
window.hideToast = hideToast;
