/* ==========================================================================
   AUTHENTICATION PAGES JAVASCRIPT (js/auth.js)
   Pencil Tip Academy of Art - Premium client-side validation and interactive flows
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initPasswordToggle();
  initFormValidation();
});

/**
 * Password Visibility Toggle
 */
function initPasswordToggle() {
  const toggleButtons = document.querySelectorAll(".pwd-toggle-btn");

  toggleButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = button.getAttribute("aria-controls");
      const passwordInput = document.getElementById(targetId);

      if (!passwordInput) return;

      const isPassword = passwordInput.getAttribute("type") === "password";
      
      // Toggle Type
      passwordInput.setAttribute("type", isPassword ? "text" : "password");
      
      // Update ARIA expanded state
      button.setAttribute("aria-expanded", isPassword ? "true" : "false");

      // Toggle Eye Icon SVG Paths
      const eyeOpenPath = button.querySelector(".eye-open");
      const eyeClosedPath = button.querySelector(".eye-closed");

      if (isPassword) {
        if (eyeOpenPath) eyeOpenPath.style.display = "none";
        if (eyeClosedPath) eyeClosedPath.style.display = "block";
      } else {
        if (eyeOpenPath) eyeOpenPath.style.display = "block";
        if (eyeClosedPath) eyeClosedPath.style.display = "none";
      }
    });
  });
}

/**
 * Form Validations (Login & Signup)
 */
function initFormValidation() {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  // Regex Patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[0-9]{10}$/;

  // ── LOGIN FORM VALIDATION ───────────────────────────────────────────────
  if (loginForm) {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    // Real-time listener
    emailInput.addEventListener("input", () => validateField(emailInput, emailRegex.test(emailInput.value), "Please enter a valid email address."));
    passwordInput.addEventListener("input", () => validateField(passwordInput, passwordInput.value.length > 0, "Password is required."));

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const isEmailValid = validateField(emailInput, emailRegex.test(emailInput.value), "Please enter a valid email address.");
      const isPasswordValid = validateField(passwordInput, passwordInput.value.length > 0, "Password is required.");

      if (isEmailValid && isPasswordValid) {
        handleFormSubmit(loginForm, "Logging in...");
      }
    });
  }

  // ── SIGNUP FORM VALIDATION ──────────────────────────────────────────────
  if (signupForm) {
    const nameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const mobileInput = document.getElementById("mobileNumber");
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirmPassword");
    const termsCheck = document.getElementById("terms");

    // Real-time strength meter elements
    const strengthProgress = document.querySelector(".pwd-strength-progress");
    const strengthText = document.querySelector(".pwd-strength-text");

    // Inputs real-time listener
    nameInput.addEventListener("input", () => {
      validateField(nameInput, nameInput.value.trim().length >= 2, "Full name must be at least 2 characters.");
    });

    emailInput.addEventListener("input", () => {
      validateField(emailInput, emailRegex.test(emailInput.value), "Please enter a valid email address.");
    });

    mobileInput.addEventListener("input", () => {
      validateField(mobileInput, mobileRegex.test(mobileInput.value), "Mobile number must be exactly 10 digits.");
    });

    passwordInput.addEventListener("input", () => {
      const pwd = passwordInput.value;
      const strength = checkPasswordStrength(pwd);
      updateStrengthMeter(strength, strengthProgress, strengthText);
      validateField(passwordInput, strength.score >= 3, "Password should be stronger (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special).");
      
      // Re-validate confirm field if user modified password
      if (confirmInput.value.length > 0) {
        validateField(confirmInput, confirmInput.value === pwd, "Passwords do not match.");
      }
    });

    confirmInput.addEventListener("input", () => {
      validateField(confirmInput, confirmInput.value === passwordInput.value, "Passwords do not match.");
    });

    termsCheck.addEventListener("change", () => {
      validateCheckbox(termsCheck, termsCheck.checked, "You must agree to the Terms & Conditions.");
    });

    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, nameInput.value.trim().length >= 2, "Full name must be at least 2 characters.");
      const isEmailValid = validateField(emailInput, emailRegex.test(emailInput.value), "Please enter a valid email address.");
      const isMobileValid = validateField(mobileInput, mobileRegex.test(mobileInput.value), "Mobile number must be exactly 10 digits.");
      
      const pwdStrength = checkPasswordStrength(passwordInput.value);
      const isPasswordValid = validateField(passwordInput, pwdStrength.score >= 3, "Password must be stronger.");
      const isConfirmValid = validateField(confirmInput, confirmInput.value === passwordInput.value, "Passwords do not match.");
      const isTermsValid = validateCheckbox(termsCheck, termsCheck.checked, "You must agree to the Terms & Conditions.");

      if (isNameValid && isEmailValid && isMobileValid && isPasswordValid && isConfirmValid && isTermsValid) {
        handleFormSubmit(signupForm, "Creating account...");
      }
    });
  }
}

/**
 * Validate Single Text Field Helper
 */
function validateField(inputElement, isValidCondition, errorMessage) {
  const group = inputElement.closest(".auth-form-group");
  if (!group) return isValidCondition;

  const errorContainer = group.querySelector(".auth-error-msg");

  if (!isValidCondition) {
    inputElement.classList.add("is-invalid");
    inputElement.setAttribute("aria-invalid", "true");
    if (errorContainer) {
      errorContainer.textContent = errorMessage;
      errorContainer.style.opacity = "1";
    }
    return false;
  } else {
    inputElement.classList.remove("is-invalid");
    inputElement.setAttribute("aria-invalid", "false");
    if (errorContainer) {
      errorContainer.textContent = "";
      errorContainer.style.opacity = "0";
    }
    return true;
  }
}

/**
 * Validate Checkbox Helper
 */
function validateCheckbox(checkboxElement, isValidCondition, errorMessage) {
  const group = checkboxElement.closest(".auth-terms-group");
  if (!group) return isValidCondition;

  const errorContainer = group.querySelector(".auth-error-msg");

  if (!isValidCondition) {
    if (errorContainer) {
      errorContainer.textContent = errorMessage;
      errorContainer.style.opacity = "1";
    }
    return false;
  } else {
    if (errorContainer) {
      errorContainer.textContent = "";
      errorContainer.style.opacity = "0";
    }
    return true;
  }
}

/**
 * Check Password Strength
 */
function checkPasswordStrength(pwd) {
  let score = 0;
  let feedback = "Very Weak";
  let color = "#D45D3B"; // Accent/brand color

  if (pwd.length >= 8) score += 1;
  if (/[A-Z]/.test(pwd)) score += 1;
  if (/[a-z]/.test(pwd)) score += 1;
  if (/[0-9]/.test(pwd)) score += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

  // Re-adjust score mapping
  if (pwd.length === 0) {
    score = 0;
    feedback = "Too Short";
    color = "rgba(30, 27, 24, 0.06)";
  } else if (score <= 2) {
    feedback = "Weak";
    color = "#E07A5F"; // Light warm orange
  } else if (score === 3 || score === 4) {
    feedback = "Good";
    color = "#F4A261"; // Mustard orange
  } else if (score === 5) {
    feedback = "Strong";
    color = "#81B29A"; // Sage green (from site details/accents)
  }

  return { score, feedback, color };
}

/**
 * Update Strength Meter UI
 */
function updateStrengthMeter(strength, progressEl, textEl) {
  if (!progressEl || !textEl) return;

  const pct = (strength.score / 5) * 100;
  progressEl.style.width = `${pct}%`;
  progressEl.style.backgroundColor = strength.color;
  textEl.textContent = strength.feedback;
  textEl.style.color = strength.score === 0 ? "var(--text-light)" : strength.color;
}

/**
 * Handle form submit loader & redirect animation
 */
function handleFormSubmit(formElement, loadingText) {
  const submitBtn = formElement.querySelector(".auth-btn");
  const btnTextSpan = submitBtn.querySelector(".auth-btn-text");
  
  // Enter loading state
  submitBtn.classList.add("is-loading");
  submitBtn.setAttribute("disabled", "disabled");

  // Disable all inputs
  const inputs = formElement.querySelectorAll("input");
  inputs.forEach(input => input.setAttribute("disabled", "disabled"));

  // Mock API integration loader
  console.log("Preparing backend authentication integration...");
  
  setTimeout(() => {
    // Redirect success to home page
    window.location.href = "index.html";
  }, 2200);
}
