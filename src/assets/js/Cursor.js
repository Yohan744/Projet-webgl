import defaultCursor from '../icons/cursor.svg'
import blackCursor from '../icons/cursor-black.svg'
import {useGlobalEvents} from "./GlobalEvents";

const cursors = {
    default: defaultCursor,
    black: blackCursor,
}

export default class Cursor {

    static instance

    constructor() {

        if (Cursor.instance) {
            return Cursor.instance
        }
        Cursor.instance = this

        this.cursor = document.querySelector('#cursor');
        this.settingsWrapper= document.querySelector('.settings-wrapper');

        this.eventEmitter = useGlobalEvents()

        this.setupEvents()

    }

    setupEvents() {
        if (this.cursor && this.settingsWrapper) {
            window.addEventListener('mousemove', this.handleMouseMove.bind(this))
            window.addEventListener('focus', () => this.cursor.style.opacity = 1)
            window.addEventListener('blur', () => this.cursor.style.opacity = 0)

            const settingsPanel = this.settingsWrapper.querySelector('.settings-panel')
            settingsPanel.addEventListener('mouseenter', () => this.handleMouseEnterSettings(true))
            settingsPanel.addEventListener('mouseleave', () => this.handleMouseEnterSettings(false))

            this.eventEmitter.on('change-cursor', (name) => this.changeCursorTo(name))

        }
    }

    handleMouseMove(e) {
        const x = e.clientX - this.cursor.offsetWidth * 0.5
        const y = e.clientY - this.cursor.offsetHeight * 0.5
        this.cursor.style.transform = `translate(${x}px, ${y}px)`;
    }

    handleMouseEnterSettings(state) {
        if (this.settingsWrapper.classList.contains('visible')) {
            this.cursor.src = state ? cursors.black : cursors.default
        }
    }

    changeCursorTo(name) {
        if (cursors[name] === undefined) return console.error(`Cursor ${name} does not exist`)
        this.cursor.src = cursors[name]
    }

    destroy() {
        window.removeEventListener('mousemove', this.handleMouseMove.bind(this))
        window.removeEventListener('focus', () => this.cursor.style.opacity = 1)
        window.removeEventListener('blur', () => this.cursor.style.opacity = 0)
        this.settingsWrapper.querySelector('.settings-panel').removeEventListener('mouseenter', () => this.handleMouseEnterSettings())
        Cursor.instance = null
    }

}

export const useCursor = () => new Cursor()