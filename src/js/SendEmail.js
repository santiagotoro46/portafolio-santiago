import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export const initSendEmail = () => {
    const form = document.getElementById("contact-form");
    const button = document.getElementById("send-button");
    const loading = document.getElementById("form-loading");

    if (!form || !button) return;

    const showToast = (message,type = "info") => {
    const colors = {
    success: "linear-gradient(90deg, #00f2ff, #6b00ff)",
    error: "linear-gradient(90deg, #ff3b3b, #ff0066)",
    info: "linear-gradient(90deg, #0055ff, #00ccff)",
    }

    Toastify({
        text: message,
        duration: 5500,
        gravity: "top",
        position: "right",
        style: {
            background: colors[type],
            borderRadius: "5px",
            fontFamily: "Orbitron, sans-serif",
            boxShadow: "0 0 15px rgba(0, 242, 255, 0.6)",
            color: "#F2EDED",
        },
    }).showToast();
}

    // VALIDACIONES

    const showError = (input, message) => {
        let errorEl = input.parentElement.querySelector(".error-msg");
        if (!errorEl) {
            errorEl = document.createElement("p");
            errorEl.className = "error-msg text-red-400 text-sm mt-2";
            input.parentElement.appendChild(errorEl);
        }
        errorEl.textContent = message;
        input.classList.add("border-red-500");
    };

    const clearError = (input) => {
        const errorEl = input.parentElement.querySelector(".error-msg");
        if (errorEl) errorEl.remove();
        input.classList.remove("border-red-500");
    };

    const validateField = (input) => {
        const id = input.id;
        const value = input.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\+?\d{0,3}?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}$/;

        clearError(input);

        if (id === "name") {
            if (!value) return showError(input, "El nombre es obligatorio.");
            if (value.length < 3)
                return showError(input, "El nombre debe tener al menos 3 caracteres.");
        }

        if(id === "phone"){
            if(!value) return showError(input, "El número de celular es obligatorio.");
            if(!phoneRegex.test(value)) return showError(input, "Por favor ingresa un número de celular válido.");
        }

        if (id === "email_id") {
            if (!value) return showError(input, "El correo electrónico es obligatorio.");
            if (!emailRegex.test(value)) return showError(input, "Por favor ingresa un correo válido.");
        }

        if (id === "description") {
            if (!value) return showError(input, "La descripción no puede estar vacía.");
            if (value.length < 10)
                return showError(
                    input,
                    "Describe mejor tu proyecto (mínimo 10 caracteres)."
                );
        }
    };

    const validateForm = () => {
        let isValid = true;
        form.querySelectorAll("input, textarea").forEach((input) => {
            validateField(input);
            if (input.parentElement.querySelector(".error-msg")) isValid = false;
        });
        return isValid;
    };

    // EVENTOS EN VIVO

    form.querySelectorAll("input, textarea").forEach((input) => {
        // Mientras escribes
        input.addEventListener("input", () => {
            validateField(input);
        });

        // Cuando sales del campo
        input.addEventListener("blur", () => {
            validateField(input);
        });
    });

    //  CONTADOR DE CARACTERES (DESCRIPCIÓN)

    const description = form.querySelector("#description");
    const counter = document.getElementById("char-counter");

    if (description && counter) {
        const updateCounter = () => {
            const length = description.value.length;
            counter.textContent = `${length}/500`;

            if (length > 450) {
                counter.classList.add("text-red-400");
            } else {
                counter.classList.remove("text-red-400");
            }
        };

        description.addEventListener("input", updateCounter);
        updateCounter();
    }

    // ENVÍO DEL FORMULARIO

    button.addEventListener("click", async () => {
        if (!validateForm()) return;

        const formData = new FormData(form);
        button.disabled = true;
        loading.classList.remove("hidden");

        button.classList.add("opacity-0", "pointer-events-none", "transition-all", "duration-300");
        loading.classList.remove("hidden");

        try {
            const response = await fetch("/api/send-email", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
                showToast("Error al enviar el mensaje. Inténtalo de nuevo.", "error");
                throw new Error(result.error || "Error en el servidor");
            }             

            showToast("Mensaje enviado con éxito.", "success");
            form.reset();
            const counter = document.getElementById("char-counter");
            if (counter) counter.textContent = "0/500";
        } catch (error) {
            showToast("Ocurrio un error inesperado. Inténtalo de nuevo.", "error");
            console.error(error);
        } finally {
            loading.classList.add("hidden");
            button.classList.remove("opacity-0", "pointer-events-none");
        }
    });
};
