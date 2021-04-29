import axios, { AxiosResponse } from 'axios';

const budget_sms_url = 'https://api.budgetsms.net/sendsms/';

class BudgetSMS {
    _options: {
        userid: string;
        username: string;
        handle: string;
        credit: number;
        price: number;
    };
    constructor() {
        this._options = {
            userid: process.env.BUDGETSMS_USERID,
            username: process.env.BUDGETSMS_USERNAME,
            handle: process.env.BUDGETSMS_HANDLE,
            credit: 1,
            price: 1,
        };
    }

    _validateOptions(): void {
        Object.keys(this._options).forEach((optionKey) => {
            if (
                ['userid', 'username', 'handle', 'from', 'to', 'msg'].indexOf(
                    optionKey,
                ) < 0
            ) {
                throw new Error(`Option '${optionKey}' does not exist`);
            }
        });
    }

    from(from: string): this {
        this._options = Object.assign({}, this._options, { from: from });
        return this;
    }

    to(to: string): this {
        this._options = Object.assign({}, this._options, { to: to });
        return this;
    }

    message(message: string): this {
        this._options = Object.assign({}, this._options, { msg: message });
        return this;
    }

    send(): Promise<AxiosResponse> {
        this._validateOptions();
        return axios.post(budget_sms_url, null, { params: this._options });
    }
}

export default BudgetSMS;
