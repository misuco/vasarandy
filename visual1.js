/**
* This program is free software; you can redistribute it and/or
* modify it under the terms of the GNU General Public License
* as published by the Free Software Foundation; either version 2
* of the License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
* 02110-1301, USA.
*
* Copyright (C) 2008-2026 Claudio Zopfi
*/

class Visual1 {
    constructor() {
        console.log("Visual1: constructor()");
        this.n = 2; // number of stones
        this.w = 0; // width
        this.h = 0; // height

        this.col1 = 0;
        this.col2 = 0;
        this.col3 = 0;
        this.incval = 0;
        this.colmax = 0;
        this.colmin = 0;

        this.canvas = null;
        this.context = null;

        this.init();
    }

    /**
    * Initialize the canvas and set up dimensions.
    */
    init() {
        console.log("Visual1: init()");
        this.w = window.innerWidth;
        this.h = window.innerHeight;

        this.canvas = document.getElementById('myCanvas'); //document.createElement('canvas');
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.canvas.style.display = 'block';
        this.canvas.style.margin = '0';
        this.canvas.style.padding = '0';
        this.context = this.canvas.getContext('2d');

        this.context.fillStyle = 'rgb(255,0,0)';
        this.context.fillRect(0, 0, this.w, this.h);

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());

        // Create a link element to trigger the download
        this.dlLink = document.createElement('a');
        this.dlLink.download = "vasarandy.png";

    }

    download() {
        // Programmatically click the link to trigger the browser's download
        this.dlLink.href = this.canvas.toDataURL("image/png");
        this.dlLink.click();
    }

    /**
    * Handle window resize.
    */
    handleResize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.canvas.width = this.w;
        this.canvas.height = this.h;
    }

    /**
    * Paint the visualization.
    */
    paint() {
        this.randomize();
        console.log("paint(): tiles per row: "+this.n);

        // Clear offscreen canvas
        this.context.fillStyle = 'rgb(0,0,0)';
        this.context.fillRect(0, 0, this.w, this.h);

        // adapt to screen orientation
        let w1 = Math.floor(this.w / this.n);
        let nw = this.n;
        let nh = Math.floor(this.h/w1);
        if(this.w>this.h) {
            w1 = Math.floor(this.h / this.n);
            nh = this.n;
            nw = Math.floor(this.w/w1);
        }

        // calculate tile size
        const w2 = Math.floor(w1 / 2);
        const w3 = Math.floor(w1 / 3);
        const w4 = Math.floor(w1 / 4);
        const w8 = Math.floor(w1 / 8);

        // Draw grid
        for (let i = 0; i < nw; i++) {
            for (let j = 0; j < nh; j++) {

                // Advance color
                this.col1 += this.incval;
                this.col2 -= this.incval;
                this.col3 += this.incval;

                // Wrap color values
                if (this.col1 > this.colmax) this.col1 = this.colmin;
                if (this.col1 < this.colmin) this.col1 = this.colmax;
                if (this.col2 > this.colmax) this.col2 = this.colmin;
                if (this.col2 < this.colmin) this.col2 = this.colmax;
                if (this.col3 > this.colmax) this.col3 = this.colmin;
                if (this.col3 < this.colmin) this.col3 = this.colmax;

                // Draw background rectangle
                this.context.fillStyle = this.hsbToRgb(this.col1, 1.0, 1.0);
                this.context.fillRect(i * w1, j * w1, w1, w1);

                // Draw first shape (col2)
                this.context.fillStyle = this.hsbToRgb(this.col2, 1.0, 1.0);
                const r1 = Math.random();
                if (r1 > 0.6) {
                    this.drawPolygon(this.context,
                        [i * w1 + w4, (i + 1) * w1 - w4, (i + 1) * w1 - w4, i * w1 + w4, i * w1 + w4],
                        [j * w1 + w4, j * w1 + w4, (j + 1) * w1 - w4, (j + 1) * w1 - w4, j * w1 + w4]);
                } else if (r1 > 0.3) {
                    this.drawPolygon(this.context,
                        [i * w1 + w2, i * w1 + w1, i * w1 + w2, i * w1, i * w1 + w2],
                        [j * w1, j * w1 + w2, j * w1 + w1, j * w1 + w2, j * w1]);
                } else {
                    this.context.beginPath();
                    this.context.arc(i * w1 + w2, j * w1 + w2, (w1 - w4) / 2, 0, 2 * Math.PI);
                    this.context.fill();
                }

                // Draw second shape (col3)
                this.context.fillStyle = this.hsbToRgb(this.col3, 1.0, 1.0);
                const r2 = Math.random();
                if (r2 > 0.6) {
                    this.drawPolygon(this.context,
                        [i * w1 + w3, (i + 1) * w1 - w3, (i + 1) * w1 - w3, i * w1 + w3, i * w1 + w3],
                        [j * w1 + w3, j * w1 + w3, (j + 1) * w1 - w3, (j + 1) * w1 - w3, j * w1 + w3]);
                } else if (r2 > 0.3) {
                    this.drawPolygon(this.context,
                        [i * w1 + w2, i * w1 + w1 - w3, i * w1 + w2, i * w1 + w3, i * w1 + w2],
                        [j * w1 + w3, j * w1 + w2, j * w1 + w1 - w3, j * w1 + w2, j * w1 + w3]);
                } else {
                    this.context.fillRect(i * w1 + w3, j * w1 + w3, w3, w3);
                }
            }
        }
    }

    /**
    * Draw a polygon on the canvas.
    */
    drawPolygon(ctx, xPoints, yPoints) {
        ctx.beginPath();
        ctx.moveTo(xPoints[0], yPoints[0]);
        for (let i = 1; i < xPoints.length; i++) {
            ctx.lineTo(xPoints[i], yPoints[i]);
        }
        ctx.closePath();
        ctx.fill();
    }

    /**
    * Convert HSB color to RGB string.
    */
    hsbToRgb(h, s, b) {
        // Normalize h to 0-1 range
        h = h % 1.0;
        if (h < 0) h += 1.0;

        let r, g, bl;

        if (s === 0) {
            r = g = bl = Math.round(b * 255);
        } else {
            const sector = Math.floor(h * 6.0);
            const fractional = h * 6.0 - sector;

            const p = b * (1.0 - s);
            const q = b * (1.0 - s * fractional);
            const t = b * (1.0 - s * (1.0 - fractional));

            switch (sector) {
                case 0:
                    r = b;
                    g = t;
                    bl = p;
                    break;
                case 1:
                    r = q;
                    g = b;
                    bl = p;
                    break;
                case 2:
                    r = p;
                    g = b;
                    bl = t;
                    break;
                case 3:
                    r = p;
                    g = q;
                    bl = b;
                    break;
                case 4:
                    r = t;
                    g = p;
                    bl = b;
                    break;
                default:
                    r = b;
                    g = p;
                    bl = q;
            }
        }

        const ri = Math.round(r * 255);
        const gi = Math.round(g * 255);
        const bi = Math.round(bl * 255);

        return `rgb(${ri},${gi},${bi})`;
    }

    /**
    * Randomize animation parameters.
    */
    randomize() {
        console.log("Visual1: randomize()");
        this.n = 1 + Math.round(Math.random() * 20);

        // calculate color range
        this.colmin = Math.random();
        this.colmax = Math.min(this.colmin+Math.random(),1.0);

        // make sure there is a minimal color difference
        let colDiffMin = 0.2;
        let colDiff = this.colmax-this.colmin;
        if(colDiff<colDiffMin) {
            if(this.colmin>colDiffMin) {
                this.colmin=this.colmax-colDiffMin;
            } else {
                this.colmax=this.colmin+colDiffMin;
            }
        }

        this.col1 = this.colmin;
        this.col2 = this.colmax;
        this.col3 = this.colmin + (this.colmax - this.colmin) * Math.random();

        this.incval = Math.random() / 100;
        console.log(`
            n: ${this.n}
            colmin: ${this.colmin}
            colmax: ${this.colmax}
            col1: ${this.col1}
            col2: ${this.col2}
            col3: ${this.col3}
            incval: ${this.incval}
        `);
    }
}
