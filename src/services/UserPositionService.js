export class UserPositionService {
    constructor() {
        if (UserPositionService._instance) {
            return UserPositionService._instance;
        }
        UserPositionService._instance = this;
    }

    static get instance() {
        if (!UserPositionService._instance) {
            UserPositionService._instance = new UserPositionService();
        }
        return UserPositionService._instance;
    }

    getPosition() {
        return new Promise((resolve, reject) => {
            if (this.position) {
                resolve(this.position);
            } else {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        this.position = position;
                        resolve(position);
                    },
                    error => {
                        reject(error)
                    }
                );
            }
        });
    }

}