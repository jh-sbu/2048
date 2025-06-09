import Square from "./Square";

export default function Grid() {
  // Temporary initial values for demonstration
  const initialValues = [
    [2, 4, 8, 16],
    [32, 64, 128, 256],
    [512, 1024, 2048, 0],
    [0, 0, 0, 0]
  ];

  return (
    <div className="grid">
      {initialValues.flat().map((value, index) => (
        <Square key={index} value={value} />
      ))}
    </div>
  );
}
