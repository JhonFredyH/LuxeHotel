export const validateField = (id, value) => {
  switch (id) {
    case "name":
      if (!value?.trim()) return "Please enter your full name";
      if (!/^[A-Za-z\s'-]+$/.test(value.trim()))
        return "Only letters, spaces, hyphens and apostrophes are allowed";
      if (value.trim().length < 3) return "Minimum 3 characters";
      return "";

    case "email":
      if (!value?.trim()) return "Email address is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
        return "Enter a valid email address";
      return "";

    case "subject":
      if (!value?.trim()) return "Please enter a subject";
      if (value.trim().length < 3) return "Minimum 3 characters";
      return "";

    case "message":
      if (!value?.trim()) return "Please enter your message";
      if (value.trim().length < 10) return "Message should be at least 10 characters";
      if (value.trim().length > 1000) return "Maximum 1000 characters";
      return "";

    // ── Register / Login fields ──────────────────────────
    case "firstName":
    case "lastName":
      if (!value?.trim()) return "This field is required.";
      if (value.trim().length < 2) return "Must be at least 2 characters.";
      return "";

    case "registerEmail":
      if (!value?.trim()) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
        return "Enter a valid email address.";
      return "";

    case "phone":
      if (!value?.trim()) return "Phone number is required.";
      if (!/^[\d\s+\-()]{6,20}$/.test(value.trim()))
        return "Enter a valid phone number.";
      return "";

    case "document":
      // Opcional — solo valida si tiene contenido
      if (value?.trim() && value.trim().length < 4)
        return "Document number must be at least 4 characters.";
      return "";

    case "registerPassword":
      if (!value?.trim()) return "Password is required.";
      if (value.length < 6) return "Password must be at least 6 characters.";
      return "";

    case "loginPassword":
      if (!value?.trim()) return "Password is required.";
      return "";

    default:
      return "";
  }
};

export const validateForm = (formData) => {
  const errors = {};
  Object.keys(formData).forEach((key) => {
    const error = validateField(key, formData[key]);
    if (error) errors[key] = error;
  });
  return errors;
};
