window.HRMS = window.HRMS || {};
(function (HRMS) {
  'use strict';

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE = /^[0-9+\-\s()]{7,18}$/;

  function validateField(field, value) {
    var v = value === undefined || value === null ? '' : value;
    var str = String(v).trim();

    if (field.required && str === '') return (field.label || field.name) + ' is required';
    if (str === '') return '';

    switch (field.type) {
      case 'email':
        return EMAIL.test(str) ? '' : 'Enter a valid email address';
      case 'tel':
        return PHONE.test(str) ? '' : 'Enter a valid phone number';
      case 'number':
        if (isNaN(Number(str))) return 'Must be a number';
        if (field.min !== undefined && Number(str) < field.min) return 'Minimum is ' + field.min;
        if (field.max !== undefined && Number(str) > field.max) return 'Maximum is ' + field.max;
        return '';
      case 'date':
        if (isNaN(new Date(str))) return 'Enter a valid date';
        return '';
      default:
        if (field.minLength && str.length < field.minLength) return 'Minimum ' + field.minLength + ' characters';
        if (field.maxLength && str.length > field.maxLength) return 'Maximum ' + field.maxLength + ' characters';
        if (field.pattern && !field.pattern.test(str)) return field.patternMessage || 'Invalid format';
        return '';
    }
  }

  function validate(schema, values) {
    var errors = {}, valid = true;
    schema.forEach(function (f) {
      var msg = validateField(f, values[f.name]);
      if (msg) { errors[f.name] = msg; valid = false; }
    });
    return { valid: valid, errors: errors };
  }

  HRMS.Validation = { validate: validate, validateField: validateField };
})(window.HRMS);