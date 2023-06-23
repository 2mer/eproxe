export default {
	getRandomNumber(min: number, max: number) {
		const range = max - min;
		return Math.round(min + (Math.random() * range));
	}
}