export class SettingService {
    constructor() {
        if (SettingService._instance) {
            return SettingService._instance;
        }
        this.data;
        SettingService._instance = this;
    }

    static get instance() {
        if (!SettingService._instance) {
            SettingService._instance = new SettingService();
        }
        return SettingService._instance;
    }
}