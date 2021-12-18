import React from "react";
import "../styles/confirmModal.scss";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";
import API from "../api";

function ConfirmModal() {
  const history = useHistory();
  const { token } = useSelector((state) => state.user);
  const { modals } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const resetData = React.useCallback(async () => {
    await API.get("/data/reset")
      .then((response) => {
        dispatch({ type: "SYNC_DATA", state: response.data.state });
        response && toast.success(response?.data.message);
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.data.message) {
            toast.error(
              error.response.data.message || "Something went wrong..."
            );
            console.error("resetData error.resonse.data", error.response.data);
          }
          toast.error("Unable resetting progress... ");
          console.error("resetData error.resonse", error.response);
        }
      });
  }, [token]); // eslint-disable-line

  function onClose() {
    dispatch({ type: "CONFIRM_MODAL_CLOSE" });
  }

  function onExited() {
    dispatch({ type: "CONFIRM_MODAL_RESET" });
  }

  function onConfirm() {
    if (modals.isLogOut) {
      dispatch({ type: "LOG_OUT" });
      localStorage.removeItem("coldwar");
      history.push("/login");
    } else if (modals.isReset) {
      resetData();
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
    <Modal
      className="confirmModal"
      show={modals.isShow}
      onHide={onClose}
      onExited={onExited}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
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
