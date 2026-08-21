import { useMemo, useState } from 'react';
import { LuCalendarX2, LuSearchX } from 'react-icons/lu';
import {
    Box,    
    Checkbox,
    Container,
    EmptyState,
    Flex,
    Heading,
    Input,
    SimpleGrid,
    Stack,
    Text,
} from '@chakra-ui/react';
import { EventCard } from '../components/EventCard';
import { EventCardSkeleton } from '../components/EventCardSkeleton';
import { useEvents } from '../context/EventsContext';
import { capitalize } from '../utils/format';

export const EventsPage = () => {
    const { events, categories, loading, error, } = useEvents();    
    const [search, setSearch] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);

    const filteredEvents = useMemo(() => {
        const query = search.trim().toLowerCase();
        return events.filter((event) => {
            const matchesSearch = query === '' || event.title.toLowerCase().includes(query);
            const matchesCategory =
                selectedCategories.length === 0 ||
                event.categoryIds.some((id) => selectedCategories.includes(id));
            return matchesSearch && matchesCategory;
        });
    }, [events, search, selectedCategories]);

    const toggleCategory = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId],
        );
    };

    return (
        <Box bg="bg.canvas" minHeight="100vh">
            <Container maxW="6xl" py="8">
                <Stack gap="8">
                    <Stack gap="2">
                        <Heading size="3xl">Events</Heading>
                        <Text color="fg.muted" fontSize="lg">
                            Browse upcoming events, search by name and filter by category.
                        </Text>
                    </Stack>

                    <Stack
                        direction={{ base: 'column', lg: 'row' }}
                        gap="4"
                        justify="space-between"
                        align={{ base: 'stretch', lg: 'flex-end' }}
                    >
                        <Stack gap="2" width={{ base: 'full', lg: '50%' }}>
                            <Text fontSize="sm" fontWeight="medium" color="fg.muted">
                                Search events
                            </Text>
                            <Input
                                placeholder="Search by event name..."
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                        </Stack>
                        <Box>
                            
                        </Box>
                    </Stack>

                    <Stack gap="3">
                        <Text fontSize="sm" fontWeight="medium" color="fg.muted">
                            Filter by category
                        </Text>
                        <Flex gap="4" flexWrap="wrap">
                            {categories.map((category) => (
                                <Checkbox.Root
                                    key={category.id}
                                    checked={selectedCategories.includes(category.id)}
                                    onCheckedChange={() => toggleCategory(category.id)}
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>{capitalize(category.name)}</Checkbox.Label>
                                </Checkbox.Root>
                            ))}
                        </Flex>
                    </Stack>

                    {loading ? (
                        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap="6">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <EventCardSkeleton key={index} />
                            ))}
                        </SimpleGrid>
                    ) : error ? (
                        <EmptyState.Root>
                            <EmptyState.Indicator color="fg.muted">
                                <LuCalendarX2 size="2rem" />
                            </EmptyState.Indicator>
                            <EmptyState.Title>Could not load events</EmptyState.Title>
                            <EmptyState.Description>{error}</EmptyState.Description>
                        </EmptyState.Root>
                    ) : filteredEvents.length === 0 ? (
                        <EmptyState.Root>
                            <EmptyState.Indicator>
                                <LuSearchX size="2rem" />
                            </EmptyState.Indicator>
                            <EmptyState.Title>No events found</EmptyState.Title>
                            <EmptyState.Description>
                                Try a different search term or category filter.
                            </EmptyState.Description>
                        </EmptyState.Root>
                    ) : (
                        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap="6">
                            {filteredEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </SimpleGrid>
                    )}
                </Stack>
            </Container>           
        </Box>
    );
};
