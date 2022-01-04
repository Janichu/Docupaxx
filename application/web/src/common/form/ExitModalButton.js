import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

/**
 * ExitModalButton
 */
export const ExitModalButton = () => {
    const [open, setOpen] = useState(false);
    return (
        <Modal
            closeIcon
            open={open}
            trigger={<Button>Exit</Button>}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
        >
            <Header content="Exit" />
            <Modal.Content>
                <p>Are you sure you want to exit?</p>
            </Modal.Content>
            <Modal.Actions>
                <Button color="red" onClick={() => setOpen(false)}>
                    <Icon name="remove" /> No
                </Button>
                <Link to="/home">
                    <Button color="green" onClick={() => setOpen(false)}>
                        <Icon name="checkmark" /> Yes
                    </Button>
                </Link>
            </Modal.Actions>
        </Modal>
    );
}