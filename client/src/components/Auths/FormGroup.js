import React, { useEffect, useState } from "react";
import styled from "styled-components";
// import components
import { Input, Button, Label } from "reactstrap";

const FormGroup = (props) => {
	const [touched, setTouched] = useState(false);

	const validClass = () => {
		if (props.error && (touched || props.submitted)) {
			return "is-invalid";
		} else {
			return props.value.length > 0 ? "is-valid" : null;
		}
	};

	const isFocused = () => {};

	return (
		<Container>
			<StyledLabel for={props.first_name}>{props.label}</StyledLabel>
			<Input
				name={props.name}
				required={props.required}
				type={props.type}
				onChange={props.onChange}
				className={validClass()}
				onFocus={() => setTouched(true)}
			/>
			{props.error && (
				<Error className="invalid-feedback">{props.error}</Error>
			)}
		</Container>
	);
};
FormGroup.propTypes = {};

export default FormGroup;

const Container = styled.div`
	margin: 1em;
`;
const StyledLabel = styled(Label)``;
const Error = styled.div``;
