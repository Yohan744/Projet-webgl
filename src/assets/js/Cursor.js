import {useGlobalEvents} from "./GlobalEvents";
import defaultCursor from '../icons/cursor.svg'
import blackCursor from '../icons/cursor-black.svg'
import grabCursor from '../icons/grab.svg'
import arrowLeftCursor from '../icons/arrowLeft.svg'
import arrowRightCursor from '../icons/arrowRight.svg'
import slideToRightCursor from '../icons/slideToRight.gif'
import slideToLeftCursor from '../icons/slideToLeft.gif'
import clickCursor from '../icons/click.gif'

const cursors = {
    default: defaultCursor,
    black: blackCursor,
    grab: grabCursor,
    arrowLeft: arrowLeftCursor,
    arrowRight: arrowRightCursor,
    slideToRight: slideToRightCursor,
    slideToLeft: slideToLeftCursor,
    click: clickCursor
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
        this.goBackIcon = document.querySelector('.go-back-icon')
        this.settinsIcon = document.querySelector('.settings-icon')

        this.tmpLastCursor = null

        this.eventEmitter = useGlobalEvents()

        this.setupEvents()

    }

    setupEvents() {
        if (this.cursor && this.settingsWrapper) {
            window.addEventListener('mousemove', this.handleMouseMove.bind(this))

            const settingsPanel = this.settingsWrapper.querySelector('.settings-panel')
            settingsPanel.addEventListener('mouseenter', () => this.handleMouseEnterSettings(true))
            settingsPanel.addEventListener('mouseleave', () => this.handleMouseEnterSettings(false))

            this.goBackIcon.addEventListener('mouseenter', () => this.handleMouseHoverIcons(true))
            this.goBackIcon.addEventListener('mouseleave', () => this.handleMouseHoverIcons(false))

            this.settinsIcon.addEventListener('mouseenter', () => this.handleMouseHoverIcons(true))
            this.settinsIcon.addEventListener('mouseleave', () => this.handleMouseHoverIcons(false))

            this.eventEmitter.on('change-cursor', (value) => this.changeCursorTo(value.name))

        }
    }

    handleMouseMove(e) {
        const x = e.clientX - this.cursor.clientWidth / 2
        const y = e.clientY - this.cursor.clientHeight / 2
        this.cursor.style.transform = `translate(${x}px, ${y}px)`;
    }

    handleMouseEnterSettings(state) {
        if (this.settingsWrapper.classList.contains('visible')) {
            this.cursor.src = state ? cursors.black : cursors.default
        }
    }

    handleMouseHoverIcons(state) {
        if (state) this.tmpLastCursor = actualCursor
        state ? this.changeCursorTo('default') : this.changeCursorTo(this.tmpLastCursor)
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
        this.goBackIcon.removeEventListener('mouseenter', () => this.handleMouseHoverIcons())
        this.goBackIcon.removeEventListener('mouseleave', () => this.handleMouseHoverIcons())
        this.settinsIcon.removeEventListener('mouseenter', () => this.handleMouseHoverIcons())
        this.settinsIcon.removeEventListener('mouseleave', () => this.handleMouseHoverIcons())
        Cursor.instance = null
    }

}

export const useCursor = () => new Cursor()
export const getActualCursor = () => actualCursor