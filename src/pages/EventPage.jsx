import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Badge,
    Button,
    Card,
    Container,
    EmptyState,
    HStack,
    Heading,
    Image,
    Skeleton,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import { EventFormModal } from '../components/EventFormModal';
import { useEvents } from '../context/EventsContext';
import { formatDate } from '../utils/format';

export const EventPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { events, loading, editEvent, removeEvent, getCategoryNames } = useEvents();

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const event = events.find((item) => item.id === Number(eventId));

    if (loading) {
        return (
            <Container maxW="5xl" py="8">
                <VStack gap="6" align="stretch">
                    <Skeleton height="40px" width="60%" />
                    <Skeleton height="320px" width="100%" />
                    <Skeleton height="20px" width="90%" />
                    <Skeleton height="20px" width="70%" />
                </VStack>
            </Container>
        );
    }

    if (!event) {
        return (
            <Container maxW="5xl" py="8">
                <EmptyState.Root>
                    <EmptyState.Indicator color="fg.muted">
                        <Text fontSize="3xl">404</Text>
                    </EmptyState.Indicator>
                    <EmptyState.Title>Event not found</EmptyState.Title>
                    <EmptyState.Description>
                        The event you are looking for does not exist or was deleted.
                    </EmptyState.Description>
                    <Button colorPalette="brand" onClick={() => navigate('/')}>
                        Back to events
                    </Button>
                </EmptyState.Root>
            </Container>
        );
    }

    const handleDelete = async () => {
        setDeleting(true);
        const result = await removeEvent(event.id);
        setDeleting(false);
        if (result.ok) {
            setDeleteDialogOpen(false);
            navigate('/');
        }
    };

    const categoryNames = getCategoryNames(event);

    return (
        <Container maxW="5xl" py="8">
            <VStack gap="6" align="stretch">
                <Button
                    variant="ghost"
                    width="fit-content"
                    onClick={() => navigate('/')}
                    alignSelf="flex-start"
                >
                    &larr; Back to events
                </Button>

                <Card.Root variant="elevated" overflow="hidden">
                    <Image
                        src={event.image}
                        alt={event.title}
                        height={{ base: '240px', md: '360px' }}
                        width="100%"
                        objectFit="cover"
                        fallback={<Stack bg="bg.muted" height="360px" width="100%" />}
                    />
                    <Card.Body gap="4" p={{ base: '5', md: '8' }}>
                        <Stack gap="2">
                            <Heading size="3xl">{event.title}</Heading>
                            <HStack gap="2" flexWrap="wrap">
                                {categoryNames.map((name) => (
                                    <Badge key={name} colorPalette="brand" variant="surface" size="lg">
                                        {name}
                                    </Badge>
                                ))}
                            </HStack>
                        </Stack>

                        <Stack gap="3">
                            <Text fontSize="lg" color="fg.muted">
                                {event.description}
                            </Text>
                        </Stack>

                        <Stack gap="2" textStyle="md">
                            <Text>
                                <Text as="span" fontWeight="semibold">
                                    Location:
                                </Text>{' '}
                                {event.location}
                            </Text>
                            <Text>
                                <Text as="span" fontWeight="semibold">
                                    Starts:
                                </Text>{' '}
                                {formatDate(event.startTime)}
                            </Text>
                            <Text>
                                <Text as="span" fontWeight="semibold">
                                    Ends:
                                </Text>{' '}
                                {formatDate(event.endTime)}
                            </Text>
                        </Stack>

                        <HStack gap="3" flexWrap="wrap">
                            <Button colorPalette="brand" onClick={() => setEditModalOpen(true)}>
                                Edit Event
                            </Button>
                            <Button colorPalette="red" variant="solid" onClick={() => setDeleteDialogOpen(true)}>
                                Delete Event
                            </Button>
                        </HStack>
                    </Card.Body>
                </Card.Root>
            </VStack>

            <EventFormModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                initialEvent={event}
                onSubmit={(data) => editEvent(event.id, data)}
            />

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                eventTitle={event.title}
                deleting={deleting}
                onConfirm={handleDelete}
            />
        </Container>
    );
};
