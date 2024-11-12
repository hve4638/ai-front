import LocaLAPI from 'api/local';

class Profiles {
    private profileNames:string[] = [];
    constructor() {
        LocaLAPI.getProfileNames()
            .then((names) => {
                this.profileNames = names;
            });
    }

    get names() {
        return this.profileNames;
    }
}

export default Profiles;