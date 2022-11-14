import { LoyaltyMemberHistory } from "../../models/loyaltyMember"

export const isBalanceSubtracted = (historyField: LoyaltyMemberHistory) => {
    return historyField['type'] === 'redemption' ||
      (historyField['type'] === 'member_exchange' && historyField['sub_type'] === 'out')
  }