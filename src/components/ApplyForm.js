import React, { useState } from 'react';
import { MEMBER_TYPES } from '../hooks/useMemberCard';

/**
 * Initial form field values — name is pre-filled from the LINE profile.
 */
const initialState = (profile) => ({
  name:       profile?.displayName || '',
  email:      '',
  phone:      '',
  memberType: 'standard',
});

/**
 * Validate form fields and return an error map.
 * Returns an empty object when all fields are valid.
 */
const validate = ({ name, email, phone }) => {
  const errs = {};
  if (!name.trim())  errs.name  = 'Full name is required.';
  if (!email.trim()) errs.email = 'Email address is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errs.email = 'Please enter a valid email address.';
  if (!phone.trim()) errs.phone = 'Phone number is required.';
  else if (!/^\+?[\d\s\-()]{7,15}$/.test(phone))
    errs.phone = 'Please enter a valid phone number.';
  return errs;
};

/**
 * ApplyForm - Membership card application form.
 *
 * Pre-fills the name field from the user's LINE profile. Performs client-side
 * validation before calling onSubmit. Shows a spinner while the submission is
 * in progress.
 *
 * @param {object}   profile    - LINE profile (used to pre-fill the name)
 * @param {boolean}  isLoading  - True while the parent is processing the request
 * @param {function} onSubmit   - Called with validated form data on success
 * @param {function} onCancel   - Called when the user dismisses the form
 */
const ApplyForm = ({ profile, isLoading, onSubmit, onCancel }) => {
  const [form,   setForm]   = useState(() => initialState(profile));
  const [errors, setErrors] = useState({});

  /** Update a single field and clear its error on change. */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  /** Validate then delegate to the parent handler. */
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="apply-section">
      <div className="apply-header">
        <h2 className="section-title">Apply for Membership</h2>
        <p className="section-desc">
          Fill in your details to receive a digital membership card.
        </p>
      </div>

      {/* LINE profile preview at the top of the form */}
      {profile && (
        <div className="apply-profile-preview">
          <img
            className="apply-avatar"
            src={profile.pictureUrl}
            alt={profile.displayName}
          />
          <span className="apply-line-name">{profile.displayName}</span>
          <span className="badge badge-line">LINE Connected</span>
        </div>
      )}

      <form className="apply-form" onSubmit={handleSubmit} noValidate>
        {/* Full name */}
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full Name *</label>
          <input
            id="name"
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            autoComplete="name"
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        {/* Email address */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address *</label>
          <input
            id="email"
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        {/* Phone number */}
        <div className="form-group">
          <label className="form-label" htmlFor="phone">Phone Number *</label>
          <input
            id="phone"
            className={`form-input ${errors.phone ? 'input-error' : ''}`}
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+1 555 000 0000"
            autoComplete="tel"
          />
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>

        {/* Membership type selector */}
        <div className="form-group">
          <label className="form-label">Membership Type *</label>
          <div className="type-selector">
            {Object.entries(MEMBER_TYPES).map(([key, cfg]) => (
              <label
                key={key}
                className={`type-option ${form.memberType === key ? 'type-option-selected' : ''}`}
                style={form.memberType === key ? { borderColor: cfg.color, backgroundColor: cfg.color + '18' } : {}}
              >
                <input
                  type="radio"
                  name="memberType"
                  value={key}
                  checked={form.memberType === key}
                  onChange={handleChange}
                  hidden
                />
                {/* Coloured dot indicator */}
                <span className="type-dot" style={{ backgroundColor: cfg.color }} />
                <span className="type-label">{cfg.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Terms acknowledgement */}
        <p className="apply-terms">
          By applying, you agree to our Terms of Service and Privacy Policy.
        </p>

        {/* Form actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="btn-spinner" />
                Applying…
              </>
            ) : (
              'Apply Now'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyForm;
