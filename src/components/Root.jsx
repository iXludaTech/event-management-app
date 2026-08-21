import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Box } from '@chakra-ui/react';
import { useEvents } from '../context/EventsContext';
import { EventFormModal } from './EventFormModal';

export const Root = () => {
    const {
        addEvent,
        isAddEventOpen,
        closeAddEvent,
    } = useEvents();

    return (
        <Box minHeight="100vh" bg="bg.canvas">
            <Navigation />
            <Outlet />

            <EventFormModal
                open={isAddEventOpen}
                onClose={closeAddEvent}
                onSubmit={addEvent}
            />
        </Box>
    );
};
