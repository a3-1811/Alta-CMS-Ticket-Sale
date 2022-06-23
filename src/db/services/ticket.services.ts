// PACKAGE MODEL
/** Schema --->
 *id?: string,
    codeBooking: string,
    numberTicket: string,
    nameEvent: string,
    status: used | pending | expired,
    dateUsed: Date,
    dateRelease: Date,
    gateCheckin: Number,
    codePackage : string
 */
import { doc,updateDoc,setDoc, collection, getDocs } from "firebase/firestore";
import moment from "moment-timezone";
import firebase from "../firebase";
import ITicket from "../types/ticket.type";
import dataJSON from "./fakeNewsEvents.json";

const db = collection(firebase,'tickets')

class TicketServices{
  addNewTicket = async (packageTicket: ITicket) => {
    await setDoc(doc(db), packageTicket);
  };

  generateTickets = async (length : number) => {
    let fakes = [...dataJSON.data]
    for (let index = 0; index < length; index++) {
      let random = Math.floor(Math.random() * (3 - 1 + 1) + 1);
      let temp = {
        codeBooking: `ALT${moment().format('HHmmss')}${Math.floor(100000 + Math.random() * 900000)}`,
        numberTicket: moment().format('HHmmss') +  Math.floor(100000 + Math.random() * 900000),
        nameEvent: fakes[index+20],
        status: random === 1 ? "used" : random === 2 ? "pending" : "expired",
        dateUsed: random === 1 ? moment().set("day", moment().get("day") - 1).toDate() : random === 2 ? null : null,
        dateRelease: moment().set("day", moment().get("day") - 3).toDate(),
        gateCheckin: random,
        codePackage: 'ALT220620094741',
        dateExpire : random === 3 ? moment().set("day", moment().get("day")).toDate() : moment().set("day", moment().get("day")+1).toDate()
      };
      await setDoc(doc(db), temp);
    }
  };
  
  getTickets = async () => {
    let tickets : ITicket[] = []
    const querySnapshot = await getDocs(db);
    querySnapshot.forEach((doc: any) => {
      let temp = doc.data()
      let packetTicket : ITicket= {
        id: doc.id,
        codeBooking: temp.codeBooking,
        numberTicket: temp.numberTicket,
        nameEvent: temp.nameEvent,
        status: temp.status,
        dateUsed: temp.dateUsed,
        dateRelease: temp.dateRelease,
        gateCheckin: temp.gateCheckin,
        codePackage : temp.codePackage,
        dateExpire : temp.dateExpire
      }
      tickets.push(packetTicket)
    });
    return tickets
  };
   updateTicket = async (ticket: ITicket) => {
    const docRef = doc(db,ticket.id)
    let temp = {...ticket}
    delete temp.id
    const updated = await updateDoc(docRef,{
      ...temp  
    });
    return updated
  };

}
export default new TicketServices()
