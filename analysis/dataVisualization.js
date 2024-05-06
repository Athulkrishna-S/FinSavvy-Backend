import user from '../models/userModel.js';

async function getAnalysisData(req,res){
    const userId = req.userId;
    const category = req.query.category;
    try{
            const result = await user.transactionAnalysis(userId);
            const classes = {}
            result.forEach(element => {

                if(element.category === category){

                    let year_month = element.date.slice(0,7);
                    if(classes.hasOwnProperty(year_month)){
                        classes[year_month] += element.amount;
                        classes[year_month] = Math.round(classes[year_month]*100)/100;
                    }
                    else{
                        classes[year_month] = Math.round(element.amount*100)/100;
                    }
                }        
            });
            res.status(200).json({status:200,data:classes});
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({status:500,message:error.message});
    }
}

async function getMonthlyData( req , res ){
    let today = new Date();
    let year = today.getFullYear();
    let this_month = today.getMonth()+1; // adding 1 bcz month is zero indexed i.e for may it has 4 instead of 5 
    const month = `${year}-${this_month.toString().padStart(2,'0')}`; // format 2024-05
    
}


export {getAnalysisData};