"use strict";

/* ============================================
   MODERN ADMIN UPLOAD FORM FUNCTIONALITY
   ============================================ */

// Utility: Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

// Utility: Validate file
function validateFile(file) {
  const maxSize = 10 * 1024 * 1024; // 10 MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (file.size > maxSize) {
    alert(
      `File size exceeds 10 MB. Current size: ${formatFileSize(file.size)}`,
    );
    return false;
  }

  if (!allowedTypes.includes(file.type)) {
    alert("Invalid file type. Please upload JPG, PNG, or WEBP images.");
    return false;
  }

  return true;
}

/* ============================================
   DRAG & DROP AND FILE UPLOAD SETUP
   ============================================ */

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const idleState = document.getElementById("idleState");
const previewBox = document.getElementById("previewBox");
const previewImg = document.getElementById("previewImg");
const previewName = document.getElementById("previewName");
const previewSize = document.getElementById("previewSize");
const removeBtn = document.getElementById("removeBtn");
const clearBtn = document.getElementById("clearBtn");
const uploadForm = document.getElementById("uploadForm");

// Prevent default drag behaviors
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Highlight drop zone when dragging
["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, () => {
    dropZone.classList.add("active");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, () => {
    dropZone.classList.remove("active");
  });
});

// Handle dropped files
dropZone.addEventListener("drop", (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
});

// Handle file input change
fileInput.addEventListener("change", (e) => {
  handleFiles(e.target.files);
});

// Handle file selection
function handleFiles(files) {
  if (files.length === 0) return;

  const file = files[0];

  if (!validateFile(file)) {
    fileInput.value = "";
    return;
  }

  showPreview(file);
}

// Show file preview
function showPreview(file) {
  const reader = new FileReader();

  reader.onload = (e) => {
    previewImg.src = e.target.result;
    previewName.textContent = file.name;
    previewSize.textContent = formatFileSize(file.size);

    idleState.style.display = "none";
    previewBox.classList.add("active");
    dropZone.classList.add("active");
  };

  reader.readAsDataURL(file);
}

// Clear selected file
function clearFile() {
  fileInput.value = "";
  previewImg.src = "";
  previewName.textContent = "";
  previewSize.textContent = "";

  idleState.style.display = "flex";
  previewBox.classList.remove("active");
  dropZone.classList.remove("active");
}

// Remove button handler
removeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  clearFile();
});

// Clear button handler
clearBtn.addEventListener("click", (e) => {
  e.preventDefault();
  clearFile();
  document.querySelectorAll('input[name="slot"]').forEach((radio) => {
    radio.checked = false;
  });
});

/* ============================================
   FORM SUBMISSION HANDLER
   ============================================ */

uploadForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Validate slot selection
  const selectedSlot = document.querySelector('input[name="slot"]:checked');
  if (!selectedSlot) {
    alert("Please select a time slot");
    return;
  }

  // Validate file selection
  if (!fileInput.files || fileInput.files.length === 0) {
    alert("Please select an image to upload");
    return;
  }

  // Show loading state
  const submitBtn = uploadForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20"/></svg> Uploading...';

  // Submit form
  setTimeout(() => {
    uploadForm.submit();
  }, 300);
});

/* ============================================
   TIME SLOT SELECTION STYLING
   ============================================ */

document.querySelectorAll(".slot-option").forEach((slot) => {
  slot.addEventListener("change", function () {
    // Visual feedback is handled by CSS :checked state
    console.log("Selected slot:", this.querySelector("input").value);
  });
});

/* ============================================
   CLICK ON DROP ZONE TO TRIGGER FILE INPUT
   ============================================ */

idleState.addEventListener("click", () => {
  fileInput.click();
});

/* ============================================
   ANIMATIONS
   ============================================ */

const style = document.createElement("style");
style.textContent = `
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    
    .btn-primary:disabled {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);
