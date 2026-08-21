import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    Field,
    HStack,
    Image,
    Input,
    SimpleGrid,
    Stack,
    Text,
    Textarea,
} from '@chakra-ui/react';
import { useEvents } from '../context/EventsContext';
import { toaster } from './ui/toaster';
import { fromDateTimeLocal, toDateTimeLocal } from '../utils/format';
import { capitalize } from '../utils/format';


const emptyForm = {
    title: '',
    description: '',
    image: '',
    location: '',
    startTime: '',
    endTime: '',
};

export const EventFormModal = ({ open, onClose, initialEvent, onSubmit }) => {
    const { categories } = useEvents();
    const [form, setForm] = useState(emptyForm);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setForm(
                initialEvent
                    ? {
                          title: initialEvent.title || '',
                          description: initialEvent.description || '',
                          image: initialEvent.image || '',
                          location: initialEvent.location || '',
                          startTime: toDateTimeLocal(initialEvent.startTime),
                          endTime: toDateTimeLocal(initialEvent.endTime),
                      }
                    : emptyForm,
            );
            setSelectedCategoryIds(initialEvent?.categoryIds || []);
        }
    }, [open, initialEvent]);

    const handleChange = (field) => (event) => {
        setForm((previous) => ({ ...previous, [field]: event.target.value }));
    };

    const toggleCategory = (categoryId) => {
        setSelectedCategoryIds((previous) => 
            previous.includes(categoryId)
                ? previous.filter((id) => id !== categoryId)
                : [...previous, categoryId],
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (selectedCategoryIds.length === 0) {
            toaster.create({
                title: 'No category selected',
                description: 'Please select at least one category.',
                type: 'error',
            });
            return;
        }

        if (new Date(form.startTime) >= new Date(form.endTime)) {
            toaster.create({
                title: 'Invalid time range',
                description: 'The start time must be before the end time.',
                type: 'error',
            });
            return;
        }

        setSubmitting(true);
        const payload = {
            title: form.title,
            description: form.description,
            image: form.image,
            location: form.location,
            categoryIds: selectedCategoryIds,
            startTime: fromDateTimeLocal(form.startTime),
            endTime: fromDateTimeLocal(form.endTime),
            ...(initialEvent ? {} : { createdBy: 1 }),
        };

        const result = await onSubmit(payload);
        setSubmitting(false);

        if (result.ok) {
            onClose();
        }
    };

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(details) => {
                if (!details.open) onClose();
            }}
            size="lg"
            scrollBehavior="inside"
        >
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>
                            {initialEvent ? 'Edit event' : 'Create new event'}
                        </Dialog.Title>
                        <Dialog.Description>
                            {initialEvent
                                ? 'Update the details below and save your changes.'
                                : 'Fill in the details below to add a new event.'}
                        </Dialog.Description>
                    </Dialog.Header>
                    <Dialog.Body>
                        <form id="event-form" onSubmit={handleSubmit}>
                            <Stack gap="4">
                                {form.image && (
                                    <Image
                                        src={form.image}
                                        alt="Event preview"
                                        height="180px"
                                        width="100%"
                                        objectFit="cover"
                                        borderRadius="md"
                                        fallback={
                                            <Box bg="bg.muted" height="180px" borderRadius="md" />
                                        }
                                    />
                                )}
                                <Field.Root required>
                                    <Field.Label>Title</Field.Label>
                                    <Input
                                        value={form.title}
                                        onChange={handleChange('title')}
                                        placeholder="e.g. Beach volleyball tournament"
                                        required
                                    />
                                </Field.Root>
                                <Field.Root required>
                                    <Field.Label>Description</Field.Label>
                                    <Textarea
                                        value={form.description}
                                        onChange={handleChange('description')}
                                        placeholder="Describe your event..."
                                        rows={4}
                                        required
                                    />
                                </Field.Root>
                                <Field.Root required>
                                    <Field.Label>Image URL</Field.Label>
                                    <Input
                                        value={form.image}
                                        onChange={handleChange('image')}
                                        placeholder="https://..."
                                        type="url"
                                        required
                                    />
                                </Field.Root>
                                <Field.Root required>
                                    <Field.Label>Location</Field.Label>
                                    <Input
                                        value={form.location}
                                        onChange={handleChange('location')}
                                        placeholder="e.g. City Park"
                                        required
                                    />
                                </Field.Root>
                                <SimpleGrid columns={{ base: 1, sm: 2 }} gap="4">
                                    <Field.Root required>
                                        <Field.Label>Start time</Field.Label>
                                        <Input
                                            value={form.startTime}
                                            onChange={handleChange('startTime')}
                                            type="datetime-local"
                                            required
                                        />
                                    </Field.Root>
                                    <Field.Root required>
                                        <Field.Label>End time</Field.Label>
                                        <Input
                                            value={form.endTime}
                                            onChange={handleChange('endTime')}
                                            type="datetime-local"
                                            required
                                        />
                                    </Field.Root>
                                </SimpleGrid>
                                <Field.Root required>
                                    <Field.Label>Categories</Field.Label>
                                    <HStack gap="4" flexWrap="wrap">
                                        {categories.map((category) => (
                                            <label key={category.id}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategoryIds.includes(category.id)}
                                                    onChange={() => toggleCategory(category.id)}
                                                />
                                                {" "}                                  
                                                {capitalize(category.name)}                                
                                            </label>
                                        ))}
                                    </HStack>
                                    <Text fontSize="sm" color="fg.muted">
                                        Select at least one category.
                                    </Text>
                                </Field.Root>
                            </Stack>
                        </form>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button variant="ghost" onClick={onClose} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="event-form"
                            colorPalette="brand"
                            loading={submitting}
                        >
                            {initialEvent ? 'Save changes' : 'Create event'}
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};
