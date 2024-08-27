document.addEventListener('DOMContentLoaded', function() {
 
  const slider = document.querySelector('.recommendations-row');
  const cards = slider.querySelectorAll('.recommendation-card');
  const leftArrow = document.querySelector('.slider-arrow-left');
  const rightArrow = document.querySelector('.slider-arrow-right');
  const dotsContainer = document.querySelector('.carousel-dots');
  let currentIndex = 0;
  const totalSlides = 5; //total slides in slider

  // SLIDER COMPONENT HANDLING
  // Bottom Dots in Slider
  function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateActiveDot() {
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function updateSlider() {
    const cardWidth = cards[0].offsetWidth;
    slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    updateActiveDot();
  }

  function showArrows() {
    leftArrow.style.display = currentIndex > 0 ? 'block' : 'none';
    rightArrow.style.display = currentIndex < totalSlides - 1 ? 'block' : 'none';
  }

  function scrollLeft() {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
      showArrows();
    }
  }

  function scrollRight() {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
      updateSlider();
      showArrows();
    }
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlider();
    showArrows();
  }

  leftArrow.addEventListener('click', scrollLeft);
  rightArrow.addEventListener('click', scrollRight);

  // keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') scrollLeft();
    if (e.key === 'ArrowRight') scrollRight();
  });

  // Initial setup for slider component
  createDots();
  updateSlider();
  showArrows();

  // Updating slider on window resize
  window.addEventListener('resize', () => {
    updateSlider();
    showArrows();
  });

  // Adding Skill submission functionality
  const addSkillBtn = document.querySelector('.add-skill-btn');
  const overlay = document.querySelector('.overlay');
  const modal = document.querySelector('.modal');
  const cancelBtn = modal.querySelector('.cancel');
  const addSkillForm = modal.querySelector('.skill-form');

  // displaying modal when Add Skill button is clicked
  addSkillBtn.addEventListener('click', () => {
    overlay.style.display = 'flex';
  });

  
  cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideModal();
  });

  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      hideModal();
    }
  });

  function hideModal() {
    overlay.style.display = 'none';
    addSkillForm.reset(); 
  }


  // Handling form submission
  addSkillForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const domain = document.getElementById('domain').value;
    const skillInputs = document.querySelectorAll('.skill-item');
    const skills = [];

    skillInputs.forEach(item => {
      const skillName = item.querySelector('.skill').value;
      const proficiency = item.querySelector('.proficiency').value;
      if (skillName && proficiency) {
        skills.push({ name: skillName, proficiency: proficiency });
      }
    });

    if (domain && skills.length > 0) {
      addNewSkillColumn(domain, skills);
      hideModal();
    } else {
      alert('Please fill in the domain and at least one skill.');
    }
  });

  function addNewSkillColumn(domain, skills) {
    const skillsContainer = document.querySelector('.skills-container');
    let currentRow = document.querySelector('.skills-grid:last-child');

    
    // If there's no row or the last row is full, create a new row
    if (!currentRow || currentRow.children.length >= 3) {
      currentRow = document.createElement('div');
      currentRow.className = 'skills-grid';
      skillsContainer.appendChild(currentRow);
    }

    const newColumn = document.createElement('div');
    newColumn.className = 'skill-column';
    
    let columnHTML = `<h2>${domain}</h2>`;
    skills.forEach(skill => {
      columnHTML += `
        <div class="skill-bar">
          <div class="skill-header">
            <span class="skill-name">${skill.name}</span>
            <span class="skill-percentage">${skill.proficiency}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress" style="width: ${skill.proficiency}%"></div>
          </div>
        </div>
      `;
    });

    newColumn.innerHTML = columnHTML;
    currentRow.appendChild(newColumn);

    // If this new column filled the row, prepare for the next row
    if (currentRow.children.length >= 3) {
      const newRow = document.createElement('div');
      newRow.className = 'skills-grid';
      skillsContainer.appendChild(newRow);
    }
    moveAddSkillButton();
  }

  function moveAddSkillButton() {
    const skillsContainer = document.querySelector('.skills-container');
    const addSkillBtn = document.querySelector('.add-skill-btn');
    skillsContainer.appendChild(addSkillBtn);
  }

  // Initial button positioning
  moveAddSkillButton();

  // Contact Form handling
  const contactForm = document.querySelector('.formSection form');

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    if (validateForm()) {
      const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
      };

      console.log('Form Data:', formData);
      alert('Your message has been sent successfully!');
      
      contactForm.reset();
    }
  });

  function validateForm() {
    let isValid = true;

    // Validating Full Name
    const fullName = document.getElementById('fullName');
    if (fullName.value.trim() === '') {
      showError(fullName, 'Full Name is required');
      isValid = false;
    } else {
      removeError(fullName);
    }

    // Validating Email
    const email = document.getElementById('email');
    if (email.value.trim() === '') {
      showError(email, 'Email is required');
      isValid = false;
    } else if (!isValidEmail(email.value)) {
      showError(email, 'Please enter a valid email address');
      isValid = false;
    } else {
      removeError(email);
    }

    return isValid;
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    let errorElement = formGroup.querySelector('.error-message');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.classList.add('error');
  }

  function removeError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
      errorElement.remove();
    }
    
    input.classList.remove('error');
  }

  // Scroll Nav feature
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function highlightNavOnScroll() {
    let scrollPosition = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll);


  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 50,
          behavior: 'smooth'
        });
      }
    });
  });
  highlightNavOnScroll();
});