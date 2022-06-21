export enum StatusTicket{
    USED = "used",
    PENDING = "pending",
    EXPIRED = "expired"
   }
export default interface Ticket {
    id?: string,
    codeBooking: string,
    numberTicket: string,
    nameEvent: string,
    status: StatusTicket,
    dateUsed ?: Date,
    dateRelease: Date,
    gateCheckin ?: Number,
    codePackage : string,
    dateExpire ?:Date
}