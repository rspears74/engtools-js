const barDiaList = {
    3: 0.375,
    4: 0.5,
    5: 0.625,
    6: 0.75,
    7: 0.875,
    8: 1.0,
    9: 1.128,
    10: 1.27,
    11: 1.41,
    14: 1.693,
    18: 2.257
}

const barAreaList = {
    3: 0.11,
    4: 0.20,
    5: 0.31,
    6: 0.44,
    7: 0.60,
    8: 0.79,
    9: 1.0,
    10: 1.27,
    11: 1.56,
    14: 2.25,
    18: 4.0
};

const barWeightList = {
    3: 0.376,
    4: 0.668,
    5: 1.044,
    6: 1.503,
    7: 2.046,
    8: 2.673,
    9: 3.4,
    10: 4.311,
    11: 5.313,
    14: 7.66,
    18: 13.614
};

class Bar {
    constructor (size) {
        const validSizes = [
            3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 18
        ];
        if (validSizes.indexOf(size) == -1) {
            throw new Error("Not a valid bar size.");
        }
        this.size = size;

        const bars = {
            'dia': barDiaList,
            'area': barAreaList,
            'weight': barWeightList
        }

        this.dia = bars['dia'][size]
        this.area = bars['area'][size]
        this.weight = bars['weight'][size]

        if (size <= 8) {
            this.bendRad = this.dia * 6 / 2;
        }
        else if (size == 9 || size == 10 || size == 11) {
            this.bendRad = this.dia * 8 / 2;
        }
        else {
            this.bendRad = this.dia * 10 / 2;
        }

        this.stirrupBendRad = this.dia * 4 / 2;

        this.bentExt180 = Math.max(2.5/12, this.dia * 4);
        this.bendExt90 = this.dia * 12;

        if (size < 9) {
            this.stirrupBentExt135 = this.dia * 4;
        }
        else {
            this.stirrupBendExt135 = "Invalid";
        }

        if (size <= 5) {
            this.stirrupBendExt90 = this.dia * 6;
        }
        else if (size == 6 || size == 7 || size == 8) {
            this.stirrupBendExt90 = this.dia * 12;
        }
        else {
            this.stirrupBendExt90 = "Invalid";
        }
    }

    devOld(fc=5) {
        if (this.size <= 11) {
            return Math.max(1.25 * this.area * 60 / Math.sqrt(fc), 0.4 * this.dia * 60);
        }
        else if (this.size == 14) {
            return 2.7 * 60 / Math.sqrt(fc);
        }
        else if (this.size == 18) {
            return 3.5 * 60 / Math.sqrt(fc)
        }
        else {
            throw new Error("Invalid bar size!");
        }
    }

    dev(fc=5) {
        return 2.4 * this.dia * 60 / Math.sqrt(fc);
    }

    spliceOld(class_='c', fc=5) {
        switch (class_) {
            case 'a':
                return this.devOld(fc=fc);
            case 'b':
                return this.devOld(fc=fc) * 1.3;
            case 'c':
                return this.devOld(fc=fc) * 1.7;
            default:
                throw new Error('Invalid class!')
        }
    }

    splice(class_='b', fc=5) {
        switch(class_) {
            case 'a':
                return this.dev(fc=fc);
            case 'b':
                return this.dev(fc=fc) * 1.3;
            default:
                throw new Error('Invalid class!')
        }
    }

}

class Prestress {
    constructor(strand=0.6, fpu=270) {
        switch (strand) {
            case 0.6:
                this.area = 0.217;
            case 0.5:
                this.area = 0.153;
            default:
                throw new Error('Strand diameter must be 0.5 or 0.6!');
        }
        this.strand = strand;
        this.fpu = fpu;
    }
}

module.exports = {
    Bar: Bar,
    Prestress: Prestress
}