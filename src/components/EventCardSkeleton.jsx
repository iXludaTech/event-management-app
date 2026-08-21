import { Card, Skeleton } from '@chakra-ui/react';

export const EventCardSkeleton = () => {
    return (
        <Card.Root variant="elevated" overflow="hidden">
            <Skeleton height="220px" width="100%" />
            <Card.Body gap="3">
                <Skeleton height="24px" width="60%" />
                <Skeleton height="16px" width="100%" />
                <Skeleton height="16px" width="80%" />
            </Card.Body>
            <Card.Footer>
                <Skeleton height="22px" width="40%" />
            </Card.Footer>
        </Card.Root>
    );
};
