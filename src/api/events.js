export const BASE_URL = 'http://localhost:3000';

const request = async (path, options = {}) => {
    const response = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return response.status === 204 ? null : response.json();
};

export const fetchEvents = () => request('/events');

export const fetchCategories = () => request('/categories');

export const createEvent = (event) =>
    request('/events', {
        method: 'POST',
        body: JSON.stringify(event),
    });

export const updateEvent = (id, event) =>
    request(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(event),
    });

export const deleteEvent = (id) => request(`/events/${id}`, { method: 'DELETE' });
