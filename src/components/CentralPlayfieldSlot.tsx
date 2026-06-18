type CentralPlayfieldSlotProps = {
  onActivate: (point: { x: number; y: number }) => void;
};

export default function CentralPlayfieldSlot({ onActivate }: CentralPlayfieldSlotProps) {
  return (
    <div className="central-playfield-slot" aria-label="Emplacement central réservé">
      <button
        className="central-hotspot"
        type="button"
        aria-label="Activer le système énergétique"
        onPointerDown={(event) => {
          onActivate({ x: event.clientX, y: event.clientY });
        }}
      />
    </div>
  );
}
