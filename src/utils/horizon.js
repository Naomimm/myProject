import StellarSdk from 'stellar-sdk'

StellarSdk.Config.setAllowHttp(true);
StellarSdk.Network.use(new StellarSdk.Network(process.env.NETWORK_PHRASE))
let horizon = new StellarSdk.Server(process.env.STELLAR_HORIZON)

let txHandler = function (txResponse) {
  console.log( JSON.stringify(StellarSdk.xdr.TransactionEnvelope.fromXDR(txResponse.envelope_xdr, 'base64')) );
  console.log( JSON.stringify(StellarSdk.xdr.TransactionResult.fromXDR(txResponse.result_xdr, 'base64')) );
  console.log( JSON.stringify(StellarSdk.xdr.TransactionMeta.fromXDR(txResponse.result_meta_xdr, 'base64')) );
};

export async function loadAccount(address) {
  let account = await horizon.loadAccount(address)
  return account
}

export async function createAccount(dstAddress) {
  let pub = process.env.MAIN_ADDRESS
  let prv = process.env.MAIN_SEED
  let min = process.env.MIN_WEC
  console.log("pub:", pub, " prv:", prv, " min-wec:", min)
  let account = await horizon.loadAccount(pub);
  let transaction = new StellarSdk.TransactionBuilder(account)
  // this operation funds the new account with XLM
    .addOperation(StellarSdk.Operation.createAccount({
      destination: dstAddress,
      startingBalance: min+''
    }))
    .build();
  transaction.sign(StellarSdk.Keypair.fromSecret(prv)); // sign the transaction
  return horizon.submitTransaction(transaction);
}

export async function changeTrust(distributorAddress, distributorSeed, issuerAddress, code, limit) {
  let account = await horizon.loadAccount(distributorAddress);
  let transaction = new StellarSdk.TransactionBuilder(account)
  // this operation funds the new account with XLM
    .addOperation(StellarSdk.Operation.changeTrust({
      asset: new StellarSdk.Asset(code, issuerAddress),
      limit
    }))
    .build();
  transaction.sign(StellarSdk.Keypair.fromSecret(distributorSeed)); // sign the transaction
  return horizon.submitTransaction(transaction);
}

export async function pay(fromAddress, fromSeed, toAddress, code, issuerAddress,amount) {
  let account = await horizon.loadAccount(fromAddress);
  let transaction = new StellarSdk.TransactionBuilder(account)
  // this operation funds the new account with XLM
    .addOperation(StellarSdk.Operation.payment({
      destination: toAddress,
      asset: new StellarSdk.Asset(code, issuerAddress),
      amount
    }))
    .build();
  transaction.sign(StellarSdk.Keypair.fromSecret(fromSeed)); // sign the transaction
  return horizon.submitTransaction(transaction);
}

export async function payNative(fromAddress, fromSeed, toAddress, amount) {
  let account = await horizon.loadAccount(fromAddress);
  let transaction = new StellarSdk.TransactionBuilder(account)
  // this operation funds the new account with XLM
    .addOperation(StellarSdk.Operation.payment({
      destination: toAddress,
      asset: StellarSdk.Asset.native(),
      amount
    }))
    .build();
  transaction.sign(StellarSdk.Keypair.fromSecret(fromSeed)); // sign the transaction
  return horizon.submitTransaction(transaction);
}

