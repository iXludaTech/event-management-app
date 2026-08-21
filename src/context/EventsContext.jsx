import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
    createEvent,
    deleteEvent,
    fetchCategories,
    fetchEvents,
    updateEvent,
} from '../api/events';
import { toaster } from '../components/ui/toaster';
import { capitalize } from '../utils/format';

const EventsContext = createContext(null);

export const EventsProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [eventsData, categoriesData] = await Promise.all([
                    fetchEvents(),
                    fetchCategories(),
                ]);
                
                setEvents(eventsData);
                setCategories(categoriesData);
            } catch (err) {
                setError(err.message);
                toaster.create({
                    title: 'Failed to load data',
                    description: 'Could not reach the server. Is json-server running?',
                    type: 'error',
                });
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const openAddEvent = useCallback(() => {
        setIsAddEventOpen(true);
    }, []);

    const closeAddEvent = useCallback(() => {
        setIsAddEventOpen(false);
    }, []);

    const addEvent = useCallback(async (eventData) => {
        try {
            const created = await createEvent(eventData);
            setEvents((previous) => [...previous, created]);
            toaster.create({
                title: 'Event created',
                description: `"${created.title}" was added successfully.`,
                type: 'success',
            });
            return { ok: true, event: created };
        } catch (err) {
            toaster.create({
                title: 'Failed to create event',
                description: err.message,
                type: 'error',
            });
            return { ok: false, error: err };
        }
    }, []);

    const editEvent = useCallback(async (id, eventData) => {
        try {
            const updated = await updateEvent(id, eventData);
            setEvents((previous) => previous.map((event) => (event.id === id ? updated : event)));
            toaster.create({
                title: 'Event updated',
                description: `"${updated.title}" was saved successfully.`,
                type: 'success',
            });
            return { ok: true, event: updated };
        } catch (err) {
            toaster.create({
                title: 'Failed to update event',
                description: err.message,
                type: 'error',
            });
            return { ok: false, error: err };
        }
    }, []);

    const removeEvent = useCallback(async (id) => {
        try {
            await deleteEvent(id);
            setEvents((previous) => previous.filter((event) => event.id !== id));
            toaster.create({
                title: 'Event deleted',
                description: 'The event was removed successfully.',
                type: 'success',
            });
            return { ok: true };
        } catch (err) {
            toaster.create({
                title: 'Failed to delete event',
                description: err.message,
                type: 'error',
            });
            return { ok: false, error: err };
        }
    }, []);

    const getCategoryNames = useCallback(
        (event) =>
            (event.categoryIds || [])
                .map((categoryId) => categories.find((category) => category.id === categoryId))
                .filter(Boolean)
                .map((category) => capitalize(category.name)),
        [categories],
    );

    return (
        <EventsContext.Provider
            value={{
                events,
                categories,
                loading,
                error,
                addEvent,
                editEvent,
                removeEvent,
                getCategoryNames,
                isAddEventOpen,
                openAddEvent,
                closeAddEvent,
            }}
        >
            {children}
        </EventsContext.Provider>
    );
};

export const useEvents = () => {
    const context = useContext(EventsContext);
    if (!context) {
        throw new Error('useEvents must be used within an EventsProvider');
    }
    return context;
};
