  const validate = (schema) => (req, res, next) => {
    const options = { abortEarly: false };
    const { error, value } = schema.validate(req.body, options);
    // console.log("")

    if (error) {
        const validationErrors = error.details.map((detail) => detail.message);
        const err = new Error('Validation failed');
        err.status = 400;
        err.details = validationErrors;
        return res.status(400).json({ err });
    }
    next();
};

module.exports = validate;
  