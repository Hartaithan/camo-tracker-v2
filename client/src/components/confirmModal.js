import React from "react";
import "../styles/confirmModal.scss";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Modal } from "react-bootstrap";

function ConfirmModal() {
	const history = useHistory();
	const { modals } = useSelector((state) => state.app);
	const dispatch = useDispatch();
	console.log(modals);

	function onClose() {
		dispatch({ type: "CONFIRM_MODAL_CLOSE" });
	}

	function onExited() {
		dispatch({ type: "CONFIRM_MODAL_RESET" });
	}

	function onConfirm() {
		if (modals.isLogOut) {
			dispatch({ type: "LOG_OUT" });
			dispatch({ type: "RESET_ALL" });
			localStorage.removeItem("state");
			history.push("/login");
		} else if (modals.isReset) {
			dispatch({ type: "RESET_ALL" });
		}
		onClose();
	}

	function findTitle() {
		if (modals.isLogOut) {
			return "LOG OUT";
		} else if (modals.isReset) {
			return "RESET ALL PROGRESS";
		}
	}

	function findBody() {
		if (modals.isLogOut) {
			return "Are you sure you want to logout?";
		} else if (modals.isReset) {
			return "This will completely reset all of your progress. Are you sure?";
		}
	}

	return (
		<Modal className="confirmModal" show={modals.isShow} onHide={onClose} onExited={onExited} aria-labelledby="contained-modal-title-vcenter" centered>
			<Modal.Header>
				<Modal.Title>{findTitle()}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{findBody()}</Modal.Body>
			<Modal.Footer>
				<button onClick={onClose}>CANCEL</button>
				<button onClick={onConfirm}>CONFIRM</button>
			</Modal.Footer>
		</Modal>
	);
}

export default ConfirmModal;
