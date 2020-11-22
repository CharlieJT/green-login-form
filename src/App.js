import React, { useState, useRef } from 'react';
import Logo from './logos/logo-r.svg';
import classes from './App.module.scss';
import Modal from './Components/UI/Modal/Modal';
import Input from './Components/UI/Input/Input';
import Button from './Components/UI/Button/Button';
import Aux from './hoc/ReactAux';

const App = () => {

	// Input Referrences
	const inputRef = useRef();
	const checkRef = useRef();

	// State
	const [modalOpen, setModalOpen] = useState(false);
	const [emailStateValue, setEmailStateValue] = useState('');
	const [emailValidity, setEmailValidity] = useState(false);
	const [validForm, setValidForm] = useState(false);
	const [touched, setTouched] = useState(false);
	const [validationPrompt, setValidationPrompt] = useState(false);
	const [rememberedDevice, setRememberedDevice] = useState(false);
	const [submitForm, setSubmitForm] = useState({
		submissionState: false,
		emailValue: '',
		deviceRemembered: false
	});

	// All state will be set back to their default values
	const initialStateHandler = () => {
		setModalOpen(false);
		setEmailStateValue('');
		setValidForm(false);
		setTouched(false);
		setRememberedDevice(false);
		setValidationPrompt(false);
		inputRef.current.blur();
		checkRef.current.checked = false;
	}

	// Modal state set to true which will open modal & will focus in on the email input field
	const openModalHandler = () => {
		setModalOpen(true);
		inputRef.current.focus();
	}

	// Modal state set to false which will close modal & then set all values back to their default value in state
	const closeModalHandler = e => initialStateHandler();

	// Form submission handler will set state back to initial state & set to show a form has been submitted sucessfully
	const formSubmitHandler = (e) => {
		e.preventDefault();
		const currentEmailValue = emailStateValue;
		const currentRememberedDevice = rememberedDevice;
		if (emailStateValue.length > 0) {
			setSubmitForm({
				submissionState: true,
				emailValue: currentEmailValue,
				deviceRemembered: currentRememberedDevice
			});
			initialStateHandler();
		}
	}

	// Adding validation prompt to signal to the user that they have incorrect information, this will switch back to true again when
	// it finds a valid input for the email field
	const formCheckValidityHandler = () => !validForm && setValidationPrompt(true);

	// Form submission state is set back to false so form can be done again.
	const goBackHandler = () => {
		setSubmitForm({
			submissionState: false,
			emailValue: '',
			deviceRemembered: false
		});
	}

	// Checking validity of form to ensure that email field is a valid field before submission
	// It checks which rule is applied & then checks the value against pattern to see if the form is an acceptable email
	// It then sets the isValid as the result & is returned.
	// This is already set up for the use of multiple input fields by setting isValid to true & setting to false when finding an invalid input, all the rest
	// of the input values will then be false because the form is invalid.
	const checkValidity = (value, rules) => {
		let isValid = true;
		if (rules.isEmail) {
			const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
			setEmailValidity(pattern.test(value));
			isValid = pattern.test(value) && isValid;
		}
		return isValid;
	}

	// Setting value of the input in state & checking validity of input field
	const inputChangedHandler = (event, inputIdentifier) => {
		const inputText = event.target.value;
		const validityCheck = checkValidity(inputText, inputIdentifier);
		setTouched(inputText ? true : false);
		setValidForm(validityCheck);
		validityCheck && setValidationPrompt(false);
		setEmailStateValue(inputText);
	}

	// Setting value of the checkbox in state, no validity taking place because not required
	const rememberedDeviceChangedHandler = (event) => {
		const currentDeviceState = event.target.checked;
		setRememberedDevice(currentDeviceState);
	}

	return (
		<div className={classes.App}>
			<Modal show={modalOpen} modalClose={closeModalHandler}>
				<img className={classes.MainLogo} src={Logo} alt="Main Logo" />
				<h2 className={classes.LoginFormHeading}>Operations Studio</h2>
				<p className={classes.MutedText}>Please enter your email below</p>
				<form className={classes.LoginForm} onSubmit={formSubmitHandler} onKeyPress={e => {
					(e.which === 13  && emailStateValue.length > 0) && formCheckValidityHandler(e, { isEmail: true })}
				}>
					<Input
						label="Email Address"
						elementType="input"
						inputRef={inputRef}
						elementConfig={{ type: "email" }}
						value={emailStateValue}
						invalid={!emailValidity}
						shouldValidate={true}
						touched={touched && validationPrompt}
						changed={(e) => inputChangedHandler(e, { isEmail: true })} />
					<div className={classes.RememberMeCheckbox}>
						<label className={classes.CheckboxContainer}>
							<input ref={checkRef} type="checkbox" onChange={rememberedDeviceChangedHandler} />
							<span className={classes.Checkmark}></span>
							<span>Remember this device</span>
						</label>
					</div>
					<Button btnType="Success" disabled={(!validForm || /^\s*$/.test(validForm)) || emailStateValue.length < 1}>Sign In</Button>
				</form>
			</Modal>
			<div className={classes.InputEnteredText}>
				{!submitForm.submissionState ?
					<Aux>
						<h3>Click to Sign In</h3>
						<Button clicked={openModalHandler} btnType="General">Sign In</Button>
					</Aux> :
					<Aux>
						<h3>Successful Sign In so form must have been valid</h3>
						<ul className={classes.FormSubmissionList}>
							<li>Email: <b>{submitForm.emailValue}</b></li>
							<li>Remembered: <b>{submitForm.deviceRemembered ? "Yes" : "No"}</b></li>
						</ul>
						<Button clicked={goBackHandler} btnType="General">Go Back</Button>
					</Aux>
				}
			</div>
		</div>
	);
}

export default App;