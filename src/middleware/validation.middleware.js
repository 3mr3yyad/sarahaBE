export const validation = (schema) => {

    return (req, res, next) => {

        const { value, error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            let errorMessages = error.details.map((error) => error.message).join("\n");

            throw new Error(errorMessages, { cause: 400 });
        }

        next();
    }
}
