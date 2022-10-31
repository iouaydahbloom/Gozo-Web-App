export function stringToDate(dateStr: string){

    return dateStr && new Date(dateStr).toLocaleDateString("en-US")
}