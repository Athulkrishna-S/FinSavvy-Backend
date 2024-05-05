import { transactions } from './database.js';

async function getTransactions(userId,condition,month){

    var query = {"userId":userId,"date":{$regex :new RegExp('^' + month)}};

    
   // const result = await transactions.findOne({userId},{transactions : 1,income : 0,_id : 0});
   const result = await transactions.findOne({ userId });


    if(!result){
        throw new Error('No transactions');
    }
    const trans=[];
    const regmonth = new RegExp('^'+month);
    result.transactions.forEach(element => {
        if(regmonth.test(element.date)){
            trans.push(element);
        }
    });
    return trans;
}

const user = {getTransactions};
export default user;