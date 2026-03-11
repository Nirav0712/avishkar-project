export default function Logo3D() {
    const boxes = ["top", "bottom", "middle", "side"];
    const faces = [1, 2, 3, 4, 5, 6];

    return (
        <div className="flex items-center justify-center h-screen bg-transparent perspective-[1500px]">
            <div className="animate-[spinY_4s_ease-in-out_infinite]">
                <div className="rotate-45 relative">

                    {boxes.map((box) => (
                        <div key={box} className="relative">
                            {faces.map((face) => (
                                <div
                                    key={face}
                                    className="absolute w-50 h-50"
                                >
                                    <img src="/arlogo.png" alt="icoimg.png" className="animate-[spin_8s_linear_infinite] " />
                                </div>
                            ))}
                        </div>
                    ))}

                </div>
            </div>

            <style>
                {`
          @keyframes spinY {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
          }
        `}
            </style>
        </div>
    );
}