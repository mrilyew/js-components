class LocalStorageParams {
    constructor(section) {
        this.section = section

        if(localStorage.getItem(section) == undefined) {
            localStorage.setItem(section, '{}')
        }
    }

    set(param, value) {
        if(this.section) {
            let params = JSON.parse(localStorage.getItem(this.section)) ?? {}
            params[param] = value
    
            localStorage.setItem(this.section, JSON.stringify(params))
        } else {
            localStorage.setItem(param, value)
        }
    }

    get(param, def = null) {
        if(this.section) {
            let params = JSON.parse(localStorage.getItem(this.section) ?? {})

            if(params[param] == '0') {
                return '0'
            }

            return params[param] ? params[param] : def
        } else {
            return localStorage.getItem(param) ?? def
        }
    }

    getAll() {
        let returner = []
        if(!this.section) {
            return []
        }

        Object.entries(JSON.parse(localStorage.getItem(this.section) ?? {})).forEach(([key, value]) => {
            let t = {}
            t[key] = value

            returner.push(t)
        })

        return returner
    }

    has(param) {
        if(this.section) {
            let params = JSON.parse(localStorage.getItem(this.section) ?? {})

            return params[param] != null || params[param] != undefined
        } else {
            return localStorage.getItem(param) != null
        }
    }

    is(param, value) {
        if(this.section) {
            let params = JSON.parse(localStorage.params ?? {})

            return params[param] != value
        } else {
            return localStorage.getItem(param) == value
        }
    }

    delete(param) {
        if(this.section) {
            this.set(param, undefined)
        } else {
            localStorage.removeItem(param)
        }
        
        return 1
    }

    deleteAll() {
        if(this.section) {
            localStorage.removeItem(this.section)
        } else {
            localStorage.clear()
        }
    }
}
