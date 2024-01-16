export class ThemeService {
    THEMES_URL = './json/themes.json';
    _themes;

    constructor() {
        if (ThemeService._instance) {
            return ThemeService._instance;
        }
        ThemeService._instance = this;
    }

    static get instance() {
        if (!ThemeService._instance) {
            ThemeService._instance = new ThemeService();
        }
        return ThemeService._instance;
    }

    get themes() {
        return this._themes;
    }

    set themes(themes) {
        this._themes = themes;
    }

    getThemes() {
        return this.themes ?
        Promise.resolve(this.themes) :
        fetch(this.THEMES_URL)
            .then(res => res.json())
            .then(themes => {
                this.themes = themes;
                return themes;
            })
    }
}