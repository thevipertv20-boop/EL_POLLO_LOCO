class TouchControls {

    constructor(keyboard) {
        this.keyboard = keyboard;
        this.setup();
    }

    setup() {
        this.addButton('touchLeft', 'LEFT');
        this.addButton('touchRight', 'RIGHT');
        this.addButton('touchJump', 'SPACE');
        this.addButton('touchThrow', 'D');
    }

    addButton(id, key) {
        let button = document.getElementById(id);

        if (!button) return;

        button.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            this.keyboard[key] = true;
        });

        button.addEventListener('pointerup', (e) => {
            e.preventDefault();
            this.keyboard[key] = false;
        });

        button.addEventListener('pointercancel', () => {
            this.keyboard[key] = false;
        });

        button.addEventListener('pointerleave', () => {
            this.keyboard[key] = false;
        });

        button.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
}