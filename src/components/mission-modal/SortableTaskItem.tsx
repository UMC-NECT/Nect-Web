import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TaskItem from './TaskItem'

interface SortableTaskItemProps {
    id: number
    content: string
    isComplete?: boolean
    isEditing?: boolean
    autoFocus?: boolean
    onClick?: () => void
    onContentClick?: () => void
    onChange?: (value: string) => void
    onSubmit?: (value: string) => void
    onDelete?: () => void
}

const SortableTaskItem = ({
    id,
    content,
    isComplete,
    isEditing,
    autoFocus,
    onClick,
    onContentClick,
    onChange,
    onSubmit,
    onDelete,
}: SortableTaskItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style}>
            <TaskItem
                content={content}
                isComplete={isComplete}
                isEditing={isEditing}
                autoFocus={autoFocus}
                isDragging={isDragging}
                dragHandleProps={{ ...attributes, ...listeners }}
                onClick={onClick}
                onContentClick={onContentClick}
                onChange={onChange}
                onSubmit={onSubmit}
                onDelete={onDelete}
            />
        </div>
    )
}

export default SortableTaskItem
