import { shape, string, bool } from "prop-types";

const todoCard = shape({
    data: shape({
        id: string.isRequired,
        title: string.isRequired,
        description: string,
        priority: string.isRequired,
        isCompleted: bool.isRequired,
        isArchived: bool.isRequired,
    }),
    isFetching: bool.isRequired,
    error: shape(),
});

export default todoCard;
