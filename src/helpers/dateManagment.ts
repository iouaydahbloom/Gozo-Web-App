import moment from 'moment'

export function stringToDate(dateStr: string){

    return dateStr && new Date(dateStr).toLocaleDateString("en-US")
}

export function formatDate(dateStr : string, format : string = 'MM/DD/YY, h:mm:ss a'){
    return dateStr && moment.utc(dateStr).local().format(format);
}