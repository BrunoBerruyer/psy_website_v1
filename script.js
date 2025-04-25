/*
* Script principal du site
* Gère les comportements interactifs et les animations JavaScript
*/

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    
    // Barre de navigation - détection du défilement
    function handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Fonction pour le menu hamburger sur mobile
    function setupMobileMenu() {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-links li');
        
        // Toggle navigation
        if (burger) {
            burger.addEventListener('click', function() {
                // Toggle navigation
                nav.classList.toggle('nav-active');
                
                // Animation des liens
                navLinks.forEach((link, index) => {
                    if (link.style.animation) {
                        link.style.animation = '';
                    } else {
                        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                    }
                });
                
                // Animation du burger
                burger.classList.toggle('toggle');
            });
        }
    }
    
    // Fonction pour le défilement fluide vers les ancres
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Fermer le menu mobile si ouvert
                    const nav = document.querySelector('.nav-links');
                    const burger = document.querySelector('.burger');
                    if (nav.classList.contains('nav-active')) {
                        nav.classList.remove('nav-active');
                        burger.classList.remove('toggle');
                    }
                    
                    // Défiler vers l'élément cible
                    window.scrollTo({
                        top: targetElement.offsetTop - 60, // Ajuster pour la hauteur de la navbar
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Fonction pour mettre en évidence l'élément de navigation actif
    function setupActiveNavHighlight() {
        const sections = document.querySelectorAll('.section');
        const navItems = document.querySelectorAll('.nav-item');
        
        window.addEventListener('scroll', function() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (pageYOffset >= sectionTop - 100) { // 100px avant la section
                    current = section.getAttribute('id');
                }
            });
            
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href').substring(1) === current) {
                    item.classList.add('active');
                }
            });
        });
    }
    
    // Fonction pour animer les éléments au scroll
    function setupScrollAnimations() {
        // Sélectionner tous les éléments à animer
        const animatedElements = document.querySelectorAll('.service-card, .section-title, .contact-item');
        
        // Configurer l'observateur d'intersection
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Si l'élément est visible
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    // Optionnel: arrêter d'observer une fois animé
                    // observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // Déclencher quand 10% de l'élément est visible
        });
        
        // Observer chaque élément
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Fonction pour valider le formulaire de contact
    function setupContactFormValidation() {
        const contactForm = document.querySelector('.contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validation simple
                let isValid = true;
                const requiredFields = contactForm.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');
                    } else {
                        field.classList.remove('error');
                    }
                });
                
                // Validation email
                const emailField = contactForm.querySelector('#email');
                if (emailField && emailField.value) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(emailField.value)) {
                        isValid = false;
                        emailField.classList.add('error');
                    }
                }
                
                // Si tout est valide, afficher un message de réussite
                if (isValid) {
                    // Ici, vous pourriez envoyer le formulaire via AJAX
                    // Pour cet exemple, nous affichons simplement un message de réussite
                    const formContainer = contactForm.parentElement;
                    
                    // Créer un message de succès
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        <h3>Message envoyé avec succès!</h3>
                        <p>Merci de m'avoir contacté. Je vous répondrai dans les plus brefs délais.</p>
                    `;
                    
                    // Cacher le formulaire et afficher le message
                    contactForm.style.display = 'none';
                    formContainer.appendChild(successMessage);
                    
                    // Réinitialiser le formulaire (pour une utilisation future)
                    contactForm.reset();
                    
                    // Optionnel: faire réapparaître le formulaire après un délai
                    setTimeout(() => {
                        successMessage.remove();
                        contactForm.style.display = 'grid';
                    }, 5000);
                }
            });
            
            // Supprimer la classe d'erreur lorsque l'utilisateur corrige son entrée
            const formFields = contactForm.querySelectorAll('input, textarea');
            formFields.forEach(field => {
                field.addEventListener('input', function() {
                    if (field.value.trim()) {
                        field.classList.remove('error');
                    }
                });
            });
        }
    }
    
    // Initialiser toutes les fonctionnalités
    handleNavbarScroll();
    setupMobileMenu();
    setupSmoothScroll();
    setupActiveNavHighlight();
    setupScrollAnimations();
    setupContactFormValidation();
    
    // Animation sur la page d'accueil au chargement initial
    const header = document.querySelector('header');
    if (header) {
        header.classList.add('animate-in');
    }
});

// Ajouter un peu de style pour le message de succès du formulaire
document.head.insertAdjacentHTML('beforeend', `
<style>
    .success-message {
        text-align: center;
        padding: 2rem;
        background: var(--color-card-bg);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-neomorphic);
        animation: fadeIn 0.5s ease-out;
    }
    
    .success-message i {
        font-size: 3rem;
        color: var(--color-success);
        margin-bottom: 1rem;
    }
    
    .success-message h3 {
        margin-bottom: 0.5rem;
        color: var(--color-success);
    }
    
    .error {
        border: 1px solid var(--color-error) !important;
        box-shadow: 0 0 0 2px rgba(214, 143, 125, 0.2) !important;
    }
</style>
`);

                