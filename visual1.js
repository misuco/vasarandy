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
        this.xcoef = 0;
        this.ycoef = 0;

        this.offscreenCanvas = null;
        this.offscreenContext = null;

        this.init();
    }

    /**
    * Initialize the canvas and set up dimensions.
    */
    init() {
        console.log("Visual1: init()");
        this.w = window.innerWidth;
        this.h = window.innerHeight;

        this.offscreenCanvas = document.getElementById('myCanvas'); //document.createElement('canvas');
        this.offscreenCanvas.width = this.w;
        this.offscreenCanvas.height = this.h;
        this.offscreenCanvas.style.display = 'block';
        this.offscreenCanvas.style.margin = '0';
        this.offscreenCanvas.style.padding = '0';
        this.offscreenContext = this.offscreenCanvas.getContext('2d');

        this.offscreenContext.fillStyle = 'rgb(255,0,0)';
        this.offscreenContext.fillRect(0, 0, this.w, this.h);

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    /**
    * Handle window resize.
    */
    handleResize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.offscreenCanvas.width = this.w;
        this.offscreenCanvas.height = this.h;
    }

    /**
    * Paint the visualization.
    */
    paint() {
        this.randomize();
        console.log("paint n:"+this.n);

        // Clear offscreen canvas
        this.offscreenContext.fillStyle = 'rgb(0,0,0)';
        this.offscreenContext.fillRect(0, 0, this.w, this.h);

        // Draw grid
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                const w1 = Math.floor(this.w / this.n);
                const w2 = Math.floor(w1 / 2);
                const w3 = Math.floor(w1 / 3);
                const w4 = Math.floor(w1 / 4);
                const w8 = Math.floor(w1 / 8);

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
                this.offscreenContext.fillStyle = this.hsbToRgb(this.col1, 1.0, 1.0);
                this.offscreenContext.fillRect(i * w1, j * w1, w1, w1);

                // Draw first shape (col2)
                this.offscreenContext.fillStyle = this.hsbToRgb(this.col2, 1.0, 1.0);
                const r1 = Math.random();
                if (r1 > 0.6) {
                    this.drawPolygon(this.offscreenContext,
                        [i * w1 + w4, (i + 1) * w1 - w4, (i + 1) * w1 - w4, i * w1 + w4, i * w1 + w4],
                        [j * w1 + w4, j * w1 + w4, (j + 1) * w1 - w4, (j + 1) * w1 - w4, j * w1 + w4]);
                    } else if (r1 > 0.3) {
                        this.drawPolygon(this.offscreenContext,
                            [i * w1 + w2, i * w1 + w1, i * w1 + w2, i * w1, i * w1 + w2],
                            [j * w1, j * w1 + w2, j * w1 + w1, j * w1 + w2, j * w1]);
                        } else {
                            this.offscreenContext.beginPath();
                            this.offscreenContext.arc(i * w1 + w2, j * w1 + w2, (w1 - w4) / 2, 0, 2 * Math.PI);
                            this.offscreenContext.fill();
                        }

                        // Draw second shape (col3)
                        this.offscreenContext.fillStyle = this.hsbToRgb(this.col3, 1.0, 1.0);
                        const r2 = Math.random();
                        if (r2 > 0.6) {
                            this.drawPolygon(this.offscreenContext,
                                [i * w1 + w3, (i + 1) * w1 - w3, (i + 1) * w1 - w3, i * w1 + w3, i * w1 + w3],
                                [j * w1 + w3, j * w1 + w3, (j + 1) * w1 - w3, (j + 1) * w1 - w3, j * w1 + w3]);
                            } else if (r2 > 0.3) {
                                this.drawPolygon(this.offscreenContext,
                                    [i * w1 + w2, i * w1 + w1 - w3, i * w1 + w2, i * w1 + w3, i * w1 + w2],
                                    [j * w1 + w3, j * w1 + w2, j * w1 + w1 - w3, j * w1 + w2, j * w1 + w3]);
                                } else {
                                    this.offscreenContext.fillRect(i * w1 + w3, j * w1 + w3, w3, w3);
                                }
                            }
                        }

                        /*

                        //this.context.drawImage(this.offscreenCanvas, 0, 0, this.w, this.h, 0, 0, this.w, this.h);


                        const centerX = this.w / 2;
                        const centerY = 0;
                        const horizon = 2;
                        const distance = 2000;
                        const scalingFactor = 3;
                        const angleIncrement = 5;

                        for (let x = 0; x < this.w; x++) {
                        for (let y = 0; y < this.h; y++) {
                        const { x: xPrime, y: yPrime } = this.vanishingPointPerspective(x, y, centerX, centerY, horizon, distance, scalingFactor, angleIncrement);
                        this.context.drawImage(this.offscreenCanvas, x, y, 1, 1, xPrime, yPrime, 1, 1);
                        //this.context.drawImage(this.offscreenCanvas, x, y, 1, 1, x, y, 1, 1);
                    }
                }

                console.log("paint done");


                // Apply distortion effect
                for (let i = 0; i < this.w; i += 2) {
                for (let j = 0; j < this.h; j += 2) {
                const is = Math.floor(i + i * this.xcoef * Math.cos(i * Math.PI / this.w));
                const js = Math.floor(j + j * this.ycoef * Math.cos(j * Math.PI / this.w));

                // Bounds checking
                //if (is >= 0 && is + 1 < this.w && js >= 0 && js + 1 < this.h) {
                this.context.drawImage(this.offscreenCanvas, is, js, 2, 2, i, j, 2, 2);
                //}
            }
        }
        */
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
        this.col1 = Math.random();
        this.col2 = Math.random();
        this.col3 = Math.random();
        this.n = Math.round(Math.random() * 20);
        this.incval = Math.random() / 100;
        this.colmax = Math.random();
        this.colmin = Math.random();
        this.xcoef = Math.random();
        this.ycoef = Math.random();
    }

    vanishingPointPerspective(x, y, centerX, centerY, horizon, distance, scalingFactor, angleIncrement) {
        const maxAngle = 0;
        const theta = Math.atan2(y - centerY, x - centerX);
        const distanceFromViewer = Math.sqrt(Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2));
        const distanceFromHorizon = Math.abs(y - horizon);
        const angle = Math.min(maxAngle, angleIncrement * distanceFromViewer);
        const scaling = distance / (distance + distanceFromViewer);
        const z = distanceFromHorizon * scaling * scalingFactor;
        const xPrime = centerX + z * Math.cos(theta + angle);
        const yPrime = centerY + z * Math.sin(theta + angle);
        return { x: xPrime, y: yPrime };
    }
}
