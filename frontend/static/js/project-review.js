// project-review.js
class ProjectReviewSystem {
    constructor() {
        this.projectId = this.getProjectIdFromUrl();
        console.log('Project ID:', this.projectId); // Debug log
        this.form = document.getElementById('review-form');
        this.projectDetail = document.getElementById('project-detail');
        this.reviewsContainer = document.getElementById('reviews-container');
        this.loadingSpinner = document.getElementById('loading-spinner');

        if (!this.form || !this.projectDetail || !this.reviewsContainer || !this.loadingSpinner) {
            console.error('Required elements are missing from the DOM');
            return;
        }
        
        if (this.projectId) {
            this.initialize();
        }
    }

    getProjectIdFromUrl() {
        const pathParts = window.location.pathname.split('/');
        const projectIndex = pathParts.indexOf('project');
        if (projectIndex !== -1 && projectIndex + 1 < pathParts.length) {
            const id = pathParts[projectIndex + 1];
            return id;
        }
        return null;
    }

    showLoading() {
        if (this.loadingSpinner) {
            this.loadingSpinner.classList.remove('d-none');
        }
    }

    hideLoading() {
        if (this.loadingSpinner) {
            this.loadingSpinner.classList.add('d-none');
        }
    }

    async initialize() {
        try {
            this.showLoading();
            await this.loadProjectDetails();
            this.setupRatingForm();
            await this.loadReviews();
            await this.checkUserReview();
            this.setupShareButton();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize project details');
        } finally {
            this.hideLoading();
        }
    }

    async loadProjectDetails() {
        try {
            const response = await fetch(`/api/projects/${this.projectId}/`);
            if (!response.ok) {
                throw new Error('Failed to load project details');
            }
            const project = await response.json();
            this.updateProjectUI(project);
        } catch (error) {
            console.error('Error loading project details:', error);
            this.showError('Failed to load project details');
        }
    }

    updateProjectUI(project) {
        const titleElement = this.projectDetail.querySelector('.project-title');
        if (titleElement) {
            titleElement.textContent = project.title;
        }
    
        const descriptionElement = this.projectDetail.querySelector('.project-description');
        if (descriptionElement) {
            descriptionElement.textContent = project.description;
        }
    
        const videoContainer = this.projectDetail.querySelector('.video-container');
        if (videoContainer && project.video_url) {
            // Extract the VIDEO_ID from the project.video_url
            const videoIdMatch = project.video_url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
            const videoId = videoIdMatch ? videoIdMatch[1] : null;
    
            if (videoId) {
                // Use the embed URL with the extracted VIDEO_ID
                videoContainer.innerHTML = `
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>`;
            } else {
                console.error('Invalid YouTube URL:', project.video_url);
            }
        }
    }
    

    async loadReviews() {
        try {
            const response = await fetch(`/api/projects/${this.projectId}/reviews/`);
            if (!response.ok) {
                throw new Error('Failed to load reviews');
            }
            const reviews = await response.json();
            this.displayReviews(reviews);
        } catch (error) {
            console.error('Error loading reviews:', error);
        }
    }

    displayReviews(reviews) {
        if (!this.reviewsContainer) return;

        if (!reviews.length) {
            this.reviewsContainer.innerHTML = `
                <div class="alert alert-info">
                    אין ביקורות עדיין
                </div>`;
            return;
        }

        this.reviewsContainer.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="d-flex justify-content-between mb-3">
                    <strong>${review.user}</strong>
                    <small class="text-muted">${new Date(review.created_at).toLocaleDateString()}</small>
                </div>
                <div class="ratings mb-3">
                    <div>תובנה: ${review.understanding}/10</div>
                    <div>קונספט: ${review.concept}/10</div>
                    <div>ביצוע: ${review.execution}/10</div>
                    <div>בולטות: ${review.prominence}/10</div>
                    <div>גאווה: ${review.pride}/10</div>
                    <div>מקוריות: ${review.originality}/10</div>
                </div>
                ${review.comments ? `<p class="mb-0">${review.comments}</p>` : ''}
            </div>
        `).join('');
    }

    setupRatingForm() {
        const categories = [
            { name: 'understanding', label: 'תובנה', description: 'Understanding' },
            { name: 'concept', label: 'קונספט', description: 'Concept' },
            { name: 'execution', label: 'ביצוע', description: 'Execution' },
            { name: 'prominence', label: 'בולטות', description: 'Prominence' },
            { name: 'pride', label: 'גאווה', description: 'Pride' },
            { name: 'originality', label: 'מקוריות', description: 'Originality' }
        ];

        const container = this.form.querySelector('.rating-categories');
        if (container) {
            categories.forEach(category => {
                container.appendChild(this.createRatingCategory(category));
            });
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    createRatingCategory(category) {
        const div = document.createElement('div');
        div.className = 'rating-category';
        div.innerHTML = `
            <div class="rating-header d-flex justify-content-between align-items-center">
                <h4 class="m-0">${category.label}</h4>
                <span class="rating-value" id="${category.name}-value">0</span>
            </div>
            <div class="rating-buttons" id="${category.name}-buttons"></div>
            <input type="hidden" name="${category.name}" id="${category.name}-input" value="0">
        `;

        const buttonsContainer = div.querySelector('.rating-buttons');
        for (let i = 0; i <= 10; i++) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn-rating';
            button.dataset.value = i;
            button.innerHTML = `<span>${i}</span>`;
            button.onclick = () => this.handleRating(category.name, i);
            buttonsContainer.appendChild(button);
        }

        return div;
    }

    handleRating(categoryName, value) {
        const buttons = document.querySelectorAll(`#${categoryName}-buttons .btn-rating`);
        buttons.forEach(btn => btn.classList.remove('selected'));
        
        const selectedButton = document.querySelector(`#${categoryName}-buttons [data-value="${value}"]`);
        if (selectedButton) {
            selectedButton.classList.add('selected');
            
            document.getElementById(`${categoryName}-value`).textContent = value;
            document.getElementById(`${categoryName}-input`).value = value;
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.showLoading();

        try {
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);

            const response = await fetch(`/api/projects/${this.projectId}/review/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit review');
            }

            this.showSuccess('הדירוג נשלח בהצלחה!');
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    showSuccess(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success mt-3';
        alert.role = 'alert';
        alert.textContent = message;
        this.projectDetail.appendChild(alert);
    }

    showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger mt-3';
        alert.role = 'alert';
        alert.textContent = message;
        this.projectDetail.appendChild(alert);
        setTimeout(() => alert.remove(), 5000);
    }

    async checkUserReview() {
        try {
            const response = await fetch(`/api/projects/${this.projectId}/user_review/`);
            if (response.ok) {
                const review = await response.json();
                this.populateExistingReview(review);
                this.disableReviewForm();
                this.showInfo('כבר דירגת פרויקט זה');
            }
        } catch (error) {
            console.error('Error checking user review:', error);
        }
    }

    populateExistingReview(review) {
        const categories = ['understanding', 'concept', 'execution', 'prominence', 'pride', 'originality'];
        categories.forEach(category => {
            this.handleRating(category, review[category]);
        });

        const commentsField = document.getElementById('comments');
        if (commentsField && review.comments) {
            commentsField.value = review.comments;
            commentsField.disabled = true;
        }
    }

    disableReviewForm() {
        if (!this.form) return;
        const elements = this.form.elements;
        for (let element of elements) {
            element.disabled = true;
        }
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;
    }

    setupShareButton() {
        const shareButton = document.querySelector('.share-button');
        if (shareButton) {
            shareButton.addEventListener('click', () => {
                if (navigator.share) {
                    navigator.share({
                        title: document.querySelector('.project-title').textContent,
                        url: window.location.href
                    }).catch(console.error);
                } else {
                    this.copyToClipboard(window.location.href);
                    this.showSuccess('הקישור הועתק ללוח');
                }
            });
        }
    }

    copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    showInfo(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-info mt-3';
        alert.role = 'alert';
        alert.textContent = message;
        this.projectDetail.appendChild(alert);
    }
}

// Initialize only on project detail pages
if (window.location.pathname.includes('/project/') && 
    !window.location.pathname.endsWith('/project/')) {
    document.addEventListener('DOMContentLoaded', () => {
        new ProjectReviewSystem();
    });
}