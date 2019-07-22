import { existsSync } from "fs";
import { join, sep } from "path";
import RequestError from "./requestError";

class RequestHandler {
    constructor(req, res, path) {
        this.req = req
        this.res = res

        this.file = join(__dirname, '..', 'views',  `${path}/index.ejs`.replace(/\/\//, '/'))

        if (!existsSync(this.file)) {
            this.file = this.file.replace(`${sep}index.ejs`, '.ejs')

            if (!existsSync(this.file)) {
                var error = new RequestError(req, res, 404, path)
                error.send()
            }
        }
    }

    send(data = {}) {
        var fileArr = this.file.split(/\/|\\/g)
         ,  title = fileArr.pop().replace(/\.ejs$/, '')
         ,  dir = `${fileArr.join(sep)}${sep}`
        
        this.res.render(this.file, {
            _title: title,
            _file: this.file,
            _dir: dir,
            ...data
        })
    }
}

export default RequestHandler
