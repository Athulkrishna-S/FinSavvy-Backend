import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
let accessToken;
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': '660c26f5fad8e1001c8826a2',
      'PLAID-SECRET': '3bbd3b891f4068b1e027f64509e260'
    },
  },
});

const plaidClient = new PlaidApi(configuration);

async function createLinkToken(req,res){
  // Get the client_user_id by searching for the current user
  console.log("Link token fun");
  const request = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: 'user',
    },
    client_name: 'Plaid Test App',
    products: ['auth'],
    language: 'en',
    redirect_uri: 'http://localhost:5173/',
    country_codes: ['US'],
  };
  try {
    const createTokenResponse = await plaidClient.linkTokenCreate(request);
    res.json(createTokenResponse.data);
  } catch (error) {
    // handle error
    console.log(error.message);
    res.status(500).json({status:500,message:"Error in plaid"});
  }
}

async function exchangePublicToken(req,res){

  const publicToken = req.body.public_token;
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    // These values should be saved to a persistent database and
    // associated with the currently signed-in user
     accessToken = response.data.access_token;
    console.log("Access token :",accessToken);
    const itemID = response.data.item_id;
    res.status(200).json({ public_token_exchange: 'complete' ,accessToken ,itemID});
  } catch (error) {
    // handle error
    console.log(error.message);
    console.log("Error in exchange")
    res.status(500).json({status : 500, public_token_exchange: 'not-complete' });

  }
  finally{
    const plaidRequest = {
      access_token: accessToken,
  };
  const plaidResponse = await plaidClient.transactionsGet(plaidRequest);
  console.log("Trans Data :",plaidResponse.data);
  // add transactions to database
  }
};


export  { createLinkToken , exchangePublicToken};