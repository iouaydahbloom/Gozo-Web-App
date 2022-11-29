export class FormHelper {
    public static handleKeyDown(event: any, callback: () => any) {
        if (event.key === 'Enter') {
            callback();
        }
    }

    public static handleInputNumberNegativeKeyPress(event: any) {
        if (['-', 'Minus', 'NumpadSubtract'].includes(event.code)) {
            event.preventDefault();
        }
    }
}


export class FormValidator {
    public static hasValue(fieldValue: any): boolean {
        return !!fieldValue && fieldValue.toString().trim() !== ''
    }

    public static isValidEmail(email: string): boolean {
        const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return validEmailRegex.test(email)
    }

    public static isValidLink(link: string): boolean {
        const validLinkRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
        return validLinkRegex.test(link)
    }

    public static doesMatch(firstValue: string, secondValue: string): boolean {
        return !!firstValue && !!secondValue && firstValue === secondValue
    }

    public static handleServerErrors(errors: any) {
        let validationErrors: any = {};
        if (errors) {
            Object.keys(errors).forEach(key => {
                validationErrors[key] = errors[key][0];
            });
        }
        return validationErrors;
    }
}
