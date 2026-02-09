import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TaskItem from './TaskItem'

interface SortableTaskItemProps {
    id: number
    content: string
    isComplete?: boolean
    isEditing?: boolean
    autoFocus?: boolean
    /** true면 드래그/수정/삭제 비활성화 */
    readOnly?: boolean
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
    readOnly = false,
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
    } = useSortable({ id, disabled: readOnly })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style}>
            <TaskItem
                content={content}
                isComplete={isComplete}
                isEditing={readOnly ? false : isEditing}
                autoFocus={autoFocus}
                isDragging={isDragging}
                dragHandleProps={readOnly ? undefined : { ...attributes, ...listeners }}
                onClick={readOnly ? undefined : onClick}
                onContentClick={readOnly ? undefined : onContentClick}
                onChange={readOnly ? undefined : onChange}
                onSubmit={readOnly ? undefined : onSubmit}
                onDelete={readOnly ? undefined : onDelete}
            />
        </div>
    )
}

export default SortableTaskItem
