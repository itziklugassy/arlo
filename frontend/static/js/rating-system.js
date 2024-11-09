// static/js/rating-system.js

class RatingSystem {
    constructor() {
        this.projectId = this.getProjectIdFromUrl();
        this.ratingForm = document.getElementById('review-form');
        this.initializeRatingSystem();
    }

    getProjectIdFromUrl() {
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 2];
    }

    initializeRatingSystem() {
        this.createRatingCategories();
        this.addFormSubmitHandler();
        this.checkExistingReview();
    }

    createRatingCategories() {
        const categories = [
            { name: 'understanding', label: 'תובנה (Understanding)', hebrew: 'תובנה' },
            { name: 'concept', label: 'קונספט (Concept)', hebrew: 'קונספט' },
            { name: 'execution', label: 'ביצוע (Execution)', hebrew: 'ביצוע' },
            { name: 'prominence', label: 'בולטות (Prominence)', hebrew: 'בולטות' },
            { name: 'pride', label: 'גאווה (Pride)', hebrew: 'גאווה' },
            { name: 'originality', label: 'מקוריות (Originality)', hebrew: 'מקוריות' }
        ];

        const container = document.createElement('div');
        container.className = 'rating-categories-container';

        categories.forEach(category => {
            container.appendChild(this.createRatingCategory(category));
        });

        // Add comments section
        container.appendChild(this.createCommentsSection());
        
        // Add submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'btn btn-primary w-100 mt-4';
        submitButton.innerHTML = '<i class="fas fa-paper-plane me-2"></i>שלח דירוג';
        container.appendChild(submitButton);

        this.ratingForm.appendChild(container);
    }

    createRatingCategory(category) {
        const wrapper = document.createElement('div');
        wrapper.className = 'rating-category mb-4';

        const header = document.createElement('div');
        header.className = 'rating-label d-flex justify-content-between align-items-center mb-3';
        header.innerHTML = `
            <span>${category.hebrew}</span>
            <span class="rating-value" id="${category.name}-value">0</span>
        `;

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'rating-buttons';

        for (let i = 0; i <= 10; i++) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn-rating';
            button.dataset.value = i;
            button.innerHTML = `<span>${i}</span>`;

            button.addEventListener('click', (e) => {
                this.handleRatingClick(category.name, i, buttonsContainer);
            });

            buttonsContainer.appendChild(button);
        }

        // Hidden input for form submission
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = category.name;
        input.id = `${category.name}-input`;

        wrapper.appendChild(header);
        wrapper.appendChild(buttonsContainer);
        wrapper.appendChild(input);

        return wrapper;
    }

    createCommentsSection() {
        const wrapper = document.createElement('div');
        wrapper.className = 'comments-section mt-4';

        const label = document.createElement('label');
        label.htmlFor = 'comments';
        label.className = 'form-label';
        label.textContent = 'הערות נוספות';

        const textarea = document.createElement('textarea');
        textarea.className = 'form-control';
        textarea.id = 'comments';
        textarea.name = 'comments';
        textarea.rows = 4;

        wrapper.appendChild(label);
        wrapper.appendChild(textarea);

        return wrapper;
    }

    handleRatingClick(categoryName, value, buttonsContainer) {
        // Remove selected class from all buttons in this category
        buttonsContainer.querySelectorAll('.btn-rating').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Add selected class to clicked button
        const clickedButton = buttonsContainer.querySelector(`[data-value="${value}"]`);
        clickedButton.classList.add('selected');

        // Update value display and hidden input
        document.getElementById(`${categoryName}-value`).textContent = value;
        document.getElementById(`${categoryName}-input`).value = value;

        // Animate the rating change
        this.animateRatingChange(categoryName, value);
    }

    animateRatingChange(categoryName, value) {
        const valueElement = document.getElementById(`${categoryName}-value`);
        valueElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            valueElement.style.transform = 'scale(1)';
        }, 200);
    }

    addFormSubmitHandler() {
        this.ratingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);

            try {
                const response = await fetch(`/api/projects/${this.projectId}/review/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': this.getCsrfToken()
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    this.showToast('הדירוג נשלח בהצלחה!', 'success');
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'שגיאה בשליחת הדירוג');
                }
            } catch (error) {
                this.showToast(error.message, 'error');
            }
        });
    }

    async checkExistingReview() {
        try {
            const response = await fetch(`/api/projects/${this.projectId}/user_review/`);
            if (response.ok) {
                const review = await response.json();
                this.populateExistingReview(review);
                this.ratingForm.querySelector('button[type="submit"]').disabled = true;
                this.showToast('כבר דירגת פרויקט זה', 'info');
            }
        } catch (error) {
            console.error('Error checking existing review:', error);
        }
    }

    populateExistingReview(review) {
        ['understanding', 'concept', 'execution', 'prominence', 'pride', 'originality'].forEach(category => {
            const value = review[category];
            const buttonsContainer = document.querySelector(`#${category}-input`).parentElement.querySelector('.rating-buttons');
            this.handleRatingClick(category, value, buttonsContainer);
        });

        const commentsField = document.getElementById('comments');
        if (commentsField && review.comments) {
            commentsField.value = review.comments;
            commentsField.disabled = true;
        }
    }

    showToast(message, type) {
        const toastContainer = document.querySelector('.toast-container');
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        toastContainer.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    getCsrfToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }
}

// Initialize the rating system when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    new RatingSystem();
});