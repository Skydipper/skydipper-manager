import React, { useState, useReducer } from 'react';
import PropTypes from 'prop-types';

// components
import Navigation from 'components/form/Navigation';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Spinner from 'components/ui/Spinner';
import FileImage from 'components/form/FileImage';

// services
import UserService from 'services/UserService';

export const FORM_ELEMENTS = {
  elements: {},
  validate() {
    const { elements } = this;
    const res = Object.keys(elements).map(k => elements[k].validate());
    return res.every(valid => valid);
  },
};

const fetchReducer = (state, action) => {
  switch (action.type) {
    case 'FORM_VALID':
      return { ...state, formInvalid: false };
    case 'FORM_INVALID':
      return { ...state, formInvalid: true };
    case 'FORM_SUBMIT_INIT':
      return {
        ...state,
        formLoading: true,
        formSuccess: false,
        formError: false,
        formInvalid: false,
      };
    case 'FORM_SUBMIT_SUCCESS':
      return { ...state, formLoading: false, formSuccess: true };
    case 'FORM_SUBMIT_FAILURE':
      return { ...state, formLoading: false, formError: true };
    case 'FORM_UPDATE':
      return { ...state, form: { ...state.form, ...action.payload } };
    default:
      return state;
  }
};

const Profile = ({ user, setUser }) => {
  /**
   * @type {[any, (action: any) => void]}
   */
  const [state, dispatch] = useReducer(fetchReducer, {
    form: { ...user },
    formLoading: false,
    formInvalid: false,
    formSuccess: false,
    formError: false,
  });

  const [step, setStep] = useState(1);
  const [stepsCount] = useState(1);

  const userService = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });

  const onSubmit = e => {
    e.preventDefault();

    // Validate the form
    const valid = FORM_ELEMENTS.validate();

    if (!valid) {
      dispatch({ type: 'FORM_INVALID' });
    } else if (step !== stepsCount) {
      dispatch({ type: 'FORM_VALID' });
      setStep(s => s + 1);
    } else {
      dispatch({ type: 'FORM_SUBMIT_INIT' });

      const userObj = {
        name: state.form.name,
        photo: state.form.photo || '',
      };

      fetch('/update-user', {
        method: 'POST',
        body: JSON.stringify({ userObj, token: user.token }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then(response => response.json())
        .then(({ data }) => setUser(data))
        .then(() => dispatch({ type: 'FORM_SUBMIT_SUCCESS' }))
        .catch(() => dispatch({ type: 'FORM_SUBMIT_FAILURE' }));
    }
  };

  const onChange = newForm => dispatch({ type: 'FORM_UPDATE', payload: newForm });

  const onStepChange = newStep => setStep(newStep);

  return (
    <div className="c-profile-edit-profile">
      <div className="row">
        <div className="column small-12">
          <form className="c-form" onSubmit={onSubmit} noValidate>
            <Spinner isLoading={state.formLoading} className="-light" />

            {state.formError && (
              <div className="callout alert small">Unable to save the profile</div>
            )}

            {state.formInvalid && (
              <div className="callout alert small">
                Fill all the required fields or correct the invalid values
              </div>
            )}

            {state.formSuccess && (
              <div className="callout success small">The information has been saved.</div>
            )}

            <fieldset className="c-field-container">
              <Field
                ref={c => {
                  if (c) FORM_ELEMENTS.elements.name = c;
                }}
                onChange={name => onChange({ name })}
                validations={['required']}
                properties={{
                  name: 'name',
                  label: 'Name',
                  type: 'text',
                  required: true,
                  default: state.form.name,
                }}
              >
                {Input}
              </Field>

              <Field
                ref={c => {
                  if (c) FORM_ELEMENTS.elements.email = c;
                }}
                onChange={email => onChange({ email })}
                properties={{
                  name: 'email',
                  label: 'Email',
                  type: 'email',
                  required: true,
                  default: state.form.email,
                  disabled: true,
                }}
              >
                {Input}
              </Field>

              <div className="c-field-row">
                <div className="row l-row">
                  <div className="column small-12 medium-2">
                    <Field
                      ref={c => {
                        if (c) FORM_ELEMENTS.elements.photo = c;
                      }}
                      onChange={photo => onChange({ photo })}
                      className="-fluid"
                      mode="url"
                      getUrlImage={file => userService.uploadPhoto(file, user)}
                      properties={{
                        name: 'photo',
                        label: 'Photo',
                        placeholder: 'Browse file',
                        baseUrl: process.env.STATIC_SERVER_URL,
                        default: state.form.photo,
                      }}
                    >
                      {FileImage}
                    </Field>
                  </div>
                </div>
              </div>
            </fieldset>

            <Navigation
              step={step}
              stepLength={stepsCount}
              submitting={state.formLoading}
              hideCancel
              onStepChange={onStepChange}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default Profile;
