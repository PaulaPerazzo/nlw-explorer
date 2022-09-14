export function convertMin(minString: string) {
    const convertNum = Number(minString);
    const hours = Math.floor(convertNum / 60);
    if (hours > 24) {
        const hoursBig = hours - 24;

        return hoursBig;
    }

    return hours;
};
