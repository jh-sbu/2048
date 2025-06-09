interface SquareProps {
  value: number;
}

export default function Square({ value }: SquareProps) {
  return (
    <div className="square">
      {value > 0 && (
        <div 
          className="square-value"
          style={{
            backgroundColor: getBackgroundColor(value),
            color: value > 4 ? '#f9f6f2' : '#776e65',
            fontSize: value < 100 ? 55 : value < 1000 ? 45 : 35
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
}

function getBackgroundColor(value: number): string {
  const colors: { [key: number]: string } = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e'
  };
  return colors[value] || '#cdc1b4';
}
