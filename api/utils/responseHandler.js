export const handleResponse = (res, { success, message, data = null }, successCode = 200, errorCode = 400) => {
    if (success) {
        return res.status(successCode).json({
            success: true,
            message,
            data
        });
    } else {
        return res.status(errorCode).json({
            success: false,
            message
        });
    }
};

// Esto considerando el manejo de errores para los modelos y con la estandarizacion 
// de {success: true o false, messsage: "causa del error o éxito"}