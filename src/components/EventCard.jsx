import { Badge, Card, HStack, Image, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventsContext';
import { formatDate } from '../utils/format';

export const EventCard = ({ event }) => {
    const navigate = useNavigate();
    const { getCategoryNames } = useEvents();
    const categoryNames = getCategoryNames(event);

    return (
        <Card.Root
            variant="elevated"
            overflow="hidden"
            cursor="pointer"
            transition="transform 0.2s ease, box-shadow 0.2s ease"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
            onClick={() => navigate(`/event/${event.id}`)}
        >
            <Image
                src={event.image}
                alt={event.title}
                height="220px"
                width="100%"
                objectFit="cover"
                fallback={<Stack bg="bg.muted" height="220px" width="100%" />}
            />
            <Card.Body gap="3">
                <Card.Title size="lg" lineClamp={1}>
                    {event.title}
                </Card.Title>
                <Card.Description lineClamp={2}>{event.description}</Card.Description>
                <Stack gap="1">
                    <Text fontSize="sm" color="fg.muted">
                        {formatDate(event.startTime)} - {formatDate(event.endTime)}
                    </Text>
                    <Text fontSize="sm" color="fg.muted">
                        {event.location}
                    </Text>
                </Stack>
            </Card.Body>
            <Card.Footer>
                <HStack gap="2" flexWrap="wrap">
                    {categoryNames.map((name) => (
                        <Badge key={name} colorPalette="brand" variant="surface">
                            {name}
                        </Badge>
                    ))}
                </HStack>
            </Card.Footer>
        </Card.Root>
    );
};
