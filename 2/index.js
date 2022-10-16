window.onload = () => {
	const form = document.createElement("form");
	document.body.appendChild(form);

	const label = document.createElement("label");
	label.setAttribute("for", "circles");
	label.innerHTML = "Quantidade de círculos:";
	form.appendChild(label);

	const input = document.createElement("input");
	input.setAttribute("name", "circles");
	input.setAttribute("type", "number");
	form.appendChild(input);

	const button = document.createElement("input");
	button.setAttribute("type", "submit");
	button.setAttribute("value", "Ok");
	form.appendChild(button);

	const params = new URLSearchParams(document.location.search);
	const circles = parseInt(params.get("circles"), 10);
	input.setAttribute("value", circles);
	makeCircles(circles);
}

function makeCircles(amount) {
	const styles = [
		"red-circle",
		"blue-circle",
		"yellow-circle",
	];

	const circles = document.createElement("div");
	circles.setAttribute("id", "circles");

	for (let i = 0; i < amount; i++) {
		const circle = document.createElement("div");
		const style = styles[Math.floor(Math.random() * styles.length)];
		circle.setAttribute("class", `circle ${style}`);
		circle.onclick = () => {
			circle.style.display = "none";
		};
		circles.appendChild(circle);
	}

	document.body.appendChild(circles);
}
