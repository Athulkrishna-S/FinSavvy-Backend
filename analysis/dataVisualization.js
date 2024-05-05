import user from '../models/userModel.js';

async function Analyzer(req,res){
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
                    }
                    else{
                            classes[year_month] = element.amount;
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

export {Analyzer};