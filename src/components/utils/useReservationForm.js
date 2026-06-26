// useReservationForm.js
import { useState } from 'react';
import { validateField, validateForm, formatPhoneNumber, formatCardNumber, formatExpiry } from './formValidation';

export const useReservationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplicar formato en tiempo real según el campo
    switch (name) {
      case 'phone':
        formattedValue = formatPhoneNumber(value);
        break;
      case 'cardNumber':
        formattedValue = formatCardNumber(value);
        break;
      case 'expiry':
        formattedValue = formatExpiry(value);
        break;
      default:
        formattedValue = value;
    }

    // Actualizar el estado del formulario
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    // Validar en tiempo real después de la actualización
    setTimeout(() => {
      const error = validateField(name, formattedValue);
      setErrors((prev) => {
        if (error) {
          return { ...prev, [name]: error };
        } else {
          // Cambié 'removed' a '_removed' (con guión bajo al inicio)
          const { [name]: _removed, ...rest } = prev;
          return rest;
        }
      });
    }, 100);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    
    // Limpiar errores de tarjeta si se cambia a otro método de pago
    if (method !== 'card') {
      setErrors((prev) => {
        // Cambié los nombres de variables para que empiecen con guión bajo
        const { 
          cardholderName: _cardholderName, 
          cardNumber: _cardNumber, 
          expiry: _expiry, 
          cvc: _cvc, 
          ...rest 
        } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = (callback) => (e) => {
    e.preventDefault();
    
    const newErrors = validateForm(formData, paymentMethod);
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // Scroll al primer error
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      
      return;
    }

    callback?.(formData);
  };

  // Función para validar un campo específico (útil para onBlur)
  const validateFieldOnBlur = (name, value) => {
    const error = validateField(name, value);
    setErrors((prev) => {
      if (error) {
        return { ...prev, [name]: error };
      } else {
        // Cambié 'removed' a '_removed'
        const { [name]: _removed, ...rest } = prev;
        return rest;
      }
    });
  };

  return {
    formData,
    errors,
    paymentMethod,
    handleInputChange,
    handlePaymentMethodChange,
    handleSubmit,
    validateFieldOnBlur,
  };
};