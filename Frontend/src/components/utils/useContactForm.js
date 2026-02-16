// useContactForm.js
import { useState } from 'react';
import { validateField, validateForm } from './contactValidation';

export const useContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({}); // Para manejar si el campo fue tocado

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Solo validar si el campo ha sido tocado
    if (touched[id]) {
      const error = validateField(id, value);
      setErrors((prev) => ({
        ...prev,
        [id]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    
    // Marcar el campo como tocado
    setTouched((prev) => ({
      ...prev,
      [id]: true,
    }));

    // Validar el campo
    const error = validateField(id, value);
    setErrors((prev) => ({
      ...prev,
      [id]: error,
    }));
  };

  const handleSubmit = (callback) => (e) => {
    e.preventDefault();

    // Marcar todos los campos como tocados antes de validar
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    const newErrors = validateForm(formData);
    
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

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setErrors({});
    setTouched({});
  };

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
};