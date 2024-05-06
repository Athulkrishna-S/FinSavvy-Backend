import { installments } from "../models/database.js";
import sendEmail from "../services/emailSender.js";

async function dailyInstallments(){
    const date = new Date();
    let data ={};
  //  const dateString = date.toLocaleDateString(); // date in format MM/DD/YYYY
    const dateString = date.toISOString().split('T')[0]; // date in format yyyy-mm-dd
    const day = ('0' + date.getDate()).slice(-2);
    const result = await installments.find({installment_day:day}).toArray();
    result.forEach(async element => {
        data ={
            name : element.title,
            amount : element.installment,
            date :  dateString
        };
        await sendEmail(element.email,"Reminder",data);
    });
}

export default dailyInstallments;