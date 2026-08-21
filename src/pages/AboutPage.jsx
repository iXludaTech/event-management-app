import {
    Box,
    Card,
    Container,
    Heading,
    SimpleGrid,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';
import { features } from '../utils/about';

export const AboutPage = () => {
    return (
        <Box bg="bg.canvas" minHeight="100vh">
            <Container maxW="5xl" py="12">
                <VStack gap="10" align="stretch">
                    <Stack gap="3" textAlign="center" align="center">
                        <Heading size="4xl">About Event Hub</Heading>
                        <Text color="fg.muted" fontSize="lg" maxW="2xl">
                            Event Hub is an event management application built with React,
                            Chakra UI and React Router. It connects to a JSON server back-end so you
                            can list, create, edit and delete events in real time.
                        </Text>
                    </Stack>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="6">
                        {features.map((feature) => (
                            <Card.Root key={feature.title} variant="elevated">
                                <Card.Body gap="2">
                                    <Card.Title>{feature.title}</Card.Title>
                                    <Card.Description>{feature.description}</Card.Description>
                                </Card.Body>
                            </Card.Root>
                        ))}
                    </SimpleGrid>

                    <Card.Root variant="subtle">
                        <Card.Body gap="2">
                            <Card.Title>Built for a learning goal</Card.Title>
                            <Card.Description>
                                This project demonstrates a full React module: Context for global
                                state, React Router for navigation, Chakra UI as the design system,
                                custom hooks, modal dialogs, skeleton loaders, error boundaries and
                                live communication with a REST API.
                            </Card.Description>
                        </Card.Body>
                    </Card.Root>
                </VStack>
            </Container>
        </Box>
    );
};
