window.langs = {}
window.current_lang = window.langs['qqx']

function _(string, ...args) {
    function fallback() {
        return "@" + string
    }

    try {
        let output_parts = string.split('.')
        let output_arr = window.current_lang[output_parts[0]]
        let output_str = output_parts[1]
        let output = output_arr[output_parts[1] ?? '']

        if(!output_arr)
            return fallback()

        if(args.length > 0) {
            if(typeof args[0] === "number") {
                const cardinal = args[0]
                let numberedString;

                switch(cardinal) {
                    case 0: 
                        numberedString = output_str + "_zero"
                        break
                    case 1: 
                        numberedString = output_str + "_one"
                        break
                    default:
                        if(cardinal < 20) {
                            numberedString = output_str + (cardinal < 5 ? "_few" : "_other")
                        } else {
                            switch(cardinal % 10) {
                                default:
                                case 0:
                                    numberedString = output_str + "_other"
                                    break
                                case 1:
                                    numberedString = output_str + "_one"
                                    break
                                case 2:
                                case 3:
                                case 4:
                                    numberedString = output_str + "_few"
                                    break
                            }
                        }
                }

                let newOutput = output_arr[numberedString];
                if(newOutput == null)
                    newOutput = output_arr[string + "_other"]

                if(newOutput == null)
                    newOutput = output;

                output = newOutput;
            }
        }

        if(output == null)
            return fallback()

        for(const [ i, element ] of Object.entries(args))
            output = output.replace(RegExp("(\\$" + (Number(i) + 1) + ")"), element)

        return output
    } catch(e) {
        return fallback()
    }
}
