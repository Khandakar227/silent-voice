export default function ChessBoard() {
    const BOARD_OFFSET = 20
    const BORDER_COLOR = '#3e3e3e'
    return (
        <>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="800px"
                height="800px" viewBox={`0 0 ${800 + BOARD_OFFSET} ${800 + BOARD_OFFSET}`} xmlSpace="preserve">

                <defs>
                </defs>
                <rect name="board" style={{ fill: 'white', stroke: 'black' }} width={800 + BOARD_OFFSET} height={800 + BOARD_OFFSET} />
                {
                    [1, 2, 3, 4, 5, 6, 7, 8].map((row, i) =>
                        'ABCDEFGH'.split('').map((col, j) => <rect key={`${col}${row}`} x={i * 100 + BOARD_OFFSET / 2} y={j * 100 + BOARD_OFFSET / 2} style={{ fill: (i + j) % 2 ? 'white' : 'black' }} name={`${col}${row}`} width="100" height="100" />)
                    )
                }
                <Pawn x={BOARD_OFFSET} y={BOARD_OFFSET} side='white' />
                <Rook  x={BOARD_OFFSET + 100} y={BOARD_OFFSET + 100} side='black'/>
            </svg>
        </>
    )
}

const Pawn = ({ x, y, side }: { x: number, y: number, side: 'white' | 'black' }) => {
    const WIDTH = 50, HEIGHT = 70;
    const COLOR = side;
    const STROKE = side == 'black' ? 'white' : 'black';

    return (
        <>
            <svg x={x + WIDTH / 4} y={y + HEIGHT / 4} width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
                <g style={{ fill: COLOR, stroke: STROKE, strokeMiterlimit: 10 }}>
                    <ellipse cx="25.3" cy="11.1" rx="10.7" ry="10.6" />
                    <rect x="14.5" y="19.2" width="21" height="3.8" />
                    <rect x="12.5" y="32.6" width="25.7" height="4.2" />
                    <rect x="10" y="36.7" width="30.7" height="4.3" />
                    <path d="M10,40.9h30.7l8.4,6.9H1.6C1.6,47.9,10,40.7,10,40.9z" />
                    <rect x="0.5" y="47.9" width="49.7" height="4.6" />
                    <path d="M18.1,23.2H33l4.1,9H14C14,32.2,18.1,22.9,18.1,23.2z" />
                </g>
            </svg>
        </>
    )
}

export function Rook({ x, y, side }: { x: number, y: number, side: 'white' | 'black' }) {
    const WIDTH = 50, HEIGHT = 70;
    const COLOR = side;
    const STROKE = side == 'black' ? 'white' : 'black';

    return (
        <svg x={(x + WIDTH / 4)} y={y} width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
            <g style={{ fill: COLOR, stroke: STROKE, strokeMiterlimit: 10 }}>
                <rect x="12.5" y="31.4" width="25.7" height="4.2" />
                <rect x="10" y="35.5" width="30.7" height="4.3" />
                <path d="M10,39.7h30.7l8.4,6.9H1.6C1.6,46.7,10,39.5,10,39.7z" />
                <rect x="0.5" y="46.7" width="49.7" height="4.6" />
                <path d="M15.6,9.5c6.3,0,12.7,0,19,0c0.8,7.2,1.5,14.3,2.3,21.5h-23C14.4,23.8,15,16.7,15.6,9.5z" />
                <path d="M25.3,19.5" />
                <polygon points="35.7,5 35.7,0.5 32.3,0.5 32.3,5 30,5 30,0.5 26.5,0.5 26.5,5 24.2,5 24.2,0.5 20.8,0.5 20.8,5 18.4,5 
	18.4,0.5 15,0.5 15,5 13.2,5 13.2,10 37.5,10 37.5,5 "/>
            </g>
        </svg>

    )
}
