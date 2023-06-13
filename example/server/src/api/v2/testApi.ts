export default {
	getRandomNumber({ min = 0, max = 100 }) {
		const range = max - min;
		return min + (Math.random() * range);
	}
}