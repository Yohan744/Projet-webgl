import {useGlobalEvents} from "./GlobalEvents";
import defaultCursor from '../icons/cursor.svg'
import blackCursor from '../icons/cursor-black.svg'
import grabCursor from '../icons/grab.svg'

const cursors = {
    default: defaultCursor,
    black: blackCursor,
    grab: grabCursor
}

let actualCursor = null

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

            const settingsPanel = this.settingsWrapper.querySelector('.settings-panel')
            settingsPanel.addEventListener('mouseenter', () => this.handleMouseEnterSettings(true))
            settingsPanel.addEventListener('mouseleave', () => this.handleMouseEnterSettings(false))

            this.eventEmitter.on('change-cursor', (value) => this.changeCursorTo(value.name))

        }
    }

    handleMouseMove(e) {
        const x = e.clientX
        const y = e.clientY
        this.cursor.style.transform = `translate(${x}px, ${y}px)`;
    }

    handleMouseEnterSettings(state) {
        if (this.settingsWrapper.classList.contains('visible')) {
            this.cursor.src = state ? cursors.black : cursors.default
        }
    }

    handleCursorOpacity(state) {
        this.cursor.classList.toggle('visible', state)
    }

    changeCursorTo(name) {
        if (cursors[name] === undefined) return console.error(`Cursor named ${name} does not exist`)
        if (this.cursor.src === cursors[name]) return console.warn(`Cursor is already set to ${name}`)
        this.cursor.src = cursors[name]
        actualCursor = name
    }

    destroy() {
        window.removeEventListener('mousemove', this.handleMouseMove.bind(this))
        window.removeEventListener('focus', () => this.handleCursorOpacity(true))
        window.removeEventListener('blur', () => this.handleCursorOpacity(false))
        this.settingsWrapper.querySelector('.settings-panel').removeEventListener('mouseenter', () => this.handleMouseEnterSettings())
        this.settingsWrapper.querySelector('.settings-panel').removeEventListener('mouseleave', () => this.handleMouseEnterSettings())
        Cursor.instance = null
    }

}

export const useCursor = () => new Cursor()
export const getActualCursor = () => actualCursor