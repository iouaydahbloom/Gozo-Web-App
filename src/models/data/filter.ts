export class Filter {
    constructor(public page: number, public page_size: number) { }
}

export class ProgramFilter extends Filter {
    constructor(public page: number,
        public page_size: number,
        public partner_id: string | null,
        public isExchangeIn: boolean | null,
        public isExchangeOut: boolean | null) {
        super(page, page_size);
    }
}