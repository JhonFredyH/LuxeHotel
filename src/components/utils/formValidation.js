

export const validateField = (id, value) => {
  switch (id) {
   
    case "fullName":
      if (!value?.trim()) return "Full name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
        return "Name can only contain letters, spaces, hyphens and apostrophes";
      }
      return "";

    case "email":
      if (!value?.trim()) return "Email address is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        return "Enter a valid email address";
      }
      return "";

    case "phone": {
      if (!value?.trim()) return "Phone number is required";
    
      const phoneRegex = /^[+\d]?[1-9][\d]{0,15}$/;
      const cleanedPhone = value.replace(/[\s\-().]/g, "");
      if (!phoneRegex.test(cleanedPhone)) {
        return "Enter a valid phone number";
      }
      return "";
    }

    case "password":
      if (!value?.trim()) return "Password is required";
      if (value.length < 6) return "Minimum 6 characters";
      return "";

   
    case "cardholderName":
      if (!value?.trim()) return "Cardholder name is required";
      if (value.trim().length < 2) return "Enter full name as on card";
      return "";

    case "cardNumber": {
      if (!value?.trim()) return "Card number is required";
      const cleanedCard = value.replace(/\s/g, "");
      if (!/^\d{13,19}$/.test(cleanedCard)) {
        return "Card number must be 13-19 digits";
      }
      if (!luhnCheck(cleanedCard)) {
        return "Invalid card number";
      }
      return "";
    }

    case "expiry": {
      if (!value?.trim()) return "Expiry date is required";
      if (!/^\d{2}\/\d{2}$/.test(value.trim())) {
        return "Format must be MM/YY";
      }

      const [month, year] = value.split("/").map(Number);
      if (month < 1 || month > 12) return "Invalid month";

      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        return "Card has expired";
      }

      if (year > currentYear + 20) return "Invalid expiry year";
      return "";
    }

    case "cvc":
      if (!value?.trim()) return "CVC is required";
      if (!/^\d{3,4}$/.test(value.trim())) {
        return "CVC must be 3 or 4 digits";
      }
      return "";

    case "specialRequests":
      if (value?.trim().length > 500) {
        return "Maximum 500 characters";
      }
      return "";

    default:
      return "";
  }
};


export const validateForm = (formData, paymentMethod = "card") => {
  const errors = {};

  
  const guestFields = ["fullName", "email", "phone"];
  guestFields.forEach((key) => {
    const error = validateField(key, formData[key]);
    if (error) errors[key] = error;
  });

 
  if (paymentMethod === "card") {
    const cardFields = ["cardholderName", "cardNumber", "expiry", "cvc"];
    cardFields.forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });
  }

 
  if (formData.specialRequests) {
    const error = validateField("specialRequests", formData.specialRequests);
    if (error) errors.specialRequests = error;
  }

  return errors;
};


const luhnCheck = (cardNumber) => {
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};


export const formatPhoneNumber = (value) => {
  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6)
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  if (cleaned.length <= 10)
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;

  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
};

export const formatCardNumber = (value) => {
  const cleaned = value.replace(/\D/g, "");
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(" ") : cleaned;
};

export const formatExpiry = (value) => {
  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length >= 3) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};
