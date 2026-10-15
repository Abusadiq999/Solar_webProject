"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");
const enquiryForm = document.querySelector("#enquiry-form");
const formFeedback = document.querySelector("#form-feedback");
const requiredFields = ["full-name", "phone", "email", "service", "location", "message"];

function closeNavigation() {
  if (!menuToggle || !primaryNavigation) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  primaryNavigation.classList.remove("is-open");
}

if (menuToggle && primaryNavigation) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
    primaryNavigation.classList.toggle("is-open", !isExpanded);
  });

  primaryNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNavigation();
      menuToggle.focus();
    }
  });
}

function setFieldError(field, message) {
  const error = document.querySelector(`#${field.id}-error`);
  field.setAttribute("aria-invalid", String(Boolean(message)));
  if (error) error.textContent = message;
}

function validateForm() {
  let isValid = true;
  const values = {};

  requiredFields.forEach((id) => {
    const field = document.getElementById(id);
    if (!field) return;
    const value = field.value.trim();
    values[id] = value;
    let message = "";

    if (!value) {
      message = "Please complete this field.";
    } else if (id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = "Enter a valid email address.";
    } else if (id === "phone" && value.replace(/\D/g, "").length < 7) {
      message = "Enter a valid phone number.";
    }

    setFieldError(field, message);
    if (message) isValid = false;
  });

  return { isValid, values };
}

if (enquiryForm && formFeedback) {
  enquiryForm.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => setFieldError(field, ""));
    field.addEventListener("change", () => setFieldError(field, ""));
  });

  enquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const { isValid } = validateForm();
    formFeedback.className = "form-feedback is-visible";

    if (!isValid) {
      formFeedback.classList.add("is-error");
      formFeedback.textContent = "Please check the highlighted fields and try again. This demo form does not send enquiries.";
      const firstInvalidField = enquiryForm.querySelector('[aria-invalid="true"]');
      firstInvalidField?.focus();
      return;
    }

    formFeedback.classList.add("is-success");
    formFeedback.textContent = "Thanks — your details look complete. This is a front-end demonstration, so your enquiry has not been sent. Please contact the company directly using the details on this page.";
    formFeedback.focus();
  });
}

const copyrightYear = document.querySelector("#copyright-year");
if (copyrightYear) copyrightYear.textContent = String(new Date().getFullYear());
