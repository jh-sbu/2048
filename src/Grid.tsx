import Square from "./Square";

export default function Grid() {
  const initialValues = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
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
