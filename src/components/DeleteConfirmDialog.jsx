import { Button, Dialog, Text } from '@chakra-ui/react';

export const DeleteConfirmDialog = ({ open, onClose, eventTitle, deleting, onConfirm }) => {
    return (
        <Dialog.Root
            open={open}
            onOpenChange={(details) => {
                if (!details.open) onClose();
            }}
            role="alertdialog"
            size="sm"
        >
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Delete event</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Text>
                            Are you sure you want to delete{' '}
                            <Text as="span" fontWeight="semibold">
                                &quot;{eventTitle}&quot;
                            </Text>
                            ? This action cannot be undone.
                        </Text>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button variant="ghost" onClick={onClose} disabled={deleting}>
                            Cancel
                        </Button>
                        <Button colorPalette="red" loading={deleting} onClick={onConfirm}>
                            Yes, delete event
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};
