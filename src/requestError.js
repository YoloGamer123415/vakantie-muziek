import { join } from "path";

const errorInfo = {
    400: 'Bad request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not found',
    500: 'Internal server error'
}

class RequestError {
    constructor(req, res, code, path) {
        this.req = req
        this.res = res
        this.code = code
        this.path = path
    }

    send(data = {}) {
        this.res.render(join(__dirname, '..', 'views', '_error.ejs'), {
            code: this.code,
            path: this.path,
            info: errorInfo[this.code],
            ...data
        })
    }
}

export default RequestError
