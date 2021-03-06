import { Instance, types, flow, getEnv } from "mobx-state-tree"
import { Environment } from "../environment"
// import sign from '../../utils/ethereum';

const UserModel = types.model("User").props({
  id: types.maybeNull(types.number),
  username: types.maybeNull(types.string)
})

const EntryModel = types.model("Entry").props({
  id: types.maybeNull(types.number),
  user: types.maybeNull(types.optional(UserModel, {})),
  tokens_amount: types.maybeNull(types.number),
  token_price: types.maybeNull(types.string)
})

const FundingModel = types.model("Funding").props({
  collected_amount: types.maybeNull(types.string),
  description: types.maybeNull(types.string),
  entries: types.optional(types.array(EntryModel), []),
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
  soft_cap: types.maybeNull(types.string),
  token_price: types.maybeNull(types.string),
  organisation: types.maybeNull(types.number),
  tokens_amount: types.maybeNull(types.number),
})

const wait = (ms) => new Promise((res) => {
  setTimeout(() => {
    res()
  }, ms)
})

export const FundingsStoreModel = types.model("FundingsStore").props({
  fundings: types.optional(types.array(FundingModel), []),
  investId: types.maybeNull(types.number),
  investAmount: types.maybeNull(types.string),
  invested: types.maybeNull(types.boolean),
  confirmationNeeded: types.maybeNull(types.boolean),
  goToNfc: types.maybeNull(types.boolean),
  password: types.maybeNull(types.string),
  tokenToSign: types.maybeNull(types.string),
  idToSign: types.maybeNull(types.number),
  confirmationWithNfcStatus: types.optional(types.enumeration(['pending', 'done']), 'pending')
}).actions(self => ({
  getFundings: flow(function*() {
    const env: Environment = getEnv(self);

    const data = yield env.api.getFundings();

    self.fundings = data.results;

    console.log({ data });
  }),
  invest: flow(function*(id, amount) {
    const env: Environment = getEnv(self);

    const data = yield env.api.invest(id, amount);

    self.confirmationNeeded = true;
    self.tokenToSign = data.token
    self.idToSign = data.id
  }),
  setPassword(password) {
    self.confirmationWithNfcStatus = 'pending'
    self.password = password
    self.confirmationNeeded = false
    self.goToNfc = true
  },
  waitForNfc: flow(function*() {
    // const data = yield sign('test123', self.tokenToSign);
    const env: Environment = getEnv(self);
    // yield env.api.sign(self.idToSign, data.signature);
    yield wait(5000)
    yield env.api.sign(self.idToSign);
    self.goToNfc = false;
    self.confirmationWithNfcStatus = 'done'
  }),
  reset() {
    self.confirmationWithNfcStatus = 'pending'
  }
}))

export interface FundingsStore extends Instance<typeof FundingsStoreModel> {}

