// PACKAGE MODEL
/** Schema --->
 * codePackage: string,
	namePackage: string,
	status: applying | off,
	dateApply : DateTime,
  dateExpire: DateTime,
  singleTicketPrice : Number,
  comboTicketPrice: {
            price : Number ,
            amount : Number
          }
 */
import { doc,updateDoc,setDoc, collection, getDocs } from "firebase/firestore";
import firebase from "../firebase";
import IPackage from "../types/package.type";

const db = collection(firebase,'package-tickets')

class PackageTicketServices{
  addNewPackageTicket = async (packageTicket: IPackage) => {
    await setDoc(doc(db), packageTicket);
  };
  
  getPackageTickets = async () => {
    let packetTickets : IPackage[] = []
    const querySnapshot = await getDocs(db);
    querySnapshot.forEach((doc: any) => {
      let temp = doc.data()
      let packetTicket : IPackage= {
        id: doc.id,
        codePackage: temp.codePackage,
        namePackage: temp.namePackage,
        status: temp.status,
        dateApply : temp.dateApply,
        dateExpire: temp.dateExpire,
        singleTicketPrice : temp.singleTicketPrice,
        comboTicketPrice: temp.comboTicketPrice
      }
      packetTickets.push(packetTicket)
    });
    return packetTickets
  };
   updatePackageTicket = async (packetTicket: IPackage) => {
    const docRef = doc(db,packetTicket.id)
    let temp = {...packetTicket}
    delete temp.id
    const updated = await updateDoc(docRef,{
      ...temp  
    });
    return updated
  };
}
export default new PackageTicketServices()
