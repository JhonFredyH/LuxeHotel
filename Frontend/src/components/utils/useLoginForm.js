import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateField } from "./formValidation";
import authService from "../../services/authService";

export const useLoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));

    // Limpiar error de API cuando el usuario empiece a escribir
    if (apiError) setApiError("");
  };

  const handleSubmit = () => async (e) => {
    // ← Quitar userType
    e.preventDefault();

    // Validar solo campos de login
    const newErrors = {};
    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Iniciar loading
    setIsLoading(true);
    setApiError("");

    try {
      // Llamar al servicio de login
      const result = await authService.login(formData.email, formData.password);

      if (result.success) {
        // Login exitoso
        console.log("Login exitoso:", result.user);

        // Redirigir según el rol del usuario
        if (result.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        // Login falló
        setApiError(result.error);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setApiError("Error de conexión. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    apiError,
    handleChange,
    handleSubmit,
  };
};
