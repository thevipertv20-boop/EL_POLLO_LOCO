class TouchControls {

    /**
     * Creates the touch controls.
     * @param {Keyboard} keyboard - Keyboard input handler.
     */
    constructor(keyboard) {
        this.keyboard = keyboard;
        this.setup();
    }

    /**
     * Sets up all touch buttons.
     */
    setup() {
        this.addButton('touchLeft', 'LEFT');
        this.addButton('touchRight', 'RIGHT');
        this.addButton('touchJump', 'SPACE');
        this.addButton('touchThrow', 'D');
    }

    /**
     * Connects a touch button to a keyboard control.
     * @param {string} id - Button element ID.
     * @param {string} key - Keyboard property to change.
     */
    addButton(id, key) {
        const button = document.getElementById(id);

        if (!button) return;

        this.addPointerDown(button, key);
        this.addPointerUp(button, key);
        this.addPointerCancel(button, key);
        this.addPointerLeave(button, key);
        this.disableContextMenu(button);
    }

    /**
     * Activates the keyboard key when pressing a touch button.
     * @param {HTMLElement} button - Touch button element.
     * @param {string} key - Keyboard property to activate.
     */
    addPointerDown(button, key) {
        button.addEventListener('pointerdown', event => {
            event.preventDefault();
            this.keyboard[key] = true;
        });
    }

    /**
     * Deactivates the keyboard key when releasing a touch button.
     * @param {HTMLElement} button - Touch button element.
     * @param {string} key - Keyboard property to deactivate.
     */
    addPointerUp(button, key) {
        button.addEventListener('pointerup', event => {
            event.preventDefault();
            this.keyboard[key] = false;
        });
    }

    /**
     * Deactivates the keyboard key when the pointer is cancelled.
     * @param {HTMLElement} button - Touch button element.
     * @param {string} key - Keyboard property to deactivate.
     */
    addPointerCancel(button, key) {
        button.addEventListener('pointercancel', () => {
            this.keyboard[key] = false;
        });
    }

    /**
     * Deactivates the keyboard key when the pointer leaves the button.
     * @param {HTMLElement} button - Touch button element.
     * @param {string} key - Keyboard property to deactivate.
     */
    addPointerLeave(button, key) {
        button.addEventListener('pointerleave', () => {
            this.keyboard[key] = false;
        });
    }

    /**
     * Disables the context menu for a touch button.
     * @param {HTMLElement} button - Touch button element.
     */
    disableContextMenu(button) {
        button.addEventListener('contextmenu', event => {
            event.preventDefault();
        });
    }
}