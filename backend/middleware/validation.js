const { body, validationResult } = require('express-validator');

const validateRegistration = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('college').trim().notEmpty().withMessage('College is required'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('year').trim().notEmpty().withMessage('Year is required'),
    body('isIEEEMember').optional().isBoolean(),
    body('ieeeId').optional().trim(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateRegistration };
