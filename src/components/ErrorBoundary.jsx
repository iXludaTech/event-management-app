import { Component } from 'react';
import { Button, Container, EmptyState } from '@chakra-ui/react';
import { LuTriangleAlert } from 'react-icons/lu';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Container maxW="3xl" py="16">
                    <EmptyState.Root>
                        <EmptyState.Indicator color="fg.muted">
                            <LuTriangleAlert size="2rem" />
                        </EmptyState.Indicator>
                        <EmptyState.Title>Something went wrong</EmptyState.Title>
                        <EmptyState.Description>
                            An unexpected error occurred. Please try reloading the page.
                        </EmptyState.Description>
                        <Button colorPalette="brand" onClick={() => window.location.reload()}>
                            Reload page
                        </Button>
                    </EmptyState.Root>
                </Container>
            );
        }

        return this.props.children;
    }
}
