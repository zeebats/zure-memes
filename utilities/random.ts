export const rng = (seed = ''): number => {
    let x = 0;
    let y = 0;
    let z = 0;
    let w = 0;

    const next = (): number => {
        const t = x ^ (x << 11);
        x = y;
        y = z;
        z = w;
        w ^= ((w >>> 19) ^ t ^ (t >>> 8)) >>> 0;

        return w / 0x1_00_00_00_00;
    };

    for (let k = 0; k < seed.length + 64; k++) {
        x ^= Math.trunc(Number(seed.codePointAt(k)));
        next();
    }

    return next();
};

export const getRandomBetween = ({
    seed = '',
    min = 0,
    max = min + 1,
} : {
    seed: string;
    min?: number;
    max?: number;
}): number => Math.floor(rng(seed) * (max - min + 1)) + min;
