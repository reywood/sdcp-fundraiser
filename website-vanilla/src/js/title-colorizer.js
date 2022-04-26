console.log('HI x');

$(() => {
    const h1 = document.querySelector('.section1 h1');
    if (h1) {
        titleColorizer(h1).colorize();
    }
});


const titleColorizer = (element) => ({
    colors: ['#6375c7', '#ed6660', '#cc62a0', '#a0b31c', '#08b8ad', '#ffb741'],
    currentColorIndex: 0,
    colorize() {
        const text = element.textContent;

        this._removeAllChildren();
        const newChildren = this._createColorizedTextElements(text);

        for (const child of newChildren) {
            element.appendChild(child);
        }
    },

    _removeAllChildren() {
        while (element.firstChild) {
            element.firstChild.remove();
        }
    },

    _createColorizedTextElements(text) {
        return text.split('').map(char => {
            if (char === ' ') {
                return document.createTextNode(char);
            }
            const span = document.createElement('span');
            span.style.color = this._getNextColor();
            span.textContent = char;
            return span;
        })
    },

    _getNextColor() {
        const nextColor = this.colors[this.currentColorIndex];
        this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
        return nextColor;
    }
});
