import { Box, Button, Container, Flex, HStack, Text } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { ColorModeButton } from './ui/color-mode';
import { useEvents } from '../context/EventsContext';

const NavItem = ({ to, end, children }) => (
    <NavLink to={to} end={end}>
        {({ isActive }) => (
            <Text
                fontWeight={isActive ? 'semibold' : 'medium'}
                color={isActive ? 'brandSolid' : 'fg.muted'}
                px="3"
                py="1.5"
                borderRadius="md"
                _hover={{ color: 'brandSolid', bg: 'bg.muted' }}
            >
                {children}
            </Text>
        )}
    </NavLink>
);

export const Navigation = () => {
    const { openAddEvent } = useEvents();
    return (
        <Box
            as="nav"
            position="sticky"
            top="0"
            zIndex="sticky"
            bg="bg.panel"
            borderBottom="1px solid"
            borderColor="border"
        >
            <Container maxW="6xl" py="3">
                <Flex justify="space-between" align="center" gap="4" flexWrap="wrap">
                    <NavLink to="/" end>
                        <Text fontWeight="bold" fontSize="lg" color="teal.500" letterSpacing="tight">
                            Event Hub
                        </Text>
                    </NavLink>

                    <HStack gap="1">
                        <NavItem to="/" end>
                            Events
                        </NavItem>
                        <NavItem to="/about">About</NavItem>
                    </HStack>

                    <HStack gap="2">
                        <Button
                            colorPalette="brand"
                            size="sm"
                            onClick={ openAddEvent }
                        >
                            + Add Event
                        </Button>
                        <ColorModeButton />
                    </HStack>
                </Flex>
            </Container>
        </Box>
    );
};
