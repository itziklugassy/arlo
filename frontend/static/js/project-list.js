// static/js/project-list.js
class ProjectList {
    constructor() {
        this.container = document.getElementById('projects-container');
        this.loadingSpinner = document.getElementById('loading-spinner');
        this.initialize();
    }

    async initialize() {
        try {
            this.showLoading();
            await this.loadProjects();
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showError('Error loading projects');
        } finally {
            this.hideLoading();
        }
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

    async loadProjects() {
        const response = await fetch('/api/projects/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const projects = await response.json();
        this.displayProjects(projects);
    }

    displayProjects(projects) {
        if (!this.container) return;

        if (!projects.length) {
            this.container.innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-info" role="alert">
                        No projects available at this time.
                    </div>
                </div>
            `;
            return;
        }

        this.container.innerHTML = projects.map(project => `
            <div class="col-md-4 mb-4">
                <div class="card h-100 project-card shadow-sm">
                    ${project.thumbnail ? 
                        `<img src="${project.thumbnail}" class="card-img-top" alt="${project.title}" style="height: 200px; object-fit: cover;">` 
                        : `<div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
                            <i class="fas fa-project-diagram fa-3x text-muted"></i>
                           </div>`
                    }
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${project.title}</h5>
                        <p class="card-text flex-grow-1">${project.description}</p>
                        <div class="mt-auto">
                            <a href="/project/${project.id}/" class="btn btn-primary w-100">
                                <i class="fas fa-eye me-2"></i>View Project
                            </a>
                        </div>
                    </div>
                    <div class="card-footer text-muted">
                        <small>Created: ${new Date(project.created_at).toLocaleDateString()}</small>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showError(message) {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-circle me-2"></i>${message}
                </div>
            </div>
        `;
    }
}

// Initialize only on project list page
if (window.location.pathname === '/project/') {
    document.addEventListener('DOMContentLoaded', () => {
        new ProjectList();
    });
}