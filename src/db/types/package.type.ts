export enum StatusPackage{
 APPLYING = "applying",
 OFF = "off"
}
export type ComboTicket = {
  price : Number ,
  amount : Number
}

export default interface PackageTicket {
  id?: string,
  codePackage: string,
	namePackage: string,
	status: StatusPackage,
	dateApply : Date,
  dateExpire: Date,
  singleTicketPrice : number,
  comboTicketPrice: ComboTicket | null
}