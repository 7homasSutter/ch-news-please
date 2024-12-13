import {X} from 'tabler-icons-react';

interface Props {
    onClick: () => void,
    size?: number
}

function AppClose({onClick, size}: Props) {

    return (
        <div
            style={{display: "flex", flexDirection: "row-reverse", margin: 2,}}>
            <X
                size={size}
                style={{
                    pointerEvents: 'all',
                    cursor: 'pointer'
                }}
                onClick={onClick}
            />
        </div>

    )
}

export default AppClose
