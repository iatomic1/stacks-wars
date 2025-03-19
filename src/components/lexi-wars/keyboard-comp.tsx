import React, { useRef } from "react";
import dynamic from "next/dynamic";

const Keyboard = dynamic(() => import("react-simple-keyboard"), {
	ssr: false,
	loading: () => null,
});
import "react-simple-keyboard/build/css/index.css";

export default function KeyboardComp({
	handleKeyboardInput,
}: {
	handleKeyboardInput: (input: string) => void;
}) {
	const keyboardRef = useRef(null);

	return (
		<div className="keyboard">
			<Keyboard
				keyboardRef={(r) => (keyboardRef.current = r)}
				layoutName="default"
				layout={{
					default: [
						"q w e r t y u i o p",
						"a s d f g h j k l",
						"z x c v b n m {bksp}",
						"{enter}",
					],
				}}
				display={{
					"{bksp}": "⌫",
					"{enter}": "Enter",
				}}
				onKeyPress={handleKeyboardInput}
				disableButtonHold
				physicalKeyboardHighlight={false}
			/>
		</div>
	);
}
