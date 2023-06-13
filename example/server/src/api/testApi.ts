export default {
	getRandomNumber(min: number, max: number) {
		const range = max - min;
		return min + (Math.random() * range);
	}
}