window.templates = {}
window.routes = []
window.router = (function() {
    return {
        app_node: document.querySelector('body'),
        url: new HashURL(location.href),
        hooks: {
            resetPage: () => {},
            restartApp: () => {},
            replaceState: () => {},
            route: () => {},
        },
        reloadPage: function() {
            location.reload()
            this.reloadPageHook()
        },
        __resetPage: function() {
            this.app_node.innerHTML = ''
            this.hooks.resetPage()
        },
        restartApp: function(prefix = '') {
            this.resetPage()
            this.hooks.resetPage(prefix)
        },
        __parseRoute: function(input_url) {
            if(!input_url) {
                input_url = window.consts.DEFAULT_ROUTE
            }

            const url = (input_url.split('?')[0]).removePart('#')
            for(const route of window.routes) {
                const route_formatted = route.url.escapeHtml()
                const route_template  = route_formatted.replace(window.consts.REGEX_ROUTE_PATTERN, '([^/]+)')
                const route_matches   = url.match(route_template)
                
                if(route_matches) {
                    const route_matches_arr = route.url.match(window.consts.REGEX_ROUTE_PATTERN)
                    
                    let route_params = []
                    let route_return_params = []
                    let route_params_matched = {}
                    let _iterator = 0
    
                    if(route_matches_arr && route_matches_arr.length > 0) {
                        route_params = route_matches_arr.map(placeholder => placeholder.slice(1, -1))
                    }
    
                    for(const route_param of route_params) {
                        const splitted_param = route_param.split('|')
                        const param_value = route_matches[_iterator + 1]
                        let param_type = splitted_param[0]
                        let param_name = splitted_param[1]
    
                        if(!param_name) {
                            param_type = 'string'
                            param_name = splitted_param[0]
                        }
                        
                        switch(param_type) {
                            default:
                            case 'int':
                                if(!isNaN(param_value.parseInt())) {
                                    route_return_params.push(param_name)
                                }
    
                                break
                            case 'string':
                                route_return_params.push(param_name)
    
                                break
                        }
                        
                        _iterator += 1
                    }
    
                    if(route_params.length > 0 && route_return_params.length < 1) {
                        continue
                    }

                    route_return_params.forEach((name, index) => {
                        route_params_matched[name] = route_matches[index + 1]
                    })

                    return {'route': route, 'params': route_return_params, 'match': route_matches, 'params_matched': route_params_matched}
                }
            }
    
            return null
        },
        replaceState: function(input_url, replace = false, unhash = false) {
            if(input_url.indexOf('#') == -1 && unhash) {
                input_url = '#' + input_url
            }

            if(replace) {
                history.replaceState({'from_router': 1}, null, input_url)
            } else {
                history.pushState({'from_router': 1}, null, input_url)
            }
            
            this.url = new HashURL(location.href)
            this.hooks.replaceState(input_url, replace, unhash)
        },
        route: async function(params = {}) {
            let input_url = params.input_url
            let push_state = params.push_state ?? true
            let url = input_url.removeAll(location.origin).removeSubstr(location.pathname).removeSubstr('#')
            if(!url || url == '') {
                if(window.active_account) {
                    url = window.consts.DEFAULT_ROUTE
                } else {
                    url = window.consts.DEFAULT_ROUTE_UNLOGGED
                }
            }

            let route_parsed = this.__parseRoute(url)
            if(!route_parsed) {
                route_parsed = this.__parseRoute('#errors/404')
            }

            this.current_route = route_parsed.route
            this.__resetPage()

            if(push_state && location.href.removeSubstr('#') != url) {
                if(route_parsed.route.replace_state) {
                    this.replaceState(url, true)
                } else {
                    this.replaceState(url, false)
                }
            }

            const controller = route_parsed['route'].script_name.split('.')
            const controller_name = controller[0]
            const controller_function = controller[1]

            this.current_controller = window.controllers[controller_name]
            if(typeof this.current_controller[controller_function + 'Skeleton'] == 'function') {
                window.scrollTo(0, 0)
                this.current_controller[controller_function + 'Skeleton']()
            }

            await this.current_controller[controller_function]()
            window.scrollTo(0, 0)
            this.hooks.route(params)
        }
    }
})()
window.controllers = {}

class HashURL extends URL {
    constructor(url) {
        super(url)
        this.hashParams = new URLSearchParams(this.hash.slice(1).split('?')[1] || '')
    }

    getParam(name, def = null) {
        return this.hashParams.get(name) ?? def
    }

    setParam(name, value) {
        this.hashParams.set(name, value)
        this._updateParams()
    }

    _updateParams() {
        let [path, ] = this.hash.slice(1).split('?')
        let newHash = path;
        const params = this.hashParams.toString()

        if(params) {
            newHash += '?' + params;
        }

        this.hashParams = new URLSearchParams(newHash.slice(1).split('?')[1] || '')
        this.hash = newHash;
    }

    hasParam(name) {
        return Boolean(this.hashParams.get(name))
    }

    deleteParam(name) {
        this.hashParams.delete(name)
        this._updateParams()
    }

    getParams() {
        return this.hashParams
    }

    getHash() {
        return this.hash.removePart('#')
    }
}
